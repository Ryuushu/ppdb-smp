<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('peserta_ppdb', function (Blueprint $table) {
            // Drop old columns
            $table->dropColumn(['program_id', 'asal_sekolah', 'tahun_lulus']);

            // New identitas diri columns
            $table->integer('jumlah_saudara_kandung')->nullable()->after('tanggal_lahir');
            $table->integer('anak_ke')->nullable()->after('jumlah_saudara_kandung');
            $table->string('status_anak')->nullable()->after('anak_ke');
            $table->string('agama')->nullable()->after('status_anak');

            $table->boolean('pernah_paud')->default(0)->after('agama');
            $table->boolean('pernah_tk')->default(0)->after('pernah_paud');

            // Documents
            $table->string('pas_foto')->nullable();
            $table->string('scan_ijazah_paud_tk')->nullable();
            $table->string('scan_kk')->nullable();
            $table->string('scan_akta_kelahiran')->nullable();

            // Orang Tua Extra Fields
            $table->string('nik_ayah')->nullable()->after('nama_ayah');
            $table->string('pendidikan_ayah')->nullable()->after('nik_ayah');
            
            $table->string('nik_ibu')->nullable()->after('nama_ibu');
            $table->string('pendidikan_ibu')->nullable()->after('nik_ibu');

            $table->string('penghasilan_ortu')->nullable()->after('no_hp_ibu');

            // Extra Experiences
            $table->text('prestasi_diraih')->nullable();
            $table->text('pengalaman_berkesan')->nullable();
            $table->string('cita_cita')->nullable();
        });

        // Drop the programs table since it's no longer used
        Schema::dropIfExists('programs');
    }

    public function down(): void
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->string('abbreviation', 5)->nullable();
            $table->string('deskripsi')->nullable();
            $table->timestamps();
        });

        Schema::table('peserta_ppdb', function (Blueprint $table) {
            $table->integer('program_id')->nullable();
            $table->string('asal_sekolah')->nullable();
            $table->year('tahun_lulus')->nullable();

            $table->dropColumn([
                'jumlah_saudara_kandung',
                'anak_ke',
                'status_anak',
                'agama',
                'pernah_paud',
                'pernah_tk',
                'pas_foto',
                'scan_ijazah_paud_tk',
                'scan_kk',
                'scan_akta_kelahiran',
                'nik_ayah',
                'pendidikan_ayah',
                'nik_ibu',
                'pendidikan_ibu',
                'penghasilan_ortu',
                'prestasi_diraih',
                'pengalaman_berkesan',
                'cita_cita'
            ]);
        });
    }
};
