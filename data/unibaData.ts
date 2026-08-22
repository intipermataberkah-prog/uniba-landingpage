// Single source of truth for UNIBA Surakarta PMB campaign landing page content.
// Tuition figures are official, sourced verbatim from "RINCIAN BIAYA PROMO KEMERDEKAAN
// TAHUN 2026" (Gelombang 2, UNIBA Surakarta 2026/2027) — not estimates.

export type ClassType = "reguler" | "karyawan";

export interface StudyProgram {
  id: string;
  name: string;
  degree: "S1" | "S2";
  facultyId: string;
  accreditation: string;
  careerProspects: string[];
  /**
   * References FeeGroup.id — several programs share an identical official fee table.
   * Omitted for programs (e.g. S2) not covered by the Promo Kemerdekaan fee document;
   * the Simulasi Biaya calculator excludes any program without one rather than guess.
   */
  feeGroupId?: string;
}

/**
 * One row of the official "Rincian Biaya Pendidikan Gelombang 2" table. Pendaftaran and
 * SPI are both waived under the Promo Kemerdekaan (their sum is the advertised "Potongan
 * 4,3 Juta"). Biaya Lain-lain is paid once, in semester 1 only. SPP Basis + SPP SKS recur
 * every semester alongside a flat Rp150.000 heregistrasi fee (see HEREGISTRASI_PER_SEMESTER).
 */
export interface FeeGroup {
  id: string;
  /** Program names as printed on the official fee table, for display/traceability. */
  label: string;
  pendaftaran: number;
  spi: number;
  sppBasis: number;
  sppSks: Record<ClassType, number>;
  biayaLainLain: number;
}

/** Flat re-registration fee charged every semester from semester 2 onward. */
export const HEREGISTRASI_PER_SEMESTER = 150_000;

/** A standard academic semester runs 6 months; the SPP for semester 2+ can be spread
 * across up to that many monthly installments instead of paid as one lump sum. */
export const MONTHS_PER_SEMESTER = 6;
export const nextSemesterInstallmentOptions = [3, 4, 5, 6] as const;
export type NextSemesterInstallmentMonths = (typeof nextSemesterInstallmentOptions)[number];

export interface Faculty {
  id: string;
  name: string;
  shortName: string;
  description: string;
  iconName: "Landmark" | "Scale" | "Sprout" | "HardHat";
  accentClass: string;
  programIds: string[];
}

