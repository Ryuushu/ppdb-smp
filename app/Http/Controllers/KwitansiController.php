<?php

namespace App\Http\Controllers;

use App\Exports\RekapDanaKwitansiExport;
use App\Exports\RekapRiwayatKwitansiExport;
use App\Http\Requests\DocumentFilterRequest;
use App\Http\Requests\StoreKwitansiRequest;
use App\Models\Kwitansi;
use App\Models\PesertaPPDB;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Maatwebsite\Excel\Facades\Excel;

class KwitansiController extends Controller
{
    // show kwitansi
    public function showPesertaDiterima(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $search = $request->input('search');

        $pesertappdb = PesertaPPDB::with('kwitansi')
            ->whereYear('created_at', $tahun)
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->input('per_page', 10))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        return inertia('Admin/Kwitansi/Index', compact('pesertappdb', 'tahun', 'years'));
    }

    public function tambahKwitansi($uuid)
    {
        $peserta = PesertaPPDB::with(['kwitansi' => fn($query) => $query->latest()->with('penerima', 'deletedBy'), 'adminItemExtras.master'])->findOrFail($uuid);
        $adminItems = \App\Models\AdminItem::with('extras')->get();

        return inertia('Admin/Kwitansi/Create', compact('peserta', 'adminItems'));
    }

    public function storeKwitansi(StoreKwitansiRequest $request, $uuid)
    {
        $data = $request->validated();
        $peserta = PesertaPPDB::findOrFail($uuid);

        $peserta->kwitansi()->create($data + ['user_id' => $request->user()->id]);

        session()->flash('success', 'Kwitansi Berhasil di Tambahkan');

        return back();
    }

    public function hapusKwitansi($id)
    {
        $kwitansi = Kwitansi::findOrFail($id);
        $kwitansi->delete();

        session()->flash('success', 'Kwitansi Berhasil di Hapus');

        return back();
    }

    public function cetakKwitansi($uuid)
    {
        $pesertappdb = PesertaPPDB::with(['kwitansi', 'adminItemExtras.master'])->findOrFail($uuid);
        $adminItems = \App\Models\AdminItem::all();

        $totalNominal = $pesertappdb->kwitansi->sum('nominal');

        $mockKwitansi = new \App\Models\Kwitansi();
        $mockKwitansi->nominal = $totalNominal;
        $mockKwitansi->jenis_pembayaran = 'Atribut Madrasah';
        $mockKwitansi->setRelation('pesertaPpdb', $pesertappdb);

        $pesertappdb->setRelation('kwitansi', collect([$mockKwitansi]));

        return view('pdf.cetak-kwitansi', compact('pesertappdb', 'adminItems'));
    }

    public function cetakKwitansiSingle($uuid, $id)
    {
        $pesertappdb = PesertaPPDB::with([
            'kwitansi' => function ($query) use ($id) {
                $query->whereId($id);
            },
        ])->findOrFail($uuid);
        $adminItems = \App\Models\AdminItem::all();

        return view('pdf.cetak-kwitansi', compact('pesertappdb', 'adminItems'));
    }

    public function rekapKwitansi(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);

        $danaKelola = (float) Kwitansi::whereYear('created_at', $tahun)
            ->whereNull('deleted_at')
            ->sum('nominal');

        $jenisPembayaran = Kwitansi::whereYear('created_at', $tahun)
            ->whereNull('deleted_at')
            ->get()
            ->groupBy('jenis_pembayaran')
            ->mapWithKeys(fn($group, $key) => [
                $key => [
                    'count' => $group->count(),
                    'total' => (float) $group->sum('nominal'),
                ]
            ]);

        $kwitansiesHistory = Kwitansi::has('pesertaPpdb')
            ->with(['pesertaPpdb', 'penerima', 'deletedBy'])
            ->whereYear('created_at', $tahun)
            ->latest()
            ->paginate($request->input('per_page', 50))
            ->withQueryString();

        $years = range(now()->year, now()->year - 5);

        $adminItems = \App\Models\AdminItem::all();
        $totalBillMale = (float) $adminItems->sum('amount_male');
        $totalBillFemale = (float) $adminItems->sum('amount_female');

        $statusFilter = $request->input('status');
        $tab = $request->input('tab', 'ringkasan');
        $search = $request->input('search');

        $pesertaQuery = PesertaPPDB::whereYear('created_at', $tahun)
            ->with(['kwitansi' => fn($q) => $q->whereNull('deleted_at'), 'adminItemExtras']);

        if ($search) {
            $pesertaQuery->where(function ($query) use ($search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            });
        }

        $allPeserta = $pesertaQuery->get()->map(function ($p) use ($totalBillMale, $totalBillFemale) {
            $baseBill = $p->jenis_kelamin === 'l' ? $totalBillMale : $totalBillFemale;
            
            // Add selected extras to the bill
            $extrasBill = $p->adminItemExtras->sum(function ($extra) use ($p) {
                return $p->jenis_kelamin === 'l' ? (float) $extra->amount_male : (float) $extra->amount_female;
            });

            $totalBill = $baseBill + $extrasBill;
            $totalPaid = $p->kwitansi->sum('nominal');
            $p->total_bill = $totalBill;
            $p->total_paid = $totalPaid;
            $p->is_lunas = $totalPaid >= $totalBill && $totalBill > 0;
            return $p;
        });

        if ($statusFilter === 'lunas') {
            $allPeserta = $allPeserta->filter(fn($p) => $p->is_lunas);
        } elseif ($statusFilter === 'belum_lunas') {
            $allPeserta = $allPeserta->filter(fn($p) => !$p->is_lunas);
        }

        $perPage = 10;
        $page = request()->get('page', 1);
        $installmentData = new \Illuminate\Pagination\LengthAwarePaginator(
            $allPeserta->forPage($page, $perPage)->values(),
            $allPeserta->count(),
            $perPage,
            $page,
            ['path' => route('ppdb.rekap.kwitansi'), 'query' => $request->query()]
        );

        return inertia('Admin/Kwitansi/Rekap', [
            'kwitansiesHistory' => $kwitansiesHistory,
            'danaKelola' => $danaKelola,
            'jenisPembayaran' => $jenisPembayaran,
            'tahun' => $tahun,
            'years' => $years,
            'installmentData' => $installmentData,
            'totalBillMale' => $totalBillMale,
            'totalBillFemale' => $totalBillFemale,
            'status' => $statusFilter,
            'tab' => $tab,
            'search' => $search,
        ]);
    }

    public function cetakRekapDanaKwitansi(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $kwitansies = Kwitansi::whereYear('created_at', $tahun)->latest()->get();
        $danaKelola = $kwitansies->sum('nominal');
        $jenisPembayaran = $kwitansies->map(function ($item) {
            $item->jenis_pembayaran = Str::title($item->jenis_pembayaran);
            return $item;
        })->groupBy('jenis_pembayaran');

        return Excel::download(new RekapDanaKwitansiExport($danaKelola, $jenisPembayaran, $tahun), 'rekap-dana-kwitansi-ppdb-' . $tahun . '.xlsx');
    }

    public function updateVariation(Request $request, $uuid)
    {
        $request->validate([
            'old_extra_id' => 'required|exists:admin_item_extras,id',
            'new_extra_id' => 'required|exists:admin_item_extras,id',
        ]);

        $peserta = PesertaPPDB::where('id', $uuid)->firstOrFail();
        
        // Remove old variation
        $peserta->adminItemExtras()->detach($request->old_extra_id);
        
        // Add new variation
        $peserta->adminItemExtras()->attach($request->new_extra_id);

        return back()->with('success', 'Variasi berhasil diperbarui');
    }

    public function cetakRekapRiwayatKwitansi(DocumentFilterRequest $request)
    {
        $tahun = $request->input('tahun', now()->year);
        $kwitansies = Kwitansi::with(['pesertaPpdb', 'penerima'])->whereYear('created_at', $tahun)->get();

        return Excel::download(new RekapRiwayatKwitansiExport($kwitansies, $tahun), 'rekap-riwayat-kwitansi-ppdb-' . $tahun . '.xlsx');
    }

    public function rekapSeragam(Request $request)
    {
        $search = $request->input('search');
        $statusFilter = $request->input('status'); // lunas, belum_lunas
        
        $peserta = PesertaPPDB::with(['adminItemExtras.master', 'kwitansi'])
            ->whereHas('adminItemExtras')
            ->when($search, function ($query, $search) {
                $query->where('nama_lengkap', 'like', "%{$search}%")
                    ->orWhere('no_pendaftaran', 'like', "%{$search}%");
            })
            ->get();

        $peserta = $peserta->map(function ($p) {
            $totalBill = 0;
            // Actually we only care about extras here
            foreach ($p->adminItemExtras as $extra) {
                $totalBill += $p->jenis_kelamin === 'l' ? $extra->amount_male : $extra->amount_female;
            }
            
            // For calculating status, we need global bill
            $p->total_paid = $p->kwitansi->whereNull('deleted_at')->sum('nominal');
            // This is simplified for recap view
            return $p;
        });

        if ($statusFilter === 'lunas') {
            $peserta = $peserta->filter(fn($p) => $p->total_paid >= $p->total_bill);
        }

        return inertia('Admin/Kwitansi/RekapSeragam', [
            'peserta' => $peserta->values(),
            'search' => $search,
            'status' => $statusFilter,
        ]);
    }
}
