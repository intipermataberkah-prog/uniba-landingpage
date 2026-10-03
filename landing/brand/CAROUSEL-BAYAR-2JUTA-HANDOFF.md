# IG Carousel — "Bayar 2 Juta Sudah Bisa Kuliah"

**File Figma:** https://www.figma.com/design/md2PNWIshLiM9EvQjw8gFH
**Kanvas:** 8 slide × 1080 × 1350 (4:5)
**Sistem:** mengikuti `brand/POSTER-DESIGN-SYSTEM.md` — token warna sudah jadi Figma Variables (collection **PMB Poster System**)
**Periode:** Gelombang 2, Promo Spesial Kemerdekaan, T.A. 2026/2027 · ditutup 31 Agustus 2026

---

## 1. Alur naratif

| # | Slide | Peran | Pesan inti |
|---|---|---|---|
| 01 | Hook | Berhenti scroll | Cukup bayar **Rp2.000.000** sudah bisa kuliah |
| 02 | Masalah | Empati | Biaya masuk numpuk di bulan yang sama |
| 03 | Potongan | Bukti angka | Gratis Uang Gedung + Pendaftaran = **Rp4.300.000** |
| 04 | Angka kunci | Payoff | Rp2.000.000 flat, semua prodi |
| 05 | Cicilan | Hilangkan keberatan | Sisanya diangsur fleksibel, tanpa bunga |
| 06 | Program studi | Relevansi | 9 prodi S1, Reguler & Kelas Karyawan |
| 07 | Cara daftar | Kurangi friksi | 4 langkah, One Day Service |
| 08 | CTA | Konversi | QR + 2 admin + deadline |

Slide 04 dan 08 memakai latar navy penuh; sisanya putih/mist. Footer bar navy 90px identik di kedelapan slide — itu yang mengikat serial jadi satu kampanye.

---

## 2. Status aset

| Slot | Slide | Status |
|---|---|---|
| `FOTO-01 · Wisudawan` | 01 | ✅ terpasang — `Students_posing_in_graduation_gowns_202608251428.jpeg` |
| `FOTO-02 · Menghitung biaya` | 02 | ✅ terpasang — `Woman_reviewing_tuition_fee_sheet_202608251428.jpeg` |
| Logo UNIBA | 01, 08 | ✅ terpasang |
| `QR · pmb.uniba.ac.id` | 08 | ✅ terpasang — `brand/assets/qr-pmb-uniba.png` |
| `Ornamen Batik` | semua 8 slide | ✅ terpasang — `brand/assets/batik-light.png` + `batik-navy.png` |

Semua aset sudah masuk. Tidak ada slot kosong tersisa.

**Catatan QR:** file yang dikirim aslinya 201 × 202 px — terlalu kecil untuk slot 300 × 300 dan berisiko buram saat discan. QR-nya di-decode dulu (`https://pmb.uniba.ac.id/`), lalu digenerate ulang 1400 × 1400 dengan error correction level Q dan modul warna navy `#123A7E`. Hasilnya diverifikasi tetap ter-decode ke URL yang sama, termasuk setelah diperkecil ke 300 px. Kalau URL tujuannya berubah, regenerate — jangan discale gambar lama.

**Catatan framing:** kedua foto dipasang pakai `CROP`, bukan `FILL`, supaya posisi kepala dikunci manual — center-crop otomatis memotong ubun-ubun. Kalau fotonya diganti, framing-nya perlu diset ulang.

**Belum terpakai:** `Staff_explaining_tablet_to_student_*.jpeg` (2 file). Slot foto slide 05 sudah diganti kartu angka cicilan. Bilang saja kalau mau dipasang di slide lain.

---

## 3. Prompt Gemini untuk foto (arsip)

Foto sudah diproduksi dan terpasang — prompt disimpan di sini kalau perlu regenerate. Semua prompt sudah menyertakan arah warna yang cocok dengan palet (navy `#123A7E`, emas `#FFC220`, wash `#DEEAF6`). Generate di **16:9**, lalu crop ke band yang dibutuhkan.

### Prompt A — Slide 01 (hero)

```
Editorial university admissions photograph, wide 16:9 landscape composition.
Four Indonesian university students in their early twenties standing together,
mid-shot, waist up, spread across the frame with generous empty space in the
upper middle. Two young women wearing neatly draped hijabs, two young men.
They wear deep navy blue graduation gowns with warm gold sash trim. Genuine
relaxed smiles, looking at camera, one raising a rolled diploma.
Lighting: soft even daylight from the front left, no harsh shadows on faces.
Background: clean seamless very light blue-grey studio backdrop (#DEEAF6),
completely plain, softly out of focus.
Style: bright, optimistic, modern institutional marketing photography, natural
skin tones, sharp focus on subjects, shallow depth of field on the backdrop.
Shot on 50mm lens, f/2.8.
No text, no logos, no watermarks, no graduation caps covering faces,
no cluttered background, no dark moody grading.
```

