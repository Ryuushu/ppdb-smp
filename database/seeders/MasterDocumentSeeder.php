<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MasterDocumentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $documents = [
            ['name' => 'Pas Foto Berwarna (3x4)', 'slug' => 'pas_foto', 'is_required' => true],
            ['name' => 'Scan Ijazah Terakhir', 'slug' => 'scan_ijazah_paud_tk', 'is_required' => false],
            ['name' => 'Scan Kartu Keluarga (KK)', 'slug' => 'scan_kk', 'is_required' => true],
            ['name' => 'Scan Akta Kelahiran', 'slug' => 'scan_akta_kelahiran', 'is_required' => true],
        ];

        foreach ($documents as $doc) {
            \App\Models\MasterDocument::updateOrCreate(['slug' => $doc['slug']], $doc);
        }
    }
}
