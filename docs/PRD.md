# PRD Website Resmi UNIBA Surakarta

> Transkripsi Markdown dari PDF "PRD (Product Requirement Document) Website Uniba" (21 halaman). Isi dipertahankan apa adanya; hanya format yang disesuaikan. Gambar jadwal di halaman 13 ditulis ulang sebagai tabel.

Sep 28, 2026 · Lazuardi Fikhirudin Leonard

> Vendor membangun ulang uniba.ac.id dengan Next.js dan Payload CMS dalam 3 minggu sampai siap tayang, dengan harga tetap sesuai proposal 24 September 2026. Situs tayang setelah seluruh konten wajib dari UNIBA lengkap. Dokumen ini menggantikan proposal untuk lingkup, jadwal, termin, dan kriteria penerimaan. Dari proposal, yang tetap berlaku hanya nilai pekerjaan. Bila ada selisih, yang berlaku adalah dokumen ini. Kedua pihak menandatangani dokumen ini paling lambat akhir minggu 1, sebelum gerbang M1. Sejak ditandatangani, dokumen ini menjadi acuan "yang disepakati" untuk penerimaan pekerjaan dan garansi. Rincian teknis ada di tab Lampiran Teknis.

## Latar belakang dan tujuan

Situs uniba.ac.id sekarang lambat, sering tumbang saat PMB, dan pernah disusupi spam judi online. Situs baru dirancang agar cepat dan jauh lebih sulit disusupi, tanpa biaya langganan keamanan tambahan. Karena halaman publik disajikan dari cache Cloudflare, situs juga lebih tahan saat pengunjung melonjak. Waktu aktif dan kapasitas pengunjung tidak dijanjikan (lihat Kebutuhan non-fungsional).

Kondisi situs lama saat diperiksa pada 28 September 2026:

- WordPress 7.1.2 dengan tema Enfold serta plugin Yoast, LiteSpeed Cache, Shield, Popup Builder, dan Akismet, di hosting Exabytes. Halaman HTML tidak di-cache Cloudflare, sehingga setiap kunjungan membebani server (waktu respons awal 1,6–2,3 detik).
- 133 berita, 46 halaman, 513 berkas media.
- Google masih mengindeks URL spam di situs utama (`/produk/slot-…`) dan di beberapa subdomain.

Tujuan yang diukur di Bagian Kebutuhan non-fungsional:

1. Halaman publik disajikan dari cache Cloudflare, sehingga lonjakan PMB hampir tidak membebani server.
2. Skor Lighthouse ponsel ≥ 90 untuk performa dan aksesibilitas.
3. Tidak ada plugin pihak ketiga dan tidak ada panel admin yang terbuka ke internet.
4. Staf UNIBA bisa menerbitkan dan memperbarui konten sendiri, tanpa vendor.

## Pengguna dan hak akses

Pengunjung utama situs adalah calon mahasiswa dan orang tua, mahasiswa, dosen dan staf, serta mitra dan alumni. Panel admin punya tiga peran. Semua akun masuk lewat Cloudflare Access (kode sekali pakai ke email kampus), lalu memakai kata sandi Payload. Email kampus berarti alamat @uniba.ac.id atau @uibs.ac.id. Jumlahnya paling banyak 50 akun, sesuai batas paket gratis Cloudflare Access, dan kuota itu ikut terpakai oleh pengguna Access UNIBA yang sudah ada.

| Aksi | Admin utama | Admin prodi | Penulis |
|---|---|---|---|
| Menyunting dan menerbitkan halaman prodi miliknya | Ya | Ya | Tidak |
| Menyunting halaman prodi lain | Ya | Tidak | Tidak |
| Mengunggah dan menerbitkan dokumen Arsip milik prodinya | Ya | Ya | Tidak |
| Mengunggah dokumen Arsip milik universitas atau fakultas | Ya | Tidak | Tidak |
| Menulis berita dan pengumuman | Ya | Ya, wajib ditandai salah satu prodinya | Ya, sebagai draf |
| Menerbitkan berita dan pengumuman | Ya | Ya, miliknya sendiri; langsung tampil di beranda | Tidak; draf ditandai "Siap ditinjau" untuk admin utama |
| Menyunting dan menurunkan berita serta dokumen miliknya sendiri | Ya | Ya | Tidak |
| Menurunkan (unpublish) konten siapa pun | Ya | Tidak | Tidak |
| Menghapus berita, dokumen Arsip, dan media | Ya | Tidak | Tidak |
| Profil, fakultas, beranda (page builder), halaman statis | Ya | Tidak | Tidak |
| Menu, footer, pengaturan situs (termasuk URL PMB), pengalihan URL | Ya | Tidak | Tidak |
| Mengelola akun pengguna | Ya | Tidak | Tidak |

Satu akun admin prodi bisa memegang lebih dari satu prodi. Tidak ada peran admin fakultas; halaman fakultas dikelola admin utama. UNIBA memegang paling sedikit dua akun admin utama atas nama dua orang berbeda (mis. Humas dan Biro TI).

## Lingkup: templat halaman

Proposal menyebut 8 jenis halaman. PRD ini menambahkan Arsip Dokumen sehingga menjadi 9 jenis, yang dibangun sebagai 14 templat di bawah. Jumlah halaman jadi boleh bertambah tanpa batas, tetapi templat baru di luar daftar ini adalah pekerjaan tambahan.

| # | Templat | Pola URL | Jumlah awal |
|---|---|---|---|
| 1 | Beranda (page builder) | `/` | 1 |
| 2 | Profil | `/profil/<slug>` | Sejarah, Visi Misi, Pimpinan, Akreditasi |
| 3 | Fakultas | `/fakultas/<slug>` | 4 |
| 4 | Program studi | `/prodi/<slug>` | 11 (9 S1, 2 S2) |
| 5 | Daftar berita, dengan filter kategori dan tahun | `/berita` | 1 |
| 6 | Isi berita | `/berita/<slug>` | 133 hasil migrasi |
| 7 | Daftar pengumuman, dengan filter kategori dan tahun | `/pengumuman` | 1 |
| 8 | Isi pengumuman | `/pengumuman/<slug>` | — |
| 9 | Halaman statis | `/<slug>`, mis. `/kontak`, `/mbkm`, `/kebijakan-privasi` | Kontak saat tayang |
| 10 | Pendaftaran | `/pendaftaran` | 1 |
| 11 | Arsip Dokumen, dengan filter kategori, unit, tahun | `/arsip` | 1 |
| 12 | Hasil pencarian, termasuk keadaan "tidak ada hasil" | `/cari?q=` | 1 |
| 13 | Halaman tidak ditemukan | (404) | 1 |
| 14 | Halaman galat server | (500) | 1 |

