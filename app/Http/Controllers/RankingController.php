<?php

namespace App\Http\Controllers;

use App\Models\Gelombang;
use App\Models\PesertaPPDB;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RankingController extends Controller
{
    public function index(Request $request)
    {
        $gelombang_id = $request->input('gelombang_id');
        
        $gelombangList = Gelombang::whereIn('status', ['buka', 'tutup', 'pengumuman', 'daftar_ulang', 'selesai'])
            ->orderBy('tanggal_mulai', 'desc')
            ->get();
            
        // If no gelombang selected, pick the latest active/announced one
        if (!$gelombang_id && $gelombangList->isNotEmpty()) {
            $gelombang_id = $gelombangList->first()->id;
        }
        
        $peserta = [];
        $selectedGelombang = null;
        
        if ($gelombang_id) {
            $selectedGelombang = Gelombang::find($gelombang_id);
            $peserta = PesertaPPDB::where('gelombang_id', $gelombang_id)
                ->whereNotNull('ranking')
                ->orderBy('ranking', 'asc')
                ->get();
        }

        return Inertia::render('Ranking', [
            'gelombangList' => $gelombangList,
            'selectedGelombang' => $selectedGelombang,
            'peserta' => $peserta,
            'title' => 'Ranking Live Pendaftaran'
        ]);
    }
}
