<?php

namespace Tests\Feature;

use App\Models\MasterDocument;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class AdminMasterDocumentTest extends TestCase
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

    public function test_admin_can_view_master_documents_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.master-documents.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_master_document_with_slug_generation(): void
    {
        $data = [
            'name' => 'Kartu Keluarga',
            'is_required' => true,
            'is_active' => true,
            'description' => 'Fotocopy KK',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.master-documents.store'), $data);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('master_documents', [
            'name' => 'Kartu Keluarga',
            'slug' => 'kartu_keluarga',
            'is_required' => 1
        ]);
    }

    public function test_admin_can_update_master_document(): void
    {
        $doc = MasterDocument::create([
            'name' => 'Ijazah Asli',
            'slug' => 'ijazah_asli',
            'is_required' => false,
            'is_active' => true,
        ]);

        $data = [
            'name' => 'Ijazah Legalisir',
            'is_required' => true,
            'is_active' => false,
            'description' => 'Harus dilegalisir',
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.master-documents.update', $doc->id), $data);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('master_documents', [
            'id' => $doc->id,
            'name' => 'Ijazah Legalisir',
            'slug' => 'ijazah_legalisir',
            'is_required' => 1,
            'is_active' => 0
        ]);
    }

    public function test_admin_can_delete_master_document(): void
    {
        $doc = MasterDocument::create([
            'name' => 'Pas Foto',
            'slug' => 'pas_foto',
            'is_required' => true,
            'is_active' => true,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.master-documents.destroy', $doc->id));
        
        $response->assertRedirect();
        $this->assertDatabaseMissing('master_documents', [
            'id' => $doc->id
        ]);
    }
}
