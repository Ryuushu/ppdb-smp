<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminItemExtra extends Model
{
    protected $fillable = ['admin_item_id', 'name', 'amount_male', 'amount_female'];

    public function master()
    {
        return $this->belongsTo(AdminItem::class, 'admin_item_id');
    }

    public function peserta()
    {
        return $this->belongsToMany(PesertaPPDB::class, 'peserta_admin_item_extras', 'admin_item_extra_id', 'peserta_ppdb_id');
    }
}