export interface Scholarship {
  id: string;
  name: string;
  description: string;
  coverage: string;
  iconName: "GraduationCap" | "Medal" | "BookOpenCheck" | "Users" | "HeartHandshake" | "ShieldCheck";
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface Testimonial {
  id: string;
  name: string;
  program: string;
  cohort: string;
  quote: string;
  outcome: string;
}

export interface EnrollmentStep {
  step: number;
  title: string;
  duration: string;
  description: string;
  iconName: "ListChecks" | "FileEdit" | "ShieldCheck" | "GraduationCap";
}

export interface BentoFeature {
  id: string;
  title: string;
  description: string;
  iconName:
    | "Wallet"
    | "Briefcase"
    | "MapPin"
    | "Moon"
    | "Award"
    | "FileEdit"
    | "GraduationCap";
  size: "large" | "medium";
}

export const classTypeLabels: Record<ClassType, string> = {
  reguler: "Kelas Pagi",
  karyawan: "Kelas Malam",
};

/**
 * Official payment scheme. Pendaftaran + SPI (Sarana Pengembangan Institusi, i.e. "uang
 * gedung") remain waived campaign-wide under Promo Kemerdekaan, which continues alongside
 * this change.
 *
 * Under the new SK the amount required to start attending classes is a FLAT Rp2.000.000,
 * identical for every programme and both class types. It replaces the previous 60%
 * proportional down payment outright, so this is a rupiah figure and not a percentage.
 * The remainder is installed flexibly with no fixed schedule until the end of semester 1.
 * Subsequent semesters follow the same SPP nominal plus a flat heregistrasi fee.
 */
export const paymentScheme = {
  /** Flat rupiah figure that secures a seat in class. Deliberately not a percentage. */
  downPayment: 2_000_000,
  entranceFeeWaived: true,
  remainingPolicy:
    "Sisa pembayaran dapat diangsur secara fleksibel tanpa jadwal cicilan tetap, hingga akhir semester 1.",
  nextSemesterPolicy:
    "Semester berikutnya hanya SPP Basis + SPP SKS + heregistrasi Rp150.000 — tanpa SPI atau Biaya Lain-lain lagi. Bisa dibayar sekaligus atau dicicil per bulan.",
};

export const promoPeriod = {
  name: "Promo Spesial Kemerdekaan",
  wave: "Gelombang 2",
  academicYear: "2026/2027",
  startDate: "2026-08-01",
  endDate: "2026-08-30",
};

export const feeExclusions =
  "Rincian biaya di atas belum termasuk praktikum, KKN, Tugas Akhir, wisuda, dan program-program pendukung program studi. Kelebihan pembayaran dapat dicairkan di akhir studi.";

export const faculties: Faculty[] = [
  {
    id: "feb",
    name: "Fakultas Ekonomi & Bisnis",
    shortName: "FEB",
    description:
      "Mencetak talenta bisnis, keuangan, dan kewirausahaan yang siap bersaing di industri modern.",
    iconName: "Landmark",
    accentClass: "from-uniba-navy to-uniba-blue",
    programIds: ["manajemen", "akuntansi", "s2-manajemen"],
  },
  {
    id: "hukum",
    name: "Fakultas Hukum",
    shortName: "FH",
    description:
      "Membentuk praktisi dan pemikir hukum yang berintegritas dengan landasan keislaman yang kuat.",
    iconName: "Scale",
    accentClass: "from-uniba-blue to-uniba-blue-bright",
    programIds: ["ilmu-hukum", "s2-hukum"],
  },
  {
    id: "pertanian",
    name: "Fakultas Pertanian",
    shortName: "FP",
    description:
      "Mengembangkan inovasi agrikultur dan peternakan berkelanjutan untuk ketahanan pangan nasional.",
    iconName: "Sprout",
    accentClass: "from-uniba-gold-deep to-uniba-gold",
    programIds: ["agroteknologi", "agribisnis", "peternakan"],
  },
  {
    id: "teknik",
    name: "Fakultas Teknik",
    shortName: "FT",
    description:
      "Menyiapkan engineer dan problem-solver yang menguasai teknologi industri, sipil, dan digital.",
    iconName: "HardHat",
    accentClass: "from-uniba-navy-deep to-uniba-blue",
    programIds: ["teknik-industri", "teknik-sipil", "informatika"],
  },
];

/**
 * Verbatim from "RINCIAN BIAYA PENDIDIKAN GELOMBANG 2" (Promo Kemerdekaan 2026/2027).
 * Pendaftaran (Rp300.000) and SPI (Rp4.000.000) are identical across every group and are
 * both waived by the promo — together the exact "Potongan 4,3 Juta" advertised in the Hero.
 */
export const feeGroups: FeeGroup[] = [
  {
    id: "teknik-industri-sipil",
    label: "Teknik Industri / Teknik Sipil",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 1_850_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
  {
    id: "agroteknologi",
    label: "Agroteknologi",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 1_850_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
  {
    id: "informatika",
    label: "Informatika",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 1_200_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
  {
    id: "peternakan",
    label: "Peternakan",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 1_600_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
  {
    id: "agribisnis",
    label: "Agribisnis",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 1_300_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
  {
    id: "manajemen-akuntansi-hukum",
    label: "Manajemen / Akuntansi / Ilmu Hukum",
    pendaftaran: 300_000,
    spi: 4_000_000,
    sppBasis: 2_800_000,
    sppSks: { reguler: 1_890_000, karyawan: 2_100_000 },
    biayaLainLain: 1_800_000,
  },
];

export const studyPrograms: StudyProgram[] = [
  {
    id: "manajemen",
    name: "S1 Manajemen",
    degree: "S1",
    facultyId: "feb",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Manajer Pemasaran",
      "Konsultan Bisnis",
      "Analis SDM",
      "Wirausahawan",
      "Staff Perbankan",
    ],
    feeGroupId: "manajemen-akuntansi-hukum",
  },
  {
    id: "akuntansi",
    name: "S1 Akuntansi",
    degree: "S1",
    facultyId: "feb",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Akuntan Publik",
      "Auditor Internal",
      "Staff Perpajakan",
      "Analis Keuangan",
      "Konsultan Akuntansi",
    ],
    feeGroupId: "manajemen-akuntansi-hukum",
  },
  {
    id: "s2-manajemen",
    name: "S2 Ilmu Manajemen",
    degree: "S2",
    facultyId: "feb",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Dosen / Akademisi",
      "Konsultan Manajemen Senior",
      "Manajer/Direktur Perusahaan",
      "Peneliti Bisnis",
      "Wirausahawan Strategis",
    ],
  },
  {
    id: "ilmu-hukum",
    name: "S1 Ilmu Hukum",
    degree: "S1",
    facultyId: "hukum",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Advokat / Pengacara",
      "Notaris & PPAT",
      "Legal Officer Perusahaan",
      "Konsultan Hukum",
      "Aparatur Sipil Negara",
    ],
    feeGroupId: "manajemen-akuntansi-hukum",
  },
  {
    id: "s2-hukum",
    name: "S2 Ilmu Hukum",
    degree: "S2",
    facultyId: "hukum",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Akademisi Hukum",
      "Advokat Senior",
      "Legal Counsel Korporat",
      "Konsultan Hukum Strategis",
      "Jalur Khusus Hakim/Jaksa",
    ],
  },
  {
    id: "agroteknologi",
    name: "S1 Agroteknologi",
    degree: "S1",
    facultyId: "pertanian",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Ahli Agronomi",
      "Peneliti Pertanian",
      "Konsultan Perkebunan",
      "Penyuluh Pertanian Lapangan",
      "Wirausaha Agribisnis",
    ],
    feeGroupId: "agroteknologi",
  },
  {
    id: "agribisnis",
    name: "S1 Agribisnis",
    degree: "S1",
    facultyId: "pertanian",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Manajer Agribisnis",
      "Analis Pasar Komoditas",
      "Eksportir Hasil Pertanian",
      "Konsultan Rantai Pasok",
      "Wirausaha Pertanian",
    ],
    feeGroupId: "agribisnis",
  },
  {
    id: "peternakan",
    name: "S1 Peternakan",
    degree: "S1",
    facultyId: "pertanian",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Ahli Nutrisi Ternak",
      "Manajer Peternakan",
      "Konsultan Kesehatan Hewan",
      "Wirausaha Peternakan",
      "Peneliti Bidang Peternakan",
    ],
    feeGroupId: "peternakan",
  },
  {
    id: "teknik-industri",
    name: "S1 Teknik Industri",
    degree: "S1",
    facultyId: "teknik",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Quality Control Engineer",
      "Manajer Produksi",
      "Konsultan Manajemen Operasi",
      "Supply Chain Analyst",
      "Project Engineer",
    ],
    feeGroupId: "teknik-industri-sipil",
  },
  {
    id: "teknik-sipil",
    name: "S1 Teknik Sipil",
    degree: "S1",
    facultyId: "teknik",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Site Engineer",
      "Konsultan Struktur Bangunan",
      "Estimator Proyek",
      "Kontraktor",
      "Pengawas Konstruksi",
    ],
    feeGroupId: "teknik-industri-sipil",
  },
  {
    id: "informatika",
    name: "S1 Informatika",
    degree: "S1",
    facultyId: "teknik",
    accreditation: "Terakreditasi BAN-PT",
    careerProspects: [
      "Software Engineer",
      "Data Analyst",
      "UI/UX Designer",
      "IT Consultant",
      "Cybersecurity Analyst",
    ],
    feeGroupId: "informatika",
  },
];

