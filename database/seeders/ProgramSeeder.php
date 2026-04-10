<?php

namespace Database\Seeders;

use App\Models\Program;
use App\Models\PpdbSetting;
use Illuminate\Database\Seeder;

class ProgramSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $data = [
            [
                'id' => 1,
                'nama' => 'Program Reguler',
                'abbreviation' => 'REG',
            ], [
                'id' => 2,
                'nama' => 'Program Tahfidz',
                'abbreviation' => 'THF',
            ], [
                'id' => 3,
                'nama' => 'Program Unggulan',
                'abbreviation' => 'UNG',
            ]
        ];

        $setting = [
            'body' => json_encode([
                'batas_akhir_ppdb' => now(),
                'no_surat' => '247/Pan.PPDB/2021',
                'hasil_akhir' => now(),
            ]),
        ];

        Program::insert($data);
        PpdbSetting::insert($setting);
    }
}