Program studi mencakup 9 S1 dan 2 S2: FEB (S1 Manajemen, S1 Akuntansi, S2 Magister Manajemen), FH (S1 Ilmu Hukum, S2 Magister Hukum), FP (S1 Agroteknologi, S1 Agribisnis, S1 Peternakan), FT (S1 Teknik Industri, S1 Teknik Sipil, S1 Informatika). Pascasarjana dan RPL tidak punya halaman sendiri. RPL cukup disebut dalam teks prodi terkait.

## Beranda: page builder dengan 18 blok

Admin utama menyusun beranda dari 18 blok: menambah, mengurutkan, dan menyembunyikan blok. Admin tidak mengatur warna, huruf, atau kolom; tampilan setiap blok mengikuti DESIGN.md. Isi setiap blok disimpan di dalam blok itu sendiri. Page builder hanya berlaku di beranda; halaman lain memakai templat tetap.

| # | Blok | Yang diisi admin | Catatan |
|---|---|---|---|
| 1 | Hero | Gambar, judul, subjudul, tombol ajakan | Latar langit hanya di sini |
| 2 | Teks + gambar | Judul, teks, gambar, posisi gambar kiri/kanan | |
| 3 | Statistik | 2–6 angka dengan label | |
| 4 | Jalur pendaftaran | Kartu: nama jalur, ringkasan, tautan | |
| 5 | Berita dan pengumuman terbaru | Jenis yang ditampilkan (berita, pengumuman, atau keduanya), jumlah | Otomatis dari semua yang terbit, termasuk dari admin prodi; bisa dipasang lebih dari sekali (mis. satu untuk berita, satu untuk pengumuman) |
| 6 | Grid fakultas dan prodi | — | Otomatis dari data fakultas dan prodi |
| 7 | Banner ajakan | Teks, tombol, gambar latar | |
| 8 | Video YouTube | Tautan video, judul | Dimuat hanya setelah diklik |
| 9 | Logo akreditasi dan mitra | Daftar logo dengan tautan | |
| 10 | Sambutan Rektor | Foto, kutipan, tautan ke halaman lengkap | |
| 11 | Prestasi | Kartu: judul, gambar, keterangan, tautan | |
| 12 | Agenda | Daftar acara: tanggal, judul, tempat, tautan | Daftar manual, bukan sistem kalender; acara yang lewat tanggal langsung disembunyikan di peramban pengunjung dan hilang dari HTML paling lambat 24 jam kemudian |
| 13 | Galeri foto | Foto dengan keterangan | |
| 14 | Testimoni alumni | Foto, nama, angkatan, kutipan | |
| 15 | FAQ | Pertanyaan dan jawaban | Tampil sebagai akordeon |
| 16 | Tautan layanan | SIAKAD, jurnal, SLiMS, repository, PMB, dan tautan lain | |
| 17 | Peta dan kontak | Alamat, telepon, email, peta Google Maps | Peta dimuat hanya setelah diklik |
| 18 | Hitung mundur PMB | Tanggal batas, teks, tombol | Disembunyikan di peramban pengunjung tepat saat tanggal lewat, dan hilang dari HTML paling lambat 24 jam kemudian |

Umpan Instagram tidak disediakan: skripnya berasal dari pihak ketiga, melanggar aturan keamanan skrip (CSP), dan memperlambat halaman.

## Kebutuhan fungsional per templat

Setiap templat di bawah harus berjalan di situs pra-tayang sebelum Termin 2. Setiap kalimat yang memakai kata "harus" di bagian ini adalah kriteria penerimaan.

### Profil, fakultas, dan program studi

- Isi halaman profil, fakultas, dan prodi berupa teks kaya (rich text): judul bagian, paragraf, daftar, gambar, tautan, sematan video YouTube, dan lampiran berkas. Tabel tetap disediakan, tetapi tidak menjadi kriteria penerimaan karena fitur tabel di Payload masih berlabel eksperimental. Dosen, kurikulum ringkas, prospek kerja, dan akreditasi ditulis sebagai teks kaya, bukan data terstruktur.
- Halaman fakultas harus menampilkan daftar prodinya secara otomatis.
- Halaman prodi harus mencantumkan jenjang dan fakultasnya, lalu menampilkan otomatis dokumen Arsip milik prodi itu serta berita dan pengumuman yang ditandai prodi itu.
- Setiap halaman di bawah beranda menampilkan remah roti (breadcrumb).

### Berita dan pengumuman

- Berita dan pengumuman disimpan dalam satu koleksi dengan kolom: judul, slug, jenis (berita atau pengumuman), tanggal terbit, gambar utama, ringkasan, isi, kategori, dan prodi (opsional).
- Halaman daftar diurutkan dari yang terbaru, 12 per halaman, dengan filter kategori dan tahun.
- Kategori dikelola admin utama. Kategori awal adalah Info Kampus dan ULD, keduanya hasil migrasi.

### Halaman statis

- Admin utama membuat halaman statis sendiri lewat editor teks kaya, dengan lampiran berkas (PDF, DOCX, XLSX), tautan internal, sematan video YouTube, dan peta Google Maps yang dimuat setelah diklik.
- Setiap halaman punya slug dan induk opsional untuk remah roti. Kebijakan Privasi dibuat sebagai halaman statis dengan naskah dari Humas.

### Pendaftaran

- Halaman pengantar PMB punya tombol utama ke URL yang diatur di pengaturan situs, dengan nilai awal `https://pmb.uniba.ac.id/`. Mengganti tujuan tombol tidak memerlukan perubahan kode.
- Halaman ini juga punya tombol WhatsApp untuk calon mahasiswa S2, dengan nomor yang diatur di pengaturan situs.
- Halaman ini tidak menampilkan angka biaya. Sistem PMB tidak diubah.
- Klik tombol utama mengirim event `pmb_portal_click` ke Google Tag Manager; vendor menyiapkan kontainer GTM dengan tag GA4, sehingga klik itu tercatat di laporan GA4.

### Arsip Dokumen

- Setiap dokumen punya judul, kategori (Akreditasi, SK/Peraturan, Laporan, Formulir, Lainnya), unit pemilik (universitas, satu fakultas, atau satu prodi), tahun, dan satu berkas PDF berukuran paling besar 10 MB.
- Halaman `/arsip` menampilkan semua dokumen dengan filter kategori, unit, dan tahun. Semua dokumen terbuka untuk umum, tanpa login.
- Arsip menggantikan halaman Unduhan situs lama.

### Pencarian

