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
        $adminItems = \App\Models\AdminItem::all();
        $totalBillMale = (float) $adminItems->sum('amount_male');
        $totalBillFemale = (float) $adminItems->sum('amount_female');
        
        $pesertaRaw = PesertaPPDB::with(['program', 'kwitansi' => fn($q) => $q->whereNull('deleted_at')])
            ->get()
            ->filter(function ($p) use ($totalBillMale, $totalBillFemale) {
                $totalBill = $p->jenis_kelamin === 'l' ? $totalBillMale : $totalBillFemale;
                $totalPaid = $p->kwitansi->sum('nominal');
                return $totalPaid >= $totalBill && $totalBill > 0;
            })
            ->sortByDesc('skor_spk')
            ->values();

        $classes = ClassRange::orderBy('min_score', 'desc')->get();
        $classCounts = [];
        foreach($classes as $c) {
            $classCounts[$c->id] = 0;
        }

        $peserta = $pesertaRaw->map(function ($p) use ($classes, &$classCounts) {
            // skor_spk is null if Calistung scores not yet entered
            if (is_null($p->skor_spk)) {
                $p->total_score_mapped = null;
                $p->assigned_class = 'Belum Diisi';
                return $p;
            }

            $score = floatval($p->skor_spk);
            $p->total_score_mapped = $score;
            
            $assigned = false;
            foreach ($classes as $class) {
                $capacity = $class->max_capacity ?? 9999;
                
                // Check score is within range (min AND max)
                if ($score >= floatval($class->min_score) && $score <= floatval($class->max_score)) {
                    if ($classCounts[$class->id] < $capacity) {
                        $p->assigned_class = $class->class_name;
                        $classCounts[$class->id]++;
                        $assigned = true;
                        break;
                    } else {
                        // Class full - try cascading to next available class in descending order
                        continue;
                    }
                }
            }

            if (!$assigned) {
                // Try assigning to any class with remaining capacity regardless of strict range
                // as a fallback (cascade)
                foreach ($classes as $class) {
                    $capacity = $class->max_capacity ?? 9999;
                    if ($classCounts[$class->id] < $capacity) {
                        $p->assigned_class = $class->class_name . ' (Limpahan)';
                        $classCounts[$class->id]++;
                        $assigned = true;
                        break;
                    }
                }
            }

            if (!$assigned) {
                $p->assigned_class = 'Semua Kelas Penuh';
            }
            return $p;
        });

        return Inertia::render('Admin/PemetaanKelas/Index', [
            'peserta' => $peserta,
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
            'max_capacity' => 'nullable|numeric|min:1',
        ]);

        ClassRange::create($validated);

        return back()->with('success', 'Rentang kelas berhasil ditambahkan.');
    }

    public function deleteRange($id)
    {
        ClassRange::findOrFail($id)->delete();
        return back()->with('success', 'Rentang kelas berhasil dihapus.');
    }

    public function saveScore(Request $request, $id)
    {
        $validated = $request->validate([
            'nilai_baca' => 'nullable|numeric|min:0|max:100',
            'nilai_tulis' => 'nullable|numeric|min:0|max:100',
            'nilai_hitung' => 'nullable|numeric|min:0|max:100',
        ]);

        $peserta = PesertaPPDB::findOrFail($id);
        $peserta->nilai_baca = $validated['nilai_baca'];
        $peserta->nilai_tulis = $validated['nilai_tulis'];
        $peserta->nilai_hitung = $validated['nilai_hitung'];
        $peserta->save();

        // Always recalculate SPK — either for the student's gelombang or globally if no gelombang
        \App\Jobs\CalculateSPKRanking::dispatchSync($peserta->gelombang_id);

        return back()->with('success', 'Nilai Calistung berhasil disimpan dan SPK diperbarui.');
    }

    public function updateRange(Request $request, $id)
    {
        $validated = $request->validate([
            'class_name' => 'required|string|max:255',
            'min_score' => 'required|numeric|min:0|max:100',
            'max_score' => 'required|numeric|min:0|max:100|gte:min_score',
            'max_capacity' => 'nullable|numeric|min:1',
        ]);

        ClassRange::findOrFail($id)->update($validated);

        return back()->with('success', 'Rentang kelas berhasil diperbarui.');
    }
}
