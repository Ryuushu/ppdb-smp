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

        $pesertappdb = PesertaPPDB::with(['ukuranSeragam'])
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

        return inertia('Admin/UkuranSeragam/Index', compact('pesertappdb', 'tahun', 'years'));
    }

    public function ubahUkuranSeragam(UpdateUkuranSeragamRequest $request)
    {
        $request->validated();

        $peserta = UkuranSeragam::updateOrCreate(
            ['peserta_ppdb_id' => $request->input('uuid')],
            [
                'baju' => $request->input('baju'),
                'jas' => $request->input('jas'),
                'sepatu' => $request->input('sepatu'),
                'peci' => $request->input('peci'),
                'seragam_praktik' => $request->boolean('seragam_praktik'),
                'baju_batik' => $request->boolean('baju_batik'),
                'seragam_olahraga' => $request->boolean('seragam_olahraga'),
                'jas_almamater' => $request->boolean('jas_almamater'),
                'kaos_bintalsik' => $request->boolean('kaos_bintalsik'),
                'atribut' => $request->boolean('atribut'),
                'kegiatan_bintalsik' => $request->boolean('kegiatan_bintalsik'),
            ]
        );

        session()->flash('success', 'data ukuran di ubah');

        return back();
    }
}
