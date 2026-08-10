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
| `07-callouts-and-snippets.csv` | 8 callout × 2 + 2 structured snippet | 18 |

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
7. `07-callouts-and-snippets.csv`

Di setiap langkah, cek panel **"Errors and warnings"** sebelum `Post`. Jangan post kalau ada error merah.

## ⚠️ Yang HARUS di-set manual (tidak ikut terimpor)

CSV Editor tidak membawa setting berikut secara andal. Set di Editor atau UI **sebelum** campaign dinyalakan:

**Per campaign, keduanya:**

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
