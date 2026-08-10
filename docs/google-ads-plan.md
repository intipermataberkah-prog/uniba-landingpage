# Google Ads Plan — UNIBA Surakarta PMB 2026/2027

**Landing pages:** `https://daftaruniba.site/` (utama) · `https://daftaruniba.site/rpl` (RPL / kelas karyawan)
**Disusun:** 10 Agustus 2026 · **Konteks:** Promo Kemerdekaan Gelombang 2 berakhir **30 Agustus 2026** (20 hari lagi)
**Constraint:** budget ketat → **Search-only**, satu geo, tanpa PMax/Display/Demand Gen.

Semua klaim harga/prodi/beasiswa di dokumen ini diambil dari `data/unibaData.ts` (bersumber dari dokumen resmi "Rincian Biaya Promo Kemerdekaan 2026"). Angka CPC/CVR di bagian proyeksi adalah **asumsi perencanaan**, bukan data terukur — ganti dengan angka Keyword Planner + data 14 hari pertama.

---

## 1. Keputusan strategis (ringkas)

| Keputusan | Pilihan | Alasan |
|---|---|---|
| Platform | **Google Search saja** | Budget ketat harus dibelanjakan pada intent tertinggi. Display/PMax akan menghabiskan budget pada traffic murah tanpa niat daftar. |
| Jumlah campaign | **2** (Brand + Non-Brand) | Lebih dari 2 memecah budget dan menahan setiap campaign di learning phase selamanya. |
| Bid strategy awal | **Brand: Maximize Clicks + CPC cap · Non-Brand: Manual CPC** | Belum ada 30+ konversi/bulan, jadi smart bidding = CPC liar. Non-Brand pakai Manual CPC karena Maximize Clicks mengabaikan max CPC per keyword, padahal tiap ad group punya plafon berbeda. Pindah ke Maximize Conversions setelah ~30 konversi terkumpul. |
| Konversi utama | **Klik WhatsApp** + submit formulir | Satu-satunya sinyal yang bisa diukur di LP saat ini. |
| Geo | **Solo Raya, "Presence" only** | Mencegah budget bocor ke pencari luar kota yang hanya riset. |
| Hero offer di iklan | **Gratis uang gedung Rp4 juta + bayar 60% dulu** | Diferensiator finansial paling tajam vs kampus swasta Solo lain. |

**Yang TIDAK dilakukan dulu:** Performance Max, Display, YouTube, Demand Gen, Discovery, dan competitor conquesting. Semua itu masuk akal di atas ~Rp15 jt/bulan, bukan sekarang.

---

## 2. Prasyarat sebelum launch (blocking)

Jangan nyalakan campaign sebelum 6 hal ini beres. Melanggar ini adalah cara tercepat membakar budget ketat.

1. **Google Ads conversion tag via GTM** terpasang di `daftaruniba.site` — bukan hanya GA4. Impor GA4 key event punya delay 24–48 jam yang merusak bidding.
2. **Event `wa_click`** — listener pada semua tombol/link `wa.me`, di-deduplikasi 1x per sesi (LP punya banyak CTA WA; tanpa dedup, angka konversi menggelembung 3–4x dan bidding jadi salah).
3. **Event `form_submit`** dan **`simulasi_biaya_selesai`** (secondary, untuk audience remarketing).
4. **UTM konsisten** — pakai auto-tagging (`gclid`) + template: `?utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_term={keyword}&utm_content={creative}`.
5. **Nomor WA admisi (0895-6219-80090) diverifikasi punya orang yang standby** 08.00–21.00. CPL bagus tanpa respons cepat = nol pendaftar.
6. **Verifikasi advertiser Google.** Ini risiko nyata: domain iklan (`daftaruniba.site`) ≠ domain resmi institusi (`uniba.ac.id`). Google bisa menandai ini sebagai *misrepresentation* untuk brand institusi pendidikan. Mitigasi: (a) tampilkan logo + badan hukum UNIBA/YPB dan alamat kampus di footer LP, (b) siapkan surat kuasa dari universitas saat verifikasi identitas advertiser, (c) idealnya pindahkan LP ke subdomain resmi (`pmb2.uniba.ac.id`) — ini juga menaikkan trust brand searcher.

**Catatan billing:** Google Ads Indonesia menagih **PPN 11%** di atas belanja. Budget Rp5 jt = tagihan ±Rp5,55 jt. Anggarkan dari awal.

---

## 3. Struktur akun

```
UNIBA Surakarta PMB
├── GOOG_Search_Brand_PMB_2026 ................... 15% budget
│   └── AG: Brand Exact
├── GOOG_Search_NonBrand_PMB_2026 ................ 85% budget
│   ├── AG: Karyawan & RPL      → /rpl
│   ├── AG: Kampus Swasta Solo  → /
│   └── AG: Prodi Spesifik      → /   (aktifkan Minggu 3)
```

