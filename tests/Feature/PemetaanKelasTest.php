<?php

namespace Tests\Feature;

use App\Models\AdminItem;
use App\Models\ClassRange;
use App\Models\Gelombang;
use App\Models\Kwitansi;
use App\Models\PesertaPPDB;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class PemetaanKelasTest extends TestCase
{
    use RefreshDatabase, WithoutMiddleware;

    protected $admin;
    protected $gelombang;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::forceCreate([
            'name' => 'Admin Test',
            'niy' => '1234567',
            'password' => bcrypt('password'),
            'role' => 'super_admin'
        ]);

        $this->gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);
    }

    public function test_admin_can_manage_class_ranges(): void
    {
        // Test Create
        $response = $this->actingAs($this->admin)->post(route('admin.pemetaan-kelas.store_ranges'), [
            'class_name' => 'Kelas A',
            'min_score' => 80,
            'max_score' => 100,
            'max_capacity' => 30
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('class_ranges', ['class_name' => 'Kelas A']);

        $range = ClassRange::first();

        // Test Update
        $response = $this->actingAs($this->admin)->put(route('admin.pemetaan-kelas.update_range', $range->id), [
            'class_name' => 'Kelas A Updated',
            'min_score' => 85,
            'max_score' => 100,
            'max_capacity' => 32
        ]);
        
        $this->assertDatabaseHas('class_ranges', ['class_name' => 'Kelas A Updated', 'min_score' => 85]);

        // Test Delete
        $response = $this->actingAs($this->admin)->delete(route('admin.pemetaan-kelas.delete_range', $range->id));
        $this->assertDatabaseMissing('class_ranges', ['id' => $range->id]);
    }

    public function test_participant_mapping_based_on_score_and_payment(): void
    {
        // 1. Setup Biaya
        AdminItem::create([
            'name' => 'Biaya Pendaftaran',
            'amount_male' => 100000,
            'amount_female' => 100000
        ]);

        // 2. Setup Peserta (Laki-laki)
        $p1 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta Lunas',
            'jenis_kelamin' => 'l',
            'skor_spk' => 90,
            'nilai_baca' => 90, // Required for CalculateSPKRanking job in controller
        ]);

        $p2 = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Peserta Belum Lunas',
            'jenis_kelamin' => 'l',
            'skor_spk' => 95,
        ]);

        // 3. Setup Pembayaran untuk p1 (Lunas)
        Kwitansi::create([
            'peserta_ppdb_id' => $p1->id,
            'nominal' => 100000,
            'user_id' => $this->admin->id,
            'jenis_pembayaran' => 'Lunas'
        ]);

        // 4. Setup Class Range
        ClassRange::create([
            'class_name' => 'Kelas Unggulan',
            'min_score' => 80,
            'max_score' => 100,
            'max_capacity' => 1
        ]);

        // Access Index
        $response = $this->actingAs($this->admin)->get(route('admin.pemetaan-kelas.index'));
        
        $response->assertStatus(200);
        
        // Verifikasi p1 (Lunas) ada di daftar dan masuk Kelas Unggulan
        // Kita tidak bisa langsung assertSee di Inertia response HTML dengan mudah untuk array data, 
        // tapi kita bisa verifikasi logic controller lewat hasil yang di-pass ke view (Inertia data).
        $inertiaData = $response->original->getData()['page']['props']['peserta'];
        
        $this->assertCount(1, $inertiaData, 'Hanya peserta lunas yang harus muncul');
        $this->assertEquals('Kelas Unggulan', $inertiaData[0]['assigned_class']);
    }

    public function test_admin_can_save_calistung_score_and_trigger_spk(): void
    {
        $p = PesertaPPDB::factory()->create([
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Test Calistung',
        ]);

        $response = $this->actingAs($this->admin)->put(route('admin.pemetaan-kelas.save_score', $p->id), [
            'nilai_baca' => 80,
            'nilai_tulis' => 85,
            'nilai_hitung' => 90,
        ]);

        $response->assertRedirect();
        
        $p->refresh();
        $this->assertEquals(80, $p->nilai_baca);
        $this->assertNotNull($p->skor_spk, 'SPK Skor harus otomatis terisi');
        $this->assertNotNull($p->ranking, 'Ranking harus otomatis terisi');
    }
}
