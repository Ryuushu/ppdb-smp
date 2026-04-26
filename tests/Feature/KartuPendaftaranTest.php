<?php

namespace Tests\Feature;

use App\Models\PesertaPPDB;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class KartuPendaftaranTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;

    protected $admin;
    protected $peserta;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::forceCreate([
            'name' => 'Admin Test',
            'niy' => '1234567',
            'password' => bcrypt('password'),
            'role' => 'super_admin'
        ]);

        $gelombang = \App\Models\Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);

        $this->peserta = PesertaPPDB::factory()->create([
            'gelombang_id' => $gelombang->id,
            'nama_lengkap' => 'Test Peserta',
            'diterima' => 1 // Diterima
        ]);
    }

    /**
     * Test admin dapat mencetak semua kartu
     */
    public function test_admin_dapat_mencetak_kartu_semua(): void
    {
        $response = $this->actingAs($this->admin)->post(route('ppdb.cetak.kartu.semua'), [
            'peserta_ids' => [$this->peserta->id]
        ]);

        $response->assertStatus(200);
        $response->assertSee('Test Peserta');
    }

    /**
     * Test cetak kartu single
     */
    public function test_admin_dapat_mencetak_kartu_single(): void
    {
        $response = $this->actingAs($this->admin)->post(route('ppdb.cetak.kartu', $this->peserta->id));

        $response->assertStatus(200);
        $response->assertSee('Test Peserta');
    }
}
