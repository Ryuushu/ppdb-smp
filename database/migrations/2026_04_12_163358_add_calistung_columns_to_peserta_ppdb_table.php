<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->decimal('nilai_baca', 8, 2)->nullable();
            $table->decimal('nilai_tulis', 8, 2)->nullable();
            $table->decimal('nilai_hitung', 8, 2)->nullable();
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
            $table->dropColumn(['nilai_baca', 'nilai_tulis', 'nilai_hitung']);
        });
    }
};
