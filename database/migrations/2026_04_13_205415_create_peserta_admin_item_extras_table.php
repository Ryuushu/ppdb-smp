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
        Schema::create('peserta_admin_item_extras', function (Blueprint $table) {
            $table->id();
            $table->foreignUuid('peserta_ppdb_id')->constrained('peserta_ppdb')->onDelete('cascade');
            $table->foreignId('admin_item_extra_id')->constrained('admin_item_extras')->onDelete('cascade');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_admin_item_extras');
    }
};
