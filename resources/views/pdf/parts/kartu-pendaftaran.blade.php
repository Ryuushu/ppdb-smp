<!-- header -->
<div class="header-container" style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; position: relative;">
    <img src="/img/logo.png" style="position: absolute; left: 0; top: 0; width: 60px; height: 60px; object-fit: contain;" />
    <div style="margin-left: 70px;">
        <strong style="font-size: 16px; display: block; text-transform: uppercase;">YAYASAN NURUL ULUM</strong>
        <strong style="font-size: 18px; display: block; text-transform: uppercase;">MADRASAH TSANAWIYAH NURUL ULUM</strong>
        <span style="font-size: 10px; display: block;">CINDOGO TAPEN BONDOWOSO 68283</span>
    </div>
</div>

<div style="text-align: center; margin-bottom: 15px;">
    <strong style="font-size: 16px; text-decoration: underline; text-transform: uppercase;">KARTU PENDAFTARAN PPDBM 2026</strong>
</div>

<div class="card-content" style="font-size: 14px; line-height: 1.6; border: 2px solid #000; padding: 15px; border-radius: 10px; background-color: #f9f9f9;">
    <table style="width: 100%; border-collapse: collapse;">
        <tr>
            <td width="30%">No. Pendaftaran</td>
            <td width="5%">:</td>
            <td><strong style="font-size: 18px; color: #d32f2f;">{{ $peserta->no_pendaftaran }}</strong></td>
            <td rowspan="5" width="25%" style="text-align: center; vertical-align: middle;">
                <div style="border: 1px solid #000; width: 100px; height: 120px; line-height: 120px; font-size: 12px; background: #fff;">Foto 3x4</div>
            </td>
        </tr>
        <tr>
            <td>Nama Lengkap</td>
            <td>:</td>
            <td><strong>{{ $peserta->nama_lengkap }}</strong></td>
        </tr>
        <tr>
            <td>NISN</td>
            <td>:</td>
            <td>{{ $peserta->nisn ?? '-' }}</td>
        </tr>
        <tr>
            <td>Asal Sekolah</td>
            <td>:</td>
            <td>{{ $peserta->asal_sekolah ?? '-' }}</td>
        </tr>
        <tr>
            <td>Tempat, Tgl Lahir</td>
            <td>:</td>
            <td>{{ $peserta->tempat_lahir }}, {{ $peserta->tanggal_lahir->format('d-m-Y') }}</td>
        </tr>
    </table>
</div>

<div style="margin-top: 20px; font-size: 12px;">
    <strong>Catatan:</strong>
    <ul style="margin-top: 5px; padding-left: 20px;">
        <li>Bawa kartu ini saat melakukan verifikasi berkas di Madrasah.</li>
        <li>Pastikan seluruh dokumen persyaratan (KK, Akta, Ijazah/SKL) sudah lengkap.</li>
        <li>Informasi pengumuman akan disampaikan melalui No. WA yang terdaftar.</li>
    </ul>
</div>

<div style="margin-top: 20px;">
    <div style="float: right; width: 40%; text-align: center; font-size: 13px;">
        Bondowoso, {{ $peserta->created_at->format('d F Y') }}<br>
        Panitia PPDBM,<br><br><br><br>
        ( ........................................ )
    </div>
    <div style="clear: both;"></div>
</div>