export const scholarships: Scholarship[] = [
  {
    id: "akademik",
    name: "Beasiswa Akademik",
    description: "Untuk lulusan dengan nilai rapor/UTBK unggul.",
    coverage: "Potongan SPP 25% – 100%",
    iconName: "GraduationCap",
  },
  {
    id: "kip-kuliah",
    name: "Beasiswa KIP Kuliah",
    description:
      "Program beasiswa pemerintah untuk mahasiswa kurang mampu dengan prestasi akademik baik.",
    coverage: "Gratis biaya kuliah penuh + uang saku bulanan",
    iconName: "ShieldCheck",
  },
  {
    id: "non-akademik",
    name: "Beasiswa Non-Akademik",
    description: "Prestasi olahraga, seni, atau organisasi tingkat daerah/nasional.",
    coverage: "Potongan SPP hingga 50%",
    iconName: "Medal",
  },
  {
    id: "tahfiz",
    name: "Beasiswa Tahfiz Al-Qur'an",
    description: "Minimal hafalan 5 juz, dibuktikan dengan sertifikat/tes hafalan.",
    coverage: "Potongan SPP hingga 75%",
    iconName: "BookOpenCheck",
  },
  {
    id: "alumni-ypb",
    name: "Beasiswa Alumni YPB",
    description: "Khusus keluarga alumni Yayasan Pendidikan Batik (YPB).",
    coverage: "Potongan biaya pendaftaran & SPP semester awal",
    iconName: "Users",
  },
  {
    id: "disabilitas",
    name: "Beasiswa Disabilitas",
    description: "Dukungan penuh aksesibilitas bagi mahasiswa penyandang disabilitas.",
    coverage: "Potongan SPP hingga 50%",
    iconName: "HeartHandshake",
  },
];

