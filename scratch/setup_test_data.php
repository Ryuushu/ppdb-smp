<?php

use App\Models\Gelombang;
use App\Models\PesertaPPDB;
use App\Models\KriteriaSPK;
use App\Models\NilaiPeserta;
use App\Jobs\CalculateSPKRanking;

echo "Starting setup...\n";

$gelombang = Gelombang::find(1);
if (!$gelombang) {
    echo "Gelombang 1 not found!\n";
    exit(1);
}

$gelombang->update(['status' => 'buka']);
echo "Gelombang 1 status set to 'buka'.\n";

$pesertas = PesertaPPDB::limit(3)->get();
$kriterias = KriteriaSPK::where('gelombang_id', 1)->get();

if ($kriterias->isEmpty()) {
    echo "No criteria found for Gelombang 1!\n";
    exit(1);
}

foreach ($pesertas as $p) {
    $p->update(['gelombang_id' => 1]);
    
    foreach ($kriterias as $k) {
        NilaiPeserta::updateOrCreate(
            ['peserta_id' => $p->id, 'kriteria_id' => $k->id],
            ['nilai' => rand(60, 100)]
        );
    }
    echo "Setup scores for: " . $p->nama_lengkap . "\n";
}

echo "Triggering ranking calculation...\n";
CalculateSPKRanking::dispatchSync(1);
echo "Ranking calculation completed for Gelombang 1.\n";
