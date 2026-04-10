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
        $kriteria = KriteriaSPK::where('gelombang_id', $this->gelombangId)->get();
        if ($kriteria->isEmpty()) return;

        // Validasi total bobot 1.0 (wajib pas 100%)
        $totalBobot = $kriteria->sum('bobot');
        if (abs($totalBobot - 1.0) > 0.001) {
            // Bobot tidak valid, tidak bisa melanjut perhitungan SPK
            return;
        }

        $pesertaList = PesertaPPDB::where('gelombang_id', $this->gelombangId)->get();
        if ($pesertaList->isEmpty()) return;

        // 1. Cari nilai Max/Min untuk tiap kriteria (Normalisasi)
        $minMax = [];
        foreach ($kriteria as $k) {
            if ($k->tipe === 'benefit') {
                $minMax[$k->id] = NilaiPeserta::where('kriteria_id', $k->id)->max('nilai') ?? 1; // hindari max 0
                if ($minMax[$k->id] == 0) $minMax[$k->id] = 1; 
            } else { // cost
                $minMax[$k->id] = NilaiPeserta::where('kriteria_id', $k->id)->min('nilai') ?? 0;
            }
        }

        // 2. Hitung skor untuk masing-masing peserta
        $skorData = [];
        foreach ($pesertaList as $peserta) {
            $skorTotal = 0;
            $nilaiPeserta = NilaiPeserta::where('peserta_id', $peserta->id)->get()->keyBy('kriteria_id');

            foreach ($kriteria as $k) {
                $nilaiRaw = isset($nilaiPeserta[$k->id]) ? $nilaiPeserta[$k->id]->nilai : 0;
                
                // Normalisasi SAW
                $nilaiNormal = 0;
                if ($k->tipe === 'benefit') {
                    $nilaiNormal = $nilaiRaw / $minMax[$k->id];
                } else { // cost
                    $nilaiNormal = $nilaiRaw == 0 ? 0 : ($minMax[$k->id] / $nilaiRaw); 
                }

                // Bobot * Normalisasi
                $skorTotal += ($nilaiNormal * $k->bobot);
            }

            $skorData[] = [
                'id' => $peserta->id,
                'skor_spk' => $skorTotal
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
