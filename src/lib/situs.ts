// Pengganti sementara global Payload `site-settings`, `header`, dan `footer` (Arsitektur §6).
// Nilai kontak disalin dari landing/data/unibaData.ts, yang sudah diverifikasi ke situs resmi.
// Saat Payload terpasang, berkas ini diganti query ke global-global tersebut.

export const pengaturanSitus = {
  urlPmb: "https://pmb.uniba.ac.id/",
  waS2: "62895621980090",
};

export const tautanWaS2 = `https://wa.me/${pengaturanSitus.waS2}?text=${encodeURIComponent(
  "Assalamu'alaikum, saya ingin mendaftar Program Magister (S2) UNIBA Surakarta.",
)}`;

// Rute mengikuti pola URL di PRD (Lingkup: templat halaman). Selain beranda, rute ini
// baru dibangun di M2, jadi untuk sementara masih 404.
export const menuUtama = [
  { label: "Profil", href: "/profil/sejarah" },
  { label: "Fakultas", href: "/#fakultas" },
  { label: "Berita", href: "/berita" },
  { label: "Pengumuman", href: "/pengumuman" },
  { label: "Arsip", href: "/arsip" },
  { label: "Kontak", href: "/kontak" },
];

export const kontak = {
  nama: "Universitas Islam Batik Surakarta",
  alamat: "Jl. KH. Agus Salim No. 10, Sondakan, Laweyan, Kota Surakarta, Jawa Tengah 57147",
  telepon: "(0271) 714751",
  teleponHref: "tel:+62271714751",
  email: "info@uniba.ac.id",
  sosial: [
    { label: "Instagram", href: "https://www.instagram.com/unibasurakarta/" },
    { label: "YouTube", href: "https://www.youtube.com/@unibasurakarta679" },
    { label: "Facebook", href: "https://www.facebook.com/unibasurakarta" },
    { label: "TikTok", href: "https://www.tiktok.com/@unibasurakarta" },
  ],
};
