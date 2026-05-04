<style>
    .pdf-body {
        font-family: 'Times New Roman', Times, serif;
        line-height: 1.4;
    }
    .header-table {
        width: 100%;
        border-bottom: 3px solid black;
        padding-bottom: 10px;
    }
    .content-table {
        width: 100%;
        margin-top: 20px;
    }
    .info-table {
        width: 60%;
        margin-top: 15px;
    }
    .peserta-table {
        margin-left: 50px;
        margin-top: 10px;
        margin-bottom: 10px;
    }
    .status-box {
        text-align: center;
        border: 2px solid black;
        padding: 10px;
        margin: 20px 0;
        font-weight: bold;
    }
    .signature-table {
        width: 100%;
        margin-top: 30px;
    }
    .footer-note {
        font-size: 10pt;
        margin-top: 40px;
    }
</style>

<div class="pdf-body">
    <!-- Header -->
    <table class="header-table">
        <tr>
            <td width="15%" align="center">
                <img src="{{ (isset($isPdf) && $isPdf) ? public_path('img/logo-1.png') : asset('img/logo-1.png') }}" style="width: 100px; height: auto;" />
            </td>
            <td width="85%" align="center">
                <strong style="font-size: 18pt;">PANITIA PENERIMAAN PESERTA DIDIK BARU</strong><br>
                <strong style="font-size: 16pt;">LEMBAGA PENDIDIKAN MI NURUL ULUM CINDOGO TAPEN</strong><br>
                <strong style="font-size: 16pt;">MI NURUL ULUM</strong><br>
                <strong style="font-size: 14pt;">TAHUN AJARAN {{ now()->year }}/{{ now()->addYear()->year }}</strong><br>
                <span style="font-size: 10pt;">Krajan Lama, Cindogo, Tapen, Kabupaten Bondowoso, Jawa Timur 68283</span><br>
                <span style="font-size: 10pt;">website: minurululumcindogo.sch.id | e-mail: minurululumcindogo@gmail.com</span>
            </td>
        </tr>
    </table>

    <!-- No, Hal, etc -->
    <table class="info-table" style="font-size: 12pt;">
        <tr>
            <td width="15%">No</td>
            <td width="2%">:</td>
            <td>{{ $setting->body['no_surat'] ?? '-' }}</td>
        </tr>
        <tr>
            <td>Lamp.</td>
            <td>:</td>
            <td>1 lembar</td>
        </tr>
        <tr>
            <td valign="top">Hal</td>
            <td valign="top">:</td>
            <td><strong>Pemberitahuan Pengumuman Hasil Seleksi<br>Penerimaan Peserta Didik Baru</strong></td>
        </tr>
    </table>

    <!-- Destination -->
    <div style="margin-left: 60%; margin-top: 20px; font-size: 12pt;">
        <strong>Kepada:</strong><br>
        <strong>Yth. Orang Tua/Wali Siswa Baru</strong><br>
        <strong>Di:</strong><br>
        <span style="margin-left: 20px;">Tempat</span>
    </div>

    <!-- Salutation -->
    <div style="margin-top: 30px; font-size: 12pt;">
        <strong>Assalamu’alaikum Wr. Wb.</strong>
        <p>
            Teriring puja dan puji syukur kehadirat Allah SWT serta Sholawat salam teruntuk Baginda Rasulullah SAW. Bersama ini kami sampaikan bahwa, putra/putri Bapak/Ibu yang tersebut di bawah ini:
        </p>
    </div>

    <!-- Participant Data -->
    <table class="peserta-table" style="font-size: 12pt;">
        <tr>
            <td width="180">Nama</td>
            <td width="10">:</td>
            <td>{{ $peserta->nama_lengkap }}</td>
        </tr>
        <tr>
            <td>Nomor Pendaftaran</td>
            <td>:</td>
            <td>{{ $peserta->no_pendaftaran }}</td>
        </tr>
        <tr>
            <td>Alamat</td>
            <td>:</td>
            <td>{{ $peserta->alamat_lengkap }}</td>
        </tr>
        <tr>
            <td>Asal Sekolah</td>
            <td>:</td>
            <td>{{ $peserta->asal_sekolah }}</td>
        </tr>
    </table>

    <!-- Result -->
    <div style="font-size: 12pt; margin-top: 15px;">
        Berdasarkan hasil ujian seleksi Penerimaan Peserta Didik Baru MI NURUL ULUM Tahun Pelajaran {{ now()->year }}/{{ now()->addYear()->year }} dinyatakan:
    </div>

    <div class="status-box" style="font-size: 14pt;">
        LULUS / <strike>TIDAK LULUS</strike> dan DITERIMA / <strike>TIDAK</strike><br>
        <small style="font-weight: normal; font-size: 10pt;">Pada Program/Gelombang:</small><br>
        {{ $peserta->gelombang?->nama ?? '-' }}
    </div>

    <!-- Instructions -->
    <div style="font-size: 11pt; text-align: justify;">
        Sehubungan dengan terbatasnya kelas yang ada, maka Bapak/Ibu/Saudara dapat segera melaksanakan 
        <strong>registrasi daftar ulang setelah dinyatakan diterima.</strong><br><br>
        <strong>Apabila sebelum batas akhir yang telah ditentukan 
        ({{ isset($setting->body['batas_akhir_ppdb']) ? $carbon->parse($setting->body['batas_akhir_ppdb'])->translatedFormat('d F Y') : '-' }})</strong>, 
        kuota kelas/rombel yang tersedia telah terpenuhi, maka dengan berat hati kami sampaikan Putra/Putri Bapak/Ibu <strong>tidak dapat diterima</strong> di kelas tersebut.<br><br>
        Biaya registrasi yang telah dibayarkan <strong>tidak dapat diambil kembali</strong> apabila Putra/Putri Bapak/Ibu diterima di MI lain dengan syarat dan ketentuan yang telah ditetapkan sekolah.
        Demikian surat pemberitahuan ini disampaikan. Atas perhatian dan kerjasamanya kami sampaikan terima kasih.
    </div>

    <div style="margin-top: 15px; font-size: 12pt;">
        <strong>Wassalamu’alaikum Wr. Wb.</strong>
    </div>

    <!-- Signature -->
    <table class="signature-table">
        <tr>
            <td width="60%"></td>
            <td width="40%" align="center" style="font-size: 12pt;">
                BONDOWOSO, {{ now()->translatedFormat('d F Y') }}<br><br><br><br><br>
                ( {{ auth()->user()?->name ?? 'Admin' }} )
            </td>
        </tr>
    </table>

    <!-- Footer Note -->
    <div class="footer-note">
        <strong>Nb:* Hari {{ isset($setting->body['batas_akhir_ppdb']) ? $carbon->parse($setting->body['batas_akhir_ppdb'])->subDay()->translatedFormat('l, d F Y') : '-' }}</strong> 
        Pukul 07.00, Siswa berangkat memakai seragam sekolah asal untuk <strong>persiapan/pembekalan kegiatan awal sekolah.</strong>
    </div>
</div>
