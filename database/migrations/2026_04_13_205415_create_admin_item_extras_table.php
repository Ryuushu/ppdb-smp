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
        Schema::create('admin_item_extras', function (Blueprint $table) {
            $table->id();
            $table->foreignId('admin_item_id')->constrained('admin_items')->onDelete('cascade');
            $table->string('name');
            $table->decimal('amount_male', 10, 2)->default(0);
            $table->decimal('amount_female', 10, 2)->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin_item_extras');
    }
};
