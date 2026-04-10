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
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->foreignId('gelombang_id')->nullable()->constrained('gelombang')->onDelete('set null');
            $table->decimal('skor_spk', 8, 4)->nullable();
            $table->integer('ranking')->nullable();
            $table->enum('status_seleksi', ['pending', 'lolos', 'tidak_lolos', 'cadangan'])->default('pending');
            $table->enum('status_daftar_ulang', ['belum', 'sudah'])->default('belum');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->dropForeign(['gelombang_id']);
            $table->dropColumn(['gelombang_id', 'skor_spk', 'ranking', 'status_seleksi', 'status_daftar_ulang']);
        });
    }
};
