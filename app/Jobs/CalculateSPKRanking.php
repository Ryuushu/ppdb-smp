<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\KriteriaSPK;
use App\Models\NilaiPeserta;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\DB;

class CalculateSPKRanking implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $gelombangId;

    /**
     * Create a new job instance.
     */
    public function __construct($gelombangId)
    {
        $this->gelombangId = $gelombangId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // If gelombangId is null, calculate for ALL students (cross-gelombang)
        $query = PesertaPPDB::query();
        if ($this->gelombangId !== null) {
            $query->where('gelombang_id', $this->gelombangId);
        }
        $pesertaList = $query->whereNotNull('nilai_baca')->get();
        if ($pesertaList->isEmpty()) return;

        // 1. Cari nilai Max (Normalisasi Benefit)
        $maxBaca = $pesertaList->max('nilai_baca') ?? 1;
        $maxTulis = $pesertaList->max('nilai_tulis') ?? 1;
        $maxHitung = $pesertaList->max('nilai_hitung') ?? 1;

        if ($maxBaca == 0) $maxBaca = 1;
        if ($maxTulis == 0) $maxTulis = 1;
        if ($maxHitung == 0) $maxHitung = 1;

        // Ambil bobot dari setting
        $setting = \App\Models\PpdbSetting::latest()->first();
        $bobotBody = $setting ? $setting->body : [];
        
        $bobotBaca = ($bobotBody['bobot_baca'] ?? 33.33) / 100;
        $bobotTulis = ($bobotBody['bobot_tulis'] ?? 33.33) / 100;
        $bobotHitung = ($bobotBody['bobot_hitung'] ?? 33.34) / 100;

        // 2. Hitung skor untuk masing-masing peserta
        $skorData = [];
        foreach ($pesertaList as $peserta) {
            $bacaRaw = $peserta->nilai_baca ?? 0;
            $tulisRaw = $peserta->nilai_tulis ?? 0;
            $hitungRaw = $peserta->nilai_hitung ?? 0;
            
            // Normalisasi SAW
            $normBaca = $bacaRaw / $maxBaca;
            $normTulis = $tulisRaw / $maxTulis;
            $normHitung = $hitungRaw / $maxHitung;

            // Bobot * Normalisasi
            $skorTotal = ($normBaca * $bobotBaca) + ($normTulis * $bobotTulis) + ($normHitung * $bobotHitung);

            // Skala 0-100
            $skorTotal100 = $skorTotal * 100;

            $skorData[] = [
                'id' => $peserta->id,
                'skor_spk' => $skorTotal100
            ];
        }

        // 3. Urutkan berdasarkan skor descending
        usort($skorData, function ($a, $b) {
            return $b['skor_spk'] <=> $a['skor_spk'];
        });

        // 4. Update database
        DB::transaction(function () use ($skorData) {
            $rank = 1;
            foreach ($skorData as $data) {
                PesertaPPDB::where('id', $data['id'])->update([
                    'skor_spk' => $data['skor_spk'],
                    'ranking' => $rank
                ]);
                $rank++;
            }
        });
    }
}
