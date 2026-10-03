# UNIBA Surakarta — PMB Poster Design System

**Sumber:** 3 poster HUMAS (Beasiswa Prestasi · Beasiswa Alumni SMA/SMK Batik · RPL)
**Status:** v1 — nilai warna diambil secara visual dari screenshot terkompresi. Verifikasi ke file sumber (.ai/.psd/.cdr) sebelum dipakai untuk cetak.
**Tanggal:** 2026-08-25

---

## 1. Karakter Desain

Poster PMB UNIBA memakai formula **"proof-first admissions poster"** — enam lapis tetap dari atas ke bawah:

| Lapis | Isi | Fungsi |
|---|---|---|
| Crest | Logo + wordmark 2 baris, center, atas | otoritas institusi |
| Foto | Cut-out mahasiswa bertoga, tepi bawah fade ke putih | bukti sosial / aspirasi |
| Pesan | Eyebrow + headline raksasa navy/emas | satu penawaran, satu kalimat |
| Bukti | Pill navy + daftar syarat / prodi | kualifikasi & filter audiens |
| Aksi | QR + `pmb.uniba.ac.id` + 2 nomor admin | konversi |
| Footer | Bar navy: sosial, web, alamat, HUMAS | legitimasi |

Prinsip yang konsisten di ketiga poster:

1. **Satu penawaran per poster.** Tidak ada dua CTA yang bersaing.
2. **Headline mendominasi ±30% tinggi kanvas.** Harus terbaca sebagai thumbnail di feed.
3. **Emas hanya untuk 1–2 kata paling penting** (`KULIAH SARJANA`, `(RPL)`, `BEASISWA`). Sisanya navy.
4. **Foto tidak pernah menyentuh headline** — selalu dipisah gradasi putih.
5. **Urgensi opsional** — ribbon `KUOTA TERBATAS` hanya di poster beasiswa, tidak di RPL.

---

## 2. Palet Warna

### 2.1 Core

| Token | Hex | Peran |
|---|---|---|
| `navy` | `#123A7E` | Warna utama. Headline, footer bar, pill, ribbon, logo. |
| `navy-deep` | `#0B2452` | Bayangan headline, dasar footer, overlay foto. |
| `navy-ink` | `#16213E` | Teks paragraf panjang di atas putih. |
| `gold` | `#FFC220` | Aksen tunggal: kata kunci penawaran, ikon telepon. |
| `gold-bright` | `#FFD84D` | Sparkle, highlight, gradasi atas huruf emas. |
| `gold-batik` | `#C9922F` | Ornamen batik sudut atas. |
| `tan-batik` | `#D9B57A` | Isian motif batik yang lebih muda. |
| `blue-action` | `#1E6FD9` | Badge centang, chip sekunder (poster RPL). |
| `white` | `#FFFFFF` | Kanvas utama + outline huruf. |
| `mist` | `#DEEAF6` | Wash foto gedung, area foto yang di-fade. |
| `paper` | `#F4F7FB` | Surface netral bila butuh blok non-putih. |

Sekunder khusus konteks: `wa-green #25D366` — hanya untuk ikon/tombol WhatsApp, bukan elemen dekoratif.

### 2.2 Rasio penggunaan (60 / 25 / 12 / 3)

```
putih & mist  ████████████████████████  60%
navy          ██████████                25%
emas          █████                     12%
biru aksi     █                          3%
```

Emas tidak pernah melewati ~15% area. Lebih dari itu, poster kehilangan kesan institusional dan mulai terbaca seperti iklan diskon.

### 2.3 Kombinasi yang diizinkan

| Latar | Teks | Kontras | Status |
|---|---|---|---|
| Putih | `navy #123A7E` | ≈9.6:1 | ✅ headline & body |
| Putih | `gold #FFC220` | ≈1.6:1 | ❌ **jangan** untuk teks polos — wajib keyline navy |
| `navy` | Putih | ≈9.6:1 | ✅ pill, footer, ribbon |
| `navy` | `gold #FFC220` | ≈6.1:1 | ✅ headline emas di atas navy |
| `mist` | `navy` | ≈8.2:1 | ✅ |
| Foto | teks apa pun | — | ❌ wajib scrim navy 40% atau keyline |

> **Aturan keras:** emas di atas putih selalu butuh keyline navy — lihat `KULIAH SARJANA` di poster RPL (huruf emas, garis tepi navy tebal). Tanpa itu, hilang di layar HP dan pecah saat cetak.