Naming: `[Platform]_[Type]_[Theme]_[Year]`.

### Setting campaign (keduanya)

| Setting | Nilai |
|---|---|
| Networks | Search only — **matikan Search Partners & Display Expansion** |
| Lokasi | Radius 30 km dari Jl. KH. Agus Salim No.10, Laweyan + kota Sukoharjo, Karanganyar, Boyolali, Klaten, Sragen, Wonogiri |
| Location option | **Presence: people in your targeted locations** (bukan "presence or interest") |
| Bahasa | Indonesia + English |
| Ad rotation | Optimize |
| Ad schedule | 06.00–23.00 setiap hari (matikan 23.00–06.00) |
| Audience | **Observation only**: In-market "Tertiary Education", "Post-Secondary Education"; Detailed Demographics "Education: High School" |
| Device | Tanpa bid adjustment dulu — Indonesia mobile-dominan, biarkan data bicara |

---

## 4. Keyword

### AG: Brand Exact → `/`
Match type: exact + phrase. Max CPC cap: **Rp2.000**.

```
[uniba surakarta]  [universitas islam batik surakarta]  [uniba solo]
[pmb uniba]  [pendaftaran uniba surakarta]  [daftar uniba surakarta]
"biaya kuliah uniba surakarta"  "uniba surakarta pendaftaran"
```

⚠️ **Negatif wajib di AG ini** — "UNIBA" ambigu dan "Batik" sangat ambigu:
```
-balikpapan  -madura  -jambi  -bandar lampung
-batik tulis  -kursus batik  -pelatihan batik  -grosir  -kain  -motif  -toko
-lowongan  -karir  -siakad  -elearning  -jurnal  -repository  -logo
-wisuda  -alumni  -dosen  -perpustakaan  -skripsi
```

### AG: Karyawan & RPL → `/rpl`
Segmen paling bernilai (kelas malam + RPL 2 tahun adalah diferensiator kuat). Sadari kompetitornya bukan kampus Solo, tapi **kampus online nasional** (Esa Unggul, Dian Nusantara, Nusa Megarkencana) yang agresif bidding geo "Solo" — CPC di sini akan yang tertinggi. Max CPC cap: **Rp5.000**.

```
[kuliah karyawan solo]  [kelas karyawan surakarta]  [kuliah sambil kerja solo]
[kuliah malam solo]  [kuliah kelas malam surakarta]  [kuliah sabtu minggu solo]
[program rpl solo]  [kuliah rpl surakarta]  [s1 kelas karyawan solo]
"kuliah karyawan di solo"  "konversi pengalaman kerja jadi sks"  "kuliah cepat lulus 2 tahun"
```

### AG: Kampus Swasta Solo → `/`
Intent lebih awal, volume lebih besar, harus dijaga ketat. Max CPC cap: **Rp3.500**.

```
[universitas swasta di solo]  [kampus swasta surakarta]  [universitas islam di solo]
[kuliah murah di solo]  [kuliah bisa dicicil solo]  [universitas terakreditasi di solo]
"kampus swasta murah solo"  "biaya kuliah swasta surakarta"  "kuliah tanpa uang gedung"
```

### AG: Prodi Spesifik → `/` (Minggu 3)
Volume kecil tapi CPC murah dan intent tinggi. Phrase match.

```
"s1 manajemen solo"  "kuliah akuntansi surakarta"  "s1 hukum solo"
"kuliah informatika solo"  "s1 teknik sipil surakarta"  "s1 teknik industri solo"
"kuliah agribisnis solo"  "s1 peternakan surakarta"  "s2 manajemen surakarta"
```

### Negative keyword list (level akun, terapkan ke semua campaign)

```
gratis  bokep  torrent  pdf  contoh  makalah  jurnal  skripsi  proposal
negeri  ptn  uns  ums  snbp  snbt  utbk pusat  kedinasan  ipdn
lowongan  loker  gaji  karir  beasiswa luar negeri  s3  doktor
arti  adalah  sejarah  profil  peringkat  ranking  akreditasi bpn
batik  kain  motif  seragam  butik  konveksi  kursus menjahit
```

> `-batik` di level akun akan memblok sebagian query brand. Solusi: pasang `-batik` **hanya di campaign Non-Brand**, dan biarkan Brand campaign menangani "universitas islam batik" lewat exact match + negatif spesifik di §4.

---

## 5. Budget & proyeksi

Budget bulanan sudah termasuk 3 skenario. **Rekomendasi: Tier B.**

> **Dipilih: Tier A.** Paket impor Google Ads Editor siap pakai ada di [`google-ads-tier-a/`](google-ads-tier-a/README.md).

