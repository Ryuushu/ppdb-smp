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

        // Bobot seimbang 33.33% tiap kriteria
        $bobot = 1/3;

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
            $skorTotal = ($normBaca * $bobot) + ($normTulis * $bobot) + ($normHitung * $bobot);

            // Skala 0-100 (karena normalisasi max 1.0 * total bobot 1.0 = 1.0. Jadi dikali 100 biar lebih manusiawi jika diinginkan
            // Tapi sebelumnya logic Class Mapping assumes total_score_mapped directly dari skor_spk.
            // Biar gampang mapping 0-100, kita kalikan 100
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
