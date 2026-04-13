<?php

namespace App\Http\Controllers;

use App\Exports\PesertaPPDBExport;
use App\Exports\SeragamExport;
use App\Http\Requests\ExportPesertaRequest;
use App\Http\Requests\ExportSeragamRequest;
use Illuminate\Http\Request;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class ExportController extends Controller
{
    public function exportPesertaPpdb(ExportPesertaRequest $request)
    {
        $diterima = $request->input('diterima', 0);
        $tahun = $request->input('tahun', now()->year);
        $all = $request->input('all', 0);

        $acc = $diterima == 1 ? 'data_peserta_snpmb_diterima_' : 'peserta_snpmb_';
        $filename = $acc . 'Semua-' . $tahun . '.xlsx';

        return Excel::download(new PesertaPPDBExport($tahun, $diterima, $all), $filename);
    }

    public function exportSeragam(ExportSeragamRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);

        $filename = 'Ukuran-seragam-snpmb-Semua-' . $tahun . '.xlsx';

        return Excel::download(new SeragamExport($tahun), $filename);
    }

    public function exportRekapSekolah(Request $request)
    {
        return bacK()->with('error', 'Fitur Rekap Sekolah telah dinonaktifkan.');
    }
}