export const enrollmentSteps: EnrollmentStep[] = [
  {
    step: 1,
    title: "Pilih Prodi & Simulasi Biaya",
    duration: "1 Menit",
    description:
      "Gunakan simulator biaya untuk menemukan program studi dan estimasi pembayaran semester 1.",
    iconName: "ListChecks",
  },
  {
    step: 2,
    title: "Isi Formulir Online",
    duration: "Tanpa Ribet",
    description: "Lengkapi data diri melalui formulir pendaftaran digital, gratis biaya formulir.",
    iconName: "FileEdit",
  },
  {
    step: 3,
    title: "Verifikasi & One Day Service",
    duration: "1 Hari Kerja",
    description: "Tim admisi memverifikasi berkas dan mengonfirmasi status penerimaan dengan cepat.",
    iconName: "ShieldCheck",
  },
  {
    step: 4,
    title: "Resmi Jadi Mahasiswa UNIBA",
    duration: "Selesai",
    description:
      "Cukup bayar Rp2.000.000 untuk mulai mengikuti perkuliahan, sisanya diangsur fleksibel.",
    iconName: "GraduationCap",
  },
];

export const bentoFeatures: BentoFeature[] = [
  {
    id: "cicilan",
    title: "Biaya Kuliah Paling Fleksibel",
    description:
      "Gratis uang gedung. Cukup bayar Rp2.000.000 untuk mulai kuliah, sisanya diangsur fleksibel tanpa bunga hingga akhir semester 1.",
    iconName: "Wallet",
    size: "large",
  },
  {
    id: "karyawan",
    title: "Kelas Karyawan & Online Hybrid",
    description: "Jadwal kelas malam yang fleksibel, tidak terpaku hanya di akhir pekan — cocok untuk kamu yang sudah bekerja.",
    iconName: "Briefcase",
    size: "medium",
  },
  {
    id: "tugas-akhir",
    title: "Tugas Akhir Fleksibel",
    description: "Bisa lulus tanpa skripsi — pilih jalur tugas akhir yang paling sesuai dengan minat dan kariermu.",
    iconName: "FileEdit",
    size: "medium",
  },
  {
    id: "rpl",
    title: "Program RPL",
    description: "Konversi pengalaman kerja kamu menjadi SKS — lulus hanya dalam 2 tahun.",
    iconName: "GraduationCap",
    size: "medium",
  },
  {
    id: "lokasi",
    title: "Lokasi Strategis di Laweyan",
    description: "Pusat Kota Surakarta, dekat kuliner dan akses transportasi mudah.",
    iconName: "MapPin",
    size: "medium",
  },
  {
    id: "islami",
    title: "Lingkungan Islami & Berkarakter",
    description: "Nilai keislaman dan jiwa kewirausahaan dibangun sejak semester awal.",
    iconName: "Moon",
    size: "medium",
  },
  {
    id: "beasiswa",
    title: "Program Beasiswa Luas",
    description: "Beasiswa KIP Kuliah, Hafiz, Prestasi, hingga Alumni YPB tersedia setiap tahun.",
    iconName: "Award",
    size: "medium",
  },
];

