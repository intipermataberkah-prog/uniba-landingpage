# Arsitektur Website Resmi UNIBA Surakarta

> Transkripsi Markdown dari PDF "Arsitektur Website Resmi UNIBA Surakarta | Dokumen Teknis" (10 halaman). Isi dipertahankan apa adanya; hanya format yang disesuaikan.

Dokumen ini menjabarkan arsitektur teknis uniba.ac.id yang dibangun dengan Next.js dan Payload CMS. Lingkup produk dan kriteria penerimaan tetap mengacu pada PRD; dokumen ini menerjemahkannya menjadi keputusan di tingkat kode. Jika keduanya berbeda, PRD menjadi acuan untuk lingkup dan kriteria penerimaan, sedangkan dokumen ini menjadi acuan untuk cara membangunnya.

| | |
|---|---|
| **Tanggal** | 3 Oktober 2026 |
| **Status** | Disepakati setelah pembahasan arsitektur |
| **Bahasa kode** | Hibrida (lihat §16) |

## 1. Prinsip

1. **Sedikit komponen.** Satu aplikasi dan satu service. Makin sedikit yang berjalan, makin kecil peluang ada yang rusak dan makin murah perawatannya.
2. **Cache di tepi, bukan di aplikasi.** Halaman publik dirender dinamis, lalu di-cache oleh Cloudflare. Aplikasi tidak menyimpan cache apa pun yang harus konsisten antar-instance.
3. **Satu sumber kebenaran.** Matriks hak akses hanya ada di fungsi `access` Payload, aturan pengalihan hanya di koleksi `redirects`, dan konfigurasi situs hanya di global `site-settings`.
4. **Panel admin tertutup dari internet.** Tidak ada jalan masuk ke `/admin` tanpa melewati Cloudflare Access, termasuk melalui alamat `run.app`.
5. **Tanpa plugin pihak ketiga di Payload.** Hanya paket resmi `@payloadcms/*` yang dipakai, sedangkan pustaka npm biasa tetap boleh.
6. Akun, domain, dan data dimiliki UNIBA.

## 2. Gambaran sistem

```
Pengunjung ──HTTPS──▶ Cloudflare (Free)            ──▶ Cloud Run (Singapura)
                      • cache HTML (Cache Rules)        • Next.js 16 + Payload 3
                      • cache-tag purge saat terbit     • 1 service, max 3 instance
                      • Access (/admin,/api,/preview)   • proxy.ts (Node runtime)
                      • Bot Fight Mode, rate-limit /cari     │
Staf admin ──/admin──▶ Cloudflare Access ──JWT──▶ ──────────┤
                                                             ▼
                                         Supabase (Singapura, Free)
                                         • Postgres (via Supavisor sesi)
                                         • Storage S3 (bucket media publik)
                                                             │
Cloud Scheduler (harian) ─▶ Cloud Run Job ─▶ keep-alive + pg_dump + salin media ─▶ GCS (backup 30 hari)
```

Versi gambar diagram ini tersedia di tab Lampiran Teknis PRD. Komponennya terdiri atas Cloudflare, Cloud Run, Supabase, dan GCS, ditambah Sentry untuk pelaporan error serta GA4/GTM untuk analitik.

## 3. Stack dan versi terkunci

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Runtime | Node.js 22 (image `node:22-alpine`) | sama dengan portal PMB |
| Framework | Next.js 16.3.6 (min 16.3.5; peer Payload `>=16.3.3 <17`) | App Router; `output: 'standalone'` |
| CMS | Payload 3.90.x | tertanam di Next; Payload 4 masih uji → di luar lingkup |
| DB adapter | `@payloadcms/db-postgres` (Drizzle) | ke Supabase via pooler Supavisor |
| Storage | `@payloadcms/storage-s3` | endpoint S3 Supabase, bucket media publik |
| UI | Tailwind v4 + shadcn/radix + lucide-react | reuse token dari portal, komponen dibuat baru (§8, §16) |
| Bahasa | TypeScript 5 | |
| Plugin Payload | `@payloadcms/plugin-seo`, `@payloadcms/plugin-redirects`, `@payloadcms/storage-s3` | hanya paket resmi |

Pustaka di luar Payload yang dipakai adalah pengekstrak teks PDF (misalnya `pdf-parse` atau `unpdf`) dan `@sentry/nextjs`. Semua versi dikunci di lockfile. Saat serah terima, `npm audit` tidak boleh menunjukkan temuan tinggi atau kritis yang sebenarnya sudah ada perbaikannya.

