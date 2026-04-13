<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$g = \App\Models\Gelombang::orderBy('id', 'desc')->first();
if ($g) {
    echo "Current start date: " . $g->tanggal_mulai . "\n";
    $g->tanggal_mulai = now()->subDays(2);
    $g->save();
    echo "Updated start date to: " . $g->tanggal_mulai . "\n";
    echo "Status: " . $g->status . "\n";
} else {
    echo "No Gelombang found.\n";
}
