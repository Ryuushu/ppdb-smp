<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;

class AutoCloseGelombang extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'gelombang:auto-close';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Secara otomatis menutup gelombang pendaftaran yang sudah melewati deadline, menghitung ranking SPK, dan meluluskan peserta sesuai kuota.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Menjalankan pengecekan auto-close gelombang...");

        // Ambil semua gelombang yang masih buka namun tanggal_selesai kurang dari hari ini (kemarin atau sebelumnya)
        $gelombangExpired = \App\Models\Gelombang::where('status', 'buka')
            ->whereDate('tanggal_selesai', '<', now()->toDateString())
            ->get();

        if ($gelombangExpired->isEmpty()) {
            $this->info("Tidak ada gelombang yang melebihi deadline hari ini.");
            return;
        }

        foreach ($gelombangExpired as $gelombang) {
            $this->info("Memproses gelombang: {$gelombang->nama}");

            // 1. Pastikan seluruh ranking terhitung (just in case ada yang luput)
            \App\Jobs\CalculateSPKRanking::dispatchSync($gelombang->id);

            // 2. Ambil kuota dan seluruh peserta di gelombang tersebut
            $kuota = $gelombang->kuota;
            $peserta = \App\Models\PesertaPPDB::where('gelombang_id', $gelombang->id)
                ->whereNotNull('ranking')
                ->orderBy('ranking', 'asc')
                ->get();

            // 3. Tentukan kelulusan berdasar kuota & Update Gelombang ke "pengumuman"
            \Illuminate\Support\Facades\DB::transaction(function () use ($peserta, $kuota, $gelombang) {
                foreach ($peserta as $index => $p) {
                    if ($index < $kuota) {
                        $p->update([
                            'status_seleksi' => 'lolos',
                            'diterima' => 1
                        ]);
                    } else {
                        $p->update([
                            'status_seleksi' => 'tidak_lolos',
                            'diterima' => 2 
                        ]);
                    }
                }

                $gelombang->update(['status' => 'pengumuman']);
            });

            $this->info("Berhasil mengunci Gelombang {$gelombang->nama} ke status pengumuman.");
        }
    }
}
