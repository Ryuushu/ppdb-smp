<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Models\PesertaPPDB;

class KartuPendaftaranController extends Controller
{
    public function showProgramPeserta(DocumentFilterRequest $request, $program = null)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with('program')
            ->when($program && $program !== 'semua', function ($q) use ($program) {
                $q->where('program_id', $program);
            })
            // ->whereDiterima(1)
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Document/Index', [
            'pesertappdb' => $pesertappdb,
            'tahun' => $tahun,
            'years' => $years,
            'program' => $program,
            'title' => 'Kartu Pendaftaran Peserta SNPMB',
            'printSingleRoute' => 'ppdb.cetak.kartu',
            'printAllRoute' => 'ppdb.cetak.kartu.semua',
            'showSettings' => false,
        ]);
    }

    public function cetakKartu($program = null)
    {
        $pesertappdb = PesertaPPDB::with(['program'])
            ->when($program && $program !== 'semua', function ($q) use ($program) {
                $q->where('program_id', $program);
            })
            // ->whereDiterima(1)
            ->whereYear('created_at', now()->year)
            ->get();

        return view('pdf.cetak-kartu', compact('pesertappdb'));
    }

    public function cetakKartuSingle($uuid)
    {
        $pesertappdb = PesertaPPDB::with(['program'])
            ->whereId($uuid)
            ->get();

        return view('pdf.cetak-kartu', compact('pesertappdb'));
    }
}
