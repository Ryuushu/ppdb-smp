<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterUkuranSeragam;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MasterUkuranSeragamController extends Controller
{
    public function index()
    {
        $items = MasterUkuranSeragam::latest()->get();
        return Inertia::render('Admin/Settings/UkuranSeragam', [
            'items' => $items,
            'title' => 'Pengaturan Biaya Ukuran Baju'
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_ukuran' => 'required|string|max:255',
            'tambahan_biaya' => 'required|numeric|min:0',
        ]);

        MasterUkuranSeragam::create($validated);

        return back()->with('success', 'Ukuran seragam berhasil ditambahkan.');
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'nama_ukuran' => 'required|string|max:255',
            'tambahan_biaya' => 'required|numeric|min:0',
        ]);

        $item = MasterUkuranSeragam::findOrFail($id);
        $item->update($validated);

        return back()->with('success', 'Ukuran seragam berhasil diperbarui.');
    }

    public function destroy($id)
    {
        MasterUkuranSeragam::findOrFail($id)->delete();
        return back()->with('success', 'Ukuran seragam berhasil dihapus.');
    }
}
