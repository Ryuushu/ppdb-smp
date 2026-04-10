<?php

namespace App\Http\Controllers;

use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\StorePendaftarRequest;
use App\Http\Requests\UpdatePendaftarRequest;
use App\Http\Requests\UpdatePesertaStatusRequest;
use App\Models\Program;
use App\Models\PesertaPPDB;
use Illuminate\Support\Str;

class PendaftaranPPDB extends Controller
{
    public function listPendaftar(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::whereYear('created_at', $tahun)
            ->with(['program']) // Eager load relationships
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListPendaftar', compact('pesertappdb', 'tahun', 'years'));
    }

    public function listPendaftarProgram(DocumentFilterRequest $request, $program)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::whereYear('created_at', $tahun)
            ->with(['program'])
            ->where('program_id', $program)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListPendaftar', compact('pesertappdb', 'tahun', 'years', 'program'));
    }

    public function tambahPendaftar()
    {
        $program = Program::all();
        $gelombang = \App\Models\Gelombang::orderBy('tanggal_mulai', 'desc')->get();

        return inertia('Admin/Ppdb/Create', compact('program', 'gelombang'));
    }

    public function submitPendaftar(StorePendaftarRequest $request)
    {
        $data = $request->validated();

        $data['program_id'] = $request->input('pilihan_jurusan');
        unset($data['pilihan_jurusan']);
        $data['penerima_kip'] = $request->has('penerima_kip') ? 'y' : 'n';
        $data['rekomendasi_mwc'] = $request->has('rekomendasi_mwc') ? 1 : 0;
        $data['bertindik'] = $request->has('bertindik') ? 1 : 0;
        $data['bertato'] = $request->has('bertato') ? 1 : 0;
        $data['no_hp_ayah'] = $request->input('no_ayah');
        $data['no_hp_ibu'] = $request->input('no_ibu');

        // Gabungkan alamat jika alamat_lengkap tidak diisi
        if (empty($data['alamat_lengkap'])) {
            $alamatParts = array_filter([
                $data['dukuh'] ? "Dk. {$data['dukuh']}" : '',
                $data['rt'] || $data['rw'] ? "RT {$data['rt']} / RW {$data['rw']}" : '',
                $data['desa_kelurahan'],
                $data['kecamatan'],
                $data['kabupaten_kota'],
                $data['provinsi'],
                $data['kode_pos'] ? "Kode Pos {$data['kode_pos']}" : '',
            ]);

            $data['alamat_lengkap'] = implode(', ', $alamatParts);
        }

        $data['akademik'] = [
            'kelas' => explode('/', $request->input('peringkat'))[0] ?? '',
            'semester' => explode('/', $request->input('peringkat'))[1] ?? '',
            'peringkat' => explode('/', $request->input('peringkat'))[2] ?? '',
            'hafidz' => $request->input('hafidz') ?? '',
        ];

        $data['non_akademik'] = [
            'jenis_lomba' => $request->input('jenis_lomba') ?? '',
            'juara_ke' => $request->input('juara_ke') ?? '',
            'juara_tingkat' => $request->input('juara_tingkat') ?? '',
        ];

        unset($data['peringkat'], $data['hafidz'], $data['jenis_lomba'], $data['juara_ke'], $data['juara_tingkat'], $data['no_ayah'], $data['no_ibu']);

        $peserta = PesertaPPDB::create($data);

        // Queue SPK ranking calculation after new registration
        \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

        session()->flash('success', 'Peserta berhasil didaftarkan. Silakan lanjut menginput nilai SPK.');

        return redirect()->route('admin.spk.input_nilai', $peserta->id);
    }

    // show daftar ulang

    public function listDaftarUlang(DocumentFilterRequest $request, $program = null)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with(['program', 'gelombang'])
            ->where('status_seleksi', 'lolos')
            ->where('status_daftar_ulang', 'sudah')
            ->when($program && $program !== 'semua', fn ($q) => $q->where('program_id', $program))
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListDaftarUlang', compact('pesertappdb', 'tahun', 'years', 'program'));
    }

    public function listBelumDaftarUlang(DocumentFilterRequest $request, $program = null)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with(['program', 'gelombang'])
            ->where('status_seleksi', 'lolos')
            ->where('status_daftar_ulang', 'belum')
            ->when($program && $program !== 'semua', fn ($q) => $q->where('program_id', $program))
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('nama_lengkap', 'like', "%{$search}%")
                        ->orWhere('no_pendaftaran', 'like', "%{$search}%")
                        ->orWhere('asal_sekolah', 'like', "%{$search}%");
                });
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Ppdb/ListBelumDaftarUlang', compact('pesertappdb', 'tahun', 'years', 'program'));
    }

    public function showPeserta($id)
    {
        $peserta = PesertaPPDB::with('program')->findOrFail($id);

        return inertia('Admin/Ppdb/Show', compact('peserta'));
    }

    /*
    * Edit data peserta
    */
    public function edit($id)
    {
        $peserta = PesertaPPDB::findOrFail($id);
        $program = Program::all();

        return inertia('Admin/Ppdb/Edit', compact('peserta', 'program'));
    }

    public function update(UpdatePendaftarRequest $request, $id)
    {
        $data = $request->validated();

        $ppdb = PesertaPPDB::findOrFail($id);
        $program = Program::findOrFail($request->input('pilihan_jurusan'));

        // check apakah peserta memgubah program
        if ($ppdb->program_id != $program->id) {
            $data['no_pendaftaran'] = $program->abbreviation.'-'.Str::padLeft($ppdb->no_urut, 3, 0).'-'.now()->format('m-y');

            session()->flash('warning', 'Peserta memilih program berbeda. Pastikan untuk mencetak kembali dokumen pendaftaran.');
        }

        $data['program_id'] = $program->id;
        unset($data['pilihan_jurusan']);

        $data['penerima_kip'] = $request->has('penerima_kip') ? 'y' : 'n';
        $data['rekomendasi_mwc'] = $request->has('rekomendasi_mwc') ? 1 : 0;
        $data['bertindik'] = $request->has('bertindik') ? 1 : 0;
        $data['bertato'] = $request->has('bertato') ? 1 : 0;
        $data['no_hp_ayah'] = $request->input('no_ayah');
        $data['no_hp_ibu'] = $request->input('no_ibu');

        // Gabungkan alamat jika alamat_lengkap tidak diisi
        if (empty($data['alamat_lengkap'])) {
            $alamatParts = array_filter([
                $data['dukuh'] ? "Dk. {$data['dukuh']}" : '',
                $data['rt'] || $data['rw'] ? "RT {$data['rt']} / RW {$data['rw']}" : '',
                $data['desa_kelurahan'],
                $data['kecamatan'],
                $data['kabupaten_kota'],
                $data['provinsi'],
                $data['kode_pos'] ? "Kode Pos {$data['kode_pos']}" : '',
            ]);

            $data['alamat_lengkap'] = implode(', ', $alamatParts);
        }

        $data['akademik'] = [
            'kelas' => explode('/', $request->input('peringkat'))[0] ?? '',
            'semester' => explode('/', $request->input('peringkat'))[1] ?? '',
            'peringkat' => explode('/', $request->input('peringkat'))[2] ?? '',
            'hafidz' => $request->input('hafidz') ?? '',
        ];

        $data['non_akademik'] = [
            'jenis_lomba' => $request->input('jenis_lomba') ?? '',
            'juara_ke' => $request->input('juara_ke') ?? '',
            'juara_tingkat' => $request->input('juara_tingkat') ?? '',
        ];

        unset($data['peringkat'], $data['hafidz'], $data['jenis_lomba'], $data['juara_ke'], $data['juara_tingkat'], $data['no_ayah'], $data['no_ibu']);

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

        $data['program_id'] = $request->input('pilihan_jurusan');
        unset($data['pilihan_jurusan']);
        $data['penerima_kip'] = $request->has('penerima_kip') ? 'y' : 'n';
        $data['rekomendasi_mwc'] = $request->has('rekomendasi_mwc') ? 1 : 0;
        $data['bertindik'] = $request->has('bertindik') ? 1 : 0;
        $data['bertato'] = $request->has('bertato') ? 1 : 0;
        $data['no_hp_ayah'] = $request->input('no_ayah');
        $data['no_hp_ibu'] = $request->input('no_ibu');

        // Gabungkan alamat jika alamat_lengkap tidak diisi
        if (empty($data['alamat_lengkap'])) {
            $alamatParts = array_filter([
                $data['dukuh'] ? "Dk. {$data['dukuh']}" : '',
                $data['rt'] || $data['rw'] ? "RT {$data['rt']} / RW {$data['rw']}" : '',
                $data['desa_kelurahan'],
                $data['kecamatan'],
                $data['kabupaten_kota'],
                $data['provinsi'],
                $data['kode_pos'] ? "Kode Pos {$data['kode_pos']}" : '',
            ]);

            $data['alamat_lengkap'] = implode(', ', $alamatParts);
        }

        $data['akademik'] = [
            'kelas' => explode('/', $request->input('peringkat'))[0] ?? '',
            'semester' => explode('/', $request->input('peringkat'))[1] ?? '',
            'peringkat' => explode('/', $request->input('peringkat'))[2] ?? '',
            'hafidz' => $request->input('hafidz') ?? '',
        ];

        $data['non_akademik'] = [
            'jenis_lomba' => $request->input('jenis_lomba') ?? '',
            'juara_ke' => $request->input('juara_ke') ?? '',
            'juara_tingkat' => $request->input('juara_tingkat') ?? '',
        ];

        unset($data['peringkat'], $data['hafidz'], $data['jenis_lomba'], $data['juara_ke'], $data['juara_tingkat'], $data['no_ayah'], $data['no_ibu']);

        $ppdb = PesertaPPDB::create($data);

        // Queue SPK ranking calculation after new registration
        \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

        session()->flash('success', 'Terima kasih, anda berhasil mendaftar dengan nomor pendaftaran '.$ppdb->no_pendaftaran);

        return redirect()->route('ppdb.register');
    }

    public function terimaPeserta(UpdatePesertaStatusRequest $request, $uuid)
    {
        $request->validated();

        $peserta = PesertaPPDB::with(['program', 'kwitansi'])->findOrFail($uuid);

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

        $peserta->delete();

        session()->flash('success', 'Peserta telah dihapus');

        return redirect()->route('ppdb.list.pendaftar');
    }
}
