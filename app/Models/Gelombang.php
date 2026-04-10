<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gelombang extends Model
{
    protected $table = 'gelombang';

    protected $fillable = [
        'nama',
        'tipe',
        'deskripsi',
        'kuota',
        'tanggal_mulai',
        'tanggal_selesai',
        'tanggal_pengumuman',
        'status',
        'tahun_ajaran',
    ];

    protected $casts = [
        'tanggal_mulai' => 'date',
        'tanggal_selesai' => 'date',
        'tanggal_pengumuman' => 'date',
    ];

    public function peserta()
    {
        return $this->hasMany(PesertaPPDB::class, 'gelombang_id');
    }

    public function kriteria()
    {
        return $this->hasMany(KriteriaSPK::class, 'gelombang_id');
    }
}
