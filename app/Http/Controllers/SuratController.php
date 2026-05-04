<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Models\PesertaPPDB;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class SuratController extends Controller
{
    public function showProgramPeserta(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with('gelombang')
            ->where('status_seleksi', 'lolos')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);
        $setting = \App\Models\PpdbSetting::latest()->first();
        $settingBody = $setting ? $setting->body : [];
        $settings = [
            'no_surat' => $settingBody['no_surat'] ?? '-',
            'batas_akhir_ppdb' => $settingBody['batas_akhir_ppdb'] ?? null,
        ];

        return inertia('Admin/Document/Index', [
            'pesertappdb' => $pesertappdb,
            'tahun' => $tahun,
            'years' => $years,
            'title' => 'Surat Diterima Peserta SNPMB',
            'printSingleRoute' => 'ppdb.cetak.surat',
            'printAllRoute' => 'ppdb.cetak.surat.semua',
            'showSettings' => true,
            'settings' => $settings,
        ]);
    }

    public function cetakSurat(Request $request)
    {
        $tahun = $request->input('tahun', now()->year);

        $pesertappdb = PesertaPPDB::with('gelombang')
            ->where('status_seleksi', 'lolos')
            ->whereYear('created_at', $tahun)
            ->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }

    public function cetakSuratSingle($uuid)
    {
        $pesertappdb = PesertaPPDB::with('gelombang')->whereId($uuid)->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }

    public function downloadSurat($uuid)
    {
        $pesertappdb = PesertaPPDB::with('gelombang')->whereId($uuid)->get();
        
        $pdf = Pdf::loadView('pdf.cetak-surat', [
            'pesertappdb' => $pesertappdb,
            'isPdf' => true
        ]);

        return $pdf->download('Surat_Diterima_' . $pesertappdb->first()->nama_lengkap . '.pdf');
    }
}
