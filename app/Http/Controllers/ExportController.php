<?php

namespace App\Http\Controllers;

use App\Exports\PesertaPPDBExport;
use App\Exports\RekapSekolahExport;
use App\Exports\SeragamExport;
use App\Http\Requests\ExportPesertaRequest;
use App\Http\Requests\ExportRekapSekolahRequest;
use App\Http\Requests\ExportSeragamRequest;
use App\Models\Program;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportPesertaPpdb(ExportPesertaRequest $request)
    {
        $program = $request->filled('program') ? $request->input('program') : null;
        $diterima = $request->input('diterima', 0);
        $tahun = $request->input('tahun', now()->year);
        $all = $request->input('all', 0);

        $abb = $program ? Program::find($program) : null;

        $acc = $diterima == 1 ? 'data_peserta_snpmb_diterima_' : 'peserta_snpmb_';
        $filename = $acc . ($abb ? $abb->abbreviation : 'Semua') . '-' . $tahun . '.xlsx';

        return Excel::download(new PesertaPPDBExport($program, $tahun, $diterima, $all), $filename);
    }

    public function exportSeragam(ExportSeragamRequest $request)
    {
        $program = $request->filled('program') ? $request->input('program') : null;
        $tahun = $request->input('tahun', now()->year);

        $abb = $program ? Program::find($program) : null;

        $filename = 'Ukuran-seragam-snpmb-' . ($abb ? $abb->abbreviation : 'Semua') . '-' . $tahun . '.xlsx';

        return Excel::download(new SeragamExport($program, $tahun), $filename);
    }

    public function exportRekapSekolah(ExportRekapSekolahRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);

        // perbandingan per jumlah sekolah pendaftar
        $pendaftarPerSekolah = PesertaPPDB::select(DB::raw('asal_sekolah, count(asal_sekolah) as as_count'))->whereYear('created_at', $tahun)->groupBy('asal_sekolah')->orderByDesc('as_count')->get();

        return Excel::download(new RekapSekolahExport($tahun, $pendaftarPerSekolah), 'Rekap-sekolah-' . $tahun . '.xlsx');
    }

    public function exportBelumDaftarUlang(ExportPesertaRequest $request)
    {
        $program = $request->filled('program') ? $request->input('program') : null;
        $tahun = $request->input('tahun', now()->year);

        $abb = $program ? Program::find($program) : null;

        $filename = 'peserta_snpmb_belum_daftar_ulang_' . ($abb ? $abb->abbreviation : 'Semua') . '-' . $tahun . '.xlsx';

        // 2 in the updated PesertaPPDBExport means 'Accepted but not yet re-registered'
        return Excel::download(new PesertaPPDBExport($program, $tahun, 2), $filename);
    }
}
