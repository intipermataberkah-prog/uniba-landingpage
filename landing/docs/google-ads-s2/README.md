# Kampanye S2 — Magister Manajemen & Magister Hukum

Paket impor Google Ads Editor untuk program Magister, mendarat di `https://www.daftaruniba.site/s2`.
Disusun 4 September 2026. File CSV-nya ada di [`../google-ads-tier-a/`](../google-ads-tier-a/) (nomor 14–19).

Semua klaim di iklan diambil **verbatim dari halaman /s2 yang live**, bukan estimasi.

## Kenapa campaign terpisah, bukan ad group

| Alasan | Penjelasan |
|---|---|
| Nilai per mahasiswa jauh lebih besar | S2 = **Rp27.000.000** pasti selama 4 semester. Bid Rp15.000 masih ±1.800× lebih kecil dari nilainya. |
| Audiens berbeda | ASN dan profesional 28–45 th, bukan lulusan SMA. Copy, jam tayang, dan bahasa iklannya tidak sama. |
| Budget harus bisa dipisah | Kalau digabung ke campaign Non-Brand, keyword S1 yang volumenya jauh lebih besar akan menelan seluruh budget dan S2 tidak akan pernah tayang. |
| Pelaporan bersih | CPL dan CAC S2 harus bisa dibaca terpisah dari S1. |

## Struktur

```
GOOG_Search_S2_PMB_2026 — Rp40.000/hari, Manual CPC, status PAUSED
├── S2 Manajemen ............ 7 keyword, bid Rp15.000
├── S2 Hukum & Cyber Law .... 9 keyword, bid Rp16.000
└── S2 Umum & ASN ........... 11 keyword, bid Rp13.000–14.000
```

Total 27 keyword, 35 negatif, 3 RSA, 4 sitelink.

**Dibuat PAUSED dengan sengaja.** Menyalakannya menambah Rp40.000/hari di atas Rp100.000/hari yang sudah jalan — itu keputusan budget, bukan keputusan teknis. Lihat bagian Budget di bawah.

## Tiga sudut yang dipakai

**1. Cyber Law — ini yang paling tajam.** Halaman /s2 menyebut "satu-satunya konsentrasi hukum siber di Solo Raya", dan visi prodinya menyebut hukum siber eksplisit. Tidak ada kampus lain di Solo Raya yang bisa menyamai klaim ini, jadi keyword `s2 hukum siber`, `magister hukum cyber law`, dan `"s2 cyber law"` diberi bid tertinggi (Rp16.000).

**2. ASN dan kelas jabatan.** Halaman menghubungkan kualifikasi S2 dengan penyesuaian kelas jabatan dan talent management. Ini niat beli yang sangat spesifik, dan hampir tidak ada kampus yang menargetkannya lewat search. Keyword `s2 untuk asn` dan `s2 untuk pns` murah karena nyaris tak ada yang melawan.

**3. Tanpa berhenti kerja.** "Kelas di luar jam kerja" + kampus di pusat kota = bisa langsung dari kantor. Ini yang mengalahkan kampus online nasional, yang justru menuntut mahasiswa belajar sendirian.

## Angka yang dipakai di iklan

Diambil dari halaman /s2, jangan diubah tanpa mengecek halamannya lagi:

| Komponen | Nilai |
|---|---|
| Untuk mulai kuliah | Rp2.400.000 |
| Total 4 semester | Rp27.000.000 |
| SPP per semester | Rp5.400.000 |
| Semester 1 | Rp8.800.000 (pendaftaran 500rb + SPP 5,4jt + lain-lain 1,9jt + matrikulasi 1jt) |
| Akreditasi | Magister Manajemen: **Baik Sekali** |

**Iklan S2 sengaja tidak menyebut tanggal penutupan**, karena halaman /s2 memang tidak menyebutkan satu pun. Jangan menambahkan deadline yang tidak ada di halaman.

## Negatif: yang khas S2

Keyword S2 menarik dua jenis sampah yang tidak muncul di S1, dan keduanya bervolume besar:

- **Pemburu contoh tesis** — `contoh`, `tesis`, `disertasi`, `jurnal`, `proposal`, `makalah`, `pdf`. Ini mahasiswa yang sedang mengerjakan tugas, bukan calon pendaftar.
- **Pemburu beasiswa** — `beasiswa`, `lpdp`, `gratis`. Program ini berbayar; orang yang mencari LPDP tidak akan membayar Rp27 juta.

Ditambah kompetitor negeri (`uns`, `ugm`, `undip`, `unair`, `negeri`), jenjang salah (`s1`, `s3`, `d3`, `profesi`, `ppg`), dan kuliah jarak jauh (`online`, `jarak jauh`, `universitas terbuka`) — halaman /s2 menjanjikan kelas tatap muka di luar jam kerja, bukan daring.

## Setting yang harus diisi manual setelah impor

Sama seperti campaign lain — Editor tidak membawa ini lewat CSV, dan defaultnya salah:

- [ ] **EU political ads** → *does not contain* (memblokir posting kalau kosong)
- [ ] **Networks** → matikan Search Partners **dan** Display Network
- [ ] **Languages** → Indonesian + English
- [ ] **Locations** → 8 wilayah yang sama: Sukoharjo, Surakarta, Sragen, Boyolali, Klaten, Karanganyar, **Ngawi (Jawa Timur)**, Wonogiri
- [ ] **Targeting method** → *People in or regularly in* (bukan "or who show interest in")
- [ ] **Ad schedule** → untuk S2 pertimbangkan **11.00–22.00**, bukan 06.00–23.00. Audiensnya bekerja; pencarian terjadi saat istirahat siang dan malam hari.
- [ ] **Conversion goals** → Contact + Outbound click (keduanya sudah account default)

## Budget: keputusan yang perlu diambil

S1 sekarang jalan Rp100.000/hari. Menyalakan S2 apa adanya menjadikannya Rp140.000/hari.

Tiga pilihan:

1. **Tambah penuh** → Rp140.000/hari. Paling cepat, tapi belanja naik 40%.
2. **Realokasi** → turunkan Non-Brand ke Rp45.000, S2 Rp40.000, Brand tetap Rp15.000. Total tetap Rp100.000.
3. **Uji dulu** → S2 Rp25.000/hari selama seminggu untuk melihat apakah ada volume sama sekali, baru diputuskan.

Pertimbangan yang relevan: satu mahasiswa S2 bernilai Rp27 juta pasti, sementara S1 semester 1 bernilai Rp6,49 juta. Kalau S2 menghasilkan lead sama sekali, ROI-nya jauh lebih tinggi per rupiah belanja.

## Urutan impor

```
14-campaign-s2.csv → 15-adgroups-s2.csv → 16-keywords-s2.csv
→ 17-negatives-s2.csv → 18-rsa-s2.csv → 19-assets-s2.csv
```

Semua sudah divalidasi: panjang headline ≤30, deskripsi ≤90, tidak ada negatif yang memblokir keyword sendiri, semua final URL mengarah ke `/s2`.
