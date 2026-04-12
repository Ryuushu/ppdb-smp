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
        Schema::create('peserta_documents', function (Blueprint $table) {
            $table->id();
            $table->uuid('peserta_ppdb_id');
            $table->unsignedBigInteger('master_document_id');
            $table->string('file_path');
            $table->timestamps();

            $table->foreign('peserta_ppdb_id')->references('id')->on('peserta_ppdb')->onDelete('cascade');
            $table->foreign('master_document_id')->references('id')->on('master_documents')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('peserta_documents');
    }
};
