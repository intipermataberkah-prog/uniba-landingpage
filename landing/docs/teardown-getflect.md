# Teardown: getflect.app

Diambil dengan `site-clone` (`skills/clone-site/scripts/tokens-probe.js`) pada
`https://www.getflect.app/?ref=land-book.com`, viewport 1280x720.

Ini **analisis token**, bukan kloning halaman. Tidak ada markup, copy, aset, atau tata
letak mereka yang disalin. Yang diambil hanya sistemnya: rasio skala tipografi, ritme
spasi, radii, dan pendekatan bobot. Warna merek mereka sengaja tidak dibawa.

## Batasan lisensi font (penting)

| Font | Status | Keputusan |
|---|---|---|
| PP Neue Montreal | Komersial, Pangram Pangram, di-host sendiri | **Tidak dipakai** |
| PP Editorial New | Komersial, Pangram Pangram | **Tidak dipakai** |

`fontLinks` kosong, artinya bukan Google Fonts, melainkan berkas berlisensi yang di-host
sendiri. Mengunduh dan memakainya adalah pembajakan font. UNIBA tetap memakai Plus Jakarta
Sans dan Inter yang sudah terpasang.

Ini juga bukan kerugian besar: yang membuat halaman itu terasa mahal adalah **bobot dan
spasi hurufnya**, bukan jenis hurufnya, dan itu bisa diterapkan ke font apa pun.

## Sistem tipografi terukur

| Elemen | Ukuran | Leading | Tracking | Bobot |
|---|---|---|---|---|
| h1 | 51.84px | **1.06** | **-0.030em** | **500** |
| h2 | 44.54px | 1.10 | -0.030em | 500 |
| h3 | 42px | 1.00 | -0.030em | 500 |
| p | 19.2px | 1.34 | -0.020em | 500 |
| body | 18px | **1.60** | 0 | 400 |
| label UI | 20px | 1.00 | -0.020em | 500 |

Nilai UI 20px/20px/500 muncul 101 kali, jelas merupakan token paling inti di halaman itu.

### Tiga aturan yang benar-benar membedakan

1. **Bobot 500, bukan 700 atau 800.** Hierarki dibangun dari ukuran dan warna, bukan dari
   menebalkan huruf. UNIBA sekarang memakai `font-extrabold` (800) di h1.
2. **Tracking negatif konsisten -0.03em** di semua tipe display. Ini yang membuat judul
   terlihat rapat dan disengaja.
3. **Leading 1.06 pada judul, 1.6 pada body.** Kontras ritme yang tajam: judul padat,
   badan teks lapang.

## Token lain

| Kategori | Nilai dominan |
|---|---|
| Radii | 50px (tombol pill), 60px dan 32px (kartu) |
| Ritme seksi | 136px, 80px |
| Gap komponen | 12px, 16px, 24px, 32px |
| Lebar konten | 1064px |
| Tombol | latar tinta gelap, teks terang, radius 50px, bobot 500, tanpa tracking |

## Warna: sengaja tidak diambil

Palet mereka adalah tinta coklat-hitam `rgb(46,25,25)` dengan aksen limau pucat
`rgb(236,247,189)`. Itu identitas mereka. Memindahkannya ke UNIBA bukan hanya soal etika
merek, tapi merugikan: navy dan emas adalah aset pengenalan UNIBA yang sudah dibangun, dan
menggantinya dengan palet kampus lain justru menghapus keunggulan itu.

Yang diambil dari sisi warna hanya **pendekatannya**: satu tinta gelap dominan, satu aksen
tunggal, sisanya netral. UNIBA sudah menjalankan pola itu dengan navy dan emas.

## Yang diterapkan ke halaman kampanye

- Tracking display `-0.03em` sebagai token, dipakai di h1 dan SectionHeading.
- Leading judul 1.06, leading body 1.6.
- Bobot judul turun dari 800 ke 600.
- Radius tombol menjadi pill, mengikuti 50px.

Yang **tidak** diterapkan: jenis huruf, palet warna, tata letak, dan komponen mereka.
