<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Program extends Model
{
    use HasFactory, SoftDeletes;

    protected $table = 'programs';

    protected $guarded = [];

    // public $timestamps = false;

    public function pesertaPpdb()
    {
        return $this->hasMany(PesertaPPDB::class, 'program_id');
    }
}
