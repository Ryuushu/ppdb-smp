<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\StorePendaftarRequest;
use App\Http\Requests\UpdatePendaftarRequest;
use App\Http\Requests\UpdatePesertaStatusRequest;
use App\Models\PesertaPPDB;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class PendaftaranPPDB extends Controller
{
    public function listPendaftar(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListPendaftar', compact('pesertappdb', 'tahun', 'years'));
    }

    public function tambahPendaftar()
    {
        $gelombang = \App\Models\Gelombang::orderBy('tanggal_mulai', 'desc')->get();

        return inertia('Admin/Ppdb/Create', compact('gelombang'));
    }

    public function submitPendaftar(StorePendaftarRequest $request)
    {
        $data = $request->validated();

        $data['penerima_kip'] = 'n'; // Not in the form, setting default
        $data['rekomendasi_mwc'] = 0;
        $data['bertindik'] = 0;
        $data['bertato'] = 0;

        // Determine File Store Process
        $fileFields = ['pas_foto', 'scan_ijazah_paud_tk', 'scan_kk', 'scan_akta_kelahiran'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('dokumen_peserta', 'public');
            }
        }

        $peserta = PesertaPPDB::create($data);

        // Queue SPK ranking calculation after new registration
        \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

        session()->flash('success', 'Peserta berhasil didaftarkan. Silakan lanjut menginput nilai SPK.');

        return redirect()->route('admin.spk.input_nilai', $peserta->id);
    }

    // show daftar ulang
    public function listDaftarUlang(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with(['gelombang'])
            ->where('status_seleksi', 'lolos')
            ->where('status_daftar_ulang', 'sudah')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListDaftarUlang', compact('pesertappdb', 'tahun', 'years'));
    }

    public function listBelumDaftarUlang(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with(['gelombang'])
            ->where('status_seleksi', 'lolos')
            ->where('status_daftar_ulang', 'belum')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListBelumDaftarUlang', compact('pesertappdb', 'tahun', 'years'));
    }

    public function showPeserta($id)
    {
        $peserta = PesertaPPDB::findOrFail($id);

        return inertia('Admin/Ppdb/Show', compact('peserta'));
    }

    public function edit($id)
    {
        $peserta = PesertaPPDB::findOrFail($id);

        return inertia('Admin/Ppdb/Edit', compact('peserta'));
    }

    public function update(UpdatePendaftarRequest $request, $id)
    {
        $data = $request->validated();
        $ppdb = PesertaPPDB::findOrFail($id);

        $data['penerima_kip'] = 'n';
        $data['rekomendasi_mwc'] = 0;
        $data['bertindik'] = 0;
        $data['bertato'] = 0;

        $fileFields = ['pas_foto', 'scan_ijazah_paud_tk', 'scan_kk', 'scan_akta_kelahiran'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                // Delete old file if exists
                if ($ppdb->$field && Storage::disk('public')->exists($ppdb->$field)) {
                    Storage::disk('public')->delete($ppdb->$field);
                }
                $data[$field] = $request->file($field)->store('dokumen_peserta', 'public');
            } else {
                unset($data[$field]); // don't override with null if no file is uploaded
            }
        }

        $ppdb->update($data);

        session()->flash('success', 'Data peserta telah di ubah');

        return redirect()->route('ppdb.show.peserta', $ppdb->id);
    }

    // formulir section
    public function mendaftar(StorePendaftarRequest $request)
    {
        $data = $request->validated();

        // Double check wave status server-side
        $gelombang = \App\Models\Gelombang::where('id', $data['gelombang_id'])
            ->where('status', 'buka')
            ->where('tanggal_mulai', '<=', now())
            ->where('tanggal_selesai', '>=', now())
            ->first();

        if (!$gelombang) {
            return back()->withErrors(['gelombang_id' => 'Gelombang pendaftaran sudah ditutup atau tidak tersedia.']);
        }

        $data['penerima_kip'] = 'n';
        $data['rekomendasi_mwc'] = 0;
        $data['bertindik'] = 0;
        $data['bertato'] = 0;

        $fileFields = ['pas_foto', 'scan_ijazah_paud_tk', 'scan_kk', 'scan_akta_kelahiran'];
        foreach ($fileFields as $field) {
            if ($request->hasFile($field)) {
                $data[$field] = $request->file($field)->store('dokumen_peserta', 'public');
            }
        }

        $ppdb = PesertaPPDB::create($data);

        // Queue SPK ranking calculation after new registration
        \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

        session()->flash('success', 'Terima kasih, anda berhasil mendaftar dengan nomor pendaftaran '.$ppdb->no_pendaftaran);

        return redirect()->route('ppdb.register');
    }

    public function terimaPeserta(UpdatePesertaStatusRequest $request, $uuid)
    {
        $request->validated();

        $peserta = PesertaPPDB::with(['kwitansi'])->findOrFail($uuid);

        $peserta->diterima = $request->input('status') == 'y' ? 1 : 2;
        $peserta->save();

        $msg = $request->input('status') == 'y' ? 'Peserta Diterima' : 'Peserta Ditolak';

        session()->flash('success', $msg);

        return back();
    }

    public function konfirmasiDaftarUlang($uuid)
    {
        $peserta = PesertaPPDB::findOrFail($uuid);
        
        if ($peserta->status_seleksi !== 'lolos') {
            return back()->with('error', 'Hanya peserta yang sudah LOLOS seleksi yang dapat melakukan daftar ulang.');
        }

        $peserta->update([
            'status_daftar_ulang' => 'sudah'
        ]);

        session()->flash('success', 'Konfirmasi daftar ulang berhasil untuk ' . $peserta->nama_lengkap);

        return back();
    }

    public function hapusPeserta($uuid)
    {
        $peserta = PesertaPPDB::findOrFail($uuid);

        $fileFields = ['pas_foto', 'scan_ijazah_paud_tk', 'scan_kk', 'scan_akta_kelahiran'];
        foreach ($fileFields as $field) {
            if ($peserta->$field && Storage::disk('public')->exists($peserta->$field)) {
                Storage::disk('public')->delete($peserta->$field);
            }
        }

        $peserta->delete();

        session()->flash('success', 'Peserta telah dihapus');

        return redirect()->route('ppdb.list.pendaftar');
    }
}
