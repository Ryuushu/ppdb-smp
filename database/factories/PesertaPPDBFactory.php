<?php

namespace Database\Factories;

use App\Models\PesertaPPDB;
use Illuminate\Database\Eloquent\Factories\Factory;

class PesertaPPDBFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = PesertaPPDB::class;

    /**
     * Define the model's default state.
     *
     * @re
     * turn array
     */
    public function definition()
    {
        $noUrut = (new PesertaPPDB)->getNoUrut();

        return [
            'id' => $this->faker->uuid(),
            'no_urut' => $noUrut,
            'no_pendaftaran' => 'TEST-'.$noUrut.now()->format('m-y'),
            'semester' => now()->year.'/'.now()->addYear()->year,
            'nama_lengkap' => $this->faker->name(),
            'jenis_kelamin' => rand(0, 1) ? 'l' : 'p',
            'tempat_lahir' => $this->faker->city(),
            'tanggal_lahir' => $this->faker->date(),
            'nik' => $this->faker->randomDigit(),
            'nisn' => $this->faker->randomDigit(),
            'asal_sekolah' => $this->faker->word(),
            'tahun_lulus' => $this->faker->year(),
            'alamat_lengkap' => $this->faker->streetAddress(),
            'jumlah_saudara_kandung' => rand(1, 5),
            'anak_ke' => rand(1, 5),
            'status_anak' => 'Anak Kandung',
            'agama' => 'Islam',
            'pernah_paud' => rand(0, 1),
            'pernah_tk' => rand(0, 1),
            'penerima_kip' => rand(0, 1) ? 'y' : 'n',
            'no_kip' => 'TEST12',
            'no_hp' => $this->faker->phoneNumber(),
            'no_hp_pribadi' => $this->faker->phoneNumber(),
            'bertindik' => rand(0, 1),
            'bertato' => rand(0, 1),
            'nama_ayah' => $this->faker->name('male'),
            'nik_ayah' => $this->faker->nik(),
            'pendidikan_ayah' => 'SMA',
            'nama_ibu' => $this->faker->name('female'),
            'nik_ibu' => $this->faker->nik(),
            'pendidikan_ibu' => 'SMA',
            'pekerjaan_ayah' => 'wirausaha',
            'pekerjaan_ibu' => 'wirausaha',
            'no_hp_ayah' => $this->faker->phoneNumber(),
            'no_hp_ibu' => $this->faker->phoneNumber(),
            'penghasilan_ortu' => '1.000.000 - 2.000.000',
            'akademik' => [
                'kelas' => '',
                'semester' => '',
                'peringkat' => '',
                'hafidz' => '',
            ],
            'non_akademik' => [
                'jenis_lomba' => '',
                'juara_ke' => '',
                'juara_tingkat' => '',
            ],
            'rekomendasi_mwc' => rand(0, 1),
            'saran_dari' => $this->faker->name(),
            'cita_cita' => $this->faker->jobTitle(),
        ];
    }
}
