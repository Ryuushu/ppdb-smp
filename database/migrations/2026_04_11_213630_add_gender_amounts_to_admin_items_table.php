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
        Schema::table('admin_items', function (Blueprint $table) {
            $table->decimal('amount_male', 15, 2)->after('name')->default(0);
            $table->decimal('amount_female', 15, 2)->after('amount_male')->default(0);
            $table->dropColumn('amount');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('admin_items', function (Blueprint $table) {
            $table->decimal('amount', 15, 2)->after('name')->default(0);
            $table->dropColumn(['amount_male', 'amount_female']);
        });
    }
};
