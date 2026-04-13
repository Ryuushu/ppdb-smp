<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\UpdateProfileRequest;
use App\Models\PesertaPPDB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    public function dashboard(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);

        $pesertaCount = PesertaPPDB::whereYear('created_at', $tahun)->count();

        $acc = PesertaPPDB::whereYear('created_at', $tahun);
        $penerimaan = [
            'diterima' => (clone $acc)->where(function($q) {
                $q->where('diterima', 1)->orWhere('status_seleksi', 'lolos');
            })->count(),
            'ditolak' => (clone $acc)->where(function($q) {
                $q->where('diterima', 2)->orWhere('status_seleksi', 'tidak_lolos');
            })->count(),
        ];

        $compareSx = [
            'l' => PesertaPPDB::whereYear('created_at', $tahun)->where('jenis_kelamin', 'l')->count(),
            'p' => PesertaPPDB::whereYear('created_at', $tahun)->where('jenis_kelamin', 'p')->count(),
        ];

        $lastYear = now()->setYear($tahun)->subYear()->format('Y');

        // Perbandingan pendaftar bulanan
        $yearDiff = PesertaPPDB::select(
            DB::raw('YEAR(created_at) as tahun, MONTH(created_at) as bulan, count(*) as jumlah_pendaftar')
        )
            ->whereRaw("YEAR(created_at) >= $lastYear")
            ->groupBy(DB::raw('YEAR(created_at), MONTH(created_at)'))
            ->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];

        $yearDiff = $yearDiff->map(function ($item) use ($months) {
            return [
                'tahun' => $item->tahun,
                'bulan' => $months[$item->bulan - 1],
                'jumlah_pendaftar' => $item->jumlah_pendaftar,
            ];
        })->groupBy('tahun');

        if (! $yearDiff->has($tahun)) {
            $yearDiff->put($tahun, collect());
        }

        // Daily trends
        $dailyTrends = PesertaPPDB::select(
            DB::raw('DATE(created_at) as tanggal, count(*) as jumlah')
        )
            ->whereYear('created_at', $tahun)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('tanggal')
            ->get();

        // Gender distribution over time
        $genderOverTime = PesertaPPDB::select(
            DB::raw('MONTH(created_at) as bulan, jenis_kelamin, count(*) as jumlah')
        )
            ->whereYear('created_at', $tahun)
            ->groupBy(DB::raw('MONTH(created_at), jenis_kelamin'))
            ->orderBy('bulan')
            ->get()
            ->groupBy('bulan')
            ->map(function ($group) use ($months) {
                return [
                    'bulan' => $months[$group->first()?->bulan - 1] ?? $group->first()?->bulan,
                    'laki' => $group->where('jenis_kelamin', 'l')->first()?->jumlah ?? 0,
                    'perempuan' => $group->where('jenis_kelamin', 'p')->first()?->jumlah ?? 0,
                ];
            });

        $oldestYear = Cache::remember('oldest_year', 60 * 24 * 28, function () {
            $oldest = PesertaPPDB::oldest('created_at')->first();
            return $oldest ? $oldest->created_at->year : date('Y');
        });

        return inertia('Admin/Dashboard', [
            'count' => ['all' => $pesertaCount],
            'penerimaan' => $penerimaan,
            'compareSx' => $compareSx,
            'yearDiff' => $yearDiff,
            'tahun' => $tahun,
            'lastYear' => $lastYear,
            'dailyTrends' => $dailyTrends,
            'genderOverTime' => $genderOverTime->values(),
            'oldestYear' => $oldestYear,
        ]);
    }

    public function pengaturanAkun()
    {
        $user = request()->user();

        return inertia('Admin/Profile', compact('user'));
    }

    public function setAkun(UpdateProfileRequest $request)
    {
        $request->validated();

        request()->user()->update([
            'name' => $request->input('name'),
            'password' => bcrypt($request->input('password')),
        ]);

        session()->flash('success', 'Data user dan password berhasil di ganti');

        return back();
    }
}
