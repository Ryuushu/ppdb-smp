<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AdminItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminItemController extends Controller
{
    public function index()
    {
        $items = AdminItem::latest()->get();
        return Inertia::render('Admin/Settings/AdminItems', [
            'items' => $items,
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
        ]);

        AdminItem::create($validated);

        return back()->with('success', 'Biaya administrasi berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'amount_male' => 'required|numeric|min:0',
            'amount_female' => 'required|numeric|min:0',
            'description' => 'nullable|string',
        ]);

        $item = AdminItem::findOrFail($id);
        $item->update($validated);

        return back()->with('success', 'Biaya administrasi berhasil diperbarui.');
    }

    public function destroy($id)
    {
        AdminItem::findOrFail($id)->delete();
        return back()->with('success', 'Biaya administrasi berhasil dihapus.');
    }
}
