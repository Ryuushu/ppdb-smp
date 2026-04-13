<?php

namespace Database\Seeders;

use App\Models\PesertaPPDB;
use Illuminate\Database\Seeder;

class PesertaPPDBSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $extras = \App\Models\AdminItemExtra::all();

        PesertaPPDB::factory(5)->create()->each(function ($p) use ($extras) {
            if ($extras->count() > 0) {
                // Attach exactly 1 random extra
                $p->adminItemExtras()->attach($extras->random()->id);
            }
        });

        // add more but for the before this year
        PesertaPPDB::factory(5)->create(['created_at' => now()->subYear()])->each(function ($p) use ($extras) {
            if ($extras->count() > 0) {
                // Attach exactly 1 random extra
                $p->adminItemExtras()->attach($extras->random()->id);
            }
        });
    }
}
