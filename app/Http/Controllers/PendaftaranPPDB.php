<?php

    namespace App\Http\Controllers;

    use App\Http\Requests\DocumentFilterRequest;
    use App\Http\Requests\StorePendaftarRequest;
    use App\Http\Requests\UpdatePendaftarRequest;
    use App\Http\Requests\UpdatePesertaStatusRequest;
    use App\Models\PesertaPPDB;
    use App\Models\PpdbSetting;
    use App\Services\FonnteService;
    use Illuminate\Support\Str;
    use Illuminate\Support\Facades\Storage;

    class PendaftaranPPDB extends Controller
    {
        public function listPendaftar(DocumentFilterRequest $request)
        {
            $tahun = $request->input('tahun', now()->year);
            $search = $request->input('search');

            $pesertappdb = PesertaPPDB::whereYear('created_at', $tahun)
                ->when($search, function ($query, $search) {
                    $query->where(function ($q) use ($search) {
                        $q->where('nama_lengkap', 'like', "%{$search}%")
                            ->orWhere('no_pendaftaran', 'like', "%{$search}%");
                    });
                })
                ->latest()
                ->paginate($request->input('per_page', 10))
                ->withQueryString();

            $years = range(now()->year, now()->year - 5);

            return inertia('Admin/Ppdb/ListPendaftar', compact('pesertappdb', 'tahun', 'years'));
        }

        public function tambahPendaftar()
        {
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            $adminItems = \App\Models\AdminItem::with('extras')->get();
 $gelombang = \App\Models\Gelombang::whereIn('status', ['buka', 'pengumuman', 'daftar_ulang'])->get();
            return inertia('Admin/Ppdb/Create', compact('gelombang', 'masterDocuments', 'adminItems'));
        }

        public function submitPendaftar(StorePendaftarRequest $request)
        {
            $data = $request->validated();

            // Exclude non-column fields before mass assignment
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            $excludeKeys = ['admin_item_ids'];
            foreach ($masterDocuments as $doc) {
                $excludeKeys[] = $doc->slug;
            }
            
            $insertData = array_diff_key($data, array_flip($excludeKeys));

            // Determine File Store Process
            $peserta = PesertaPPDB::create($insertData);

            // Sync selected fee variations
            if (!empty($data['admin_item_ids'])) {
                $peserta->adminItemExtras()->sync($data['admin_item_ids']);
            }

            // Handle Dynamic Documents
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            foreach ($masterDocuments as $doc) {
                if ($request->hasFile($doc->slug)) {
                    $path = $request->file($doc->slug)->store('dokumen_peserta', 'public');
                    \App\Models\PesertaDocument::create([
                        'peserta_ppdb_id' => $peserta->id,
                        'master_document_id' => $doc->id,
                        'file_path' => $path
                    ]);
                }
            }

            // Queue SPK ranking calculation after new registration
            \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

            session()->flash('success', 'Peserta berhasil didaftarkan. Silakan lanjut menginput nilai SPK.');

            return redirect()->route('admin.spk.input_nilai', $peserta->id);
        }

        public function showPeserta($id)
        {
            $peserta = PesertaPPDB::with(['documents.masterDocument', 'gelombang', 'adminItemExtras.master'])->findOrFail($id);

            return inertia('Admin/Ppdb/Show', compact('peserta'));
        }

        public function edit($id)
        {
            $peserta = PesertaPPDB::with(['documents.masterDocument', 'adminItemExtras.master'])->findOrFail($id);
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            $adminItems = \App\Models\AdminItem::with('extras')->get();

            return inertia('Admin/Ppdb/Edit', compact('peserta', 'masterDocuments', 'adminItems'));
        }

        public function update(UpdatePendaftarRequest $request, $id)
        {
            $data = $request->validated();
            $ppdb = PesertaPPDB::findOrFail($id);


            // Exclude non-column fields before mass assignment
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            $excludeKeys = ['admin_item_ids'];
            foreach ($masterDocuments as $doc) {
                $excludeKeys[] = $doc->slug;
            }
            
            $updateData = array_diff_key($data, array_flip($excludeKeys));

            $ppdb->update($updateData);

            // Sync selected fee variations
            if (!empty($data['admin_item_ids'])) {
                $ppdb->adminItemExtras()->sync($data['admin_item_ids']);
            }

            // Handle Dynamic Documents
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            foreach ($masterDocuments as $doc) {
                if ($request->hasFile($doc->slug)) {
                    // Delete old file if exists in peserta_documents
                    $oldDoc = \App\Models\PesertaDocument::where('peserta_ppdb_id', $ppdb->id)
                        ->where('master_document_id', $doc->id)
                        ->first();

                    if ($oldDoc && Storage::disk('public')->exists($oldDoc->file_path)) {
                        Storage::disk('public')->delete($oldDoc->file_path);
                    }

                    $path = $request->file($doc->slug)->store('dokumen_peserta', 'public');
                    
                    \App\Models\PesertaDocument::updateOrCreate(
                        [
                            'peserta_ppdb_id' => $ppdb->id,
                            'master_document_id' => $doc->id,
                        ],
                        [
                            'file_path' => $path
                        ]
                    );
                }
            }

            session()->flash('success', 'Data peserta telah di ubah');

            return redirect()->route('ppdb.show.peserta', $ppdb->id);
        }

        // formulir section
        public function mendaftar(StorePendaftarRequest $request)
        {
            $data = $request->validated();

            // Double check wave status server-side
            $gelombang = \App\Models\Gelombang::where('id', $data['gelombang_id'])
                ->where('status', 'buka')
                ->where('tanggal_mulai', '<=', now())
                ->where('tanggal_selesai', '>=', now())
                ->first();

            if (!$gelombang) {
                return back()->withErrors(['gelombang_id' => 'Gelombang pendaftaran sudah ditutup atau tidak tersedia.']);
            }

            // Exclude non-column fields before mass assignment
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            $excludeKeys = ['admin_item_ids'];
            foreach ($masterDocuments as $doc) {
                $excludeKeys[] = $doc->slug;
            }
            
            $insertData = array_diff_key($data, array_flip($excludeKeys));

            $ppdb = PesertaPPDB::create($insertData);

            // Sync selected fee variations
            if (!empty($data['admin_item_ids'])) {
                $ppdb->adminItemExtras()->sync($data['admin_item_ids']);
            }

            // Handle Dynamic Documents
            $masterDocuments = \App\Models\MasterDocument::where('is_active', true)->get();
            foreach ($masterDocuments as $doc) {
                if ($request->hasFile($doc->slug)) {
                    $path = $request->file($doc->slug)->store('dokumen_peserta', 'public');
                    \App\Models\PesertaDocument::create([
                        'peserta_ppdb_id' => $ppdb->id,
                        'master_document_id' => $doc->id,
                        'file_path' => $path
                    ]);
                }
            }

            // Queue SPK ranking calculation after new registration
            \App\Jobs\CalculateSPKRanking::dispatch($data['gelombang_id']);

            session()->flash('success', 'Terima kasih, anda berhasil mendaftar dengan nomor pendaftaran '.$ppdb->no_pendaftaran);

            return redirect()->route('ppdb.register');
        }

        public function terimaPeserta(UpdatePesertaStatusRequest $request, $uuid)
        {
            $request->validated();

            $peserta = PesertaPPDB::with(['kwitansi', 'gelombang'])->findOrFail($uuid);

            $peserta->diterima = $request->input('status') == 'y' ? 1 : 2;
            $peserta->save();

            $msg = $request->input('status') == 'y' ? 'Peserta Diterima' : 'Peserta Ditolak';

            // Send WhatsApp notification if accepted
            if ($request->input('status') == 'y') {
                $setting = PpdbSetting::latest()->first();
                if ($setting && !empty($setting->body['fonnte_token'])) {
                    $fonnte = new FonnteService();
                    $template = $setting->body['pesan_kelulusan'] ?? "Selamat {nama}! Anda dinyatakan LULUS seleksi PPDB. Silakan melakukan daftar ulang.";
                    
                    if ($peserta->no_hp) {
                        $message = str_replace(
                            ['{nama}', '{no_pendaftaran}', '{gelombang}'],
                            [$peserta->nama_lengkap, $peserta->no_pendaftaran, $peserta->gelombang?->nama ?? ''],
                            $template
                        );
                        $fonnte->sendMessage($peserta->no_hp, $message);
                    }
                }
            }

            session()->flash('success', $msg);

            return back();
        }

        public function hapusPeserta($uuid)
        {
            $peserta = PesertaPPDB::with('documents')->findOrFail($uuid);

            foreach ($peserta->documents as $doc) {
                if (Storage::disk('public')->exists($doc->file_path)) {
                    Storage::disk('public')->delete($doc->file_path);
                }
            }

            $peserta->delete();

            session()->flash('success', 'Peserta telah dihapus');

            return redirect()->route('ppdb.list.pendaftar');
        }
    }
