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
        $masterDocs = \App\Models\MasterDocument::all()->pluck('id', 'slug')->toArray();
        $pesertas = \App\Models\PesertaPPDB::all();

        foreach ($pesertas as $peserta) {
            $cols = ['pas_foto', 'scan_ijazah_paud_tk', 'scan_kk', 'scan_akta_kelahiran'];
            foreach ($cols as $col) {
                if ($peserta->$col && isset($masterDocs[$col])) {
                    \App\Models\PesertaDocument::updateOrCreate(
                        [
                            'peserta_ppdb_id' => $peserta->id,
                            'master_document_id' => $masterDocs[$col],
                        ],
                        [
                            'file_path' => $peserta->$col
                        ]
                    );
                }
            }
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        //
    }
};
