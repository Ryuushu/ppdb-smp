<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\AdminItemController;
use App\Http\Controllers\Admin\PemetaanKelasController;

use App\Http\Controllers\ExportController;
use App\Http\Controllers\FormulirController;
use App\Http\Controllers\KartuPendaftaranController;
use App\Http\Controllers\KwitansiController;
use App\Http\Controllers\PendaftaranPPDB;
use App\Http\Controllers\PpdbSettingController;
use App\Http\Controllers\SuratController;
use App\Http\Controllers\UkuranSeragamController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// redirect /pendaftaran to /register
Route::redirect('/pendaftaran', '/register');

Route::get('/', function () {
    $gelombang = \App\Models\Gelombang::whereIn('status', ['buka', 'tutup', 'pengumuman'])
        ->orderBy('tanggal_mulai', 'asc')
        ->get();
    $setting = \App\Models\PpdbSetting::latest()->first();

    return inertia('Landing', [
        'gelombang' => $gelombang,
        'setting' => $setting
    ]);
});
Route::get('/register', function () {
    $program = \App\Models\Program::all()->map(fn($p) => ['value' => $p->id, 'label' => $p->nama]);
    $gelombangAktif = \App\Models\Gelombang::where('status', 'buka')
        ->where('tanggal_mulai', '<=', now())
        ->where('tanggal_selesai', '>=', now())
        ->first();

    return inertia('Pendaftaran', [
        'program' => $program,
        'gelombangAktif' => $gelombangAktif
    ]);
})->name('ppdb.register');

Route::post('/register', [PendaftaranPPDB::class, 'mendaftar'])->name('ppdb.register.submit');

Route::get('/ranking', [\App\Http\Controllers\RankingController::class, 'index'])->name('ppdb.ranking');

Route::view('/formulir-old', 'formulir'); // Keeping old just in case

