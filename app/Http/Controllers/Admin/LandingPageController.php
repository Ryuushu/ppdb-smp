<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\LandingContent;
use App\Models\LandingSetting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index()
    {
        $settings = LandingSetting::pluck('value', 'key')->toArray();
        $contents = LandingContent::orderBy('order')->get()->groupBy('type');

        return Inertia::render('Admin/Settings/LandingPage', [
            'settings' => $settings,
            'contents' => $contents,
        ]);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'array',
        ]);

        foreach ($validated['settings'] as $key => $value) {
            LandingSetting::updateOrCreate(
                ['key' => $key],
                ['value' => $value]
            );
        }

        // Handle kepsek_image upload if present
        if ($request->hasFile('kepsek_image')) {
            $path = $request->file('kepsek_image')->store('landing/settings', 'public');
            LandingSetting::updateOrCreate(
                ['key' => 'kepsek_image'],
                ['value' => $path]
            );
        }

        return redirect()->back()->with('success', 'Pengaturan berhasil diperbarui.');
    }

    public function storeContent(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
            'attributes' => 'nullable|array',
        ]);

        $content = new LandingContent($validated);

        if ($request->hasFile('image')) {
            $content->image = $request->file('image')->store('landing/contents', 'public');
        }

        $content->save();

        return redirect()->back()->with('success', 'Konten berhasil ditambahkan.');
    }

    public function updateContent(Request $request, $id)
    {
        $content = LandingContent::findOrFail($id);

        $validated = $request->validate([
            'type' => 'required|string',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'icon' => 'nullable|string',
            'order' => 'integer',
            'is_active' => 'boolean',
            'attributes' => 'nullable|array',
        ]);

        $content->fill($validated);

        if ($request->hasFile('image')) {
            if ($content->image) {
                Storage::disk('public')->delete($content->image);
            }
            $content->image = $request->file('image')->store('landing/contents', 'public');
        }

        $content->save();

        return redirect()->back()->with('success', 'Konten berhasil diperbarui.');
    }

    public function destroyContent($id)
    {
        $content = LandingContent::findOrFail($id);
        if ($content->image) {
            Storage::disk('public')->delete($content->image);
        }
        $content->delete();

        return redirect()->back()->with('success', 'Konten berhasil dihapus.');
    }
}
