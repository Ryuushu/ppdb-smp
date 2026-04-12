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
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->string('no_kip_kks_pkh')->nullable()->after('no_kip');
            $table->string('asal_sekolah')->nullable()->after('pernah_tk');
            $table->string('npsn_sekolah_asal')->nullable()->after('asal_sekolah');
            $table->string('alamat_sekolah_asal')->nullable()->after('npsn_sekolah_asal');
            $table->string('tahun_lulus')->nullable()->after('alamat_sekolah_asal');
            $table->string('no_hp_pribadi')->nullable()->after('cita_cita');
            $table->json('ekstrakurikuler')->nullable()->after('no_hp_pribadi');
        });
    }

    public function down(): void
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->dropColumn([
                'no_kip_kks_pkh',
                'asal_sekolah',
                'npsn_sekolah_asal',
                'alamat_sekolah_asal',
                'tahun_lulus',
                'no_hp_pribadi',
                'ekstrakurikuler'
            ]);
        });
    }
};
