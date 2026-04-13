<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminItem;
use App\Models\AdminItemExtra;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminItemController extends Controller
{
    public function index()
    {
        $items = AdminItem::with('extras')->latest()->get();
        $baseItems = AdminItem::get(); // For parent selection dropdown

        return Inertia::render('Admin/Settings/AdminItems', [
            'items' => $items,
            'baseItems' => $baseItems,
            'title' => 'Daftar Biaya Administrasi'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount_male' => 'required|numeric|min:0',
            'amount_female' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_extra' => 'nullable|boolean',
            'parent_id' => 'nullable|exists:admin_items,id',
        ]);

        if (!empty($validated['is_extra'])) {
            // Support bulk add by comma
            $names = array_filter(array_map('trim', explode(',', $validated['name'])));
            
            foreach ($names as $name) {
                AdminItemExtra::create([
                    'admin_item_id' => $validated['parent_id'],
                    'name' => $name,
                    'amount_male' => $validated['amount_male'],
                    'amount_female' => $validated['amount_female'],
                ]);
            }
        } else {
            AdminItem::create([
                'name' => $validated['name'],
                'amount_male' => $validated['amount_male'],
                'amount_female' => $validated['amount_female'],
                'description' => $validated['description'] ?? null,
            ]);
        }

        return back()->with('success', 'Biaya administrasi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount_male' => 'required|numeric|min:0',
            'amount_female' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'is_extra' => 'nullable|boolean',
            'parent_id' => 'nullable|exists:admin_items,id',
            'was_extra' => 'nullable|boolean', // Added to track original state if we want to change types (not recommended, but supported for stability)
        ]);

        if (!empty($validated['is_extra'])) {
            $item = AdminItemExtra::findOrFail($id);
            $item->update([
                'admin_item_id' => $validated['parent_id'],
                'name' => $validated['name'],
                'amount_male' => $validated['amount_male'],
                'amount_female' => $validated['amount_female'],
            ]);
        } else {
            $item = AdminItem::findOrFail($id);
            $item->update([
                'name' => $validated['name'],
                'amount_male' => $validated['amount_male'],
                'amount_female' => $validated['amount_female'],
                'description' => $validated['description'] ?? null,
            ]);
        }

        return back()->with('success', 'Biaya administrasi berhasil diperbarui.');
    }

    public function destroy(Request $request, $id)
    {
        if ($request->input('is_extra') == 1 || $request->input('is_extra') === 'true' || $request->input('is_extra') === true) {
            AdminItemExtra::findOrFail($id)->delete();
        } else {
            AdminItem::findOrFail($id)->delete();
        }
        return back()->with('success', 'Biaya administrasi berhasil dihapus.');
    }

    public function bulkDestroy(Request $request)
    {
        $ids = $request->input('ids');
        $type = $request->input('type'); // 'master' or 'extra'

        if ($type === 'master') {
            AdminItem::whereIn('id', $ids)->delete();
        } else {
            \App\Models\AdminItemExtra::whereIn('id', $ids)->delete();
        }

        return back()->with('success', 'Data terpilih berhasil dihapus');
    }
}
