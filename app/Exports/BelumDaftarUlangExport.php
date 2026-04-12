<?php

namespace App\Exports;

use App\Models\PesertaPPDB;
use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class BelumDaftarUlangExport implements FromCollection, WithHeadings, WithMapping, ShouldAutoSize
{
    protected $tahun;
    protected $jurusan;

    public function __construct($tahun = null, $jurusan = null)
    {
        $this->tahun = $tahun ?? now()->year;
        $this->jurusan = $jurusan;
    }

    /**
     * @return \Illuminate\Support\Collection
     */
    public function collection()
    {
        return PesertaPPDB::query()
            ->doesntHave('kwitansi')
            ->whereYear('created_at', $this->tahun)
            ->get();
    }

    public function headings(): array
    {
        return [
            'No',
            'No Pendaftaran',
            'Nama Lengkap',
            'Status',
            'No HP',
            'Alamat Lengkap',
        ];
    }

    public function map($row): array
    {
        static $index = 0;
        $index++;

        return [
            $index,
            $row->no_pendaftaran,
            $row->nama_lengkap,
            $row->diterima == 1 ? 'Diterima' : ($row->diterima == 2 ? 'Ditolak' : 'Belum Diverifikasi'),
            $row->no_hp,
            $row->alamat_lengkap,
        ];
    }
}