- Pencarian mencakup judul dan isi berita, pengumuman, halaman statis, profil, fakultas, prodi, dan dokumen Arsip, termasuk teks di dalam PDF.
- Pencarian toleran salah ketik: kata kunci "manajmen" harus menemukan halaman Manajemen, dan "agroteknlogi" menemukan Agroteknologi.
- Hasil dikelompokkan per jenis konten, dengan halaman "tidak ada hasil" yang menyarankan tautan populer.
- PDF hasil pindaian (gambar tanpa lapisan teks) tidak bisa dicari karena tidak ada OCR.

### Navigasi, SEO, dan analitik

- Menu utama (dua tingkat) dan footer (tautan, kontak, media sosial) diatur admin utama di CMS. Menu ponsel tersedia.
- Setiap halaman punya judul dan deskripsi meta serta gambar Open Graph (bawaan situs atau gambar halaman). `sitemap.xml` dan `robots.txt` dibuat otomatis.
- Situs memakai alamat kanonik https://uniba.ac.id tanpa www (alamat www dialihkan 301 ke alamat yang sama tanpa www), atribut bahasa `lang="id"`, dan data terstruktur CollegeOrUniversity, NewsArticle, serta BreadcrumbList.
- Google Search Console diverifikasi sebagai properti Domain lewat DNS, lalu sitemap dikirim saat tayang.
- Google Tag Manager dan GA4 milik akun Google kampus. Bila properti GA4 situs lama (G-7B4L0H41QZ) dikuasai UNIBA, properti itu dipakai lagi agar riwayat data tidak putus. Tidak ada Meta Pixel dan tidak ada banner persetujuan cookie saat tayang.

### Kontak dan formulir

- Tidak ada formulir bawaan situs. Halaman Kontak memuat alamat, telepon, email, WhatsApp, dan peta; formulir Google yang sudah ada tetap berupa tautan.

## CMS dan alur kerja editorial

Konten ditulis sebagai draf, dipratinjau, lalu diterbitkan. Perubahan yang diterbitkan harus tampil di situs publik paling lambat 5 menit setelah tombol Terbitkan diklik. Batas yang sama berlaku saat konten diturunkan atau dihapus.

- **Draf dan terbit.** Semua koleksi mendukung draf. Penulis menandai drafnya "Siap ditinjau"; admin utama melihat daftar draf berstatus itu di panel admin lalu menerbitkannya. Tidak ada notifikasi email atau WhatsApp otomatis.
- **Pratinjau.** Admin bisa melihat halaman persis seperti nanti tampil sebelum menerbitkannya.
- **Riwayat versi.** Setiap simpanan tercatat; admin bisa melihat versi lama dan memulihkannya.
- **Tanpa penjadwalan.** Tidak ada fitur terbit terjadwal, jadi konten diterbitkan secara manual.
- **Unggahan.** Gambar diperkecil dan dikompres otomatis saat diunggah. Berkas lampiran dan PDF Arsip paling besar 10 MB, untuk menjaga kuota penyimpanan 1 GB (lihat Lampiran Teknis).
- **Akun.** Admin utama membuat dan menonaktifkan akun di Payload serta mengatur ulang kata sandinya. Biro TI menambahkan atau mencabut email akun itu di daftar Cloudflare Access; langkahnya ada di panduan admin. Tidak ada layanan email pengiriman; kode masuk dikirim oleh Cloudflare Access.
- **Penguncian login.** Akun terkunci 10 menit setelah 5 kali salah kata sandi berturut-turut.

## Migrasi konten dan pengalihan URL

Vendor memindahkan seluruh 133 berita situs lama secara otomatis, apa adanya. Setiap URL di sitemap lama (±192) serta setiap pola di peta pengalihan harus berakhir di halaman baru (301) atau dinyatakan hilang permanen (410). URL lama lain menampilkan halaman 404 situs baru; admin utama bisa menambah pengalihannya sendiri di CMS.

### Yang dimigrasikan

- 133 berita (1 Februari 2021 – 24 September 2026) menjadi berita, dengan tanggal terbit asli, gambar utama, dan isi.
- Semua gambar di dalam berita dan gambar utamanya dipindahkan ke penyimpanan baru, sehingga tidak bergantung pada server lama.
- Kategori dipetakan: Info Kampus tetap Info Kampus, ULD tetap ULD, Uncategorized dan Tak Berkategori menjadi tanpa kategori. Empat kategori kosong tidak dibuat.
- Tag (55) tidak dimigrasikan.
- 25 gambar yang ditautkan dari `uibs.ac.id` sudah mati di sumbernya dan dihapus dari berita terkait.
- 46 halaman WordPress tidak dimigrasikan. Halaman yang termasuk konten wajib dibangun ulang vendor dari naskah UNIBA; halaman lain dibuat admin UNIBA lewat CMS bila diperlukan.
- Skrip impor dijalankan ulang pada hari peluncuran dan hanya menambah berita yang terbit di situs lama selama pengerjaan; berita yang sudah diimpor tidak ditimpa dan tidak diterbitkan ulang. Karena itu, konten situs lama tidak perlu dibekukan selama pengerjaan.

### Peta pengalihan

| URL lama | Tujuan | Kode |
|---|---|---|
| `/<slug-berita>/` (133 berita) | `/berita/<slug>` | 301, dibuat otomatis |
| `/category/info-kampus/`, `/category/uld/` | `/berita?kategori=…` | 301 |
| Kategori dan tag lama lainnya | `/berita` | 301 |
| Halaman lama (44 di sitemap lama) | Sesuai daftar yang ditetapkan UNIBA | 301 |
| `/homepage/` | `/` | 301 |
| `/download/` | `/arsip` | 301 |
| `/wp-content/uploads/…` | Alamat yang sama di `lama.uniba.ac.id`, selama 30 hari | 302 |
| `/produk/*` (spam judi) | — | 410 |
| `/portfolio-item/*`, `/portfolio/*` (demo tema) | — | 410 |
| `/author/*` | — | 410 |

Vendor mengirim daftar 44 halaman lama dari sitemap sebagai bahan; UNIBA mengisi tujuan setiap halaman paling lambat akhir minggu 2, dan vendor memasukkannya ke CMS sebelum tayang. Halaman lama yang tidak diberi tujuan, atau tujuannya belum ada saat tayang, membalas 410 sampai admin utama mengisi tujuannya di CMS.

**Pemeriksaan penerimaan:** 133 dari 133 berita tampil dengan tanggal asli dan gambar (kecuali 25 gambar yang sudah mati), dan setelah tayang seluruh ±192 URL dari sitemap lama diuji: tidak ada URL terpetakan yang berakhir di 404.

## Desain

Tampilan memakai bahasa visual daftaruniba.site yang dibuat lebih formal untuk situs institusi. Vendor menulis DESIGN.md di minggu 1. Dokumen itu disetujui bersamaan dengan dua halaman staging (Beranda dan satu prodi), lalu menjadi acuan tetap. Perubahan tata letak setelah itu adalah permintaan perubahan.

