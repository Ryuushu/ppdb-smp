<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AdminItem extends Model
{
    protected $fillable = ['name', 'amount_male', 'amount_female', 'description'];
}