### 2.4 Hubungan dengan palet web (`app/globals.css`)

Poster berjalan lebih **terang dan jenuh** daripada landing page. Ini disengaja — media cetak/feed butuh saturasi lebih tinggi. Jangan saling menimpa; perlakukan sebagai dua tier dari satu keluarga.

| Peran | Web (existing) | Poster (baru) | Catatan |
|---|---|---|---|
| Navy utama | `#0f2c59` | `#123A7E` | poster lebih terang & lebih biru |
| Navy dalam | `#081a37` / `#003366` | `#0B2452` | dekat, aman disatukan |
| Emas | `#f59e0b` | `#FFC220` | poster lebih kuning, kurang oranye |
| Emas tua | `#d4af37` | `#C9922F` | keduanya untuk ornamen |
| Biru terang | `#2563eb` | `#1E6FD9` | praktis identik |
| Emas aman-teks | `#a16207` | — | **tetap pakai versi web untuk teks emas di web** |

**Rekomendasi:** tambahkan tier `print` lewat `brand/poster-tokens.css`, jangan ubah nilai web yang sudah lolos audit kontras.

---

## 3. Tipografi

### 3.1 Keluarga huruf

Poster memakai geometric sans super-berat, all-caps, tracking rapat.

| Peran | Perkiraan di poster | Pengganti open-source | Berat |
|---|---|---|---|
| Display | Gilroy / Poppins Black | **Poppins** | 800–900 |
| Display miring | oblique ±8° | Poppins Black + skew, atau **Anton** | — |
| Sub-headline | Poppins Bold | **Poppins** | 700 |
| Body / daftar | Poppins Medium | **Poppins** | 500 |
| Mikro footer | Poppins Regular | **Poppins** | 400 |
| Caption URL | italic | **Poppins** Italic | 400 |

> Landing page memakai Plus Jakarta Sans + Inter. Untuk konsistensi lintas kanal, **Plus Jakarta Sans ExtraBold** adalah pengganti display terdekat dan sudah tersedia di project.

### 3.2 Skala tipe (kanvas 1080 × 1350 px)

| Level | Ukuran | Tracking | Contoh |
|---|---|---|---|
| Display-1 | 132–150 px | −2% | `BEASISWA PRESTASI`, `GRATIS UKT & SP1` |
| Display-2 | 84–96 px | −1.5% | `KULIAH SARJANA`, `REKOGNISI PEMBELAJARAN LAMPAU` |
| Eyebrow | 34 px | +4% | `MODAL PENGALAMAN KERJA`, `KHUSUS ALUMNI SMA & SMK BATIK` |
| Sub-headline | 30 px | 0 | `Khusus Calon Mahasiswa Baru Jalur Prestasi…` |
| Pill label | 28 px | +2% | `Program Studi`, `Tersedia untuk kamu yang memiliki :` |
| List item | 32 px | 0 | `Juara MTQ`, `Program Studi S1 Manajemen` |
| Contact | 26 px | 0 | `Admin 1 0895 3947 54000` |
| Micro / footer | 18–20 px | +2% | alamat, `www.uniba.ac.id` |
| Caption URL | 24 px italic | 0 | `pmb.uniba.ac.id` |

Rasio display : body ≈ **4.5 : 1**. Itu yang membuat poster tetap terbaca di thumbnail.

### 3.3 Efek huruf

Hanya tiga efek yang dipakai — jangan tambah yang lain:

1. **Keyline putih** 6–8 px untuk headline navy di atas foto.
2. **Keyline navy** 8–10 px untuk headline emas.
3. **Drop shadow** `0 6px 0 rgba(11,36,82,.25)` — offset vertikal murni, blur minimal.

Dilarang: gradasi pelangi, bevel/emboss, outer glow, teks melengkung, stroke berlapis lebih dari 2.

---

## 4. Grid & Layout

```
Kanvas 1080 × 1350 (4:5) · margin aman 72 px · grid 12 kolom, gutter 24 px

┌───────────────────────────────┐  0
│ ░batik░        LOGO      ░░░░ │  crest      0–190
├───────────────────────────────┤
│                               │
│       FOTO CUT-OUT            │  foto     190–560
│  (tepi bawah fade ke putih)   │
├───────────────────────────────┤
│  EYEBROW                      │
│  HEADLINE BESAR               │  pesan    560–900
│  sub-headline                 │
├───────────────────────────────┤
│  ▭ pill navy                  │
│  • daftar syarat / prodi      │  bukti    900–1150
├───────────────────────────────┤
│  ☎ admin           [ QR ]     │  aksi    1150–1260
├───────────────────────────────┤
│ sosial │ web │ alamat │ HUMAS │  footer  1260–1350
└───────────────────────────────┘
```

