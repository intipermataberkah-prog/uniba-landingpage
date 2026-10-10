# Catatan kerja — landing PMB UNIBA

## 2026-10-10 — Pindah domain ke daftar.uniba.ac.id

- **Apa:** domain utama landing sekarang `https://daftar.uniba.ac.id`. Semua trafik
  `daftaruniba.site` / `www.daftaruniba.site` di-redirect 308 ke sana, path + query ikut
  (gclid/UTM tetap utuh) — `next.config.ts`.
- **DNS:** CNAME `daftar` → `e3eb6538a7f18307.vercel-dns-017.com` (DNS only) di zona
  Cloudflare `uniba.ac.id`. Zona Free sudah penuh (200 record), jadi record rusak
  `A journal-fe.uniba.ac.id → 1.1.1.1` dihapus (atas persetujuan user) untuk memberi slot.
- **Vercel:** domain ditambahkan ke project `uniba-landingpage1`; env produksi
  `NEXT_PUBLIC_SITE_URL=https://daftar.uniba.ac.id` (canonical, sitemap, robots, OG).
- **Docs/CSV Google Ads:** semua final URL diganti ke domain baru. Di akun Google Ads,
  final URL iklan **wajib** diganti juga — redirect lintas domain melanggar kebijakan
  "destination mismatch".
- **OG image** di-generate ulang (teks domain baru). Regex `downPayment` di
  `scripts/make-og-image.py` dibatasi ke `paymentScheme` karena `s2Payment` ikut cocok.
- **Sisa:** tanggal di OG/promo masih "Ditutup 30 September 2026" (sudah lewat) — ikut data
  `promoPeriod`, belum diubah.