export const testimonials: Testimonial[] = [
  {
    id: "t1",
    name: "Rina A.",
    program: "S1 Manajemen",
    cohort: "Angkatan 2021",
    quote:
      "Bayarnya ringan di awal, sisanya bisa nyicil santai — jadi kuliah nggak berat buat orang tua. Dosennya juga praktisi aktif, jadi ilmunya kepakai langsung di kerjaan.",
    outcome: "Kini bekerja sebagai Staff Marketing di perusahaan retail nasional",
  },
  {
    id: "t2",
    name: "Bagus S.",
    program: "S1 Informatika — Kelas Karyawan",
    cohort: "Angkatan 2020",
    quote:
      "Sambil kerja full-time, saya tetap bisa kuliah lewat kelas malam. Jadwalnya fleksibel banget dan tetap dapat gelar S1 resmi.",
    outcome: "Naik jabatan menjadi IT Supervisor setelah lulus",
  },
  {
    id: "t3",
    name: "Fitria N.",
    program: "S1 Ilmu Hukum — Beasiswa Tahfiz",
    cohort: "Angkatan 2022",
    quote:
      "Dapat beasiswa tahfiz jadi biaya kuliah jauh lebih ringan. Lingkungan kampusnya juga mendukung banget buat mahasiswa yang mau jaga hafalan.",
    outcome: "Aktif magang di kantor advokat sejak semester 6",
  },
];

export const faqItems: FaqItem[] = [
  {
    question: "Apakah cicilan biaya kuliah dikenakan bunga?",
    answer:
      "Tidak. Kamu cukup membayar Rp2.000.000 di awal untuk mulai mengikuti perkuliahan, dan sisanya dapat diangsur fleksibel tanpa bunga hingga akhir semester 1, tanpa jadwal cicilan tetap.",
  },
  {
    question: "Apakah kelas karyawan bisa kuliah sambil kerja?",
    answer:
      "Bisa. Kelas Malam bersifat fleksibel — tidak hanya di akhir pekan, jadwalnya dapat disesuaikan pada hari kerja di malam hari maupun akhir pekan, serta didukung pembelajaran daring untuk sebagian pertemuan agar tetap sejalan dengan jam kerja.",
  },
  {
    question: "Apa saja syarat pendaftaran PMB?",
    answer:
      "Syarat umum meliputi: mengisi formulir pendaftaran online, fotokopi ijazah/SKL, fotokopi KTP/KK, dan pas foto terbaru. Tim admisi akan memandu proses verifikasi berkas selanjutnya.",
  },
  {
    question: "Bagaimana cara mengajukan beasiswa?",
    answer:
      "Ajukan beasiswa saat proses pendaftaran online dengan melampirkan bukti pendukung (rapor, sertifikat prestasi, atau sertifikat hafalan Al-Qur'an). Tim beasiswa akan melakukan verifikasi dan seleksi.",
  },
  {
    question: "Berapa lama proses verifikasi pendaftaran?",
    answer:
      "UNIBA menerapkan One Day Service — status kelulusan administrasi pendaftaran dapat kamu ketahui dalam waktu 1 hari kerja setelah berkas lengkap diterima.",
  },
  {
    question: "Apakah tanggal pembayaran sisa biaya bisa disesuaikan?",
    answer:
      "Bisa. Sisa biaya semester 1 dapat diangsur secara fleksibel sesuai kemampuanmu, dan pembayaran semester selanjutnya juga bisa disesuaikan tanggalnya.",
  },
];

export const navLinks = [
  { label: "Program Studi", href: "#program-studi" },
  { label: "Simulasi Biaya", href: "#simulasi-biaya" },
  { label: "Beasiswa", href: "#beasiswa" },
  { label: "Cara Daftar", href: "#cara-daftar" },
  { label: "Kontak", href: "#kontak" },
];