Aturan layout:

- Footer bar navy **selalu** 90 px, menempel penuh ke tepi kiri–kanan.
- Logo center-atas, lebar ±150 px, clear space minimum 40 px.
- Blok QR di kuadran kanan-bawah zona aksi (kanan = akhir arah baca).
- Ribbon `KUOTA TERBATAS` menempel ke tepi kanan, sedikit keluar kanvas agar terasa "ditempel".
- Ornamen batik hanya di dua sudut atas, tidak pernah di bawah.

---

## 5. Komponen

| # | Komponen | Spesifikasi |
|---|---|---|
| 1 | **Logo lockup** | Lambang + `UNIVERSITAS ISLAM BATIK / SURAKARTA` dua baris caps, tracking +6%, navy. Hanya di atas putih/mist. |
| 2 | **Batik corner** | Strip motif emas–tan di sudut kiri & kanan atas, tinggi ±110 px, tidak dicerminkan persis. |
| 3 | **Urgency ribbon** | Paralelogram navy, teks putih 30 px caps dua baris `KUOTA / TERBATAS`, menempel tepi kanan. |
| 4 | **Label pill** | Rect navy radius 8 px, padding 16×32, teks putih caps, lebar mengikuti teks, center. |
| 5 | **Check list** | Ikon centang lingkaran `#1E6FD9` ⌀30 px, gap 16 px, teks bold. Rata kiri di dalam blok yang di-center. |
| 6 | **Bullet list polos** | Tanpa ikon, teks navy medium, rata tengah (dipakai di Beasiswa Prestasi). |
| 7 | **QR block** | Eyebrow `LINK PENDAFTARAN` 22 px caps → QR 190×190 px, quiet zone 16 px → `pmb.uniba.ac.id` italic. |
| 8 | **Admin contact** | Ikon telepon lingkaran emas ⌀40 px + `Admin Pendaftaran` bold navy + dua nomor sebaris. |
| 9 | **Footer bar** | Navy, tiga slot: ikon sosial + `unibasurakarta` │ `www.uniba.ac.id` │ alamat. Badge `HUMAS` di ujung kanan. |

---

## 6. Aturan Foto

- Subjek: mahasiswa bertoga, ekspresi gembira, **selalu cut-out** (background dihapus).
- Latar gedung kampus diturunkan ke `mist #DEEAF6`, opacity ±25%.
- Tepi bawah foto selalu memudar ke putih — tidak ada garis potong keras.
- Minimal dua orang di frame; subjek tunggal terasa seperti iklan personal, bukan institusi.
- Jangan pernah menaruh headline di atas wajah.

---

## 7. Do & Don't

**Do**

- Satu penawaran, satu CTA, satu warna aksen.
- Nomor admin selalu dua — mengurangi kehilangan lead kalau satu nomor tidak aktif.
- QR selalu ditemani URL teks (`pmb.uniba.ac.id`) untuk yang memfoto poster dari jauh.
- Cek keterbacaan pada lebar 320 px sebelum publish.

**Don't**

- Emas polos di atas putih tanpa keyline.
- Lebih dari 5 item daftar — poster RPL sudah di batas.
- Menambah warna kelima (merah/hijau) selain hijau WhatsApp untuk ikon WA.
- Menggeser atau mengubah tinggi footer bar antar poster — konsistensi bar itulah yang membuat serial terbaca sebagai satu kampanye.
- Mencampur dua bobot display dalam satu headline.

---

## 8. Checklist pra-publish

- [ ] Logo center, clear space 40 px
- [ ] Headline terbaca di thumbnail 320 px
- [ ] Emas ≤ 15% area, tidak ada emas tanpa keyline di atas putih
- [ ] QR discan dari HP (min 190 px pada kanvas 1080), quiet zone bersih
- [ ] URL teks pendamping QR ada
- [ ] Dua nomor admin, format konsisten
- [ ] Footer bar 90 px, alamat + web + sosial lengkap
- [ ] Ekspor: IG feed 1080×1350, story 1080×1920 (re-layout, bukan sekadar scale), cetak 300 dpi CMYK
