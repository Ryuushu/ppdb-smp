<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClassRange extends Model
{
    protected $fillable = ['class_name', 'min_score', 'max_score'];
}