## 4. Topologi aplikasi

Situs dibangun sebagai satu aplikasi Next.js dengan Payload tertanam di dalamnya, bukan dua service terpisah:

- Rute publik berada di route group `(site)`.
- Admin Payload dan route handler berada di route group `(payload)`, yang melayani `/admin` dan `/api`.
- Hanya ada satu `payload.config.ts`, satu image, dan satu service Cloud Run.
- Kode disimpan di satu repo pada GitHub org kampus, dengan vendor sebagai anggota (lihat bagian kepemilikan di PRD).

Pilihan ini mengikuti PRD yang meminta "satu layanan Cloud Run" dan menghindari repotnya mengoordinasikan dua deploy.

## 5. Struktur folder

```
src/
  app/
    (site)/                rute publik
      page.tsx             /                  (beranda: render global homepage)
      berita/              /berita, /berita/[slug]
      pengumuman/          /pengumuman, /pengumuman/[slug]
      prodi/[slug]/        /prodi/<slug>
      fakultas/[slug]/     /fakultas/<slug>
      profil/[slug]/       /profil/<slug>
      arsip/               /arsip
      cari/                /cari              (tak di-cache, rate-limited)
      [slug]/              halaman statis akar (/kontak, /mbkm, …)
      not-found.tsx  error.tsx     404 / 500
    (payload)/             admin & api Payload (dari template Payload)
  collections/             posts, pages, prodi, faculties, profil, arsip, media, redirects, search-index, users
  globals/                 header, footer, site-settings, homepage
  blocks/                  18 komponen blok beranda + config blocks-nya
  fields/                  slug, seoMeta, richText (config Lexical), unit-pemilik
  access/                  fungsi hak akses + access.check.ts  (satu titik kebenaran matriks)
  lib/                     util, cloudflare-purge, access-jwt, *.check.ts
  search/                  indexer.ts, query.ts, pdf-text.ts  + *.check.ts
  migrations/              migrasi Payload (di-commit)
  scripts/                 import-berita.ts (migrasi 133 berita) + import-berita.check.ts
payload.config.ts · proxy.ts · next.config.ts · Dockerfile · instrumentation.ts (Sentry)
```

## 6. Model data

### Koleksi

| Koleksi | Field inti | Akses tulis |
|---|---|---|
| `posts` | `title`, `slug`, `type` (berita\|pengumuman), `publishedAt`, `cover` (→media), `excerpt`, `content` (rich text), `category`, `prodi?` (→prodi), `tampilkanDiBeranda` (admin-utama) | admin-utama; admin-prodi (bertanda prodinya); penulis (draf) |
| `pages` | `title`, `slug`, `parent?`, `content` (rich text + lampiran), `seo` | admin-utama |
| `prodi` | `nama`, `slug`, `jenjang`, `faculty` (→faculties), `deskripsi`, `kurikulum`, `prospekKerja`, `dosen` (rich text) | admin-utama; admin-prodi (miliknya) |
| `faculties` | `nama`, `slug`, `deskripsi` | admin-utama |
| `profil` | `title`, `slug` (sejarah\|visi-misi\|pimpinan\|akreditasi), `content` | admin-utama |
| `arsip` | `judul`, `kategori`, `unit` (universitas\|fakultas\|prodi + ref), `tahun`, `file` (→media, ≤10 MB) | admin-utama; admin-prodi (unit prodinya) |
| `media` | upload (storage-s3), `alt` | semua peran (terbatas) |
| `redirects` | `from`, `to`, `type` (301\|410) | admin-utama (diisi otomatis importer) |
| `search-index` | `docType`, `refId`, `title`, `url`, `body`, `tsv` | sistem (hook), bukan UI |
| `users` | `email`, `role`, `prodi[]` (→prodi) | admin-utama |

### Global

`header` berisi menu dua tingkat dan `footer` berisi tautan, kontak, serta media sosial. `site-settings` menyimpan URL PMB default (`https://pmb.uniba.ac.id/`), nomor WA S2, dan properti GA4/GTM. `homepage` memuat field `blocks` (lihat §8).

### Relasi

`prodi → faculties` wajib diisi, sedangkan `posts → prodi` opsional. `arsip → unit` mengarah ke universitas, satu fakultas, atau satu prodi. `users.prodi[] → prodi` menentukan cakupan admin-prodi.

