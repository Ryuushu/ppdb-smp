<?php

namespace App\Exports;

use App\Models\PesertaPPDB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class PesertaPPDBExport implements FromCollection, ShouldAutoSize, WithHeadings, WithMapping
{
    public $tahun;

    public $diterima;

    public $all;

    public function __construct($tahun, $diterima, $all = null)
    {
        $this->tahun = $tahun;
        $this->diterima = $diterima;
        $this->all = $all;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        if ($this->all) {
            return PesertaPPDB::whereYear('created_at', $this->tahun)->get();
        }

        return PesertaPPDB::when($this->diterima == 1, function ($query) {
            // Diterima now usually means Sudah Daftar Ulang in the context of legacy lists
            $query->where('status_daftar_ulang', 'sudah');
        })->when($this->diterima == 2, function ($query) {
            // Selection Accepted but not yet re-registered
            $query->where('status_seleksi', 'lolos')->where('status_daftar_ulang', 'belum');
        })
            ->whereYear('created_at', $this->tahun)->get();
    }

    // heading
    public function headings(): array
    {
        return [
            'No. Pendaftaran',
            'Nama Lengkap',
            'Jenis Kelamin',
            'Tempat Lahir',
            'Tanggal Lahir',
            'NIK',
            'NISN',
            'Agama',
            'Anak Ke',
            'Jumlah Saudara',
            'Status Anak',
            'Alamat Lengkap',
            'Pernah PAUD',
            'Pernah TK',
            'No. PKH/KIP/KKS',
            'Asal Sekolah',
            'NPSN Sekolah',
            'Alamat Sekolah Asal',
            'Tahun Lulus',
            'Nama Ayah',
            'NIK Ayah',
            'Pendidikan Ayah',
            'Pekerjaan Ayah',
            'Nama Ibu',
            'NIK Ibu',
            'Pendidikan Ibu',
            'Pekerjaan Ibu',
            'Penghasilan Ortu',
            'Nomor Telepon Ortu',
            'Nomor Telepon Pribadi',
            'Prestasi',
            'Pengalaman',
            'Cita-cita',
            'Ekstrakurikuler',
            'Terdaftar Pada',
        ];
    }

    // map
    public function map($peserta): array
    {
        return [
            $peserta->no_pendaftaran,
            $peserta->nama_lengkap,
            $peserta->jenis_kelamin == 'l' ? 'Laki-laki' : 'Perempuan',
            $peserta->tempat_lahir,
            $peserta->tanggal_lahir ? $peserta->tanggal_lahir->format('d/m/Y') : '-',
            '\''.$peserta->nik,
            '\''.$peserta->nisn,
            $peserta->agama,
            $peserta->anak_ke,
            $peserta->jumlah_saudara_kandung,
            $peserta->status_anak,
            $peserta->alamat_lengkap,
            $peserta->pernah_paud ? 'Ya' : 'Tidak',
            $peserta->pernah_tk ? 'Ya' : 'Tidak',
            $peserta->no_kip_kks_pkh,
            $peserta->asal_sekolah,
            $peserta->npsn_sekolah_asal,
            $peserta->alamat_sekolah_asal,
            $peserta->tahun_lulus,
            $peserta->nama_ayah,
            '\''.$peserta->nik_ayah,
            $peserta->pendidikan_ayah,
            $peserta->pekerjaan_ayah,
            $peserta->nama_ibu,
            '\''.$peserta->nik_ibu,
            $peserta->pendidikan_ibu,
            $peserta->pekerjaan_ibu,
            $peserta->penghasilan_ortu,
            '\''.$peserta->no_hp,
            '\''.$peserta->no_hp_pribadi,
            $peserta->prestasi_diraih,
            $peserta->pengalaman_berkesan,
            $peserta->cita_cita,
            is_array($peserta->ekstrakurikuler) ? implode(', ', $peserta->ekstrakurikuler) : '',
            $peserta->created_at->format('d/m/Y H:i'),
        ];
    }
}
