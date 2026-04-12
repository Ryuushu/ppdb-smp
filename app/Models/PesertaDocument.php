<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PesertaDocument extends Model
{
    use HasFactory;

    protected $fillable = [
        'peserta_ppdb_id',
        'master_document_id',
        'file_path'
    ];

    public function masterDocument()
    {
        return $this->belongsTo(MasterDocument::class, 'master_document_id');
    }

    public function peserta()
    {
        return $this->belongsTo(PesertaPPDB::class, 'peserta_ppdb_id');
    }
}