export const contactInfo = {
  universityName: "Universitas Islam Batik Surakarta",
  shortName: "UNIBA Surakarta",
  address: "Jl. KH. Agus Salim No. 10, Sondakan, Kec. Laweyan, Kota Surakarta, Jawa Tengah 57147",
  phone: "(0271) 714751",
  phoneHref: "tel:+62271714751",
  /** Official PMB admissions WhatsApp, verified live on pmb.uniba.ac.id. */
  whatsapp: "62895621980090",
  email: "info@uniba.ac.id",
  website: "https://uniba.ac.id/",
  pmbWebsite: "https://pmb.uniba.ac.id/",
  /** Verified from the official site footer (uniba.ac.id). */
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/unibasurakarta/" },
    { label: "YouTube", href: "https://www.youtube.com/@unibasurakarta679" },
    { label: "Facebook", href: "https://www.facebook.com/unibasurakarta" },
    { label: "TikTok", href: "https://www.tiktok.com/@unibasurakarta" },
  ],
  /** Separate admissions-specific Instagram account. */
  pmbInstagram: "https://www.instagram.com/pmb.unibasurakarta/",
};

export const trustBadges = [
  { label: "Akreditasi BAN-PT", sublabel: "Institusi & Program Studi" },
  { label: "10.000+ Alumni", sublabel: "Tersebar di berbagai industri" },
  { label: "Legal Kemendikbudristek", sublabel: "Terdaftar resmi sebagai PT" },
];

export const rplPromo = {
  title: "Program RPL",
  description: "Konversi pengalaman kerja kamu menjadi SKS — lulus hanya dalam 2 tahun.",
};

export function getFacultyPrograms(facultyId: string): StudyProgram[] {
  return studyPrograms.filter((program) => program.facultyId === facultyId);
}

/** Only programs with official Promo Kemerdekaan fee data — safe for Simulasi Biaya. */
export function getFacultyProgramsWithPricing(facultyId: string): StudyProgram[] {
  return getFacultyPrograms(facultyId).filter((program) => program.feeGroupId !== undefined);
}

export function getProgramById(programId: string): StudyProgram | undefined {
  return studyPrograms.find((program) => program.id === programId);
}

export function getFeeGroup(program: StudyProgram): FeeGroup {
  const group = feeGroups.find((item) => item.id === program.feeGroupId);
  if (!group) {
    throw new Error(`No fee group found for program ${program.id}`);
  }
  return group;
}

/** Full official Semester 1 breakdown, with Pendaftaran + SPI waived by the promo. */
export function calculateSemester1Detail(program: StudyProgram, classType: ClassType) {
  const group = getFeeGroup(program);
  const sppSks = group.sppSks[classType];
  const waivedTotal = group.pendaftaran + group.spi;
  const semesterTotal = group.sppBasis + sppSks + group.biayaLainLain;
  // Flat, not proportional. Math.min guards the case of a programme whose semester
  // total is below the flat figure; none currently are, but the invariant should hold.
  const downPayment = Math.min(paymentScheme.downPayment, semesterTotal);
  const remaining = semesterTotal - downPayment;

  return {
    pendaftaran: group.pendaftaran,
    spi: group.spi,
    sppBasis: group.sppBasis,
    sppSks,
    biayaLainLain: group.biayaLainLain,
    waivedTotal,
    semesterTotal,
    downPayment,
    remaining,
  };
}

/** Semester 2+ estimate: SPP Basis + SPP SKS + flat heregistrasi (no SPI/Biaya Lain-lain). */
export function calculateNextSemesterEstimate(program: StudyProgram, classType: ClassType) {
  const group = getFeeGroup(program);
  return group.sppBasis + group.sppSks[classType] + HEREGISTRASI_PER_SEMESTER;
}

/**
 * Spreads the semester 2+ nominal across `months` monthly installments (rounded up to the
 * nearest Rp1.000, so the total collected is never less than what's actually owed).
 */
export function calculateNextSemesterMonthly(
  program: StudyProgram,
  classType: ClassType,
  months: NextSemesterInstallmentMonths
) {
  const total = calculateNextSemesterEstimate(program, classType);
  const monthly = Math.ceil(total / months / 1000) * 1000;
  return { total, monthly };
}
