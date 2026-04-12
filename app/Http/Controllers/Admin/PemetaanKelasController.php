<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ClassRange;
use App\Models\PesertaPPDB;
use App\Models\Gelombang;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PemetaanKelasController extends Controller
{
    public function index(Request $request)
    {
        $gelombangId = $request->input('gelombang_id');
        $gelombang = Gelombang::orderBy('tanggal_mulai', 'desc')->get();
        
        $peserta = [];
        if ($gelombangId) {
            $peserta = PesertaPPDB::where('gelombang_id', $gelombangId)
                ->get()
                ->map(function ($p) {
                    $score = floatval($p->skor_spk) * 100; // Convert to 0-100 scale if needed
                    $p->total_score_mapped = $score;
                    
                    // Assign class based on ranges
                    $class = ClassRange::where('min_score', '<=', $score)
                        ->where('max_score', '>=', $score)
                        ->first();
                        
                    $p->assigned_class = $class ? $class->class_name : 'Belum Terpetakan';
                    return $p;
                });
        }

        return Inertia::render('Admin/PemetaanKelas/Index', [
            'gelombang' => $gelombang,
            'peserta' => $peserta,
            'selected_gelombang' => $gelombangId,
            'title' => 'Pemetaan Kelas Siswa Baru'
        ]);
    }

    public function settingRanges()
    {
        $ranges = ClassRange::orderBy('min_score', 'desc')->get();
        return Inertia::render('Admin/PemetaanKelas/SettingRanges', [
            'ranges' => $ranges,
            'title' => 'Pengaturan Rentang Kelas'
        ]);
    }

    public function storeRanges(Request $request)
    {
        $validated = $request->validate([
            'class_name' => 'required|string|max:255',
            'min_score' => 'required|numeric|min:0|max:100',
            'max_score' => 'required|numeric|min:0|max:100|gte:min_score',
        ]);

        ClassRange::create($validated);

        return back()->with('success', 'Rentang kelas berhasil ditambahkan.');
    }

    public function deleteRange($id)
    {
        ClassRange::findOrFail($id)->delete();
        return back()->with('success', 'Rentang kelas berhasil dihapus.');
    }
}
