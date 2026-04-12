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
            'nik' => 'required|string',
            'jenis_kelamin' => 'required|in:l,p',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date_format:Y-m-d',
            'jumlah_saudara_kandung' => 'required|integer|min:0',
            'anak_ke' => 'required|integer|min:1',
            'status_anak' => 'required|string',
            'alamat_lengkap' => 'required|string',
            'agama' => 'required|string',
            
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

            'penghasilan_ortu' => 'nullable|string',
            'no_hp' => 'required|string',
            'no_kip_kks_pkh' => 'nullable|string',

            // Sekolah Asal
            'asal_sekolah' => 'nullable|string',
            'npsn_sekolah_asal' => 'nullable|string',
            'alamat_sekolah_asal' => 'nullable|string',
            'tahun_lulus' => 'nullable|string',

            // Bakat / Tambahan
            'prestasi_diraih' => 'nullable|string',
            'pengalaman_berkesan' => 'nullable|string',
            'cita_cita' => 'nullable|string',
            'no_hp_pribadi' => 'nullable|string',
            'ekstrakurikuler' => 'nullable|array',
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
}
