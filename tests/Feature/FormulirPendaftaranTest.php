<?php

namespace Tests\Feature;

use App\Models\Gelombang;
use App\Models\MasterDocument;
use App\Models\PesertaPPDB;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class FormulirPendaftaranTest extends TestCase
{
    use RefreshDatabase, WithFaker, WithoutMiddleware;

    protected $gelombang;
    protected $masterDocument;

    protected function setUp(): void
    {
        parent::setUp();

        // Setup gelombang yang sedang buka
        $this->gelombang = Gelombang::create([
            'nama' => 'Gelombang 1',
            'kuota' => 100,
            'tahun_ajaran' => '2024/2025',
            'tanggal_mulai' => now()->subDays(5),
            'tanggal_selesai' => now()->addDays(5),
            'status' => 'buka',
        ]);
        
        // Setup master document
        MasterDocument::create([
            'name' => 'Kartu Keluarga',
            'slug' => 'kartu_keluarga',
            'is_required' => false,
            'is_active' => true,
        ]);
    }

    /**
     * Test menampilkan halaman pendaftaran
     */
    public function test_halaman_pendaftaran_dapat_diakses(): void
    {
        $response = $this->get(route('ppdb.register'));

        $response->assertStatus(200);
    }

    /**
     * Test validasi gagal saat field wajib tidak diisi
     */
    public function test_validasi_pendaftaran_gagal_jika_field_wajib_kosong(): void
    {
        $response = $this->post(route('ppdb.register.submit'), []);

        $response->assertSessionHasErrors([
            'gelombang_id',
            'nama_lengkap',
            'nik',
            'jenis_kelamin',
            'tempat_lahir',
            'tanggal_lahir',
            'jumlah_saudara_kandung',
            'anak_ke',
            'status_anak',
            'alamat_lengkap',
            'agama',
            'pernah_paud',
            'pernah_tk',
            'nama_ayah',
            'nama_ibu',
            'no_hp',
        ]);
    }

    /**
     * Test sukses submit formulir pendaftaran
     */
    public function test_sukses_submit_formulir_pendaftaran(): void
    {
        $data = [
            'gelombang_id' => $this->gelombang->id,
            'nama_lengkap' => 'Budi Santoso',
            'nik' => '3301234567890001',
            'nisn' => '0051234567',
            'jenis_kelamin' => 'l',
            'tempat_lahir' => 'Jakarta',
            'tanggal_lahir' => '2010-05-12',
            'jumlah_saudara_kandung' => 2,
            'anak_ke' => 1,
            'status_anak' => 'Anak Kandung',
            'alamat_lengkap' => 'Jl. Merdeka No. 10',
            'agama' => 'Islam',
            'pernah_paud' => 1,
            'pernah_tk' => 1,
            'nama_ayah' => 'Ayah Budi',
            'nama_ibu' => 'Ibu Budi',
            'no_hp' => '081234567890',
        ];

        $response = $this->post(route('ppdb.register.submit'), $data);

        $response->assertRedirect(route('ppdb.register'));
        $response->assertSessionHas('success');

        $this->assertDatabaseHas('peserta_ppdb', [
            'nama_lengkap' => 'Budi Santoso',
            'nik' => '3301234567890001',
            'jenis_kelamin' => 'l',
        ]);
    }
}
