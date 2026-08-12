# Google Ads Editor Import — Tier A (Rp3.000.000/bulan)

Paket impor untuk rencana di [`../google-ads-plan.md`](../google-ads-plan.md).
Mata uang: **IDR**. Semua budget/bid ditulis dalam rupiah penuh (bukan sen).

## Isi paket

| File | Entitas | Baris |
|---|---|---|
| `01-campaigns.csv` | 2 campaign | 2 |
| `02-adgroups.csv` | 4 ad group (2 aktif, 2 paused) | 4 |
| `03-keywords.csv` | 31 keyword | 31 |
| `04-negative-keywords.csv` | 65 negatif level campaign | 65 |
| `05-responsive-search-ads.csv` | 4 RSA (15 headline + 4 deskripsi masing-masing) | 4 |
| `06-sitelinks.csv` | 5 sitelink × 2 campaign | 10 |
| `07-callouts.csv` | 8 callout × 2 campaign | 16 |
| `08-structured-snippets.csv` | 2 structured snippet, 9 nilai masing-masing | 2 |

> ⚠️ **Nilai structured snippet tidak bisa diimpor lewat CSV.** Sudah dicoba dua format dan keduanya gagal diam-diam: daftar dipisah titik-koma di satu kolom `Values`, dan satu kolom per nilai (`Value 1` … `Value 9`). Keduanya membuat snippet dengan header benar tapi **nilai kosong**, dan impor melaporkan sukses tanpa error — baru ketahuan dari error "There are too few values for a structured snippet". Isi 9 nilainya **manual** di Editor: pilih kedua baris snippet sekaligus, klik kolom Value 1, ketik lalu Tab antar nilai. File `08-structured-snippets.csv` tetap berguna untuk membuat kerangka snippet-nya.

## Alokasi budget

| Campaign | Bid strategy | Budget/hari | Budget/bulan |
|---|---|---|---|
| `GOOG_Search_Brand_PMB_2026` | Maximize Clicks, CPC limit Rp2.000 | Rp15.000 | Rp450.000 |
| `GOOG_Search_NonBrand_PMB_2026` | **Manual CPC** | Rp85.000 | Rp2.550.000 |
| **Total** | | **Rp100.000** | **Rp3.000.000** |

Tagihan aktual ±**Rp3.330.000** setelah PPN 11%.

> **Kenapa Non-Brand pakai Manual CPC, bukan Maximize Clicks seperti di dokumen rencana?**
> Maximize Clicks mengabaikan max CPC per keyword — hanya CPC limit level campaign yang berlaku. Karena satu campaign Non-Brand menampung ad group dengan plafon berbeda (Karyawan Rp5.000, Kampus Solo Rp3.500, Prodi Rp3.000), Maximize Clicks akan meratakan semuanya. Di budget Rp85.000/hari, kontrol bid per keyword lebih berharga daripada otomatisasi. Brand tetap Maximize Clicks karena kompetisinya rendah dan CPC-nya sudah murah.

## Urutan impor (Google Ads Editor)

Impor **berurutan** — Editor menolak baris yang mereferensikan campaign/ad group yang belum ada.

1. `Account > Import > From file` → `01-campaigns.csv`
2. `02-adgroups.csv`
3. `03-keywords.csv`
4. `04-negative-keywords.csv`
5. `05-responsive-search-ads.csv`
6. `06-sitelinks.csv`
7. `07-callouts.csv`
8. `08-structured-snippets.csv`

Di setiap langkah, cek panel **"Errors and warnings"** sebelum `Post`. Jangan post kalau ada error merah.

## ⚠️ Yang HARUS di-set manual (tidak ikut terimpor)

CSV Editor tidak membawa setting berikut secara andal. Semua item di bawah **sudah dikonfirmasi salah** pada impor pertama tanggal 10 Agustus 2026 — bukan dugaan. Set di Editor atau UI **sebelum** campaign dinyalakan:

**Blocker akun (sekali saja):**

- [ ] **EU political ads** — impor memunculkan error merah "You can't post your campaign until you confirm if your campaign has EU political ads", dan selama belum diisi, **location targeting tidak bisa diedit sama sekali**. Set field `EU political ads` di panel campaign ke *does not contain* untuk kedua campaign. Kerjakan ini **paling awal**, karena memblokir perbaikan lokasi di bawah.

**Per campaign, keduanya:**

