<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class KriteriaSPK extends Model
{
    protected $table = 'kriteria_spk';

    protected $fillable = [
        'gelombang_id',
        'nama',
        'bobot',
        'tipe',
    ];

    public function gelombang()
    {
        return $this->belongsTo(Gelombang::class, 'gelombang_id');
    }

    public function nilaiPeserta()
    {
        return $this->hasMany(NilaiPeserta::class, 'kriteria_id');
    }
}
