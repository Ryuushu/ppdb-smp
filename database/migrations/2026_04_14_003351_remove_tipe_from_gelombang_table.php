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
        Schema::table('gelombang', function (Blueprint $table) {
            $table->dropColumn('tipe');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('gelombang', function (Blueprint $table) {
            $table->enum('tipe', ['prestasi', 'reguler'])->default('reguler')->after('nama');
        });
    }
};