| | Ketentuan |
|---|---|
| Dipertahankan | Palet navy `#0f2c59` (turunannya `#003366`, `#081a37`) dan biru langit (`#38bdf8`, `#0369a1`, `#eaf4fd`); huruf Geist; kartu bersudut membulat; komponen tombol |
| Dikurangi | Animasi kartu memantul diganti satu gerak muncul-naik 300 ms, mati bila pengguna memilih kurangi gerak; tanpa kemiringan 3D; latar langit hanya di hero beranda; bayangan lebih tipis dengan garis tepi halus; huruf miring Instrument Serif hanya di judul hero |
| Ditambah | Logo vektor resmi dari Humas; tekstur batik halus untuk footer dan pemisah bagian; foto kampus asli dari Humas |

Kontras warna teks pada templat (bukan isi yang dimasukkan admin) harus memenuhi WCAG 2.1 AA, dan semua templat harus rapi pada lebar layar 360 px, diperiksa dengan konten contoh. Isi yang dimasukkan admin dan berita hasil migrasi apa adanya tidak termasuk dalam pemeriksaan ini. Tabel lebar di dalam isi boleh digulir di dalam kotaknya sendiri.

## Keamanan

Situs memakai lapisan keamanan dasar tanpa biaya langganan tambahan. Audit, uji penetrasi, dan WAF berbayar tidak termasuk. Keamanan subdomain lain (fakultas, lembaga, jurnal, SLiMS, repository) di luar lingkup; pembersihan spam di sana berjalan terpisah. Situs, database, berkas, dan backup disimpan di Singapura (Google Cloud dan Supabase), di luar Indonesia.

### Yang dipasang

| Perlindungan | Keterangan |
|---|---|
| Tanpa plugin pihak ketiga | Plugin Payload hanya dari paket resmi tim Payload (`@payloadcms/*`): penyimpanan S3, SEO, dan pengalihan. Pustaka npm biasa (mis. pengekstrak teks PDF) boleh dipakai; versinya dikunci lewat lockfile, dan saat serah terima `npm audit` tidak menunjukkan temuan tinggi atau kritis yang sudah ada perbaikannya |
| Container yang tidak bisa diubah | Berkas yang disisipkan penyerang tidak bertahan; setiap deploy ulang memulai dari image bersih |
| Panel admin tertutup | `/admin`, `/api`, dan `/preview` di balik Cloudflare Access: kode sekali pakai ke email kampus sebagai faktor kedua, lalu kata sandi Payload dengan penguncian. Aplikasi juga memeriksa token Access sendiri, sehingga jalur langsung ke Cloud Run (alamat `run.app`) tetap tertutup |
| Header keamanan | Content-Security-Policy, Permissions-Policy, Referrer-Policy `strict-origin-when-cross-origin`, X-Content-Type-Options `nosniff`, HSTS 1 tahun |
| Cloudflare paket gratis | SSL, perlindungan DDoS, Bot Fight Mode, dan satu aturan pembatas laju untuk halaman pencarian |
| Backup harian | Database dan berkas ke Google Cloud Storage, disimpan 30 hari; uji pemulihan sekali sebelum M3. Pemulihan mengembalikan data ke backup terakhir, paling lama ± 24 jam sebelumnya |
| Google Search Console | Properti Domain memberi peringatan bila halaman spam muncul di uniba.ac.id atau subdomainnya |

### Kompromi yang disepakati

- CSP mengizinkan skrip inline (`'unsafe-inline'`). CSP berbasis nonce memaksa semua halaman dirender ulang di server dan tidak bisa di-cache Cloudflare, padahal cache itulah penangkal situs tumbang. Mitigasi: tidak ada skrip pihak ketiga selain Google Tag Manager, tidak ada HTML kiriman pengunjung, dan direktif CSP lainnya ketat, kecuali gaya inline yang dibutuhkan Next.js dan panel Payload.
- HSTS tanpa `includeSubDomains`, karena belum semua subdomain dipastikan melayani HTTPS.
- Admin prodi menerbitkan langsung ke beranda. Mitigasi: Access dan penguncian login, admin utama bisa menurunkan konten kapan saja, dan riwayat versi menyimpan setiap perubahan.

### Sengaja tidak diambil

| Tidak diambil | Risiko yang tersisa | Kalau nanti dibutuhkan |
|---|---|---|
| Audit keamanan dan uji penetrasi | Celah di kode buatan sendiri tidak diuji pihak ketiga | Pekerjaan terpisah, kapan saja |
| WAF berbayar (Cloud Armor) dan Load Balancer | Serangan yang lolos Cloudflare langsung sampai ke aplikasi | Bisa ditambahkan tanpa membangun ulang situs |
| Cloudflare Pro | Aturan WAF dan perlindungan bot seadanya | Cukup naik paket, tanpa perubahan kode |
| Uji beban sebelum PMB | Belum ada angka kapasitas pengunjung | Sebaiknya dijadwalkan sebelum gelombang PMB berikutnya |
| Pemantauan keamanan berkelanjutan | Penyusupan bisa berjalan berhari-hari tanpa ketahuan | Termasuk kontrak perawatan setelah garansi |

## Kebutuhan non-fungsional dan kriteria penerimaan

Pekerjaan diterima bila target di bawah terpenuhi di situs pra-tayang dengan konten yang sudah diterima. Vendor tidak menjanjikan waktu aktif (uptime) maupun angka kapasitas pengunjung, karena uji beban tidak termasuk. Penurunan skor setelah tayang akibat konten yang diunggah UNIBA bukan bug.

| Kebutuhan | Target | Cara mengukur |
|---|---|---|
| Performa | Lighthouse ponsel, Performance ≥ 90 | Lighthouse di Chrome stabil terbaru (perangkat Mobile, throttling bawaan, cache Cloudflare sudah terisi), median 3 kali uji, dijalankan vendor bersama PIC. Halaman uji (Beranda, satu prodi, satu berita) dipilih bersama saat M2. Bila naskah asli belum ada, dipakai konten contoh dengan panjang dan gambar setara |
| Aksesibilitas | Lighthouse ponsel, Accessibility ≥ 90; kontras teks templat WCAG 2.1 AA | Cara dan halaman yang sama |
| Tampilan ponsel | Semua templat rapi di lebar 360 px, tanpa gulir menyamping | Diperiksa dengan konten contoh |
| Peramban | Dua versi terakhir Chrome, Safari, Firefox, dan Edge di komputer, serta Chrome Android dan Safari iOS di ponsel | Uji manual semua templat |
| Kesegaran konten | Terbit, turun, atau hapus tampil ≤ 5 menit | Terbitkan lalu turunkan satu berita; periksa beranda, daftar berita, dan halaman berita |
| Kemandirian admin | Staf UNIBA bisa bekerja tanpa vendor | Dalam sesi pelatihan, satu peserta tiap peran menyelesaikan tanpa bantuan: admin utama menyusun ulang blok beranda, mengubah menu, dan membuat akun; admin prodi menyunting halaman prodi, menerbitkan satu berita, dan mengunggah satu PDF Arsip; penulis membuat satu draf "Siap ditinjau" |
| Waktu aktif dan kapasitas | Tidak dijanjikan | — |

