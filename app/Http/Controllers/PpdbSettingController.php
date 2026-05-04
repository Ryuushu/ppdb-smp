<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdatePpdbSettingRequest;
use App\Models\PpdbSetting;

class PpdbSettingController extends Controller
{
    public function index()
    {
        $setting = PpdbSetting::latest()->first();

        return inertia('Admin/Settings/Ppdb', compact('setting'));
    }

    public function setBatasAkhir(UpdatePpdbSettingRequest $request)
    {
        $request->validated();

        $batas = PpdbSetting::latest()->first();

        // Create if not exists (handling edge case if table is empty, though view assumed it exists)
        if (! $batas) {
            $batas = PpdbSetting::create(['body' => []]);
        }

        $batas->update([
            'body' => [
                'no_surat' => $request->input('no_surat'),
                'whatsapp' => $request->input('whatsapp'),
                'fonnte_token' => $request->input('fonnte_token'),
                'jatuh_tempo_cicilan' => $request->input('jatuh_tempo_cicilan'),
                'pesan_tagihan' => $request->input('pesan_tagihan'),
                'pesan_kelulusan' => $request->input('pesan_kelulusan'),
            ],
        ]);

        session()->flash('success', 'Pengaturan PPDB telah di ubah');

        return back();
    }
}
