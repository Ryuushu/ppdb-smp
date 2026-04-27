<style>
    .checkbox-box {
        border: 1px solid #000;
        width: 14px;
        height: 14px;
        display: inline-block;
        text-align: center;
        line-height: 14px;
        font-family: DejaVu Sans, sans-serif; /* Supports V checkmark well */
        font-size: 11px;
        vertical-align: middle;
        margin-right: 5px;
    }
</style>

<!-- header -->
<div class="header-container" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; position: relative;">
    <img src="/img/logo-1.png" style="position: absolute; left: 0; top: 0; width: 80px; height: 80px; object-fit: contain;" />
    <div style="margin-left: 90px;">
        <strong style="font-size: 22px; display: block; text-transform: uppercase;">YAYASAN NURUL ULUM</strong>
        <strong style="font-size: 24px; display: block; text-transform: uppercase;">MADRASAH IBTIDAIYAH NURUL ULUM</strong>
        <strong style="font-size: 18px; display: block; text-transform: uppercase;">CINDOGO TAPEN BONDOWOSO</strong>
        <span style="font-size: 12px; display: block;">Jl. KHR As'ad Syamsul Arifin, Krajan baru, Rt 010 / Rw 004, Cindogo Tapen Bondowoso 68283</span>
    </div>
</div>

<div class="form-title-container" style="position: relative; margin-bottom: 20px;">
    <strong style="font-size: 18px; text-decoration: underline;">FORMULIR PPDBM 2026</strong>
    <div style="position: absolute; right: 0; top: -10px; border: 1px solid #000; padding: 5px 15px; font-family: monospace;">
        NIS : {{ $peserta->no_urut ?? '....................' }}
    </div>
</div>

