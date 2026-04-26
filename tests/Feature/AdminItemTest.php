<?php

namespace Tests\Feature;

use App\Models\AdminItem;
use App\Models\AdminItemExtra;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithoutMiddleware;
use Tests\TestCase;

class AdminItemTest extends TestCase
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

    public function test_admin_can_view_admin_items_index(): void
    {
        $response = $this->actingAs($this->admin)->get(route('admin.admin-items.index'));
        $response->assertStatus(200);
    }

    public function test_admin_can_create_master_admin_item(): void
    {
        $data = [
            'name' => 'Biaya Formulir',
            'amount_male' => 100000,
            'amount_female' => 100000,
            'description' => 'Biaya awal',
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.admin-items.store'), $data);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('admin_items', [
            'name' => 'Biaya Formulir',
            'amount_male' => 100000,
            'amount_female' => 100000
        ]);
    }

    public function test_admin_can_create_extra_admin_item_with_bulk_insert(): void
    {
        $master = AdminItem::create([
            'name' => 'Seragam',
            'amount_male' => 0,
            'amount_female' => 0,
        ]);

        $data = [
            'name' => 'S, M, L, XL', // Bulk insert by comma
            'amount_male' => 150000,
            'amount_female' => 160000,
            'is_extra' => true,
            'parent_id' => $master->id,
        ];

        $response = $this->actingAs($this->admin)->post(route('admin.admin-items.store'), $data);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('admin_item_extras', [
            'admin_item_id' => $master->id,
            'name' => 'S',
            'amount_male' => 150000,
            'amount_female' => 160000
        ]);
        $this->assertDatabaseHas('admin_item_extras', [
            'admin_item_id' => $master->id,
            'name' => 'XL',
        ]);
    }

    public function test_admin_can_update_master_admin_item(): void
    {
        $item = AdminItem::create([
            'name' => 'SPP',
            'amount_male' => 50000,
            'amount_female' => 50000,
        ]);

        $data = [
            'name' => 'SPP Bulan Pertama',
            'amount_male' => 75000,
            'amount_female' => 75000,
        ];

        $response = $this->actingAs($this->admin)->put(route('admin.admin-items.update', $item->id), $data);
        
        $response->assertRedirect();
        $this->assertDatabaseHas('admin_items', [
            'id' => $item->id,
            'name' => 'SPP Bulan Pertama',
            'amount_male' => 75000
        ]);
    }

    public function test_admin_can_delete_admin_item(): void
    {
        $item = AdminItem::create([
            'name' => 'Gedung',
            'amount_male' => 1000000,
            'amount_female' => 1000000,
        ]);

        $response = $this->actingAs($this->admin)->delete(route('admin.admin-items.destroy', $item->id));
        
        $response->assertRedirect();
        $this->assertDatabaseMissing('admin_items', [
            'id' => $item->id
        ]);
    }

    public function test_admin_can_bulk_destroy_admin_items(): void
    {
        $item1 = AdminItem::create(['name' => 'A', 'amount_male' => 0, 'amount_female' => 0]);
        $item2 = AdminItem::create(['name' => 'B', 'amount_male' => 0, 'amount_female' => 0]);

        $response = $this->actingAs($this->admin)->post(route('admin.admin-items.bulk-destroy'), [
            'ids' => [$item1->id, $item2->id],
            'type' => 'master'
        ]);
        
        $response->assertRedirect();
        $this->assertDatabaseMissing('admin_items', ['id' => $item1->id]);
        $this->assertDatabaseMissing('admin_items', ['id' => $item2->id]);
    }
}