- [x] 🔴 **Location targeting** — impor pertama menghasilkan `United States` di campaign Non-Brand (85% budget) dan hanya kota `Surakarta` di Brand. **Sudah diperbaiki 10 Agustus 2026:** keduanya kini menarget 8 wilayah bernama, tanpa radius — Sukoharjo, Surakarta, Sragen, Boyolali, Klaten, Karanganyar, **Ngawi (Jawa Timur)**, Wonogiri. Daftar ini berasal dari data asal mahasiswa S1 2021–2025 (94% intake), lihat tabel di [`../google-ads-plan.md`](../google-ads-plan.md#basis-data-geo--asal-mahasiswa-s1-20212025). Radius sengaja tidak dipakai: 30 km tidak mencapai Wonogiri maupun Ngawi.

- [ ] **Languages** — centang **Indonesian** dan **English**. Sengaja tidak dimasukkan ke CSV: kolom `Languages` di Editor hanya menerima nama bahasa sesuai bahasa tampilan Editor, jadi impor selalu memunculkan warning. Set manual lebih cepat daripada menebak formatnya.
- [ ] **Networks** — centang Google Search saja. **Matikan Search Partners dan Display Network.** Editor sering default-nya menyala; ini kebocoran budget terbesar di paket ketat.
- [ ] **Lokasi** — radius 30 km dari `Jl. KH. Agus Salim No. 10, Sondakan, Laweyan, Surakarta`, tambah kota Sukoharjo, Karanganyar, Boyolali, Klaten, Sragen, Wonogiri.
- [ ] **Location options** — ubah ke **"Presence: People in or regularly in your targeted locations"**. Default Google adalah "Presence or interest" dan itu akan menarik pencari luar kota.
- [ ] **Ad schedule** — 06.00–23.00 setiap hari (matikan 23.00–06.00).
- [ ] **Audience segments — mode Observation** (bukan Targeting): In-market "Tertiary Education", "Post-Secondary Education".
- [ ] **Conversion goals** — pilih hanya `wa_click` dan `form_submit` sebagai Primary. Semua goal lain set ke Secondary, termasuk goal akun default.
- [ ] **Call asset** — (0271) 714751, jadwal Senin–Jumat 08.00–16.00.
- [ ] **Location asset** — hubungkan Google Business Profile UNIBA Surakarta.

**Opsional (setelah stabil):**

- [ ] Ganti Description 4 dengan countdown agar tanggal tidak basi:
  ```
  Promo Gelombang 2 berakhir {=COUNTDOWN("2026/08/30 23:59:00","id",5)}. Kuota terbatas.
  ```
  Uji dulu di preview — panjang teks yang ter-render berubah-ubah dan bisa melewati batas 90 karakter.

## Catatan isi

- **Ad group `Kampus Swasta Solo` dan `Prodi Spesifik` sengaja di-`Paused`**, berikut keyword dan RSA-nya. Nyalakan di Minggu 3 sesuai runbook. Jangan nyalakan lebih awal — di Rp85.000/hari, 4 ad group aktif berarti tidak ada satu pun yang mengumpulkan data cukup.
- **Negatif `batik` hanya ada di campaign Non-Brand.** Campaign Brand justru butuh kata itu (`[universitas islam batik surakarta]`), jadi di sana dipakai negatif spesifik: `batik tulis`, `kursus batik`, `membatik`, `kain`, `motif`, `grosir`, `konveksi`, `seragam`, `butik`.
- **Negatif kota** (`jakarta`, `yogyakarta`, `semarang`, `bandung`, `surabaya`) ada di Non-Brand untuk menahan kampus online nasional yang bidding lintas-geo.
- Semua headline dan deskripsi sudah diverifikasi ≤30 dan ≤90 karakter.
- Angka biaya di iklan bersumber dari `data/unibaData.ts`: SPI Rp4.000.000 yang digratiskan, DP 60% semester 1. **Jangan ubah klaim harga tanpa mengecek file itu.**

## Setelah post

1. Klik iklan sendiri satu kali, lalu klik tombol WhatsApp di LP. Pastikan konversi tercatat di Google Ads dalam 3 jam.
2. Cek **Search Terms Report setiap hari** selama minggu 1. Di budget ini, satu query sampah yang dibiarkan seminggu bisa menghabiskan 10% budget bulanan.
3. Jangan sentuh bid atau budget sampai hari ke-7.
