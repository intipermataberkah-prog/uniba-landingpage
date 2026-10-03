# RPL di Non-Brand — ad group `Karyawan & RPL`

Disusun 26 September 2026. File CSV ada di [`../google-ads-tier-a/`](../google-ads-tier-a/) (nomor 20–24). Tidak ada campaign baru: semuanya masuk ke ad group `Karyawan & RPL` di `GOOG_Search_NonBrand_PMB_2026`, budget Non-Brand tetap Rp95.000/hari. Mendarat di `https://www.daftaruniba.site/rpl`.

## Kenapa

Periode 19–25 September akun ini **0 klik**. Keyword RPL lama semuanya exact match plus nama kota (`[kuliah rpl surakarta]`, `[program rpl solo]`), dan sebagian berstatus *Not eligible — Low search volume*: frasa sesempit itu hampir tidak pernah dicari.

Paket ini menambahkan **20 keyword phrase match dengan istilah umum** (`kuliah rpl`, `jalur rpl`, `kuliah karyawan`, `kuliah sambil kerja`, `kuliah malam`, ...). Lokalisasi diserahkan ke location targeting Non-Brand (8 wilayah Solo Raya), jadi "solo/surakarta" tidak perlu ada di keyword. Keyword exact lama dibiarkan; phrase baru sudah mencakup query yang sama.

## Isi

| File | Isi |
|---|---|
| `20-keywords-rpl.csv` | 20 keyword phrase |
| `21-negatives-rpl.csv` | 18 negatif **level ad group** |
| `22-rsa-rpl.csv` | 2 RSA baru (15 headline tanpa pin, 4 deskripsi) |
| `23-sitelinks-rpl.csv` | 4 sitelink level ad group |
| `24-callouts-rpl.csv` | 6 callout level ad group |

- **Negatif level ad group, bukan campaign**, supaya tidak ikut memblokir ad group Non-Brand lain. Isinya hanya yang belum ada di negatif campaign Non-Brand: kata "RPL" juga berarti *Rekayasa Perangkat Lunak* (jurusan SMK), jadi `rekayasa perangkat lunak`, `jurusan`, `modul`, `soal`, `pkl`, `ukk`, `coding`, dst. ditahan. Cek Search Terms setiap hari minggu pertama.
- **Headline tanpa pin**: pin di ad lama yang membuat Ad Strength jadi *Poor*.
- **Ad group ini jadi berisi 3 RSA aktif** (1 lama + 2 baru), batas maksimum Google. Jangan tambah RSA lagi tanpa mem-pause satu.
- **Sitelink/callout level ad group menggantikan** yang level campaign untuk ad group ini saja.
- Bid per keyword dikosongkan: Non-Brand sekarang **Target Impression Share** (diterapkan otomatis oleh Google, target 14%, CPC maks Rp12.000), yang mengabaikan bid keyword.

## Klaim harga

Iklan hanya memakai dua klaim harga, keduanya tampil di halaman /rpl:

- **Cukup Rp2.000.000 untuk mulai kuliah**, sisa semester 1 dicicil tanpa bunga (`paymentScheme`).
- **Semester berikutnya dicicil mulai Rp684.000/bulan**: prodi RPL termurah (Agroteknologi, Teknik Industri, Kelas Malam), Rp4.100.000 ÷ 6 bulan. Manajemen/Akuntansi/Hukum ≈ Rp842.000, jadi iklan wajib memakai kata **"mulai"**. Angka di /rpl dihitung otomatis (`cheapestRplMonthly`), tapi angka di iklan ditulis manual: kalau biaya berubah, ganti juga di `22-rsa-rpl.csv` dan `24-callouts-rpl.csv`.
- "Tanpa bunga" hanya untuk sisa semester 1; situs tidak menjanjikannya untuk cicilan semester 2+, jadi iklan tidak menggabungkan keduanya.

Potongan Rp4,3 juta dan tanggal penutupan sengaja tidak dipakai, supaya iklan tidak basi saat periode promo berganti.

## Urutan impor (Google Ads Editor)

**Get recent changes** dulu, lalu:

```
20-keywords-rpl.csv → 21-negatives-rpl.csv → 22-rsa-rpl.csv
→ 23-sitelinks-rpl.csv → 24-callouts-rpl.csv
```

Tidak ada setting campaign yang perlu diubah: lokasi, bahasa, jaringan, dan jadwal Non-Brand sudah benar.

**Jangan impor ulang `01-campaigns.csv` / `02-adgroups.csv`**: CSV itu masih menulis Manual CPC dan akan mengembalikan bid strategy Non-Brand.
