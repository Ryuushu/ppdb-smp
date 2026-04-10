<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::rename('jurusan', 'programs');

        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->renameColumn('jurusan_id', 'program_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->renameColumn('program_id', 'jurusan_id');
        });

        Schema::rename('programs', 'jurusan');
    }
};
