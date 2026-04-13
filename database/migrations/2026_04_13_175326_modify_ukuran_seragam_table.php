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
        Schema::table('ukuran_seragam', function (Blueprint $table) {
            $table->dropColumn([
                'baju', 'jas', 'sepatu', 'peci',
                'seragam_praktik', 'baju_batik', 'seragam_olahraga',
                'jas_almamater', 'kaos_bintalsik', 'atribut', 'kegiatan_bintalsik'
            ]);
            $table->foreignId('master_ukuran_seragam_id')->nullable()->constrained('master_ukuran_seragams')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('ukuran_seragam', function (Blueprint $table) {
            $table->dropForeign(['master_ukuran_seragam_id']);
            $table->dropColumn('master_ukuran_seragam_id');
            $table->string('baju', 3)->nullable();
            $table->string('jas', 3)->nullable();
            $table->string('sepatu', 3)->nullable();
            $table->string('peci', 3)->nullable();
            $table->boolean('seragam_praktik')->default(false);
            $table->boolean('baju_batik')->default(false);
            $table->boolean('seragam_olahraga')->default(false);
            $table->boolean('jas_almamater')->default(false);
            $table->boolean('kaos_bintalsik')->default(false);
            $table->boolean('atribut')->default(false);
            $table->boolean('kegiatan_bintalsik')->default(false);
        });
    }
};
