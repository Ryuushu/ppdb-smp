<?php

namespace Database\Seeders;

use App\Models\AdminItem;
use App\Models\AdminItemExtra;
use Illuminate\Database\Seeder;

class AdminItemSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // 1. Biaya Pendaftaran
        $pendaftaran = AdminItem::create([
            'name' => 'Biaya Pendaftaran',
            'amount_male' => 150000,
            'amount_female' => 150000,
            'description' => 'Biaya administrasi awal pendaftaran.',
        ]);

        // 2. Seragam (Master)
        $seragam = AdminItem::create([
            'name' => 'Seragam',
            'amount_male' => 700000,
            'amount_female' => 750000,
            'description' => 'Biaya paket seragam lengkap.',
        ]);

        // 3. Ukuran Seragam (Varian/Ekstra)
        $sizes = ['S', 'M', 'L', 'XL', 'XXL'];
        foreach ($sizes as $size) {
            AdminItemExtra::create([
                'admin_item_id' => $seragam->id,
                'name' => $size,
                'amount_male' => 0, // Sudah termasuk di harga master
                'amount_female' => 0,
            ]);
        }

        // Contoh Ekstra yang ada tambahan biaya
        AdminItemExtra::create([
            'admin_item_id' => $seragam->id,
            'name' => 'Jumbo (3XL)',
            'amount_male' => 50000,
            'amount_female' => 50000,
        ]);

        // 4. Biaya Gedung / Infaq
        AdminItem::create([
            'name' => 'Infaq Bangunan',
            'amount_male' => 1000000,
            'amount_female' => 1000000,
            'description' => 'Biaya pembangunan gedung sekolah.',
        ]);
    }
}
