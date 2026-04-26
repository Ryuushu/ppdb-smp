<?php

namespace Tests\Feature;

use App\Jobs\CalculateSPKRanking;
use App\Models\Gelombang;
use App\Models\PesertaPPDB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SPKCalculationTest extends TestCase
{
    use RefreshDatabase;

    protected $gelombang;

    protected function setUp(): void
    {
        parent::setUp();

        $this->gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);
    }

    public function test_spk_calculation_logic(): void
    {
        // Create participants with Calistung scores
        // Max scores: Baca: 90, Tulis: 80, Hitung: 100
        $p1 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta 1',
            'nilai_baca' => 90,
            'nilai_tulis' => 40,
            'nilai_hitung' => 50,
        ]);

        $p2 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta 2',
            'nilai_baca' => 45,
            'nilai_tulis' => 80,
            'nilai_hitung' => 100,
        ]);

        // Dispatch job synchronously
        CalculateSPKRanking::dispatchSync($this->gelombang->id);

        // Refresh models
        $p1->refresh();
        $p2->refresh();

        // Check scores and ranking
        // Max values: Baca=90, Tulis=80, Hitung=100
        // P1: (90/90 * 1/3) + (40/80 * 1/3) + (50/100 * 1/3) = (1 + 0.5 + 0.5) / 3 = 2/3 = 0.666...
        // P1 Skor (Scale 100): 66.66...
        // P2: (45/90 * 1/3) + (80/80 * 1/3) + (100/100 * 1/3) = (0.5 + 1 + 1) / 3 = 2.5/3 = 0.833...
        // P2 Skor (Scale 100): 83.33...

        $this->assertGreaterThan($p1->skor_spk, $p2->skor_spk);
        $this->assertEquals(1, $p2->ranking);
        $this->assertEquals(2, $p1->ranking);
        
        $this->assertEqualsWithDelta(83.33, $p2->skor_spk, 0.01);
        $this->assertEqualsWithDelta(66.66, $p1->skor_spk, 0.01);
    }
}
