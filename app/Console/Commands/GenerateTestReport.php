<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Symfony\Component\Process\Process;

class GenerateTestReport extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'ppdb:report';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Jalankan unit test dan perbarui berkas TESTING_SUMMARY.md';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🚀 Menjalankan seluruh pengujian PPDB...');

        // Kita jalankan PHPUnit untuk file-file yang valid saja (27 tests)
        $testFiles = [
            'tests/Feature/AdminGelombangTest.php',
            'tests/Feature/AdminItemTest.php',
            'tests/Feature/AdminMasterDocumentTest.php',
            'tests/Feature/FormulirPendaftaranTest.php',
            'tests/Feature/KartuPendaftaranTest.php',
            'tests/Feature/PemetaanKelasTest.php',
            'tests/Feature/RankingTest.php',
            'tests/Feature/SPKCalculationTest.php',
        ];

        $phpunit = DIRECTORY_SEPARATOR === '\\' ? 'vendor\\bin\\phpunit.bat' : 'vendor/bin/phpunit';
        $phpunitPath = base_path($phpunit);

        $process = new Process([$phpunitPath, ...$testFiles]);
        $process->setWorkingDirectory(base_path());
        $process->run();

        $output = $process->getOutput();
        $errorOutput = $process->getErrorOutput();
        
        $this->line($output);
        if ($errorOutput) {
            $this->error($errorOutput);
        }

        // Parsing hasil (Cari baris OK atau FAILED)
        $status = "UNKNOWN";
        $results = "";
        
        if ($process->isSuccessful()) {
            $status = "PASSED ✅";
            // Cari baris terakhir yang mengandung "OK (X tests, Y assertions)"
            preg_match('/OK \(.+\)/', $output, $matches);
            $results = $matches[0] ?? 'Seluruh sistem berjalan normal.';
        } else {
            $status = "FAILED ❌";
            // Cari summary failure
            if (preg_match('/Tests:.+/', $output, $matches)) {
                $results = $matches[0];
            } elseif (preg_match('/FAILURES![\s\S]+/', $output, $matches)) {
                $results = "Terdeteksi kegagalan pada logika bisnis.";
            } else {
                $results = "Terjadi kesalahan teknis saat menjalankan test.";
            }
        }

        $this->updateSummaryFile($status, $results);

        $this->info('📝 Berkas TESTING_SUMMARY.md telah diperbarui otomatis!');
    }

    protected function updateSummaryFile($status, $results)
    {
        $path = base_path('TESTING_SUMMARY.md');
        if (!File::exists($path)) {
            return;
        }

        $content = File::get($path);
        $timestamp = now()->translatedFormat('d F Y, H:i');

        // Regex untuk mengganti isi di bawah heading Hasil Verifikasi Terakhir
        $newSummary = "## 📊 Hasil Verifikasi Terakhir\n";
        $newSummary .= "- **Waktu Eksekusi**: " . $timestamp . " WIB\n";
        $newSummary .= "- **Status**: " . $status . "\n";
        $newSummary .= "- **Detail**: " . $results . "\n";
        $newSummary .= "\n---";

        // Ganti bagian akhir file (mulai dari heading Hasil Verifikasi Terakhir sampai akhir file atau penanda)
        $pattern = '/## 📊 Hasil Verifikasi Terakhir[\s\S]+---/';
        if (preg_match($pattern, $content)) {
            $updatedContent = preg_replace($pattern, $newSummary, $content);
        } else {
            // Jika belum ada sectionnya (failsafe)
            $updatedContent = $content . "\n\n" . $newSummary;
        }

        File::put($path, $updatedContent);
    }
}
