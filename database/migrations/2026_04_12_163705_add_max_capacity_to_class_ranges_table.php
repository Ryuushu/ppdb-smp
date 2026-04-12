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
        Schema::table('class_ranges', function (Blueprint $table) {
            $table->integer('max_capacity')->nullable()->default(30);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('class_ranges', function (Blueprint $table) {
            $table->dropColumn('max_capacity');
        });
    }
};