### Gerbang penerimaan

| Gerbang | Waktu | Kriteria | Akibat |
|---|---|---|---|
| M1: Dua halaman | Akhir minggu 1 | Beranda dan satu prodi tampil di staging sesuai DESIGN.md; DESIGN.md diserahkan | Persetujuan PIC |
| M2: Situs lengkap | Akhir minggu 2 | Di situs pra-tayang: 14 templat berjalan; 18 blok bisa dipakai; matriks peran berlaku; Arsip dan pencarian (termasuk isi PDF dan salah ketik) berjalan; 133 berita termigrasi dengan pengalihan 301; konten wajib yang diterima sebelum batas minggu 2 sudah dimasukkan; halaman uji Lighthouse dan blok beranda yang wajib terisi sudah ditetapkan | Persetujuan PIC, lalu **Termin 2 (30%)** |
| M3: Siap tayang | Akhir minggu 3 | Revisi M1 dan M2 selesai; header keamanan dan Access aktif, dan `/admin` lewat alamat `run.app` ditolak; backup harian berjalan dan uji pemulihan berhasil; keep-alive, pemantauan, dan peringatan anggaran aktif; target di tabel atas tercapai; pelatihan dan panduan admin selesai. Konten yang belum diterima atau pelatihan yang tertunda karena jadwal UNIBA tidak menahan M3; keduanya diselesaikan sebelum tayang | Status "siap tayang"; hitungan 30 hari menuju Termin 3 dimulai sejak M3 disetujui atau dianggap disetujui |
| Tayang | Setelah semua konten wajib lengkap | `uniba.ac.id` dan `www` diarahkan ke situs pra-tayang; uji asap lolos; peta pengalihan diuji; sitemap dikirim ke Search Console; subdomain fakultas dialihkan | **Termin 3 (20%)**, bila belum jatuh tempo lebih dulu; garansi 30 hari dimulai |

## Jadwal, termin, dan tata kelola

Pengerjaan berlangsung 3 minggu sejak T0 sampai siap tayang. Tanggal tayang bergantung pada kelengkapan konten wajib dari UNIBA.

**Tiga minggu sampai siap tayang; tayang menunggu konten wajib UNIBA.** Hitungan dimulai di T0: kontrak ditandatangani, Termin 1 dibayar, akses akun cloud diberikan.

| Tahap | Pekerjaan | Gerbang di akhir tahap |
|---|---|---|
| T0 | — | Termin 1 (50%) |
| Minggu 1 | Akun dan akses cloud; model konten, peran; DESIGN.md; Beranda + 1 prodi tampil di staging | M1 · 2 halaman (disetujui PIC) |
| Minggu 2 | 14 templat, 18 blok; Arsip dan pencarian; migrasi 133 berita; pengalihan URL; konten awal dimuat | M2 · Situs lengkap (Termin 2, 30%) |
| Minggu 3 | Revisi (maks. 2x); keamanan dan Access; backup dan keep-alive; pemantauan; pelatihan admin | M3 · Siap tayang (30 hari berjalan) |
| Tayang (lama bergantung konten) | Setelah konten wajib UNIBA lengkap; DNS dialihkan; uji asap, sitemap; garansi 30 hari mulai | Tayang (Termin 3, 20%) |

Termin 3 jatuh tempo saat tayang atau 30 hari setelah siap tayang, mana yang lebih dulu. Lamanya tahap Tayang bergantung pada kelengkapan konten dan tanggal tayang yang dipilih PIC. *(Jadwal pengerjaan · 3 minggu, 4 gerbang, 3 termin.)*

Garis waktu dihitung dalam minggu kalender sejak T0. Hanya bagian setelah M3 yang lamanya bergantung pada UNIBA.

### Tata kelola

- **T0** adalah tanggal paling akhir dari: kontrak ditandatangani, Termin 1 (50%) dibayar, dan akses akun Cloudflare, Google Cloud, serta Supabase diberikan ke vendor.
- **Lingkungan:** `staging.uniba.ac.id` dipakai vendor untuk uji. Mulai minggu 2, situs produksi dibuka di `baru.uniba.ac.id` di balik Access; di situs pra-tayang inilah konten dimasukkan, gerbang M2 dan M3 ditinjau, dan pelatihan dilakukan. Saat tayang, `uniba.ac.id` diarahkan ke situs yang sama, sehingga konten tidak perlu dipindah.
- **Termin:** 50% saat kontrak; 30% saat gerbang M2 disetujui; 20% saat tayang atau 30 hari setelah M3 disetujui (atau dianggap disetujui), mana yang lebih dulu, apa pun penyebab situs belum tayang. Nominal dan PPN diatur dalam kontrak.
- **Pengajuan dan keputusan:** vendor mengajukan gerbang lewat email kepada PIC, berisi tautan dan daftar kriteria. PIC memutuskan paling lambat 3 hari kerja (Senin–Jumat di luar libur nasional). Bila PIC tidak menjawab dalam batas itu, gerbang dianggap disetujui. Penolakan harus menyebut kriteria gerbang yang belum terpenuhi.
- **Revisi:** paling banyak 2 putaran per gerbang. Satu putaran adalah satu daftar masukan tertulis dari PIC lewat email; masukan pihak lain disalurkan lewat PIC. Vendor menyelesaikannya dalam 3 hari kerja lalu mengajukan ulang. Revisi adalah perubahan di dalam desain dan lingkup yang sudah disetujui. Setelah putaran kedua, gerbang disetujui bila kriterianya terpenuhi; permintaan lain dicatat sebagai permintaan perubahan. Selama masa tinjau, vendor melanjutkan pekerjaan minggu berikutnya.
- **Permintaan perubahan:** dihitung terpisah. Vendor memberi perkiraan biaya dan waktu secara tertulis, dan pekerjaan dimulai setelah disetujui tertulis oleh pejabat yang ditunjuk pimpinan UNIBA.
- **Keterlambatan dari UNIBA** (akun, akses, bahan dan naskah, keputusan, jadwal pelatihan) menggeser gerbang yang bergantung padanya sebanyak hari keterlambatannya.
- **Komunikasi:** tautan staging atau pra-tayang dikirim di akhir setiap minggu. Percakapan harian lewat satu grup WhatsApp; pengajuan gerbang dan daftar revisi lewat email.

