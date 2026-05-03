<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePendaftarRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            // Identitas Diri
            'nama_lengkap' => 'required|string|max:255',
            'nisn' => 'nullable|string',
            'nik' => ['required', 'string', \Illuminate\Validation\Rule::unique('peserta_ppdb', 'nik')->ignore($this->route('id'))],
            'jenis_kelamin' => 'required|in:l,p',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date_format:Y-m-d',
            'jumlah_saudara_kandung' => 'required|integer|min:0',
            'anak_ke' => 'required|integer|min:1',
            'status_anak' => 'required|string',
            'alamat_lengkap' => 'required|string',
            'dukuh' => 'nullable|string',
            'rt' => 'nullable|string',
            'rw' => 'nullable|string',
            'desa_kelurahan' => 'nullable|string',
            'kecamatan' => 'nullable|string',
            'kabupaten_kota' => 'nullable|string',
            'provinsi' => 'nullable|string',
            'kode_pos' => 'nullable|string',
            'agama' => 'required|string',
            'saran_dari' => 'nullable|string',
            'rekomendasi_mwc' => 'nullable',
            
            // Riwayat Pendidikan
            'pernah_paud' => 'required|boolean',
            'pernah_tk' => 'required|boolean',

            // Data Orang Tua
            'nama_ayah' => 'required|string',
            'nik_ayah' => 'nullable|string',
            'pendidikan_ayah' => 'nullable|string',
            'pekerjaan_ayah' => 'nullable|string',
            
            'nama_ibu' => 'required|string',
            'nik_ibu' => 'nullable|string',
            'pendidikan_ibu' => 'nullable|string',
            'pekerjaan_ibu' => 'nullable|string',
            'no_hp_ayah' => ['nullable', 'string', 'regex:/^(08|\+62|62)[0-9]{8,15}$/'],
            'no_hp_ibu' => ['nullable', 'string', 'regex:/^(08|\+62|62)[0-9]{8,15}$/'],

            'penghasilan_ortu' => 'nullable|string',
            'no_hp' => ['required', 'string', 'regex:/^(08|\+62|62)[0-9]{8,15}$/'],


            // Sekolah Asal
            'asal_sekolah' => 'nullable|string',
            'npsn_sekolah_asal' => 'nullable|string',
            'alamat_sekolah_asal' => 'nullable|string',
            'tahun_lulus' => 'nullable|string',

            // Bakat / Tambahan
            'prestasi_diraih' => 'nullable|string',
            'pengalaman_berkesan' => 'nullable|string',
            'cita_cita' => 'nullable|string',
            'no_hp_pribadi' => ['nullable', 'string', 'regex:/^(08|\+62|62)[0-9]{8,15}$/'],
            'ekstrakurikuler' => 'nullable|array',
            
            'admin_item_ids' => 'nullable|array',
            'admin_item_ids.*' => 'exists:admin_item_extras,id',
        ];

        // Dynamic Document Rules (Always nullable for updates)
        $masterDocs = \App\Models\MasterDocument::where('is_active', true)->get();
        foreach ($masterDocs as $doc) {
            $rule = 'nullable|file|max:2048';
            if ($doc->slug === 'pas_foto') {
                 $rule .= '|mimes:jpg,jpeg,png';
            } else {
                 $rule .= '|mimes:jpg,jpeg,png,pdf';
            }
            $rules[$doc->slug] = $rule;
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'no_hp.regex' => 'Format nomor WhatsApp tidak valid (Gunakan format 08... atau 62...)',
            'no_hp_ayah.regex' => 'Format nomor WhatsApp ayah tidak valid',
            'no_hp_ibu.regex' => 'Format nomor WhatsApp ibu tidak valid',
            'no_hp_pribadi.regex' => 'Format nomor WhatsApp pribadi tidak valid',
        ];
    }
}
