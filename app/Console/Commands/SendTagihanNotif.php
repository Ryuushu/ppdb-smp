<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\PesertaPPDB;
use App\Models\PpdbSetting;
use App\Models\AdminItem;
use App\Services\FonnteService;
use Carbon\Carbon;

class SendTagihanNotif extends Command
{
    protected $signature = 'ppdb:send-tagihan';
    protected $description = 'Kirim notifikasi WhatsApp otomatis untuk siswa yang telat bayar';

    public function handle()
    {
        $setting = PpdbSetting::latest()->first();
        if (!$setting || empty($setting->body['fonnte_token']) || empty($setting->body['jatuh_tempo_cicilan'])) {
            $this->error('Pengaturan Fonnte atau Jatuh Tempo belum lengkap.');
            return;
        }

        $jatuhTempo = Carbon::parse($setting->body['jatuh_tempo_cicilan']);
        if (now()->lessThan($jatuhTempo)) {
            $this->info('Belum melewati jatuh tempo.');
            return;
        }

        $adminItems = AdminItem::all();
        $totalBillMale = (float) $adminItems->sum('amount_male');
        $totalBillFemale = (float) $adminItems->sum('amount_female');

        $pesertas = PesertaPPDB::with(['kwitansi', 'adminItemExtras'])
            ->whereNull('last_notified_at')
            ->orWhereDate('last_notified_at', '<', now()->toDateString())
            ->get();

        $fonnte = new FonnteService();
        $count = 0;

        foreach ($pesertas as $p) {
            $baseBill = $p->jenis_kelamin === 'l' ? $totalBillMale : $totalBillFemale;
            $extrasBill = $p->adminItemExtras->sum(function ($extra) use ($p) {
                return $p->jenis_kelamin === 'l' ? (float) $extra->amount_male : (float) $extra->amount_female;
            });

            $totalBill = $baseBill + $extrasBill;
            $totalPaid = $p->kwitansi->whereNull('deleted_at')->sum('nominal');

            if ($totalPaid < $totalBill) {
                $sisa = $totalBill - $totalPaid;
                
                $template = $setting->body['pesan_tagihan'] ?? "Halo {nama}, kami menginformasikan bahwa pembayaran pendaftaran PPDB atas nama {nama} ({no_pendaftaran}) masih memiliki sisa tagihan sebesar {tagihan}. Mohon segera melakukan pelunasan. Terima kasih.";
                
                $message = str_replace(
                    ['{nama}', '{no_pendaftaran}', '{tagihan}', '{total_tagihan}'],
                    [$p->nama_lengkap, $p->no_pendaftaran, number_format($sisa, 0, ',', '.'), number_format($totalBill, 0, ',', '.')],
                    $template
                );

                // Send to parent number
                $target = $p->no_hp;
                if ($target) {
                    $fonnte->sendMessage($target, $message);
                    $p->update(['last_notified_at' => now()]);
                    $count++;
                }
            }
        }

        $this->info("Berhasil mengirim $count notifikasi WhatsApp.");
    }
}