| | **Tier A (dipilih)** | Tier B | Tier C |
|---|---|---|---|
| Budget/bulan | Rp3.000.000 | **Rp5.000.000** | Rp10.000.000 |
| Budget/hari | Rp100.000 | **Rp167.000** | Rp333.000 |
| Brand (15%) | Rp15.000/hari | Rp25.000/hari | Rp50.000/hari |
| Non-Brand (85%) | Rp85.000/hari | Rp142.000/hari | Rp283.000/hari |
| Jumlah AG aktif | 2 (Brand + Karyawan) | 3 | 4 |

**Model proyeksi Tier B** (asumsi, untuk kalibrasi ekspektasi — bukan janji):

| Metrik | Asumsi | Hasil/bulan |
|---|---|---|
| CPC blended | Rp3.500 | — |
| Klik | — | ±1.430 |
| LP → klik WA | 8% | ±114 lead |
| Biaya per lead | — | ±Rp44.000 |
| Lead → mahasiswa terdaftar | 6% | **±7 mahasiswa** |
| CAC per mahasiswa | — | ±Rp715.000 |
| Pendapatan semester 1 (7 × Rp6,49 jt*) | — | ±Rp45 jt |

\* Contoh S1 Manajemen Kelas Pagi: SPP Basis 2.800.000 + SPP SKS 1.890.000 + Biaya Lain-lain 1.800.000 = **Rp6.490.000**. Nilai seumur studi (8 semester) jauh lebih tinggi lagi — headroom ROI di sini besar, jadi **jangan terlalu pelit menaikkan budget begitu CPL terbukti**.

**Sprint Agustus (10–30 Agustus, 21 hari):** front-load. Kalau bisa, alokasikan Rp3,5–4 jt untuk 21 hari ini (±Rp180k/hari) — urgensi deadline promo adalah aset konversi yang tidak akan tersedia lagi di September.

---

## 6. Iklan (RSA)

Semua sudah dicek panjang karakter (headline ≤30, deskripsi ≤90). Buat **satu RSA per ad group** + pin minimal.

### Headline pool (15)

| # | Headline | Char |
|---|---|---|
| 1 | Kuliah S1 di UNIBA Surakarta | 28 |
| 2 | Gratis Uang Gedung Rp4 Juta | 27 |
| 3 | Bayar 60% Dulu, Sisa Nyusul | 27 |
| 4 | Kelas Malam untuk Karyawan | 26 |
| 5 | Terakreditasi BAN-PT | 20 |
| 6 | Daftar Gratis, Tanpa Biaya | 26 |
| 7 | Promo Berakhir 30 Agustus | 25 |
| 8 | Kampus Islami di Laweyan | 24 |
| 9 | Lulus 2 Tahun Lewat RPL | 23 |
| 10 | Cek Simulasi Biaya 1 Menit | 26 |
| 11 | Beasiswa Tahfiz s/d 75% | 23 |
| 12 | Bisa Lulus Tanpa Skripsi | 24 |
| 13 | Diterima dalam 1 Hari Kerja | 27 |
| 14 | Kuliah Sambil Kerja di Solo | 27 |
| 15 | 11 Prodi S1 & 2 Prodi S2 | 24 |

**Pinning per ad group:**
- Brand → pin #1 ke Position 1
- Karyawan & RPL → pin #4 atau #14 ke Position 1, #9 ke Position 2
- Kampus Swasta Solo → pin #2 ke Position 1
- Prodi → pin headline dinamis `{KeyWord:Kuliah di UNIBA Surakarta}` ke Position 1

### Description pool (4)

| # | Description | Char |
|---|---|---|
| 1 | Gratis uang gedung Rp4 juta. Cukup bayar 60% di semester 1, sisanya diangsur. | 76 |
| 2 | Kelas malam & hybrid untuk karyawan. Jadwal fleksibel, bukan hanya Sabtu-Minggu. | 79 |
| 3 | Simulasi biaya online 1 menit. Verifikasi 1 hari kerja. Chat admisi via WhatsApp. | 81 |
| 4 | Promo Gelombang 2 berakhir 30 Agustus 2026. Daftar sekarang, kuota terbatas. | 76 |

Deskripsi #4 sebaiknya pakai **countdown customizer** (`{=COUNTDOWN(...)}`) agar tanggal tidak perlu diedit manual dan tidak jadi klaim basi setelah 30 Agustus.

### Assets

**Sitelinks (5)**
| Teks | URL | Deskripsi |
|---|---|---|
| Simulasi Biaya | `/#simulasi-biaya` | Hitung biaya semester 1 dalam 1 menit |
| Program RPL 2 Tahun | `/rpl` | Konversi pengalaman kerja jadi SKS |
| Daftar Beasiswa | `/#beasiswa` | KIP Kuliah, Tahfiz, Prestasi, Alumni |
| Cara Daftar | `/#cara-daftar` | 4 langkah, verifikasi 1 hari kerja |
| Program Studi | `/#program-studi` | 11 prodi S1 & 2 prodi S2 |