## Kewajiban UNIBA

Jadwal 3 minggu hanya berlaku bila kebutuhan di bawah tersedia tepat waktu. Setiap keterlambatan menggeser gerbang yang bergantung padanya sebanyak hari keterlambatannya. Harga tetap, dan nominalnya diatur dalam kontrak.

| Kebutuhan | Batas waktu | Penanggung jawab |
|---|---|---|
| Perpanjang domain uniba.ac.id di Exabytes (kedaluwarsa Oct 31, 2026) | Sebelum T0 | Biro TI |
| Akun Google Cloud dengan penagihan aktif, serta dua organisasi Supabase atas nama kampus yang terpisah dari proyek portal PMB (produksi, dengan metode pembayaran siap untuk naik ke Pro; dan staging), dimiliki akun kampus yang tidak memegang proyek gratis Supabase lain; vendor menjadi anggota, di Supabase dengan peran Developer di keduanya | T0 | Biro TI |
| Akses anggota vendor ke akun Cloudflare milik UNIBA untuk zona uniba.ac.id, dan akun vendor sebagai pemilik terverifikasi uniba.ac.id di Google Search Console | T0 | Biro TI |
| Satu PIC yang memutuskan paling lambat 3 hari kerja | T0, sepanjang proyek | Pimpinan |
| Logo vektor resmi, foto kampus, dan foto pimpinan beresolusi memadai. Bila logo vektor tidak ada, dipakai berkas logo beresolusi tertinggi yang tersedia; menggambar ulang logo di luar lingkup | Awal minggu 1 | Humas |
| Akses akun Google kampus ke Google Tag Manager, GA4 (termasuk properti lama bila ada), dan Search Console | Minggu 1 | Biro TI dan Humas |
| Nama, email kampus, dan peran calon admin, termasuk paling sedikit dua admin utama | Minggu 1 | PIC |
| Naskah konten wajib dalam Word atau Google Docs | 3 hari kerja sebelum akhir minggu 2, agar dimuat vendor | Humas dan tiap prodi |
| Nomor WhatsApp PMB untuk calon mahasiswa S2 | Akhir minggu 2 | Tim PMB |
| Tujuan pengalihan untuk 44 halaman lama | Akhir minggu 2 | Biro TI dan Humas |
| Jadwal dan peserta pelatihan, paling sedikit satu orang tiap peran | Minggu 3 | PIC |
| Naskah Kebijakan Privasi | Disarankan sebelum tayang; tidak menahan tayang | Humas |
| Memasang situs lama di `lama.uniba.ac.id` (cPanel Exabytes dan pengaturan WordPress) setelah uji asap hari tayang, lalu mematikannya 30 hari kemudian | Hari tayang dan 30 hari setelahnya | Biro TI |
| Menyimpan backup lengkap WordPress fakultas (fe, fh, fp, ft) lalu mematikannya; record DNS keempatnya tetap ada dan ber-proxy agar pengalihan berjalan | Setelah tayang | Biro TI |
| Tetap membayar hosting Exabytes, karena email dan subdomain lain ada di sana | Setelah tayang | Biro TI |

Vendor memasukkan sekali naskah konten wajib (daftar di bawah) yang diterima paling lambat 3 hari kerja sebelum akhir minggu 2. Naskah yang datang setelah itu, serta konten lain (MBKM, halaman statis lain, dan seluruh dokumen Arsip), dimasukkan admin UNIBA sendiri lewat CMS. Setiap naskah dimuat vendor satu kali. Perbaikan sesudahnya dilakukan admin UNIBA sendiri. Blok beranda yang wajib terisi saat tayang ditetapkan PIC pada M2.

### Konten wajib sebelum tayang

- [ ] Beranda: foto hero asli dan isi blok yang dipakai
- [ ] Profil: Sejarah, Visi Misi, Pimpinan (dengan foto), Akreditasi
- [ ] 4 halaman fakultas
- [ ] 11 halaman prodi: deskripsi, kurikulum ringkas, prospek kerja, daftar dosen
- [ ] Kontak
- [ ] Pendaftaran
- [ ] 133 berita hasil migrasi (dikerjakan vendor)
- [ ] Tujuan pengalihan halaman lama

Tidak menahan tayang: MBKM, halaman statis lain, dokumen Arsip, dan Kebijakan Privasi (tetap berupa draf sampai naskahnya ada).

## Peluncuran dan pensiun situs lama

Peluncuran mengarahkan dua record DNS (apex dan www) di zona Cloudflare milik UNIBA ke situs yang sudah berjalan di `baru.uniba.ac.id`. Tanggal tayang dipilih PIC setelah M3 dan konten wajib lengkap: malam hari, di luar masa puncak PMB (bukan pada minggu penutupan gelombang pendaftaran), dan tidak bersamaan dengan perubahan DNS portal PMB.

Selama sertifikat Google diterbitkan (biasanya ± 15 menit, paling lama 24 jam), kedua record belum lewat proxy Cloudflare: halaman bisa gagal dibuka lewat HTTPS dan belum di-cache, sedangkan `/admin` dan `/api` tetap tertutup oleh aplikasi. Sehari sebelumnya TTL DNS diturunkan ke 60 detik, dan proses penerbitan sertifikat sudah diuji lewat `baru.uniba.ac.id`.

### Hari tayang

1. Jalankan ulang impor berita untuk menambah berita baru dari situs lama.
2. Arahkan record `uniba.ac.id` dan `www` ke Cloud Run; record lain (MX, webmail, dan semua subdomain) tidak disentuh. Setelah sertifikat terbit, proxy Cloudflare diaktifkan.
3. Uji asap: beranda, satu prodi, satu berita, pencarian, Arsip, login admin, dan contoh pengalihan URL.
4. Setelah uji asap lolos, Biro TI memasang situs lama di `lama.uniba.ac.id` di balik Cloudflare Access, hanya untuk staf; berkas `/wp-content/uploads/` di sana tetap terbuka untuk umum selama 30 hari.
5. Aktifkan pengalihan semua alamat di `fe`, `fh`, `fp`, dan `ft.uniba.ac.id`, termasuk path di bawahnya, ke halaman fakultas masing-masing.
6. Kirim sitemap ke Google Search Console dan jalankan uji ±192 URL lama.

**Pembatalan (rollback):** bila uji asap gagal dan tidak bisa diperbaiki dalam 1 jam, dua record DNS dikembalikan ke server lama, yang masih berjalan karena langkah 4 belum dikerjakan. Karena TTL sudah 60 detik, perubahan ini berlaku dalam hitungan menit.

### Setelah tayang

