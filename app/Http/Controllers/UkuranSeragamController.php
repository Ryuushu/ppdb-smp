<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\UpdateUkuranSeragamRequest;
use App\Models\PesertaPPDB;
use App\Models\UkuranSeragam;

class UkuranSeragamController extends Controller
{
    public function showProgramPeserta(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with(['ukuranSeragam.masterUkuran'])
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
        $masterUkuranSeragams = \App\Models\MasterUkuranSeragam::all();

        return inertia('Admin/UkuranSeragam/Index', compact('pesertappdb', 'tahun', 'years', 'masterUkuranSeragams'));
    }

    public function ubahUkuranSeragam(UpdateUkuranSeragamRequest $request)
    {
        $request->validated();

        $peserta = UkuranSeragam::updateOrCreate(
            ['peserta_ppdb_id' => $request->input('uuid')],
            ['master_ukuran_seragam_id' => $request->input('master_ukuran_seragam_id')]
        );

        session()->flash('success', 'data ukuran di ubah');

        return back();
    }
}
