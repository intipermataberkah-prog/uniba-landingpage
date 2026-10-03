import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Blok 6 (PRD): tidak diisi admin, otomatis dari koleksi faculties dan prodi.
// Sebelum Payload terpasang, datanya diambil dari daftar prodi di PRD (9 S1, 2 S2).
// Nama field mengikuti Arsitektur §6 (nama, slug, jenjang).

const fakultas = [
  {
    nama: "Fakultas Ekonomi dan Bisnis",
    singkatan: "FEB",
    slug: "ekonomi-dan-bisnis",
    prodi: [
      { nama: "Manajemen", jenjang: "S1", slug: "manajemen" },
      { nama: "Akuntansi", jenjang: "S1", slug: "akuntansi" },
      { nama: "Magister Manajemen", jenjang: "S2", slug: "magister-manajemen" },
    ],
  },
  {
    nama: "Fakultas Hukum",
    singkatan: "FH",
    slug: "hukum",
    prodi: [
      { nama: "Ilmu Hukum", jenjang: "S1", slug: "ilmu-hukum" },
      { nama: "Magister Hukum", jenjang: "S2", slug: "magister-hukum" },
    ],
  },
  {
    nama: "Fakultas Pertanian",
    singkatan: "FP",
    slug: "pertanian",
    prodi: [
      { nama: "Agroteknologi", jenjang: "S1", slug: "agroteknologi" },
      { nama: "Agribisnis", jenjang: "S1", slug: "agribisnis" },
      { nama: "Peternakan", jenjang: "S1", slug: "peternakan" },
    ],
  },
  {
    nama: "Fakultas Teknik",
    singkatan: "FT",
    slug: "teknik",
    prodi: [
      { nama: "Teknik Industri", jenjang: "S1", slug: "teknik-industri" },
      { nama: "Teknik Sipil", jenjang: "S1", slug: "teknik-sipil" },
      { nama: "Informatika", jenjang: "S1", slug: "informatika" },
    ],
  },
];

export function FacultyGrid() {
  return (
    <section id="fakultas" className="scroll-mt-16 bg-uniba-cloud py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-uniba-navy sm:text-4xl">
            Fakultas dan program studi
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Pilih program studi untuk melihat kurikulum, dosen, dan prospek kerjanya.
          </p>
        </div>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {fakultas.map((f) => (
            <li
              key={f.slug}
              data-fade-up
              className="flex flex-col rounded-2xl border border-uniba-navy/10 bg-white p-6 shadow-card"
            >
              <p className="text-xs font-semibold tracking-widest text-uniba-sky-deep">{f.singkatan}</p>
              <h3 className="mt-2 text-lg leading-snug font-semibold text-uniba-navy">{f.nama}</h3>
              <ul className="mt-5 flex-1 divide-y divide-uniba-navy/10 border-t border-uniba-navy/10">
                {f.prodi.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={`/prodi/${p.slug}`}
                      className="flex items-center gap-3 py-3 text-slate-700 transition-colors hover:text-uniba-navy"
                    >
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs font-semibold ${
                          p.jenjang === "S2" ? "bg-uniba-navy text-white" : "bg-uniba-cloud text-uniba-navy"
                        }`}
                      >
                        {p.jenjang}
                      </span>
                      {p.nama}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/fakultas/${f.slug}`}
                className="mt-4 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-uniba-sky-deep transition-colors hover:text-uniba-navy"
              >
                Profil fakultas
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