### Prompt B — Slide 02 (empati)

```
Candid documentary photograph, wide 16:9 landscape composition.
A single Indonesian high-school graduate, around 18 years old, sitting at a
plain wooden table at home in the late afternoon. She wears a simple hijab and
a plain light-coloured shirt. She is looking down at a printed fee sheet and a
calculator with a thoughtful, slightly worried expression — pensive, not
distressed. Chin resting lightly on one hand.
Composition: subject on the LEFT third of the frame, right two-thirds left
mostly empty and softly blurred for text overlay.
Lighting: warm soft window light from the left, gentle falloff.
Background: quiet neutral home interior, heavily out of focus, muted pale tones.
Style: honest, warm, understated Indonesian lifestyle photography, natural
colours, no heavy retouching.
No text, no logos, no branding, no crying, no melodrama, no stock-photo
fake expressions.
```

**Catatan produksi:** untuk slide 01, kalau kamu mau meniru gaya poster HUMAS (subjek cut-out dengan tepi memudar ke putih), hapus background hasil Gemini lalu taruh di atas frame — feather putih di slide 01 sudah disiapkan sebagai layer terpisah bernama `Feather ke putih`.

---

## 4. Ornamen batik

Terpasang di sudut atas ke-8 slide, 400 × 140 per sudut. Dua varian, keduanya PNG transparan di `brand/assets/`:

| File | Dipakai di | Warna motif |
|---|---|---|
| `batik-light.png` | slide 01, 02, 03, 05, 06, 07 | `#C9922F` + `#D9B57A` |
| `batik-navy.png` | slide 04, 08 | `#FFC220` + `#C9922F` |

Sudut kanan memakai file yang sama dengan `CROP` bernilai x negatif, jadi motifnya menipis ke arah tengah — bukan ke luar kanvas.

### Kenapa tidak langsung dari Gemini

Enam kali generate versi navy tidak ada yang terpakai: dua jadi blok geometris abstrak, satu mandala tunggal, satu pola full-bleed, dan dua hasil recolor menyimpang dari sumbernya. Gemini konsisten mengabaikan instruksi "band" dan "memudar".

Jalan yang dipakai: versi terang dari Gemini dipertahankan sebagai satu-satunya sumber, lalu dikonversi secara deterministik dengan `brand/assets/batik_convert.py` — latar putih dijadikan alpha, dan dua tingkat emasnya di-remap. Karena komposisinya tidak disentuh, kedua varian identik posisi motifnya.

### Kalau motifnya mau diganti

1. Generate ulang **hanya versi terang** (prompt di bawah), simpan sebagai JPEG latar putih.
2. Ubah `SRC` di `batik_convert.py` ke file baru, jalankan `python batik_convert.py`.
3. Ganti fill kedua slot di Figma dengan PNG hasilnya.

```
Traditional Javanese batik ornament, flat vector illustration, wide horizontal
banner composition.
A decorative border band of classic Surakarta batik motifs — truntum
(small eight-petal star flowers) combined with kawung (four-lobed quatrefoil
rosettes) — arranged in dense staggered rows.
Colours: warm antique gold (#C9922F) and soft tan (#D9B57A) only, two tones,
flat fills with no gradients and no shading.
Background: pure flat white (#FFFFFF), completely clean.
The motif is densest at the LEFT edge and gradually thins out toward the RIGHT
edge, fading into empty white space by the right third.
Style: crisp flat vector, clean geometric edges, symmetrical and orderly,
traditional Indonesian textile ornament, high contrast against the white.
No text, no logos, no watermark, no drop shadows, no 3D, no fabric texture,
no photo realism, no frame or border lines.
```

**Jangan minta Gemini bikin versi navy-nya.** Sudah dicoba enam kali dan tidak pernah konsisten — konversinya jauh lebih murah lewat skrip.

---

## 5. Caption Instagram

**Caption utama:**