### Draf, versi, dan pratinjau

Semua koleksi konten mengaktifkan `versions.drafts`. Pratinjau dibuka lewat `/preview`, yang berada di balik Access dan tidak pernah di-cache. Terbit terjadwal tidak disediakan karena membutuhkan job runner, dan itu di luar lingkup.

## 7. Model pengguna dan hak akses

Peran pengguna disimpan di `users.role` dengan nilai `admin-utama`, `admin-prodi`, atau `penulis`, ditambah `prodi[]` untuk menentukan cakupan. Matriks dari PRD ditegakkan cukup sekali, sebagai fungsi di `src/access/`, dan diuji oleh `access.check.ts`:

```ts
// contoh bentuk (bukan final)
export const bisaUbahPrByProdi: Access = ({ req: { user }, id, data }) => {
  if (!user) return false
  if (user.role === 'admin-utama') return true
  if (user.role === 'admin-prodi')
    return { prodi: { in: user.prodi?.map(p => p.id ?? p) } } // query constraint
  return false // penulis
}
```

Ringkasan aturannya:

- admin-utama: boleh melakukan semuanya.
- admin-prodi: mengelola `prodi`, `arsip`, dan `posts` yang bertanda prodinya. Konten yang ia terbitkan langsung tampil, termasuk di beranda melalui feed otomatis. Ia tidak boleh mengubah global, `pages`, `faculties`, `profil`, `users`, maupun `redirects`.
- penulis: membuat dan mengubah `posts` sebagai draf (`_status=draft`), lalu menandainya "siap ditinjau". Penulis tidak bisa menerbitkan.
- Khusus admin-utama: menghapus konten dan media, mengelola pengguna, mengatur global dan beranda, serta menurunkan konten milik siapa pun.

Lapisan kedua ada di tepi, yaitu Cloudflare Access (lihat §10 dan §11).

## 8. Page builder beranda

Global `homepage` memakai field `blocks` Payload dengan 18 tipe blok. Admin bisa menambah, mengurutkan, dan menyembunyikan blok, tetapi tidak bisa mengatur warna, huruf, atau kolom. Setiap blok terdiri atas satu komponen React di `src/blocks/` dan satu definisi `Block` Payload. Daftar lengkapnya ada di PRD bagian Beranda. Blok "Berita & pengumuman terbaru" dan "Grid fakultas/prodi" mengambil data secara otomatis, tidak diisi manual. Page builder hanya tersedia di beranda; halaman lain memakai templat tetap.

## 9. Rendering dan caching