Route::prefix('/dashboard')->middleware('auth')->group(function () {
    // setting profile
    Route::get('setting/profile', [AdminController::class, 'pengaturanAkun'])->name('setting.profile');
    Route::put('setting/profile', [AdminController::class, 'setAkun'])->name('setting.profile');

    // snpmb setting
    Route::middleware('role:super_admin')->group(function () {
        Route::get('/setting/ppdb', [PpdbSettingController::class, 'index'])->name('snpmb.set.batas.akhir');
        Route::put('/setting/ppdb', [PpdbSettingController::class, 'setBatasAkhir'])->name('snpmb.set.batas.akhir');

        // Admin Items (Fees)
        Route::get('/setting/admin-items', [AdminItemController::class, 'index'])->name('admin.admin-items.index');
        Route::post('/setting/admin-items', [AdminItemController::class, 'store'])->name('admin.admin-items.store');
        Route::delete('/setting/admin-items/{id}', [AdminItemController::class, 'destroy'])->name('admin.admin-items.destroy');
    });

    // Gelombang Pendaftaran
    Route::get('/gelombang', [\App\Http\Controllers\Admin\GelombangController::class, 'index'])->name('admin.gelombang.index');
    Route::get('/gelombang/create', [\App\Http\Controllers\Admin\GelombangController::class, 'create'])->name('admin.gelombang.create');
    Route::post('/gelombang', [\App\Http\Controllers\Admin\GelombangController::class, 'store'])->name('admin.gelombang.store');
    Route::get('/gelombang/{id}', [\App\Http\Controllers\Admin\GelombangController::class, 'show'])->name('admin.gelombang.show');
    Route::get('/gelombang/{id}/edit', [\App\Http\Controllers\Admin\GelombangController::class, 'edit'])->name('admin.gelombang.edit');
    Route::put('/gelombang/{id}', [\App\Http\Controllers\Admin\GelombangController::class, 'update'])->name('admin.gelombang.update');
    Route::delete('/gelombang/{id}', [\App\Http\Controllers\Admin\GelombangController::class, 'destroy'])->name('admin.gelombang.destroy');
    Route::put('/gelombang/{id}/status', [\App\Http\Controllers\Admin\GelombangController::class, 'updateStatus'])->name('admin.gelombang.update_status');
    Route::post('/gelombang/{id}/umumkan', [\App\Http\Controllers\Admin\GelombangController::class, 'umumkan'])->name('admin.gelombang.umumkan');
    Route::post('/gelombang/{id}/kriteria', [\App\Http\Controllers\Admin\GelombangController::class, 'storeKriteria'])->name('admin.gelombang.store_kriteria');
    Route::delete('/kriteria/{id}', [\App\Http\Controllers\Admin\GelombangController::class, 'deleteKriteria'])->name('admin.gelombang.delete_kriteria');

    // Pemetaan Kelas
    Route::prefix('pemetaan-kelas')->group(function () {
        Route::get('/', [PemetaanKelasController::class, 'index'])->name('admin.pemetaan-kelas.index');
        Route::get('/setting-ranges', [PemetaanKelasController::class, 'settingRanges'])->name('admin.pemetaan-kelas.setting_ranges');
        Route::post('/setting-ranges', [PemetaanKelasController::class, 'storeRanges'])->name('admin.pemetaan-kelas.store_ranges');
        Route::delete('/setting-ranges/{id}', [PemetaanKelasController::class, 'deleteRange'])->name('admin.pemetaan-kelas.delete_range');
    });

    Route::get('/', [AdminController::class, 'dashboard'])->name('dashboard');

    // list pendaftar

    Route::get('/ppdb/list-pendaftar', [PendaftaranPPDB::class, 'listPendaftar'])->name('ppdb.list.pendaftar');

    Route::get('/ppdb/list-pendaftar/{program}', [PendaftaranPPDB::class, 'listPendaftarProgram'])->name('ppdb.list.pendaftar.program');

    // tanbah pendaftar

    Route::get('/ppdb/tambah-pendaftar', [PendaftaranPPDB::class, 'tambahPendaftar'])->name('ppdb.tambah.pendaftar');

    Route::post('/ppdb/tambah-pendaftar', [PendaftaranPPDB::class, 'submitPendaftar'])->name('ppdb.tambah.pendaftar');

    // -- lihat identias pendaftar

    Route::get('/ppdb/show/{id}', [PendaftaranPPDB::class, 'showPeserta'])->name('ppdb.show.peserta');

    // edit pendaftar
    Route::get('/ppdb/edit/{id}', [PendaftaranPPDB::class, 'edit'])->name('ppdb.edit.peserta');
    Route::post('/terima-peserta/{uuid}', [PendaftaranPPDB::class, 'terimaPeserta'])->name('ppdb.terima.peserta');
    Route::post('/konfirmasi-daftar-ulang/{uuid}', [PendaftaranPPDB::class, 'konfirmasiDaftarUlang'])->name('ppdb.konfirmasi.daftar_ulang');
    Route::get('/hapus-peserta/{uuid}', [PendaftaranPPDB::class, 'hapusPeserta'])->name('ppdb.hapus.peserta');
    Route::put('/ppdb/edit/{id}', [PendaftaranPPDB::class, 'update'])->name('ppdb.edit.peserta');
    Route::delete('/ppdb/delete/{id}', [PendaftaranPPDB::class, 'hapusPeserta'])->name('ppdb.delete.peserta');

    // daftar ulanng

    Route::post('/ppdb/daftar-ulang/{uuid}', [PendaftaranPPDB::class, 'terimaPeserta'])->name('ppdb.terima.peserta');

    Route::get('/ppdb/list/terdaftar-ulang/{program?}', [PendaftaranPPDB::class, 'listDaftarUlang'])->name('ppdb.daftar.ulang.list');
    Route::get('/ppdb/list/belum-daftar-ulang/{program?}', [PendaftaranPPDB::class, 'listBelumDaftarUlang'])->name('ppdb.belum.daftar.ulang.list');

    Route::prefix('kwitansi')->group(function () {
        Route::get('show', [KwitansiController::class, 'showPesertaDiterima'])->name('ppdb.kwitansi.show');
        Route::get('show/{program}', [KwitansiController::class, 'showProgramPeserta'])->name('ppdb.kwitansi.show.program');

        // tambah kwitansi
        Route::get('/tambah/{uuid}', [KwitansiController::class, 'tambahKwitansi'])->name('ppdb.kwitansi.tambah');
        Route::post('/tambah/{uuid}', [KwitansiController::class, 'storeKwitansi'])->name('ppdb.kwitansi.tambah');
        Route::delete('/hapus/{id}', [KwitansiController::class, 'hapusKwitansi'])->name('ppdb.kwitansi.hapus');

        // cetak
        Route::post('/cetak/kwitansi/{uuid}', [KwitansiController::class, 'cetakKwitansi'])->name('ppdb.cetak.kwitansi');
        Route::post('/cetak/kwitansi/{uuid}/{id}', [KwitansiController::class, 'cetakKwitansiSingle'])->name('ppdb.cetak.kwitansi.single');

        // rekap kwitansi
        Route::get('/rekap', [KwitansiController::class, 'rekapKwitansi'])->name('ppdb.rekap.kwitansi');
        Route::get('/rekap/cetak-dana', [KwitansiController::class, 'cetakRekapDanaKwitansi'])->name('ppdb.rekap.kwitansi-dana');
        Route::get('/rekap/cetak-riwayat', [KwitansiController::class, 'cetakRekapRiwayatKwitansi'])->name('ppdb.rekap.kwitansi-riwayat');
    });

    Route::prefix('ukuran-seragam')->group(function () {
        Route::get('show/{program?}', [UkuranSeragamController::class, 'showProgramPeserta'])->name('ppdb.seragam.show.program');

        Route::post('/ubah/seragam', [UkuranSeragamController::class, 'ubahUkuranSeragam'])->name('ppdb.ubah.seragam');
    });

    Route::prefix('surat')->group(function () {
        Route::get('show/{program?}', [SuratController::class, 'showProgramPeserta'])->name('ppdb.surat.show.program');

        Route::post('/cetak/surat/{program?}', [SuratController::class, 'cetakSurat'])->name('ppdb.cetak.surat.semua');
        Route::post('/cetak/surat/{uuid}/single', [SuratController::class, 'cetakSuratSingle'])->name('ppdb.cetak.surat');
    });

    Route::prefix('formulir')->group(function () {
        Route::get('show/{program?}', [FormulirController::class, 'showProgramPeserta'])->name('ppdb.formulir.show.program');

        Route::post('/cetak/formulir/{program?}', [FormulirController::class, 'cetakFormulir'])->name('ppdb.cetak.formulir.semua');
        Route::post('/cetak/formulir/{uuid}/single', [FormulirController::class, 'cetakFormulirSingle'])->name('ppdb.cetak.formulir');
    });

    Route::prefix('kartu-pendaftaran')->group(function () {
        Route::get('show/{program?}', [KartuPendaftaranController::class, 'showProgramPeserta'])->name('ppdb.kartu.show.program');

        Route::post('/cetak/kartu/{program?}', [KartuPendaftaranController::class, 'cetakKartu'])->name('ppdb.cetak.kartu.semua');
        Route::post('/cetak/kartu/{uuid}/single', [KartuPendaftaranController::class, 'cetakKartuSingle'])->name('ppdb.cetak.kartu');
    });

    Route::prefix('export')->group(function () {
        // peserta ppdb
        Route::get('peserta-ppdb', [ExportController::class, 'exportPesertaPpdb'])->name('export.peserta.ppdb');

        // ukuran seragam
        Route::get('ukuran-seragam', [ExportController::class, 'exportSeragam'])->name('export.seragam');

        // export rekap sekolah
        Route::get('rekap-sekolah', [ExportController::class, 'exportRekapSekolah'])->name('export.rekap-sekolah');

        // export belum daftar ulang
        Route::get('belum-daftar-ulang', [ExportController::class, 'exportBelumDaftarUlang'])->name('export.belum.daftar.ulang');
    });

});
