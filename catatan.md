# Catatan Proyek: Website Resmi UNIBA Surakarta

Changelog, jurnal keputusan teknis, dan daftar kerja. Wajib diperbarui di setiap sesi kerja.

Acuan: [docs/PRD.md](docs/PRD.md) (lingkup dan kriteria penerimaan) dan [docs/ARSITEKTUR.md](docs/ARSITEKTUR.md) (cara membangun). Bila keduanya berbeda, PRD menang untuk lingkup.

---

## Goal aktif

**Static Home Page Mockup/UI for Client Approval (M1)**

Gerbang M1 (akhir minggu 1): Beranda dan satu prodi tampil di staging sesuai DESIGN.md, dan DESIGN.md diserahkan. Payload CMS sengaja ditunda; semua isi masih *hardcoded*.

## Status

| Item | Status |
|---|---|
| Restrukturisasi repo (situs resmi di root, landing ke `landing/`) | ✅ Selesai |
| PDF PRD dan Arsitektur → Markdown | ✅ `docs/PRD.md`, `docs/ARSITEKTUR.md` |
| Beranda statis (header, blok 1/3/4/6, footer) | ✅ Ter-render, build dan lint bersih |
| Satu halaman prodi | ⬜ Belum |
| DESIGN.md | ⬜ Belum (kriteria M1) |
| Deploy ke `staging.uniba.ac.id` | ⬜ Belum (butuh akun GCP/Cloudflare dari Biro TI, PRD T0) |

**Laporan render (3 Okt 2026):** `npm run build` lolos (Next 16.3.6, Turbopack, `/` prerender statis), `npm run lint` bersih tanpa peringatan. Dicek dengan Playwright (Chromium): tanpa gulir menyamping di 1440 px dan 360 px; menu ponsel terbuka dan tertutup; gerak muncul-naik berjalan (opacity 0 → 1 saat kartu masuk layar); header `X-Powered-By` tidak dikirim. `landing/` juga tetap lolos build dari folder barunya.

---

## Changelog

### 2026-10-03

**Struktur repo**
- Landing page PMB (daftaruniba.site) dipindah dengan `git mv` ke `landing/`, jadi riwayat git tetap utuh. Ia tetap aplikasi mandiri dengan `package.json` dan lockfile sendiri.
- Situs resmi uniba.ac.id sekarang di root (`src/`), mengikuti struktur folder Arsitektur §5.
- Repo `pmb-uniba` **tidak** diimpor. Repo itu privat dan repo ini publik, jadi subtree akan membuka kode dan riwayat PMB ke publik. Keputusan diambil bersama pengguna.

**Situs resmi (root)**
- `package.json` baru: Next 16.3.6 (dikunci persis sesuai Arsitektur §3), React 19.2.8, Tailwind v4, lucide-react, TypeScript 5.
- `next.config.ts`: `output: "standalone"`, `poweredByHeader: false`, `turbopack.root` eksplisit (Arsitektur §16).
- `src/app/(site)/layout.tsx`: root layout di route group `(site)`, jadi `(payload)` nanti bisa punya root layout sendiri. Font Geist + Instrument Serif (hanya italic). Metadata `noindex` untuk staging. Ada skip-link "Lewati ke konten".
- `src/app/(site)/globals.css`: token warna Tailwind v4, utilitas `batik-kawung` dan `batik-kawung-inverse`, gerak `fade-up` 300 ms.
- `src/app/(site)/page.tsx`: beranda yang menyusun blok dengan isi contoh.
- `src/blocks/`: `Hero` (blok 1), `Stats` (blok 3), `AdmissionPaths` (blok 4), `FacultyGrid` (blok 6).
- `src/components/`: `SiteHeader`, `SiteFooter`, `FadeUp`.
- `src/lib/situs.ts`: pengganti sementara global `site-settings`, `header`, dan `footer`.
- Aset dari landing: logo (biru dan putih), langit hero (desktop dan ponsel, WebP 23/20 KB), favicon.

**Landing (`landing/`)**
- Satu-satunya perubahan kode: `turbopack.root` di `landing/next.config.ts`, supaya Next tidak membaca lockfile root sebagai workspace.
- `AGENTS.md`/`CLAUDE.md` disalin ke `landing/`, karena `next dev` menulis ulang berkas itu per proyek.

**Dokumen**
- `docs/PRD.md` dan `docs/ARSITEKTUR.md`: transkripsi PDF apa adanya.

---

## Jurnal keputusan teknis

