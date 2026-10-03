# Website Resmi UNIBA Surakarta

Rebuild uniba.ac.id dengan Next.js 16, Tailwind v4, dan (nanti) Payload CMS.

| Folder | Isi |
|---|---|
| `src/` | Situs resmi uniba.ac.id (aplikasi utama repo ini) |
| `docs/` | [PRD](docs/PRD.md) dan [Arsitektur](docs/ARSITEKTUR.md) |
| `landing/` | Landing page PMB daftaruniba.site, aplikasi Next terpisah dengan lockfile sendiri |
| `catatan.md` | Changelog, keputusan teknis, dan daftar kerja |

Portal PMB ada di repo privat terpisah (`pmb-uniba`) dan tidak digabung ke sini.

## Menjalankan

```bash
npm install
npm run dev        # http://localhost:3000
```

Landing page:

```bash
cd landing && npm install && npm run dev   # http://localhost:3002
```

Deploy Vercel untuk daftaruniba.site memerlukan **Root Directory = `landing`**.
