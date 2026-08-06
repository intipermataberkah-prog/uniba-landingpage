import { contactInfo } from "@/data/unibaData";

/**
 * Resolves the canonical production origin used for metadata, sitemap, robots,
 * and structured data. Priority:
 *   1. NEXT_PUBLIC_SITE_URL      — set this in Vercel if you use a custom domain
 *   2. VERCEL_PROJECT_PRODUCTION_URL — auto-provided by Vercel (stable prod domain)
 *   3. localhost fallback for local dev
 */
export function getBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3002";
}

export const siteConfig = {
  name: "PMB UNIBA Surakarta",
  shortName: contactInfo.shortName,
  university: contactInfo.universityName,
  description:
    "Pendaftaran Mahasiswa Baru (PMB) Universitas Islam Batik Surakarta 2026/2027. " +
    "Kuliah S1 & S2 terakreditasi BAN-PT: Gratis Uang Gedung, cukup bayar 60% di semester 1, " +
    "sisanya diangsur fleksibel tanpa bunga. Kelas Pagi & Kelas Malam fleksibel di pusat Kota Solo.",
  locale: "id_ID",
  keywords: [
    "PMB UNIBA Surakarta",
    "Pendaftaran UNIBA Surakarta",
    "Universitas Islam Batik Surakarta",
    "Kuliah Murah Solo",
    "Kuliah Karyawan Solo",
    "Kelas Malam Surakarta",
    "Kuliah Cicilan Solo",
    "Kuliah Tanpa Uang Gedung",
    "Beasiswa Kuliah Solo",
    "Beasiswa KIP Kuliah",
    "Program RPL Surakarta",
    "Kuliah S1 Solo",
    "Kuliah S2 Solo",
    "Kampus Islam Solo Raya",
  ],
} as const;
