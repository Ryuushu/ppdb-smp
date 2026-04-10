<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NilaiPeserta extends Model
{
    protected $table = 'nilai_peserta';

    protected $fillable = [
        'peserta_id',
        'kriteria_id',
        'nilai',
    ];

    public function peserta()
    {
        return $this->belongsTo(PesertaPPDB::class, 'peserta_id');
    }

    public function kriteria()
    {
        return $this->belongsTo(KriteriaSPK::class, 'kriteria_id');
    }
}
