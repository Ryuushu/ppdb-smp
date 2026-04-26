<?php

namespace Tests\Feature;

use App\Models\Gelombang;
use App\Models\PesertaPPDB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RankingTest extends TestCase
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
            'status' => 'pengumuman',
        ]);
    }

    public function test_ranking_page_is_accessible(): void
    {
        $response = $this->get(route('ppdb.ranking'));
        $response->assertStatus(200);
    }

    public function test_ranking_page_shows_participants_ordered_by_ranking(): void
    {
        // Create participants with rankings
        $p1 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta Ranking 2',
            'ranking' => 2,
            'skor_spk' => 70,
        ]);

        $p2 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta Ranking 1',
            'ranking' => 1,
            'skor_spk' => 90,
        ]);

        $response = $this->get(route('ppdb.ranking', ['gelombang_id' => $this->gelombang->id]));
        
        $response->assertStatus(200);
        $response->assertSeeInOrder(['Peserta Ranking 1', 'Peserta Ranking 2']);
    }
}