- Situs lama tetap di `lama.uniba.ac.id` selama 30 hari sebagai rujukan, lalu dimatikan Biro TI.
- Biro TI menyimpan backup lengkap WordPress fakultas lalu mematikannya; isinya tidak dimigrasikan. Record DNS `fe`, `fh`, `fp`, dan `ft` tetap ada dan ber-proxy, karena pengalihan Cloudflare hanya berjalan untuk hostname yang di-proxy.
- **Hosting Exabytes tidak boleh dihentikan:** email kampus (MX dan webmail) serta subdomain lain masih berjalan di sana.

## Garansi, perawatan, kepemilikan, dan serah terima

Vendor memperbaiki bug tanpa biaya selama 30 hari sejak tayang. Bug adalah fungsi yang tidak berjalan sesuai PRD ini, bukan permintaan perubahan desain atau fitur baru.

| Tingkat | Contoh | Tanggapan | Perbaikan |
|---|---|---|---|
| Kritis | Situs tidak bisa dibuka, penyusupan, atau data hilang karena kode atau konfigurasi vendor | 1 hari kerja | Perbaikan atau solusi sementara dalam 2 hari kerja |
| Mayor | Fitur rusak tanpa jalan lain | 2 hari kerja | 5 hari kerja |
| Minor | Tampilan atau teks templat keliru | Dikumpulkan | Paling lambat 10 hari kerja setelah dilaporkan |

Gangguan berikut bukan bug garansi, tetapi vendor tetap membantu mendiagnosisnya selama garansi: gangguan penyedia (Cloudflare, Google Cloud, Supabase); kuota atau jeda paket gratis bila naik paket belum disetujui; domain atau DNS di luar dua record situs; akun yang dibobol lewat kata sandi pengguna; dan tindakan admin. Perbaikan di luar kode vendor adalah pekerjaan tambahan. Data yang hilang dipulihkan dari backup harian terakhir; perubahan sesudah backup itu tidak dijamin kembali.

Laporan yang masuk selama 30 hari garansi tetap diselesaikan dengan batas waktu tingkatnya, walau jatuh setelah garansi berakhir. Pembaruan keamanan Next.js dan Payload yang terbit selama masa garansi termasuk garansi, terbatas pada rilis patch dan minor di jalur versi yang dikunci (Next.js 16.x, Payload 3.x); naik versi mayor seperti Payload 4 adalah pekerjaan tambahan. Pekerjaan hari-tayang (migrasi ulang, peralihan DNS, pengalihan subdomain fakultas, dan uji) termasuk harga bila tayang terjadi paling lambat 90 hari setelah M3 disetujui. Bila lewat dari 90 hari, pembaruan dependensi dan pendampingan tayang dihitung sebagai permintaan perubahan atau masuk kontrak perawatan. Garansi 30 hari tetap dihitung sejak tayang. Laporan masuk lewat satu grup WhatsApp dan email.

**Setelah garansi.** Situs perlu dirawat setiap bulan: pembaruan dependensi dan keamanan, pemeriksaan hasil backup, peninjauan Google Search Console, dan pemantauan kuota Supabase. Karena kode milik vendor, perawatan ini hanya bisa dikerjakan lewat kontrak perawatan terpisah dengan vendor. Bila UNIBA memilih tidak mengambilnya, risiko keamanan sejak garansi berakhir menjadi tanggungan UNIBA.

**Kepemilikan.** Kode sumber dan hak kekayaan intelektualnya milik vendor. UNIBA memegang kendali penuh atas akun (Cloudflare, Google Cloud, Supabase), domain, dan seluruh data: konten, media, database, dan backup. PRD ini tidak menjanjikan penyerahan kode sumber; lisensi pemakaian diatur dalam kontrak. Bila kontrak perawatan tidak diambil, Biro TI mencabut akses vendor ke Cloudflare, Google Cloud (termasuk jalur deploy), dan Supabase paling lambat 7 hari setelah garansi berakhir; image terakhir tetap tersimpan di Artifact Registry UNIBA.

**Pelatihan dan serah terima** (bagian dari gerbang M3):

- Satu sesi pelatihan daring langsung (Google Meet) selama 2 jam untuk admin utama, admin prodi, dan penulis, direkam untuk staf berikutnya.
- Panduan admin berbahasa Indonesia.
- Daftar akun dan peran: UNIBA sebagai pemilik, vendor sebagai anggota.
- Runbook: memulihkan dari backup, melanjutkan proyek Supabase yang terjeda, membatalkan peralihan DNS, dan menaikkan instance minimum saat musim PMB.
- Bukti uji pemulihan backup dan konfirmasi bahwa seluruh kredensial ada di tangan UNIBA.

## Di luar lingkup

Semua yang tidak tertulis di PRD ini adalah pekerjaan tambahan, termasuk:

- Versi bahasa Inggris, atau persiapan multibahasa.
- Formulir bawaan situs, terbit terjadwal, dan peran admin fakultas.
- Templat baru di luar 14 templat, dan page builder di halaman selain beranda.
- Umpan Instagram, OCR untuk PDF pindaian.
- Penulisan ulang atau penerjemahan konten, pemotretan, dan pembuatan video.
- Uji beban, audit keamanan, dan uji penetrasi.
- WAF berbayar (Cloud Armor), Load Balancer, dan Cloudflare Pro.
- Perubahan pada SIAKAD, jurnal, SLiMS, repository, dan sistem PMB, serta integrasi data dari sistem-sistem itu.
- Pembersihan spam dan pengamanan subdomain lain (pekerjaan ini sudah berjalan terpisah), serta migrasi isi situs WordPress fakultas (fe, fh, fp, ft).
- Domain `uibs.ac.id`.
- Perawatan setelah garansi 30 hari, kecuali lewat kontrak perawatan.

## Risiko dan asumsi

Risiko terbesar ada di luar kode: konten yang terlambat, domain yang hampir kedaluwarsa, dan batas paket gratis Supabase. Pemilik di tabel adalah penanggung jawab selama proyek dan masa garansi.

