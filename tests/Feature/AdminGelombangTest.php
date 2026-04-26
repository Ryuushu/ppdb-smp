<?php

namespace Tests\Feature;

use App\Models\Gelombang;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class AdminGelombangTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::forceCreate([
            'name' => 'Admin Test',
            'niy' => '1234567',
            'password' => bcrypt('password'),
            'role' => 'super_admin'
        ]);
    }

    public function test_admin_can_view_gelombang_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.gelombang.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_gelombang(): void
    {
        $data = [
            'nama' => 'Gelombang Baru',
            'deskripsi' => 'Deskripsi gelombang',
            'kuota' => 150,
            'tanggal_mulai' => now()->format('Y-m-d'),
            'tanggal_selesai' => now()->addDays(10)->format('Y-m-d'),
            'tahun_ajaran' => '2024/2025',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.gelombang.store'), $data);
        
        $response->assertRedirect(route('admin.gelombang.index'));
        $this->assertDatabaseHas('gelombang', [
            'nama' => 'Gelombang Baru',
            'status' => 'draft'
        ]);
    }

    public function test_admin_can_update_gelombang(): void
    {
        $gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);

        $data = [
            'nama' => 'Gelombang Updated',
            'deskripsi' => 'Deskripsi update',
            'kuota' => 200,
            'tanggal_mulai' => now()->format('Y-m-d'),
            'tanggal_selesai' => now()->addDays(15)->format('Y-m-d'),
            'tahun_ajaran' => '2025/2026',
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.gelombang.update', $gelombang->id), $data);
        
        $response->assertRedirect(route('admin.gelombang.index'));
        $this->assertDatabaseHas('gelombang', [
            'id' => $gelombang->id,
            'nama' => 'Gelombang Updated',
            'kuota' => 200
        ]);
    }

    public function test_admin_can_delete_gelombang(): void
    {
        $gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.gelombang.destroy', $gelombang->id));
        
        $response->assertRedirect(route('admin.gelombang.index'));
        $this->assertDatabaseMissing('gelombang', [
            'id' => $gelombang->id
        ]);
    }

    public function test_admin_can_update_gelombang_status(): void
    {
        $gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'draft',
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.gelombang.update_status', $gelombang->id), [
            'status' => 'buka'
        ]);
        
        $this->assertDatabaseHas('gelombang', [
            'id' => $gelombang->id,
            'status' => 'buka'
        ]);
    }

    public function test_admin_can_add_kriteria_spk_to_gelombang(): void
    {
        $gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);

        $response = $this->actingAs($this->admin)->post(route('admin.gelombang.store_kriteria', $gelombang->id), [
            'nama' => 'Nilai Rapor',
            'bobot' => 0.5,
            'tipe' => 'benefit'
        ]);
        
        $this->assertDatabaseHas('kriteria_spk', [
            'gelombang_id' => $gelombang->id,
            'nama' => 'Nilai Rapor',
            'bobot' => 0.5
        ]);
    }
}
