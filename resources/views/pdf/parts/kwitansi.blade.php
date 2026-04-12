
@php
    $peserta = $kwitansi->pesertaPpdb;
    $tahunAkademik = $peserta->semester ?? (date('Y') . '/' . (date('Y') + 1));
@endphp

<style>
    .kwitansi-container {
        font-family: Arial, sans-serif;
        border: 2px solid #000;
        padding: 10px;
        max-width: 800px;
        margin: 0 auto;
        color: #000;
    }
    .header {
        display: flex;
        align-items: center;
        border-bottom: 2px solid #000;
        padding-bottom: 10px;
        margin-bottom: 10px;
    }
    .logo {
        width: 80px;
        height: 80px;
        margin-right: 20px;
    }
    .title-box {
        flex: 1;
        text-align: center;
    }
    .title-box h1 {
        margin: 0;
        font-size: 18px;
        text-transform: uppercase;
    }
    .title-box h2 {
        margin: 5px 0;
        font-size: 16px;
        text-transform: uppercase;
    }
    .title-box p {
        margin: 0;
        font-size: 14px;
        font-weight: bold;
    }
    .info-table {
        width: 100%;
        margin-bottom: 10px;
    }
    .info-table td {
        padding: 2px 0;
        font-size: 14px;
    }
    .input-line {
        border-bottom: 1px solid #000;
        display: inline-block;
        min-width: 300px;
        padding-left: 5px;
    }
    .amount-box {
        border: 1px solid #000;
        padding: 5px 10px;
        min-width: 250px;
        display: inline-block;
        font-style: italic;
        background-color: #f0f0f0;
    }
    .main-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 15px;
    }
    .main-table th, .main-table td {
        border: 1px solid #000;
        padding: 5px;
        text-align: left;
        font-size: 13px;
    }
    .main-table th {
        background-color: #e0e0e0;
        text-align: center;
    }
    .text-center { text-align: center !important; }
    .text-right { text-align: right !important; }
    .font-bold { font-weight: bold; }
    
    .footer {
        display: flex;
        justify-content: flex-end;
        margin-top: 20px;
    }
    .signature-area {
        text-align: center;
        width: 300px;
    }
    .notes {
        font-size: 12px;
        margin-top: 20px;
    }
    .notes p { margin: 2px 0; }

    @media print {
        .kwitansi-container {
            border: 2px solid #000 !important;
        }
        .main-table th {
            background-color: #e0e0e0 !important;
            -webkit-print-color-adjust: exact;
        }
    }
</style>

<div class="kwitansi-container">
    <div class="header">
        <img src="/img/logo.png" class="logo" alt="Logo">
        <div class="title-box">
            <h1>KWITANSI PEMBAYARAN</h1>
            <h2>ATRIBUT SISWA BARU</h2>
            <h2>MIS NURUL ULUM CINDOGO</h2>
            <p>Tahun Pelajaran {{ $tahunAkademik }}</p>
        </div>
    </div>

    <table class="info-table">
        <tr>
            <td width="20%">Sudah Terima dari</td>
            <td width="2%">:</td>
            <td><span class="input-line">{{ $peserta->nama_lengkap }}</span></td>
        </tr>
        <tr>
            <td>Jumlah Uang</td>
            <td>:</td>
            <td><div class="amount-box">Rp {{ number_format($kwitansi->nominal, 0, ',', '.') }},- / ({{ (new App\Helper\Terbilang)->convert($kwitansi->nominal) }} rupiah)</div></td>
        </tr>
        <tr>
            <td>Untuk Pembayaran/ No</td>
            <td>:</td>
            <td><span class="input-line">{{ $kwitansi->jenis_pembayaran }} / No: {{ $peserta->no_pendaftaran }}</span></td>
        </tr>
    </table>

    <table class="main-table">
        <thead>
            <tr>
                <th rowspan="2" width="40%">Jenis Kelengkapan</th>
                <th colspan="2">Harga Atribut</th>
                <th colspan="2">Keterangan</th>
            </tr>
            <tr>
                <th width="15%">Laki-Laki</th>
                <th width="15%">Perempuan</th>
                <th width="15%">Sudah</th>
                <th width="15%">Belum</th>
            </tr>
        </thead>
        <tbody>
            @php
                $totalL = 0;
                $totalP = 0;
            @endphp
            @foreach($adminItems as $item)
                @php
                    $totalL += $item->amount_male;
                    $totalP += $item->amount_female;
                @endphp
                <tr>
                    <td>{{ $item->name }}</td>
                    <td class="text-right">Rp {{ number_format($item->amount_male, 0, ',', '.') }}</td>
                    <td class="text-right">Rp {{ number_format($item->amount_female, 0, ',', '.') }}</td>
                    <td class="text-center"></td>
                    <td class="text-center"></td>
                </tr>
            @endforeach
            <tr class="font-bold">
                <td rowspan="2" class="text-center">Jumlah Total</td>
                <td class="text-center">Laki-Laki</td>
                <td class="text-right" colspan="3">Rp {{ number_format($totalL, 0, ',', '.') }}</td>
            </tr>
            <tr class="font-bold">
                <td class="text-center">Perempuan</td>
                <td class="text-right" colspan="3">Rp {{ number_format($totalP, 0, ',', '.') }}</td>
            </tr>
        </tbody>
    </table>

    <div class="footer">
        <div class="signature-area">
            <p>Bondowoso, {{ date('d F Y') }}</p>
            <p>Panitia PPDBM MIS Nurul Ulum Cindogo</p>
            <br><br><br>
            <p>__________________________</p>
        </div>
    </div>

    <div class="notes">
        <p class="font-bold">Keterangan :</p>
        <p>- Kwitansi jangan sampai hilang.</p>
        <p>- Sebagai persyaratan pengambilan atribut.</p>
        <p>- Harga seragam M*</p>
        <p>- Ukuran L Tambah 10.000 & Ukuran XL Tambah 20.000</p>
    </div>
</div>
