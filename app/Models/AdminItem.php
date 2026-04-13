<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminItem extends Model
{
    protected $fillable = ['name', 'amount_male', 'amount_female', 'description'];

    public function extras()
    {
        return $this->hasMany(AdminItemExtra::class, 'admin_item_id');
    }
}