<div class="form-content" style="font-size: 13px; line-height: 1.6;">
    <!-- I. IDENTITAS CALON PESERTA DIDIK -->
    <strong style="display: block; margin-top: 10px;">I. &nbsp; IDENTITAS CALON PESERTA DIDIK</strong>
    <table style="width: 100%; margin-left: 15px; border-collapse: collapse;">
        <tr><td width="3%">1.</td><td width="35%">Nama Lengkap</td><td width="2%">:</td><td>{{ $peserta->nama_lengkap }}</td></tr>
        <tr><td>2.</td><td>NISN</td><td>:</td><td>{{ $peserta->nisn ?? '........................................' }}</td></tr>
        <tr><td>3.</td><td>NIK</td><td>:</td><td>{{ $peserta->nik }}</td></tr>
        <tr><td>4.</td><td>Tempat Lahir</td><td>:</td><td>{{ $peserta->tempat_lahir }}</td></tr>
        <tr><td>5.</td><td>Tanggal Lahir</td><td>:</td><td>{{ $peserta->tanggal_lahir->format('d-m-Y') }}</td></tr>
        <tr>
            <td>6.</td><td>Jenis Kelamin</td><td>:</td>
            <td>
                <span class="checkbox-box">{!! $peserta->jenis_kelamin == 'l' ? 'V' : '&nbsp;&nbsp;' !!}</span> Laki-laki
                <span class="checkbox-box" style="margin-left: 15px;">{!! $peserta->jenis_kelamin == 'p' ? 'V' : '&nbsp;&nbsp;' !!}</span> Perempuan
            </td>
        </tr>
        <tr><td>7.</td><td>Agama</td><td>:</td><td>{{ $peserta->agama ?? 'ISLAM' }}</td></tr>
        <tr><td>8.</td><td>Anak Ke</td><td>:</td><td>{{ $peserta->anak_ke }}</td></tr>
        <tr><td>9.</td><td>Jumlah Saudara Kandung</td><td>:</td><td>{{ $peserta->jumlah_saudara_kandung }}</td></tr>
        <tr>
            <td>10.</td><td>Status Dalam Keluarga</td><td>:</td>
            <td>
                <span class="checkbox-box">{!! $peserta->status_anak == 'Kandung' ? 'V' : '&nbsp;&nbsp;' !!}</span> Anak Kandung
                <span class="checkbox-box" style="margin-left: 15px;">{!! $peserta->status_anak == 'Angkat' ? 'V' : '&nbsp;&nbsp;' !!}</span> Anak Angkat
            </td>
        </tr>
        <tr><td>11.</td><td>Alamat Lengkap</td><td>:</td><td>{{ $peserta->alamat_lengkap }}</td></tr>
        <tr>
            <td>12.</td><td>Pernah Mengikuti PAUD</td><td>:</td>
            <td>
                <span class="checkbox-box">{!! $peserta->pernah_paud ? 'V' : '&nbsp;&nbsp;' !!}</span> Iya
                <span class="checkbox-box" style="margin-left: 15px;">{!! !$peserta->pernah_paud ? 'V' : '&nbsp;&nbsp;' !!}</span> Tidak
            </td>
        </tr>
        <tr>
            <td>13.</td><td>Pernah Mengikuti TK/RA</td><td>:</td>
            <td>
                <span class="checkbox-box">{!! $peserta->pernah_tk ? 'V' : '&nbsp;&nbsp;' !!}</span> Iya
                <span class="checkbox-box" style="margin-left: 15px;">{!! !$peserta->pernah_tk ? 'V' : '&nbsp;&nbsp;' !!}</span> Tidak
            </td>
        </tr>

    </table>

    <!-- II. IDENTITAS SEKOLAH SEBELUMNYA -->
    <strong style="display: block; margin-top: 15px;">II. &nbsp; IDENTITAS SEKOLAH SEBELUMNYA</strong>
    <table style="width: 100%; margin-left: 15px; border-collapse: collapse;">
        <tr><td width="3%">15.</td><td width="35%">Asal Sekolah, NPSN</td><td width="2%">:</td><td>{{ $peserta->asal_sekolah ?? '....................' }}, {{ $peserta->npsn_sekolah_asal ?? '..........' }}</td></tr>
        <tr><td>16.</td><td>Alamat Sekolah Sebelumnya</td><td>:</td><td>{{ $peserta->alamat_sekolah_asal ?? '........................................' }}</td></tr>
        <tr><td>17.</td><td>Tahun Lulus</td><td>:</td><td>{{ $peserta->tahun_lulus ?? '....................' }}</td></tr>
    </table>

    <!-- III. IDENTITAS ORANG TUA/WALI -->
    <strong style="display: block; margin-top: 15px;">III. &nbsp; IDENTITAS ORANG TUA/WALI</strong>
    <table style="width: 100%; margin-left: 15px; border-collapse: collapse;">
        <tr><td width="3%">18.</td><td width="35%">Nama Ayah</td><td width="2%">:</td><td>{{ $peserta->nama_ayah }}</td></tr>
        <tr><td>19.</td><td>NIK Ayah</td><td>:</td><td>{{ $peserta->nik_ayah ?? '........................................' }}</td></tr>
        <tr><td>20.</td><td>Pendidikan Ayah</td><td>:</td><td>{{ $peserta->pendidikan_ayah ?? '........................................' }}</td></tr>
        <tr>
            <td valign="top">21.</td><td valign="top">Pekerjaan Ayah</td><td valign="top">:</td>
            <td>
                @php
                    $jobs = ['PNS', 'Pegawai BUMN', 'TNI/POLRI', 'Pegawai Swasta/Wiraswasta', 'Pedagang', 'Petani', 'Buruh Tani'];
                    $isOther = $peserta->pekerjaan_ayah && !in_array($peserta->pekerjaan_ayah, $jobs);
                @endphp
                @foreach($jobs as $job)
                    <div style="display: inline-block; width: 45%; margin-bottom: 2px;">
                        <span class="checkbox-box">{!! strtolower($peserta->pekerjaan_ayah) == strtolower($job) || ($job == 'Pegawai Swasta/Wiraswasta' && str_contains(strtolower($peserta->pekerjaan_ayah ?? ''), 'wira')) ? 'V' : '&nbsp;&nbsp;' !!}</span> {{ $job }}
                    </div>
                @endforeach
                <div style="display: inline-block; width: 45%; margin-bottom: 2px;">
                    <span class="checkbox-box">{!! $isOther || $peserta->pekerjaan_ayah == 'Lainnya' ? 'V' : '&nbsp;&nbsp;' !!}</span> Lainnya {{ $isOther ? '('.$peserta->pekerjaan_ayah.')' : '' }}
                </div>
            </td>
        </tr>
        <tr><td>22.</td><td>Nama Ibu</td><td>:</td><td>{{ $peserta->nama_ibu }}</td></tr>
        <tr><td>23.</td><td>NIK Ibu</td><td>:</td><td>{{ $peserta->nik_ibu ?? '........................................' }}</td></tr>
        <tr><td>24.</td><td>Pendidikan Ibu</td><td>:</td><td>{{ $peserta->pendidikan_ibu ?? '........................................' }}</td></tr>
        <tr>
            <td valign="top">25.</td><td valign="top">Pekerjaan Ibu</td><td valign="top">:</td>
            <td>
                @php
                    $isOtherIbu = $peserta->pekerjaan_ibu && !in_array($peserta->pekerjaan_ibu, $jobs);
                @endphp
                @foreach($jobs as $job)
                    <div style="display: inline-block; width: 45%; margin-bottom: 2px;">
                        <span class="checkbox-box">{!! strtolower($peserta->pekerjaan_ibu) == strtolower($job) || ($job == 'Pegawai Swasta/Wiraswasta' && str_contains(strtolower($peserta->pekerjaan_ibu ?? ''), 'wira')) ? 'V' : '&nbsp;&nbsp;' !!}</span> {{ $job }}
                    </div>
                @endforeach
                <div style="display: inline-block; width: 45%; margin-bottom: 2px;">
                    <span class="checkbox-box">{!! $isOtherIbu || $peserta->pekerjaan_ibu == 'Lainnya' ? 'V' : '&nbsp;&nbsp;' !!}</span> Lainnya {{ $isOtherIbu ? '('.$peserta->pekerjaan_ibu.')' : '' }}
                </div>
            </td>
        </tr>
        <tr>
            <td valign="top">26.</td><td valign="top">Penghasilan Orang Tua</td><td valign="top">:</td>
            <td>
                <div style="margin-bottom: 2px;"><span class="checkbox-box">{!! in_array($peserta->penghasilan_ortu, ['C', '> 5 Juta']) ? 'V' : '&nbsp;&nbsp;' !!}</span> Lebih dari 3 Juta rupiah</div>
                <div style="margin-bottom: 2px;"><span class="checkbox-box">{!! in_array($peserta->penghasilan_ortu, ['B', '3 Juta - 5 Juta']) ? 'V' : '&nbsp;&nbsp;' !!}</span> Rp. 1.500.000 s/d Rp. 3.000.000</div>
                <div style="margin-bottom: 2px;"><span class="checkbox-box">{!! in_array($peserta->penghasilan_ortu, ['A', '1 Juta - 3 Juta']) ? 'V' : '&nbsp;&nbsp;' !!}</span> Rp. 500.000 s/d Rp. 1.500.000</div>
                <div style="margin-bottom: 2px;"><span class="checkbox-box">{!! in_array($peserta->penghasilan_ortu, ['K', '< 1 Juta']) ? 'V' : '&nbsp;&nbsp;' !!}</span> Rp. 0 s/d Rp. 500.000</div>
            </td>
        </tr>
        <tr><td>27.</td><td>No. Telepon HP/WA Orang Tua</td><td>:</td><td>{{ $peserta->no_hp }}</td></tr>
    </table>

    <!-- IV. BAKAT DAN MINAT -->
    <strong style="display: block; margin-top: 15px;">IV. &nbsp; BAKAT DAN MINAT</strong>
    <table style="width: 100%; margin-left: 15px; border-collapse: collapse;">
        <tr><td width="3%">28.</td><td width="35%">Prestasi yang pernah diraih</td><td width="2%">:</td><td>{{ $peserta->prestasi_diraih ?? '........................................' }}</td></tr>
        <tr><td>29.</td><td>Pengalaman berkesan selama ini</td><td>:</td><td>{{ $peserta->pengalaman_berkesan ?? '........................................' }}</td></tr>
        <tr><td>30.</td><td>Cita-cita</td><td>:</td><td>{{ $peserta->cita_cita ?? '........................................' }}</td></tr>
        <tr><td>31.</td><td>Nomor HP/WA Pribadi</td><td>:</td><td>{{ $peserta->no_hp_pribadi ?? '........................................' }}</td></tr>
        <tr>
            <td valign="top">32.</td><td valign="top">Ekstra Kurikuler yang ingin di Ikuti</td><td valign="top">:</td>
            <td>
                @php $selectedExtras = $peserta->ekstrakurikuler ?? []; @endphp
                @foreach(['Pramuka, PBB' => 'Pramuka, PBB', 'Kaligrafi' => 'Kaligrafi', 'Tilawah' => 'Tilawah', 'Seni Hadrah' => 'Seni Hadrah'] as $val => $label)
                    <div style="display: inline-block; width: 45%; margin-bottom: 2px;">
                        <span class="checkbox-box">{!! in_array($val, $selectedExtras) || ($val == 'Pramuka, PBB' && (is_array($selectedExtras) && (in_array('Pramuka', $selectedExtras) || in_array('PBB', $selectedExtras)))) ? 'V' : '&nbsp;&nbsp;' !!}</span> {{ $label }}
                    </div>
                @endforeach
            </td>
        </tr>
    </table>
</div>

<div style="margin-top: 30px; border-top: 1px dashed #000; padding-top: 10px;">
    <div style="float: left; width: 33%; text-align: center;">
        <br>Panitia Penerimaan,<br><br><br><br>
        ( ........................................ )
    </div>
    <div style="float: left; width: 33%; text-align: center;">
        <div style="border: 1px solid #000; width: 80px; height: 100px; margin: 0 auto; line-height: 100px; font-size: 10px;">Foto 3x4</div>
    </div>
    <div style="float: left; width: 34%; text-align: center;">
        Bondowoso, {{ $peserta->created_at->format('d F Y') }}<br>
        Calon Peserta Didik,<br><br><br><br>
        ( {{ $peserta->nama_lengkap }} )
    </div>
    <div style="clear: both;"></div>
</div>
