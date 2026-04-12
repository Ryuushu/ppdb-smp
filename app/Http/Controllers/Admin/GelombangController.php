<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GelombangController extends Controller
{
    public function index()
    {
        $gelombang = Gelombang::withCount('peserta')->orderBy('tanggal_mulai', 'desc')->get();
        return Inertia::render('Admin/Gelombang/Index', [
            'gelombang' => $gelombang,
            'title' => 'Kelola Gelombang Pendaftaran'
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Gelombang/Create', [
            'title' => 'Tambah Gelombang Baru'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:prestasi,reguler',
            'deskripsi' => 'nullable|string',
            'kuota' => 'required|integer|min:1',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'tanggal_pengumuman' => 'nullable|date|after:tanggal_selesai',
            'tahun_ajaran' => 'required|string',
        ]);

        $validated['status'] = 'draft';

        Gelombang::create($validated);

        return redirect()->route('admin.gelombang.index')->with('success', 'Gelombang berhasil ditambahkan');
    }

    public function show($id)
    {
        $gelombang = Gelombang::with(['peserta', 'kriteria'])->findOrFail($id);
        
        return Inertia::render('Admin/Gelombang/Show', [
            'gelombang' => $gelombang,
            'title' => 'Detail Gelombang: ' . $gelombang->nama
        ]);
    }

    public function edit($id)
    {
        $gelombang = Gelombang::findOrFail($id);
        return Inertia::render('Admin/Gelombang/Edit', [
            'gelombang' => $gelombang,
            'title' => 'Edit Gelombang'
        ]);
    }

    public function update(Request $request, $id)
    {
        $gelombang = Gelombang::findOrFail($id);

        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:prestasi,reguler',
            'deskripsi' => 'nullable|string',
            'kuota' => 'required|integer|min:1',
            'tanggal_mulai' => 'required|date',
            'tanggal_selesai' => 'required|date|after_or_equal:tanggal_mulai',
            'tanggal_pengumuman' => 'nullable|date',
            'tahun_ajaran' => 'required|string',
        ]);

        $gelombang->update($validated);

        return redirect()->route('admin.gelombang.index')->with('success', 'Gelombang berhasil diperbarui');
    }

    public function destroy($id)
    {
        $gelombang = Gelombang::findOrFail($id);
        $gelombang->delete();

        return redirect()->route('admin.gelombang.index')->with('success', 'Gelombang berhasil dihapus');
    }

    public function updateStatus(Request $request, $id)
    {
        $gelombang = Gelombang::findOrFail($id);
        
        $validated = $request->validate([
            'status' => 'required|in:draft,buka,tutup,pengumuman,daftar_ulang,selesai',
        ]);
        
        $gelombang->update(['status' => $validated['status']]);
        
        return back()->with('success', 'Status gelombang berhasil diubah');
    }

    public function umumkan($id)
    {
        $gelombang = Gelombang::findOrFail($id);
        $kuota = $gelombang->kuota;

        $peserta = PesertaPPDB::where('gelombang_id', $id)
            ->whereNotNull('ranking')
            ->orderBy('ranking', 'asc')
            ->get();

        if ($peserta->isEmpty()) {
            return back()->with('error', 'Tidak ada peserta yang sudah diranking untuk diumumkan.');
        }

        \Illuminate\Support\Facades\DB::transaction(function () use ($peserta, $kuota) {
            foreach ($peserta as $index => $p) {
                // If within quota, set to lolos
                if ($index < $kuota) {
                    $p->update([
                        'status_seleksi' => 'lolos',
                        'diterima' => 1 // Legacy field? existing code used it
                    ]);
                } else {
                    $p->update([
                        'status_seleksi' => 'tidak_lolos',
                        'diterima' => 2 // Rejected
                    ]);
                }
            }
        });

        // Update gelombang status to pengumuman
        $gelombang->update(['status' => 'pengumuman']);

        return back()->with('success', "Hasil pendaftaran gelombang {$gelombang->nama} telah diumumkan. " . min($peserta->count(), $kuota) . " peserta dinyatakan lolos.");
    }

    public function storeKriteria(Request $request, $id)
    {
        $validated = $request->validate([
            'nama' => 'required|string|max:255',
            'bobot' => 'required|numeric|min:0|max:1',
            'tipe' => 'required|in:benefit,cost',
        ]);

        $gelombang = Gelombang::findOrFail($id);
        $totalBobotExisting = \App\Models\KriteriaSPK::where('gelombang_id', $id)->sum('bobot');
        $newBobot = floatval($validated['bobot']);

        if (($totalBobotExisting + $newBobot) > 1.001) {
            throw \Illuminate\Validation\ValidationException::withMessages([
                'bobot' => 'Total bobot akhir tidak boleh melebihi 1.00 (Sisa: ' . number_format(1.0 - $totalBobotExisting, 2) . ')'
            ]);
        }

        $validated['gelombang_id'] = $id;

        \App\Models\KriteriaSPK::create($validated);

        return back()->with('success', 'Kriteria SPK berhasil ditambahkan');
    }

    public function deleteKriteria($id)
    {
        $kriteria = \App\Models\KriteriaSPK::findOrFail($id);
        
        // Hapus nilai peserta yang terkait kriteria ini terlebih dahulu
        \App\Models\NilaiPeserta::where('kriteria_id', $id)->delete();
        
        $kriteria->delete();

        return back()->with('success', 'Kriteria SPK berhasil dihapus');
    }
}
