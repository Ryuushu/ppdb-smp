<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Models\PesertaPPDB;

class SuratController extends Controller
{
    public function showProgramPeserta(DocumentFilterRequest $request, $program = null)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with('program')
            ->when($program && $program !== 'semua', function ($q) use ($program) {
                $q->where('program_id', $program);
            })
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
        $settingBody = optional((\App\Models\PpdbSetting::latest()->first())->body);
        $settings = [
            'no_surat' => $settingBody['no_surat'] ?? '-',
            'batas_akhir_ppdb' => $settingBody['batas_akhir_ppdb'] ?? null,
        ];

        return inertia('Admin/Document/Index', [
            'pesertappdb' => $pesertappdb,
            'tahun' => $tahun,
            'years' => $years,
            'program' => $program,
            'title' => 'Surat Diterima Peserta SNPMB',
            'printSingleRoute' => 'ppdb.cetak.surat',
            'printAllRoute' => 'ppdb.cetak.surat.semua',
            'showSettings' => true,
            'settings' => $settings,
        ]);
    }

    public function cetakSurat($program = null)
    {
        $pesertappdb = PesertaPPDB::with(['program'])
            ->when($program && $program !== 'semua', function ($q) use ($program) {
                $q->where('program_id', $program);
            })
            ->whereDiterima(1)
            ->whereYear('created_at', now()->year)
            ->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }

    public function cetakSuratSingle($uuid)
    {
        $pesertappdb = PesertaPPDB::with(['program'])
            ->whereId($uuid)
            ->get();

        return view('pdf.cetak-surat', compact('pesertappdb'));
    }
}