**Callouts:** Gratis Uang Gedung · Bisa Dicicil · Kelas Malam Tersedia · Terakreditasi BAN-PT · One Day Service · 10.000+ Alumni · Bisa Tanpa Skripsi · Beasiswa KIP Kuliah

**Structured snippet** — Header *Program Studi*: Manajemen, Akuntansi, Ilmu Hukum, Informatika, Teknik Industri, Teknik Sipil, Agribisnis, Agroteknologi, Peternakan

**Call asset:** (0271) 714751, aktif 08.00–16.00 Senin–Jumat
**Location asset:** hubungkan Google Business Profile UNIBA Surakarta (Laweyan) — gratis, menaikkan CTR lokal secara signifikan

---

## 7. Runbook 4 minggu

| Minggu | Aksi | Jangan dilakukan |
|---|---|---|
| **1** (10–16 Ags) | Launch Brand + AG Karyawan + AG Kampus Solo. Cek Search Terms Report **setiap hari**, tambahkan negatif. Verifikasi konversi tercatat dengan tes klik WA sungguhan. | Jangan ubah budget/bid. Jangan pause keyword karena 0 konversi di hari ke-3. |
| **2** (17–23 Ags) | Search terms 2 hari sekali. Matikan keyword dengan >40 klik & 0 konversi. Naikkan bid pada 3 keyword pembawa lead. Tambah RSA kedua di AG terbaik. | Jangan tambah campaign baru. |
| **3** (24–30 Ags) | Aktifkan AG Prodi Spesifik. Push urgensi deadline di semua deskripsi. **Konfirmasi ke admisi: tanggal & harga Gelombang 3** supaya iklan tidak mati 31 Agustus. | Jangan potong budget di minggu paling urgen. |
| **4** (31 Ags–6 Sep) | Ganti seluruh copy promo → penawaran Gelombang 3. Bangun audience remarketing (pengunjung 30 hari, penyelesai simulasi biaya) untuk fase berikutnya. Jika konversi ≥30, pindah ke Maximize Conversions. | Jangan pindah ke smart bidding kalau konversi <30. |

---

## 8. Review mingguan (15 menit)

1. **Search Terms Report** — sumber pemborosan #1. Setiap query tidak relevan → negatif, langsung.
2. Spend vs pacing (target ±10% dari budget harian × hari).
3. CPL per ad group — matikan yang >2x CPL rata-rata setelah ≥50 klik.
4. Impression Share Lost (Budget) vs (Rank) — jika kalah karena *Rank*, perbaiki Quality Score/copy, bukan naikkan budget.
5. **Respons WA:** berapa lead masuk vs berapa dibalas <15 menit. Ini biasanya bocor lebih besar daripada masalah di akun iklan.
6. Bandingkan konversi Google Ads vs GA4 — selisih >30% berarti tracking bermasalah.

**Fase 2 (setelah ada data):** impor **offline conversion** — lead WA yang benar-benar mendaftar diunggah balik ke Google Ads lewat `gclid`. Ini yang mengubah optimasi dari "klik WA termurah" jadi "mahasiswa terdaftar termurah". Ini adalah upgrade tunggal dengan dampak terbesar di akun ini.

---

## 9. Risiko

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Domain iklan ≠ domain institusi | Iklan ditolak / akun disuspend | Lihat §2.6 — dokumen kuasa + branding resmi di LP, atau pindah ke subdomain `uniba.ac.id` |
| "Batik" menarik query tekstil/kursus | Budget ketat terkuras ke traffic nol-nilai | Negative list §4, review search terms harian di minggu 1 |
| Kampus online nasional menaikkan CPC "kelas karyawan" | CPL naik tajam | Batasi Max CPC Rp5.000; kalau tembus, geser budget ke AG Prodi + Kampus Solo |
| Promo berakhir 30 Ags, copy tidak diganti | Klaim menyesatkan → pelanggaran kebijakan Google | Pakai countdown customizer + tugaskan review copy tanggal 29 Ags |
| Klik WA di-hitung tanpa dedup | Konversi menggelembung, bidding salah arah | Dedup 1x/sesi (§2.2) |
| Lead WA tidak dibalas cepat | CPL bagus, pendaftar nol | SLA balas <15 menit di jam 08.00–21.00 |

---

## 10. Langkah berikutnya

1. Konfirmasi angka budget bulanan (Tier A/B/C).
2. Pasang tracking (§2) — ini blocking.
3. Saya bisa generate **CSV siap impor Google Ads Editor** (campaign, ad group, keyword, negatif, RSA, sitelink) begitu budget dan tracking dikonfirmasi.
