<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MasterDocument;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class MasterDocumentController extends Controller
{
    public function index()
    {
        $documents = MasterDocument::latest()->get();
        return Inertia::render('Admin/Settings/MasterDocuments', [
            'documents' => $documents,
            'title' => 'Master Dokumen'
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_required' => 'required|boolean',
            'is_active' => 'required|boolean',
            'description' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($validated['name'], '_');

        // Ensure unique slug
        $count = MasterDocument::where('slug', 'like', $validated['slug'] . '%')->count();
        if ($count > 0) {
            $validated['slug'] .= '_' . ($count + 1);
        }

        MasterDocument::create($validated);

        return back()->with('success', 'Dokumen berhasil ditambahkan.');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, $id)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'is_required' => 'required|boolean',
            'is_active' => 'required|boolean',
            'description' => 'nullable|string',
        ]);

        $document = MasterDocument::findOrFail($id);
        
        // Update slug if name changes
        if ($document->name !== $validated['name']) {
            $validated['slug'] = Str::slug($validated['name'], '_');
            $count = MasterDocument::where('slug', 'like', $validated['slug'] . '%')
                ->where('id', '!=', $id)
                ->count();
            if ($count > 0) {
                $validated['slug'] .= '_' . ($count + 1);
            }
        }

        $document->update($validated);

        return back()->with('success', 'Dokumen berhasil diperbarui.');
    }

    public function destroy($id)
    {
        $document = MasterDocument::findOrFail($id);
        
        // check if document is being used? 
        // For now, let's just delete it (foreign key cascade will handle cleanup in peserta_documents)
        $document->delete();

        return back()->with('success', 'Dokumen berhasil dihapus.');
    }
}
