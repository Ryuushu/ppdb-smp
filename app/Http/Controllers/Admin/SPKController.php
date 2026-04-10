<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gelombang;
use App\Models\KriteriaSPK;
use App\Models\NilaiPeserta;
use App\Models\PesertaPPDB;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class SPKController extends Controller
{
    public function inputNilai($pesertaId)
    {
        $peserta = PesertaPPDB::findOrFail($pesertaId);
        $peserta->load('gelombang');
        
        $kriteria = KriteriaSPK::where('gelombang_id', $peserta->gelombang_id)->get();

        $nilai = NilaiPeserta::where('peserta_id', $pesertaId)->get()->keyBy('kriteria_id');

        return Inertia::render('Admin/SPK/InputNilai', [
            'peserta' => $peserta,
            'kriteria' => $kriteria,
            'nilai_existing' => $nilai,
            'title' => 'Input Nilai SPK: ' . $peserta->nama_lengkap
        ]);
    }

    public function storeNilai(Request $request, $pesertaId)
    {
        $peserta = PesertaPPDB::findOrFail($pesertaId);
        $gelombangId = $peserta->gelombang_id;

        $kriteria = KriteriaSPK::where('gelombang_id', $gelombangId)->get();
        
        $rules = [];
        foreach ($kriteria as $k) {
            $rules['nilai_'.$k->id] = 'required|numeric|min:0|max:100';
        }

        $validated = $request->validate($rules);

        DB::transaction(function () use ($pesertaId, $kriteria, $validated) {
            foreach ($kriteria as $k) {
                NilaiPeserta::updateOrCreate(
                    ['peserta_id' => $pesertaId, 'kriteria_id' => $k->id],
                    ['nilai' => $validated['nilai_'.$k->id]]
                );
            }
        });

        // Recalculate ranking immediately for live updates if weights are valid
        $totalBobot = $kriteria->sum('bobot');
        if (abs($totalBobot - 1.0) <= 0.001) {
            \App\Jobs\CalculateSPKRanking::dispatchSync($gelombangId);
        }

        return redirect()->route('admin.spk.input_nilai', $pesertaId)->with('success', 'Nilai SPK berhasil disimpan. Anda sekarang dapat mencetak Kartu dan Formulir pendaftaran.');
    }

    public function hitungRankingManual($gelombangId)
    {
        $kriteria = KriteriaSPK::where('gelombang_id', $gelombangId)->get();
        if ($kriteria->isEmpty()) {
            return back()->with('error', 'Kriteria belum diatur.');
        }

        $totalBobot = $kriteria->sum('bobot');
        if (abs($totalBobot - 1.0) > 0.001) {
            return back()->with('error', 'Total bobot kriteria harus pas 1.00 (100%). Saat ini: ' . number_format($totalBobot, 2));
        }

        \App\Jobs\CalculateSPKRanking::dispatchSync($gelombangId);

        return back()->with('success', 'Perhitungan SPK selesai. Ranking telah diperbarui.');
    }
}
