<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PesertaPPDB extends Model
{
    use HasFactory, SoftDeletes;

    protected $keyType = 'string';

    public $incrementing = false;

    protected $table = 'peserta_ppdb';

    protected $guarded = [];

    protected $casts = [
        'akademik' => 'array',
        'non_akademik' => 'array',
        'ekstrakurikuler' => 'array',
        'tanggal_lahir' => 'date',
        'bertindik' => 'boolean',
        'bertato' => 'boolean',
    ];


    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = \Illuminate\Support\Str::uuid();
            $model->no_urut = $model->getNoUrut();
            $model->semester = now()->year.'/'.now()->addYear()->year;

            $model->no_pendaftaran = 'MTS-'.\Illuminate\Support\Str::padLeft($model->no_urut, 3, 0).'-'.now()->format('m-y');

            $model->attributes['nama_lengkap'] = str($model->attributes['nama_lengkap'])->title();
            $model->attributes['tempat_lahir'] = str($model->attributes['tempat_lahir'])->title();
        });

        static::updating(function ($model) {
            $model->attributes['nama_lengkap'] = str($model->attributes['nama_lengkap'])->title();
            $model->attributes['tempat_lahir'] = str($model->attributes['tempat_lahir'])->title();
        });
    }

    public function getNoUrut()
    {
        return $this->whereYear('created_at', now()->year)
            ->withTrashed()
            ->max('no_urut') + 1;
    }

    public function kwitansi()
    {
        return $this->hasMany(Kwitansi::class, 'peserta_ppdb_id');
    }

    public function ukuranSeragam()
    {
        return $this->hasOne(UkuranSeragam::class, 'peserta_ppdb_id');
    }

    public function gelombang()
    {
        return $this->belongsTo(Gelombang::class, 'gelombang_id');
    }

    public function nilaiSPK()
    {
        return $this->hasMany(NilaiPeserta::class, 'peserta_id');
    }

    public function toWhatsapp($no)
    {
        if (! $no) {
            return $no;
        }

        $no = preg_replace('/^0/', '62', $no);
        $no = preg_replace('/^8/', '628', $no);

        // Menghasilkan URL WhatsApp
        return 'https://wa.me/'.$no;
    }
}
