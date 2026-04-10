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
        Schema::create('nilai_peserta', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('peserta_id')->constrained('peserta_ppdb')->onDelete('cascade');
            $table->foreignId('kriteria_id')->constrained('kriteria_spk')->onDelete('cascade');
            $table->decimal('nilai', 8, 2)->default(0);
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
        Schema::dropIfExists('nilai_peserta');
    }
};