| Risiko | Dampak | Mitigasi | Pemilik |
|---|---|---|---|
| Domain kedaluwarsa Oct 31, 2026 | Situs, email, dan PMB mati | Diperpanjang sebelum T0 | Biro TI |
| Konten wajib terlambat | Tayang mundur, situs lama berjalan lebih lama | Termin 3 jatuh tempo 30 hari setelah M3; vendor memuat konten wajib yang masuk sebelum batas minggu 2 | Humas dan prodi |
| Supabase gratis: jeda setelah 7 hari tanpa aktivitas, tanpa backup bawaan, kuota 500 MB database, 1 GB berkas, 5 GB lalu lintas | Situs berhenti atau kuota penuh | Keep-alive dan backup harian ke GCS, peringatan kuota, naik ke Pro (US$25/bulan) saat pemicu tercapai | Biro TI |
| Admin prodi menerbitkan langsung ke beranda | Akun yang dibobol menampilkan konten di beranda | Access dan penguncian login; admin utama bisa menurunkan konten; riwayat versi | Admin utama |
| Lingkup bertambah dalam 3 minggu | Jadwal ketat | Batas 2 putaran revisi, persetujuan otomatis 3 hari kerja, permintaan perubahan tertulis | Vendor |
| Pemetaan domain Cloud Run masih berstatus Preview | Google menyatakan fitur ini belum siap produksi dan tidak disarankan untuk layanan produksi (tanpa SLA); perilakunya bisa berubah sewaktu-waktu | Cadangan: Cloudflare Worker (Workers Paid, US$5/bulan, dibayar UNIBA) tanpa membangun ulang situs; selama garansi diaktifkan vendor, setelah itu lewat kontrak perawatan | Vendor selama garansi, lalu Biro TI |
| CSP mengizinkan skrip inline | Perlindungan terhadap sisipan skrip lebih lemah | Tanpa skrip pihak ketiga selain Google Tag Manager, tanpa HTML kiriman pengunjung | Vendor |
| Tanpa uji beban | Kapasitas puncak PMB belum terbukti | Halaman publik dari cache Cloudflare; uji beban sebelum gelombang PMB berikutnya sebagai pekerjaan terpisah | UNIBA |
| Instance minimum 0 | Muat awal lambat di admin dan pencarian setelah sepi | Runbook: instance minimum 1 saat musim PMB (± Rp330 ribu/bulan) | Biro TI |
| Google masih mengindeks URL spam dan subdomain terinfeksi | Reputasi domain dan peringatan "situs diretas" | 410 untuk URL spam, properti Domain di Search Console, pembersihan subdomain yang sedang berjalan | Biro TI |
| Tanpa kontrak perawatan setelah garansi | Keamanan menurun dalam hitungan bulan | Kontrak perawatan dengan vendor | UNIBA |
| PP 33/2026 (turunan UU PDP) berlaku efektif awal 2027 | Mungkin perlu banner persetujuan dan kebijakan privasi baru | Tinjauan hukum awal 2027, termasuk penyimpanan data di Singapura | UNIBA |
| Perubahan DNS portal PMB di zona yang sama | Bentrok pada hari tayang | Dijadwalkan terpisah; tujuan tombol PMB diatur dari CMS | Vendor dan tim PMB |

### Asumsi

- 11 prodi terdiri atas 9 S1 dan 2 S2; kedua S2 berada di FEB (Magister Manajemen) dan FH (Magister Hukum); tidak ada halaman Pascasarjana atau RPL tersendiri.
- Staging tetap hidup setelah tayang, di balik Access dan tidak diindeks, untuk perawatan.
- Vendor memakai peran Developer di organisasi Supabase UNIBA, sehingga kuota 2 proyek gratis milik UNIBA tidak bentrok dengan proyek lain milik vendor.
- Perkiraan biaya memakai kurs ± Rp17.900 per US$ (JISDOR, 25 September 2026).
- Kebutuhan memori container diukur di minggu 1; perkiraan biaya Cloud Run disesuaikan bila ternyata perlu lebih dari 1 GiB.

## Daftar istilah

Daftar ini menjelaskan istilah teknis dalam kesepakatan di atas, supaya penanda tangan tahu persis apa yang mereka setujui.

| Istilah | Arti |
|---|---|
| Cache | Salinan halaman yang disimpan Cloudflare, sehingga pengunjung tidak membebani server |
| Purge | Menghapus salinan cache agar perubahan konten langsung tampil |
| Staging | Salinan situs untuk uji vendor, tertutup bagi umum |
| Situs pra-tayang | Situs produksi sebelum diresmikan, di `baru.uniba.ac.id`, tempat konten dimasukkan dan gerbang ditinjau |
| Gerbang (M1, M2, M3) | Titik pemeriksaan hasil kerja yang harus disetujui PIC |
| Termin | Tahap pembayaran |
| Slug | Bagian akhir alamat halaman, mis. `manajemen` pada `/prodi/manajemen` |
| Cloudflare Access | Pintu masuk panel admin yang meminta kode sekali pakai dari email sebelum kata sandi |
| CSP dan `'unsafe-inline'` | Daftar sumber skrip yang boleh berjalan di halaman; `'unsafe-inline'` berarti skrip yang ditulis langsung di halaman juga diizinkan |
| HSTS | Perintah agar peramban selalu memakai HTTPS untuk situs ini |
| Keep-alive | Kueri harian agar database paket gratis tidak dijeda |
| Instance minimum | Jumlah server yang selalu menyala walau sepi |
| Pemetaan domain (Preview) | Fitur Google yang menghubungkan uniba.ac.id ke Cloud Run; berstatus uji dan tanpa jaminan layanan |
| Uji asap | Pemeriksaan cepat fungsi utama setelah peralihan |
| 301, 302, 410, 404 | Kode alamat: pindah permanen, pindah sementara, dihapus permanen, tidak ditemukan |

## Persetujuan

Dengan menandatangani, para pihak menyetujui lingkup, kriteria penerimaan, jadwal, dan pembagian tanggung jawab dalam dokumen ini, termasuk bahwa risiko keamanan setelah garansi menjadi tanggungan UNIBA bila kontrak perawatan tidak diambil.

| Pihak | Nama | Jabatan | Tanda tangan | Tanggal |
|---|---|---|---|---|
| Vendor | Lazuardi Fikhirudin Leonard | Pelaksana | | |
| UNIBA | | PIC proyek | | |
| UNIBA | | Kepala Biro TI | | |

## Sumber

Dasar dokumen ini adalah proposal "Proposal Implementasi Website UNIBA — Paket Ringkas" (24 September 2026). Data situs lama dan batas layanan diperiksa pada 28 September 2026 dari halaman berikut.

- Situs lama: REST API WordPress uniba.ac.id, sitemap uniba.ac.id
- Payload: autentikasi, plugin resmi, adapter penyimpanan, draf dan versi, migrasi database
- Supabase: harga dan kuota, jeda proyek gratis, backup, koneksi Postgres, FAQ Supavisor
- Google Cloud: pemetaan domain Cloud Run, ingress Cloud Run, harga Cloud Run, kontrak container Cloud Run, anggaran dan peringatan, siklus hidup Cloud Storage, CSP untuk tag Google
- Cloudflare: perilaku cache bawaan, perilaku cache dan Set-Cookie, purge cache, pengalihan URL, Bot Fight Mode, batas Workers, aturan pembatas laju

*(Tautan asli sumber ada di PDF; tidak ikut tersalin.)*
