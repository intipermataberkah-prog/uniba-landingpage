# Prompt latar langit untuk Nano Banana (Gemini image)

Hasilnya ditaruh di `public/sky/` dan dipasang di belakang `SkyBackdrop`.

## Baca ini dulu sebelum generate

Latar hero ini **bukan gambar hiasan**. Tugasnya satu: menjadi alas tenang untuk
teks navy dan tombol daftar. Jadi ada tiga syarat yang lebih penting daripada
seberapa indah awannya.

1. **Tengahnya harus kosong dan terang.** Judul, dek harga, dan tombol duduk di
   tengah. Awan yang ramai persis di belakang teks akan menurunkan keterbacaan,
   dan itu langsung memakan konversi di halaman yang dibiayai iklan.
2. **Kontras rendah.** Jangan ada langit biru pekat atau awan gelap dramatis.
   Target kita teks navy 11:1 di atas latar. Semakin gelap latarnya, semakin
   tipis marginnya.
3. **Ringan.** Sekarang latarnya CSS murni, **0 KB**. Mengganti dengan foto
   berarti menambah beban di halaman berbayar, jadi ini hanya sepadan kalau
   hasilnya jelas lebih baik daripada versi CSS. Target akhir di bawah **150 KB**
   setelah dikompresi ke WebP.

## Prompt utama, latar hero

```
A very soft, minimal photograph of a bright daytime sky, shot looking upward with
a wide lens. Pale cyan-blue at the top edge fading to almost white across the
lower two thirds. A few gentle, diffuse cumulus clouds drift near the left and
right edges only, leaving the centre of the frame open, clean and bright with no
cloud detail at all. Very low contrast, no dark shadows, no dramatic sky, no sun
flare, no horizon line, no birds, no aircraft, no landscape, no buildings, no
people, no text. Calm, airy, premium editorial feel. Evenly lit, slightly
overexposed, fine natural film grain. Wide 16:9 composition.
```

**Kenapa awan hanya di kiri dan kanan:** itu bagian yang menentukan berhasil atau
tidak. Kalau modelnya menaruh awan tebal di tengah, teksnya akan berebut ruang
dengan gambar dan hasilnya lebih buruk daripada CSS yang sekarang.

## Varian mobile, kalau versi 16:9 terpotong jelek

```
The same soft bright sky, composed vertically for a tall 9:16 crop. Pale
cyan-blue along the top, fading to near-white at the bottom half. Sparse diffuse
clouds only in the upper third. The lower half stays clean and open. Very low
contrast, no horizon, no landscape, no people, no text.
```

## Varian pita seksi, opsional

Untuk pita tipis antar seksi, bukan hero.

```
An extremely soft, abstract band of pale blue and white sky, almost like a gentle
gradient with the faintest suggestion of cloud texture. Very wide panoramic
composition, low contrast, no defined shapes, no horizon, no objects, no text.
```

## Yang tidak boleh diminta

- **Kampus, gedung, mahasiswa, wisuda.** Kalau gambar buatan AI ditempatkan di
  halaman UNIBA, orang akan membacanya sebagai foto UNIBA. Itu representasi yang
  tidak benar. Langit tidak mengklaim apa pun, itu sebabnya langit aman.
- **Teks apa pun**, termasuk tulisan kecil di kejauhan. Model gambar merusak
  huruf, dan tulisan palsu di halaman resmi kampus adalah masalah.
- **Matahari terbenam, senja, jingga.** Palet kampanye biru, dan jingga akan
  mengembalikan kesan emas yang baru saja kita buang.

## Setelah dapat gambarnya

1. Simpan sebagai `public/sky/hero-sky.webp` (dan `hero-sky-mobile.webp` bila ada).
2. Kirimkan ke saya. `ffmpeg` ada di sini, jadi saya yang kompresi, atur ukuran,
   dan ukur beban transfernya.
3. Saya pasang di belakang `SkyBackdrop` sebagai lapis dasar, **bukan pengganti**.
   Gradien CSS tetap jadi jaring pengaman: kalau gambarnya gagal dimuat atau
   koneksinya lambat, halaman tetap punya langit dan teks tetap terbaca.
4. Kalau setelah dikompresi hasilnya tidak terlihat jelas lebih baik daripada CSS
   yang sekarang, saya sarankan tidak dipakai. Nol KB sulit dikalahkan.
