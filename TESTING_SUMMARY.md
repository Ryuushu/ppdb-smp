# 📊 Laporan Detail & Review Teknis Pengujian PPDB

Dokumen ini memberikan review mendalam terhadap logika sistem yang diuji dan bagaimana pengujian memastikan keandalan aplikasi.

---

## 🛠️ 1. Infrastruktur Pengujian (SQLite In-Memory)
- **Review**: Penggunaan `:memory:` memastikan setiap kali perintah test dijalankan, database dibuat dari nol dan dihapus saat selesai. Ini menjamin **isolasi data** yang sempurna—tidak ada sisa data dari test sebelumnya yang mengganggu test berikutnya.
- **Kecepatan**: Eksekusi 27 test selesai dalam waktu sekitar **10-12 detik**, jauh lebih cepat dibandingkan database fisik.

---

## 🔍 2. Review Detail Per Fase

### Fase 1: Validasi Pendaftaran & Keamanan
- **Fokus**: Memastikan calon siswa tidak bisa mendaftar dengan data kosong dan admin tidak bisa diakses sembarang orang.
- **Review Teknis**: 
    - Test memvalidasi sistem **Nomor Urut Otomatis**. Jika pendaftar pertama masuk, sistem harus memberikan nomor urut 1, pendaftar kedua nomor 2, dst.
    - Pengujian **Upload Dokumen** memastikan file yang diunggah tercatat di database dengan path yang benar dan relasi yang tepat ke tabel `peserta_ppdb`.
    - Keamanan pada fitur cetak kartu diuji untuk memastikan hanya pengguna dengan role `super_admin` yang bisa merender view PDF/HTML.

### Fase 2: Master Data & Admin CRUD
- **Fokus**: Keandalan panel kontrol admin dalam mengelola konfigurasi sekolah.
- **Review Teknis**:
    - **Auto-Slug Generator**: Kita menguji logika di `MasterDocumentController` yang secara otomatis mengubah "Kartu Keluarga" menjadi "kartu_keluarga". Ini penting agar relasi data antar tabel tidak rusak karena spasi atau karakter aneh.
    - **Bulk Insert Biaya**: Sistem biaya tambahan (extra) diuji kemampuannya dalam memproses input string dengan koma (misal: "S, M, L, XL"). Test memastikan satu baris input admin dikonversi menjadi banyak baris data di database secara presisi.

### Fase 3: SPK & Algoritma Ranking (Inti Sistem)
- **Fokus**: Akurasi perhitungan seleksi siswa.
- **Review Teknis**:
    - **Normalisasi SAW**: Test menyimulasikan 2 peserta dengan nilai berbeda. Sistem diuji untuk mencari nilai tertinggi dari seluruh peserta (`Max Value`), lalu membagi nilai peserta dengan nilai tertinggi tersebut.
    - **Pembobotan**: Test memastikan setiap kriteria Calistung (Baca, Tulis, Hitung) memiliki pengaruh yang adil (1/3 atau 33.3%). 
    - **Ranking ASC/DESC**: Test memverifikasi bahwa meskipun input nilai acak, sistem tetap memberikan `ranking 1` kepada peserta dengan `skor_spk` tertinggi secara otomatis.

### Fase 4: Pemetaan Kelas & Syarat Pembayaran
- **Fokus**: Integrasi antara keuangan dan akademik.
- **Review Teknis**:
    - **Interdependency**: Ini adalah bagian paling kompleks. Test memastikan sistem "menolak" memetakan siswa ke kelas jika mereka belum membayar lunas. Ini mencegah kebocoran data siswa yang belum menyelesaikan administrasi.
    - **Logika Cascading (Pelimpahan)**: Test mengisi kapasitas sebuah kelas hingga penuh (limit 1), lalu memasukkan peserta baru. Sistem diverifikasi berhasil melempar peserta kedua ke kelas berikutnya tanpa terjadi error *overlap*.

---

## 🚀 3. Cara Menjalankan & Membaca Hasil

Jalankan perintah berikut untuk melihat hasil informatif:

```bash
php artisan test --display-failed
```

**Informasi Hasil:**
- `.` atau `PASS`: Fitur berjalan sempurna sesuai spesifikasi.
- `F` atau `FAIL`: Terjadi perubahan kode yang merusak logika (segera periksa baris kode yang ditunjuk).
- `E` atau `ERROR`: Masalah teknis seperti query database yang salah.

---

## 📊 Hasil Verifikasi Terakhir
- **Waktu Eksekusi**: 26 April 2026, 11:49 WIB
- **Status**: PASSED ✅
- **Detail**: OK (27 tests, 77 assertions)

---

## 💡 4. Rekomendasi Masa Depan
1. **Lakukan Test Sebelum Deploy**: Selalu jalankan `php artisan test` sebelum mengunggah perubahan ke server produksi.
2. **Tambah Test untuk Bug Baru**: Jika Anda menemukan bug di masa depan, buatlah satu file test yang mereplikasi bug tersebut sebelum memperbaikinya (Metode TDD).