> Kuliah nggak harus nunggu punya uang banyak dulu. 🎓
>
> Di UNIBA Surakarta, Gelombang 2 kamu cukup bayar **Rp2.000.000** untuk mulai mengikuti perkuliahan. Uang gedung dan biaya pendaftaran — total Rp4.300.000 — kami gratiskan lewat Promo Spesial Kemerdekaan.
>
> Sisanya? Diangsur fleksibel, tanpa bunga, tanpa jadwal cicilan tetap, sampai akhir semester — mulai dari **Rp482.000/bulan**.
>
> ✅ 9 Program Studi S1
> ✅ Kelas Reguler & Kelas Karyawan (malam)
> ✅ One Day Service — status penerimaan keluar dalam 1 hari kerja
>
> Gelombang 2 ditutup **31 Agustus 2026**. Geser untuk lihat rinciannya, lalu daftar di pmb.uniba.ac.id
>
> 📞 Admin 1: 0895 6219 80090
> 📞 Admin 2: 0895 3947 54000
>
> #UNIBASurakarta #PMB2026 #KuliahdiSolo #UniversitasIslamBatik #KuliahSambilKerja #MahasiswaBaru #KampusSolo #PMBUniba #KelasKaryawan #KuliahMurah

**Hook alternatif untuk A/B test (ganti 2 baris pertama):**
- "Yang bikin batal kuliah biasanya bukan nilai. Tapi biaya masuk."
- "Rp2 juta. Itu yang kamu butuhkan buat mulai kuliah semester ini."
- "Uang gedung Rp4 juta itu? Nggak usah dibayar."

---

## 6. Angka cicilan Rp482.000 — dari mana

Dipakai di slide 05. Bukan tarif resmi, tapi hasil bagi dari tabel resmi, jadi bisa dipertanggungjawabkan kalau ditanya.

| Langkah | Nominal |
|---|---|
| SPP Basis S1 Informatika | Rp1.200.000 |
| SPP SKS (Reguler) | Rp1.890.000 |
| Biaya Lain-lain (semester 1 saja) | Rp1.800.000 |
| **Total Semester 1** | **Rp4.890.000** |
| − Bayar di awal | −Rp2.000.000 |
| **Sisa** | **Rp2.890.000** |
| ÷ 6 bulan (durasi 1 semester) | **Rp482.000/bulan** |

Aturan pakainya:

- Kartu di slide 05 memakai label **"MULAI DARI"**. Karena kalimat penjelas di dalam kartu sudah dihapus, **footnote di bawahnya jadi satu-satunya yang menerangkan angka ini** — menyebut prodi, nominal sisa, dan pembaginya. Jangan dihapus atau diperkecil sampai tidak terbaca; tanpa itu Rp482.000 terbaca sebagai tarif resmi, padahal kebijakannya tidak mengikat jadwal tetap.
- Jangan tulis "cicilan Rp482.000/bulan" di materi lain. Yang benar "mulai dari" — karena ini angka terendah, bukan angka semua orang.
- Angka ini pakai prodi **termurah** (Informatika). Perbandingan sisa semester 1 ÷ 6 bulan untuk prodi lain:

| Prodi | Sisa sem-1 | ÷ 6 bulan |
|---|---|---|
| Informatika | Rp2.890.000 | Rp482.000 |
| Agribisnis | Rp2.990.000 | Rp499.000 |
| Peternakan | Rp3.290.000 | Rp549.000 |
| Teknik Industri / Teknik Sipil / Agroteknologi | Rp3.540.000 | Rp590.000 |
| Manajemen / Akuntansi / Ilmu Hukum | Rp4.490.000 | Rp749.000 |

Kelas Karyawan lebih tinggi (SPP SKS Rp2.100.000, bukan Rp1.890.000) — Teknik jadi Rp625.000/bulan.

**Kalau nanti ada SK yang membolehkan tenor 8 bulan**, angka headline turun ke Rp362.000 (Informatika) dan Teknik jadi Rp443.000. Cukup ganti isi kartu di slide 05 dan footnote-nya.

---

## 7. Ekspor

Hasil ekspor terbaru: `C:\Users\Win11\Downloads\UNIBA PMB Carousel\` — 8 file PNG **2160 x 2700** (2x), dinamai `01`-`08`.

- Ekspor lewat export Figma (bukan render layar), format PNG, scale 2.
- Scale bisa sampai 4x (4320 x 5400) kalau perlu untuk cetak — berlebihan untuk feed.
- Urutan file harus `01`-`08` saat upload. Instagram menurunkan sendiri ke 1080 lebar.
- Jangan pakai JPG di bawah kualitas 90 — huruf emas dengan keyline navy paling cepat pecah.

**Kalau ada revisi:** ekspor ulang seluruh 8 slide, jangan hanya yang berubah — supaya tidak ada campuran versi lama dan baru dalam satu carousel.

### Verifikasi pada file hasil ekspor

- Semua 8 file terkonfirmasi 2160 x 2700, PNG RGBA.
- QR di slide 08 di-decode langsung dari file ekspor → `https://pmb.uniba.ac.id/`.
- QR masih terbaca saat slide diperkecil ke 540 px (kira-kira ukuran tampil di layar HP).
