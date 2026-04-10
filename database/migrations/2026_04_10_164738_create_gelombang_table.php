<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('gelombang', function (Blueprint $table) {
            $table->id();
            $table->string('nama'); // "Gelombang Prestasi" / "Gelombang Reguler"
            $table->enum('tipe', ['prestasi', 'reguler'])->default('reguler');
            $table->text('deskripsi')->nullable();
            $table->integer('kuota')->default(0);
            $table->date('tanggal_mulai');
            $table->date('tanggal_selesai');
            $table->date('tanggal_pengumuman')->nullable();
            $table->enum('status', ['draft', 'buka', 'tutup', 'pengumuman', 'daftar_ulang', 'selesai'])->default('draft');
            $table->string('tahun_ajaran'); // e.g. "2026/2027"
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('gelombang');
    }
};