| # | Keputusan | Alasan |
|---|---|---|
| K1 | Halaman di `src/app/(site)/page.tsx`, bukan `app/(site)/page.tsx` | Mengikuti Arsitektur §5 (`src/`). Route group-nya sama. |
| K2 | Root layout di `(site)/layout.tsx`, tanpa `app/layout.tsx` | Pola template Payload: `(site)` dan `(payload)` masing-masing punya root layout. |
| K3 | Props blok berbahasa Inggris (`title`, `subtitle`, `primaryAction`), data koleksi memakai nama field Arsitektur §6 (`nama`, `slug`, `jenjang`) | Arsitektur §16: config Payload berbahasa Inggris. Field koleksi yang sudah dinamai di §6 diikuti apa adanya. |
| K4 | Blok dirender langsung dengan props di `page.tsx`, belum ada `RenderBlocks` | Ponytail: renderer generik baru dibuat saat global `homepage` dari Payload ada. Sekarang ia belum punya pekerjaan. |
| K5 | `FacultyGrid` tanpa props, data di dalam berkas blok | PRD: blok 6 tidak diisi admin, otomatis dari koleksi. Nanti datanya diganti query `faculties` + `prodi`. |
| K6 | Menu ponsel memakai `<details>`, belum memakai shadcn Sheet | Tanpa JS, sudah aksesibel sebagai disclosure. shadcn/radix diinisialisasi saat blok pertama butuh primitif radix (FAQ/akordeon, blok 15). Belum ada `components.json` di root. |
| K7 | Gerak muncul-naik: CSS + satu `IntersectionObserver` (`FadeUp.tsx`) | PRD: satu gerak 300 ms, mati saat reduced-motion. Kartu disembunyikan hanya jika `@media (scripting: enabled)`, jadi tanpa JS semua tetap tampil. Hero memakai animasi CSS saat muat, tanpa JS. |
| K8 | Tekstur batik berupa SVG kawung inline (data URI), bukan PNG dari `landing/brand/assets` | PNG batik di landing berwarna emas solid 1400 px, terlalu berat dan terlalu ramai untuk tekstur halus. SVG 40 px dengan garis 1 px dan opasitas 6–14% beratnya < 1 KB. |
| K9 | Hero memakai `getImageProps` + `<picture>` (art direction) | Arsitektur §12: gambar lewat `next/image`. Ada potongan berbeda untuk desktop dan ponsel. Gradasi CSS jadi dasar bila gambar belum termuat. |
| K10 | Tombol "Pendaftaran" di header ponsel dipindah ke dalam menu | Di 360 px, logo + wordmark + tombol + ikon menu tidak muat dalam satu baris. CTA utama ponsel tetap ada di hero. |
| K11 | Logo memakai PNG 512 px dari landing, bukan *dummy* | Lebih representatif untuk persetujuan klien. Logo vektor resmi tetap menunggu Humas (PRD: Kewajiban UNIBA). |

### Kerangka copy

Kerangka **4C (Clear, Concise, Credible, Compelling)**. Pengunjung beranda sebagian besar sudah kenal UNIBA (mengetik domain atau mencari nama kampus), jadi tugas copy adalah memastikan identitas dan mengarahkan ke jalur yang tepat. Copy sudah dibersihkan dengan skill *humanizer*: tanpa "di jantung kota", kalimat aktif dengan "Anda", dan tanpa intro yang mengulang judul.

### Kontras (WCAG 2.1 AA, dihitung)

Teks terburuk: navy-deep di atas langit tergelap `#80b6e4` = 5,84:1. Lainnya: slate-600 di cloud 6,80; sky-deep di putih 5,93; putih/60 di navy-950 6,84. Semua ≥ 4,5:1.

---

## Asumsi yang wajib dikonfirmasi klien

- **"43 tahun di Kota Solo"** diambil dari copy landing (`s2Reasons`), bukan dari PRD. Humas wajib mengonfirmasi tahun berdirinya.
- **Judul hero** "Kuliah pagi atau malam di Kota Solo." adalah usulan. Di CMS nanti ini diisi admin.
- **RPL di lima prodi S1** diambil dari `landing/data/unibaData.ts` (`rplProgramIds`).
- **Slug fakultas** (`ekonomi-dan-bisnis`, `hukum`, `pertanian`, `teknik`) adalah usulan; PRD belum menetapkannya.
- Nomor WA admisi S2 diambil dari landing. PRD menyebut nomornya diserahkan Tim PMB paling lambat akhir minggu 2.

## Batasan yang diketahui

- Semua rute selain `/` (Profil, Berita, Arsip, Kontak, `/pendaftaran`, `/prodi/*`, `/fakultas/*`) masih 404. Templatnya masuk M2.
- Belum ada `not-found.tsx` dan `error.tsx` khusus (templat 13 dan 14).
- `npm start` mengeluarkan peringatan karena `output: "standalone"`. Untuk pratinjau lokal pakai `npm run dev`. Image produksi nanti menjalankan `node .next/standalone/server.js` lewat Dockerfile.
- `npm audit`: 5 temuan *high*, semuanya di rantai dev `eslint-config-next → fast-glob → micromatch → braces`. Advisori `braces` berlaku untuk semua versi dan belum ada perbaikan, jadi tidak melanggar aturan serah terima (Arsitektur §3). Dicek ulang sebelum serah terima.
- Belum diukur dengan Lighthouse. PRD mengukurnya di M2/M3 dengan cache Cloudflare terisi.

---

## Daftar kerja

### M1 (minggu 1)
- [ ] **DESIGN.md**: token, tipografi, kartu, tombol, gerak, batik, aturan kontras. Ini kriteria gerbang M1.
- [ ] Satu halaman prodi (`/prodi/<slug>`, templat 4): jenjang, fakultas, isi teks kaya, breadcrumb.
- [ ] Konfirmasi asumsi di atas dengan PIC/Humas.
- [ ] Minta logo vektor dan foto hero asli dari Humas.
- [ ] Deploy staging (Cloud Run + Access), setelah akses T0 diberikan Biro TI.
- [ ] **Sebelum merge ke `main`:** ubah Root Directory proyek Vercel daftaruniba.site ke `landing/`. Tanpa itu, deploy landing akan membangun situs resmi.

### M2 (minggu 2)
- [ ] Payload 3.90.x tertanam: `(payload)`, koleksi, global, `payload.config.ts`.
- [ ] 14 blok sisa + `RenderBlocks` dari global `homepage`.
- [ ] 13 templat sisa, Arsip, pencarian, migrasi 133 berita, `redirects`.
- [ ] Inisialisasi shadcn (`components.json`) saat primitif radix pertama dibutuhkan.
