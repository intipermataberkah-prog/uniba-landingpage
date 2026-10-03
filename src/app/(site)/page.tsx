import { AdmissionPaths } from "@/blocks/AdmissionPaths";
import { FacultyGrid } from "@/blocks/FacultyGrid";
import { Hero } from "@/blocks/Hero";
import { Stats } from "@/blocks/Stats";
import { pengaturanSitus, tautanWaS2 } from "@/lib/situs";

// Beranda M1: isi contoh, belum dari Payload. Nanti urutan dan isi blok datang dari
// global `homepage` (Arsitektur §8), dan halaman ini tinggal merender daftar blok itu.
export default function Beranda() {
  return (
    <>
      <Hero
        eyebrow="Universitas Islam Batik Surakarta"
        title="Kuliah pagi atau malam di Kota Solo."
        subtitle="Ada sebelas program studi S1 dan S2 di empat fakultas. Kelas pagi cocok untuk yang baru lulus sekolah, kelas malam untuk yang sudah bekerja."
        primaryAction={{ label: "Daftar Kuliah", href: pengaturanSitus.urlPmb }}
        secondaryAction={{ label: "Lihat program studi", href: "#fakultas" }}
      />

      {/* "43 tahun" diambil dari landing (s2Reasons). Angka ini wajib dikonfirmasi Humas sebelum M1. */}
      <Stats
        items={[
          { value: "43", label: "Tahun di Kota Solo" },
          { value: "4", label: "Fakultas" },
          { value: "9", label: "Program sarjana (S1)" },
          { value: "2", label: "Program magister (S2)" },
        ]}
      />

      <div aria-hidden="true" className="batik-kawung h-12 border-y border-uniba-navy/10 bg-uniba-cloud" />

      <AdmissionPaths
        title="Jalur pendaftaran"
        intro="Jalur S1, S2, dan RPL punya kanal pendaftaran yang berbeda. Pilih jalur Anda, lalu daftar langsung di kanalnya."
        cards={[
          {
            name: "Sarjana (S1)",
            summary:
              "Untuk lulusan SMA, SMK, MA, atau sederajat. Anda mendaftar dan mengunggah berkas di portal PMB.",
            link: { label: "Buka portal PMB", href: pengaturanSitus.urlPmb },
          },
          {
            name: "Magister (S2)",
            summary:
              "Magister Manajemen dan Magister Hukum. Tim admisi melayani pendaftaran S2 langsung lewat WhatsApp.",
            link: { label: "Hubungi admisi S2", href: tautanWaS2 },
          },
          {
            name: "Rekognisi Pembelajaran Lampau (RPL)",
            summary:
              "Pengalaman kerja Anda bisa diakui sebagai SKS. Jalur ini dibuka di lima program studi S1.",
            link: { label: "Daftar lewat portal PMB", href: pengaturanSitus.urlPmb },
          },
        ]}
      />

      <FacultyGrid />
    </>
  );
}