- Semua rute publik dirender dinamis di Cloud Run, tanpa ISR/SSG dan tanpa Redis. Alasannya, cache ISR Next disimpan per instance di filesystem Cloud Run yang efemeral, sehingga isinya bisa berbeda antar-instance.
- Cloudflare meng-cache HTML lewat Cache Rules (paket Free membatasi hingga 10 aturan). `/admin*`, `/api*`, `/preview*`, dan `/cari*` tidak di-cache; `/_next/image*` diberi TTL panjang; sisa HTML juga diberi TTL panjang dan mengabaikan header cache dari aplikasi.
- Halaman publik tidak mengirim cookie. Respons yang membawa `Set-Cookie` tetap di-cache, tetapi cookie-nya dibuang dan tidak sampai ke pengunjung. Rute yang butuh cookie (login dan pratinjau) masuk ke aturan tanpa cache.
- `instrumentation.ts`, variabel `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, dan `deploymentId` dibuat sama di semua instance, sesuai panduan self-host Next untuk multi-instance.
- Target kesegaran: perubahan tampil paling lambat 5 menit, berkat purge otomatis saat konten terbit (lihat §10 dan subbagian Cache-tag dan purge).

### Cache-tag dan purge

`proxy.ts` menambahkan header `Cache-Tag` berdasarkan path. Hook Payload `afterChange` dan `afterDelete` lalu memanggil `lib/cloudflare-purge.ts` dengan pemetaan berikut:

| Peristiwa | Tag di-purge |
|---|---|
| Terbit/ubah 1 berita | `post:<id>`, `list:berita`, `home` (bila dipajang), `prodi:<slug>` terkait |
| Terbit/ubah pengumuman | `post:<id>`, `list:pengumuman`, `home` |
| Ubah arsip | `arsip:<id>`, `list:arsip`, `prodi:<slug>` |
| Ubah prodi/fakultas/profil | tag halaman itu + `home` |
| Ubah `header`/`footer`/`site-settings` | purge **per-hostname** (bukan seluruh zona, agar cache subdomain lain seperti PMB tak ikut) |
| Ubah `redirects` | `post`/path sumber terkait |

Paket Free membatasi purge sekitar 5 kali per menit. Jika Cloudflare membalas 429 atau galat lain, sistem mencoba ulang hingga 5 menit, lalu beralih ke purge per-hostname dan mengirim peringatan ke Biro TI. Impor migrasi ditutup dengan satu purge per-hostname.

## 10. `proxy.ts` (runtime Node, setiap request)

Urutan pemrosesannya:

1. `www.uniba.ac.id` dialihkan 301 ke apex, dengan path tetap dipertahankan.
2. Parameter pelacak (`utm_*`, `gclid`, `gbraid`, `wbraid`, `fbclid`) dibuang sebelum masuk cache, karena Cloudflare Free tidak bisa menormalisasi kunci cache.
3. Aturan `redirects` diterapkan: 301 untuk entri dari koleksi, 410 untuk pola lama (`/produk/*`, `/portfolio-item/*`, `/author/*`).
4. Untuk `/admin`, `/api`, dan `/preview`, JWT Cloudflare Access (`Cf-Access-Jwt-Assertion`) diverifikasi terhadap kunci publik tim Access UNIBA, dengan `aud` yang cocok dengan aplikasinya. Jika tidak sah, responsnya 403. Langkah ini menutup akses langsung lewat `run.app` atau IP pemetaan domain, dan diuji di gerbang M3.
5. Header `Cache-Tag` dan header cache ditambahkan untuk rute publik.

Aturan pengalihan dibaca dari koleksi melalui cache memori berumur pendek supaya tidak perlu query ke DB di setiap request. Logika ini diuji oleh `proxy.check.ts`, mencakup redirect, 410, dan keputusan Access.

## 11. Autentikasi dan hak akses (dua lapis)

- Di tepi, Cloudflare Access (Zero Trust Free, maksimal 50 pengguna) melindungi `/admin*`, `/api*`, dan `/preview*`, termasuk di `baru.`, `staging.`, dan `lama.`. Faktor kedua berupa kode sekali pakai yang dikirim ke email kampus (`@uniba.ac.id` atau `@uibs.ac.id`). Biro TI menambah dan mencabut akun lewat dashboard Zero Trust; langkahnya ada di panduan admin.
- Di aplikasi, Payload memakai kata sandi, `maxLoginAttempts`/`lockTime` (akun terkunci 10 menit setelah 5 kali gagal), dan fungsi `access` (§7). `proxy.ts` juga memverifikasi JWT Access agar panel tidak bisa dibuka lewat `run.app`.
- Tidak ada layanan pengiriman email. Reset kata sandi dilakukan oleh admin-utama, dan kode masuk dikirim oleh Access.

## 12. Media dan penyimpanan

- `@payloadcms/storage-s3` terhubung ke Supabase Storage melalui endpoint S3 (`forcePathStyle`) dengan bucket media publik. `disablePayloadAccessControl` diaktifkan untuk media publik supaya gambar tidak perlu lewat `/api`, yang dilindungi Access.
- Gambar di halaman disajikan lewat `next/image` (sharp) dan di-cache Cloudflare. PDF Arsip dan berkas asli diunduh langsung dari Supabase, sehingga dihitung ke kuota Supabase.
- Saat unggah, gambar dikompres otomatis. Lampiran dan PDF dibatasi 10 MB untuk menjaga kuota 1 GB dan batas request Cloud Run sebesar 32 MiB.
- Supabase Storage tidak menyimpan versi berkas, jadi salinan harian ke GCS adalah satu-satunya cara memulihkan berkas.

## 13. Pencarian

- Tabel `search-index` berisi judul, jenis, URL, teks bersih, dan kolom `tsvector`. Isinya diperbarui oleh hook Payload `afterChange` dan `afterDelete`.
- Teks PDF diekstrak secara sinkron saat unggah (maksimal 10 MB, memakai pustaka JS). PDF yang tidak punya lapisan teks ditandai "tidak terindeks" karena OCR tidak disediakan.
- Query memakai Postgres FTS (config `simple` + `unaccent`) yang digabung dengan ekstensi `pg_trgm` agar tetap menemukan hasil meski ada salah ketik. Kecocokan di judul diberi peringkat lebih tinggi daripada di isi, dan hasil dikelompokkan per jenis.
- `/cari` tidak di-cache dan dilindungi satu aturan rate-limit Cloudflare (Free). Pengujiannya ada di `search/indexer.check.ts`, termasuk kasus salah ketik seperti "manajmen" yang tetap menemukan "Manajemen".

## 14. Keamanan (ringkasan; detail di Lampiran PRD)

- Header keamanan: CSP (mengizinkan skrip `'unsafe-inline'` serta domain GTM, GA4, YouTube-nocookie, Maps, dan Supabase; nilai lengkapnya ada di PRD), HSTS 1 tahun tanpa `includeSubDomains`, `nosniff`, Referrer-Policy, Permissions-Policy, `frame-ancestors 'self'` (pratinjau Payload butuh iframe dari domain yang sama), dan `X-Powered-By` dimatikan.
- Container bersifat immutable, jadi file yang disisipkan akan hilang setiap kali deploy.
- Rahasia (kunci Supabase, token API Cloudflare, kunci Payload, DSN Sentry) disimpan di Secret Manager GCP kampus dan tidak pernah masuk repo.
- `DISALLOW_FILE_EDIT=true` tetap dipasang. Pembatasan eksekusi PHP tidak relevan karena situs ini bukan WordPress.

## 15. Lingkungan, migrasi, dan deploy

| Lingkungan | Alamat | Supabase | Catatan |
|---|---|---|---|
| Dev | lokal | Postgres lokal (Docker) | Payload `push`; tak pernah ke DB prod |
| Staging | `staging.uniba.ac.id` | proyek Free (org staging) | di balik Access, `noindex` |
| Produksi | `baru.uniba.ac.id` → `uniba.ac.id` saat tayang | proyek Free (org produksi, terpisah dari portal PMB) | naik Pro bila pemicu PRD tercapai |

- Migrasi dikelola oleh Payload. `payload migrate:create` dijalankan saat pengembangan dan filenya di-commit; `payload migrate` dijalankan sebagai Cloud Run Job sebelum rilis. Mode `push` tidak pernah dipakai di staging maupun produksi.
- Koneksi DB memakai Supavisor mode sesi (port 5432, IPv4). Pool Size proyek dinaikkan ke 25. Aplikasi memakai paling banyak 4 koneksi per instance (12 untuk 3 instance), dan sisanya untuk job.
- Domain memakai pemetaan domain Cloud Run (Singapura). Record dibiarkan tanpa proxy sampai sertifikat Google terbit (paling lama 24 jam), lalu proxy Cloudflare diaktifkan dengan SSL Full (strict). Always-Use-HTTPS dimatikan dan diganti Single Redirect http→https yang mengecualikan `/.well-known/acme-challenge/*`. Jika cara ini bermasalah, cadangannya adalah Cloudflare Worker (Workers Paid, dibayar UNIBA).

### CI/CD (GitHub Actions, org kampus)

1. Image dibangun lalu di-push ke Artifact Registry di proyek GCP kampus melalui Workload Identity Federation, tanpa kunci akun layanan.
2. `payload migrate` dijalankan sebagai Cloud Run Job.
3. Revisi baru di-deploy. Branch `main` otomatis masuk ke staging; tag masuk ke produksi setelah disetujui manual.
4. Setelah 100% lalu lintas berpindah, Cloudflare di-purge per-hostname agar tidak ada HTML lama yang masih merujuk bundel JS versi sebelumnya. Jika purge gagal, rilis dianggap gagal.

## 16. Konvensi kode

- Bahasa hibrida: slug koleksi dan konfigurasi Payload memakai bahasa Inggris (mengikuti norma Payload), label admin dan isi field memakai bahasa Indonesia, sedangkan kode kustom (`proxy`, `search`, `scripts`, `access`, `lib`) mengikuti gaya rumah yang berbahasa Indonesia.
- Pola `*.check.ts`: setiap modul dengan logika yang tidak sepele punya satu self-test berbasis assert yang bisa langsung dijalankan, sama seperti di portal PMB. Pola ini wajib untuk `proxy`, `search/indexer`, `scripts/import-berita`, dan `access`.
- UI: token Tailwind v4 dan setup shadcn/radix dipakai ulang dari portal supaya lebih cepat, tetapi komponen situs dibuat baru (komponen formulir portal tidak diimpor). Gayanya dibuat kalem sesuai PRD: tanpa efek pantul, tanpa tilt 3D, dan latar langit hanya di hero. Kontras teks templat memenuhi WCAG 2.1 AA.
- `output: 'standalone'`, `poweredByHeader: false`, dan `turbopack.root` ditetapkan secara eksplisit. Karena repo ini mandiri, `turbopack.root` sebenarnya tidak wajib seperti di portal, tetapi tetap ditulis agar jelas.

## 17. Observability

- Cloud Logging (log JSON terstruktur) dan Error Reporting bawaan Cloud Run.
- Sentry (`@sentry/nextjs`, free tier) mencatat stack trace error di server dan klien, dengan DSN disimpan di Secret Manager. Ini satu-satunya layanan pihak ketiga tambahan yang disetujui.
- Uptime check Cloud Monitoring setiap 5 menit, diarahkan ke `run.app` sebelum tayang lalu ke `https://uniba.ac.id/`. Peringatan dikirim jika job backup gagal, purge gagal, sertifikat tinggal 21 hari sebelum kedaluwarsa, atau anggaran mencapai 50%, 90%, dan 100%.

## 18. Pengujian

- `*.check.ts` (berbasis assert, tanpa framework berat) menguji `proxy`, `search/indexer`, `scripts/import-berita` (idempotensi dan rewrite gambar), serta `access` (matriks peran).
- `payload generate:types` dijalankan di CI, dan build gagal jika tipe tidak sinkron.
- Tidak ada pengujian e2e berat. Kriteria penerimaan (Lighthouse ≥ 90, layar 360px, lintas peramban, konten terbit dalam 5 menit) diuji manual di situs pra-tayang sesuai PRD.

## 19. Migrasi konten (ringkasan; detail di PRD)

`scripts/import-berita.ts` membaca REST API publik WordPress lama (`/wp-json/wp/v2/{posts,categories,media}`). Skrip ini idempoten: kuncinya ID pos WP, dan saat dijalankan ulang di hari tayang ia hanya menambah pos baru. Skrip juga mengonversi HTML ke Lexical, menulis ulang gambar ke `media`, dan mengisi koleksi `redirects` dengan 133 pengalihan 301 otomatis. Pola 410 dan subdomain fakultas (301 lewat Cloudflare) ditangani di luar importer.

## 20. Keputusan tercatat (ADR ringkas)

| # | Keputusan | Alasan | Konsekuensi |
|---|---|---|---|
| 1 | Payload tertanam di Next, satu service | PRD "satu layanan"; sederhana | Admin & situs berbagi deploy |
| 2 | Dynamic render + edge cache, tanpa ISR/Redis | Cache ISR per-instance tak andal di Cloud Run | Butuh purge saat terbit |
| 3 | Supabase Free + keep-alive + backup GCS | biaya ±Rp0–300rb | Naik Pro bila pemicu tercapai; jeda 7 hari dijaga keep-alive |
| 4 | Cloudflare Access (bukan plugin 2FA) | "tanpa plugin pihak ketiga"; gratis ≤50 user | Akun dikelola di dashboard Zero Trust |
| 5 | Ekstraksi PDF sinkron saat unggah | tanpa job runner | Batas 10 MB; PDF besar → job latar bila perlu |
| 6 | Sentry free tier ditambahkan | stack trace lebih baik | satu dependensi eksternal; DSN rahasia |
| 7 | Pemetaan domain Cloud Run (Preview) | tanpa Load Balancer | cadangan Worker bila berubah |

## 21. Peta ke PRD

| Bagian Architecture | Bagian PRD |
|---|---|
| §6–8 Model data, beranda | PRD: Lingkup templat, Beranda 18 blok, Kebutuhan fungsional |
| §9–10 Rendering, cache, proxy | Lampiran: Rendering/cache/purge |
| §11 Akses | PRD: Pengguna & hak akses; Lampiran: Keamanan teknis |
| §12–13 Media, pencarian | Lampiran: Database/penyimpanan, Pencarian |
| §15 Lingkungan/deploy | Lampiran: Lingkungan & deploy |
| §17 Observability | Lampiran: Pemantauan & runbook |
| §19 Migrasi | PRD: Migrasi konten & pengalihan |
