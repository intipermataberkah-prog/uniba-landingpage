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
   * Omitted for programs (e.g. S2) not covered by the source fee document;
   * the Simulasi Biaya calculator excludes any program without one rather than guess.
   */
  feeGroupId?: string;
}

/**
 * One row of the official "Rincian Biaya Pendidikan Gelombang 2" table. Biaya Lain-lain is
 * paid once, in semester 1 only. SPP Basis + SPP SKS recur every semester alongside a flat
 * Rp150.000 heregistrasi fee (see HEREGISTRASI_PER_SEMESTER).
 *
 * Pendaftaran and SPI are waived for every intake -- REGULER, KARYAWAN and RPL alike --
 * their sum is the advertised "Potongan 4,3 Juta". RPL carries this same waiver plus its
 * own additional concession on top (see `rplConversion`). Read the waiver off
 * `calculateSemester1Detail` / `calculateRplSemester1Detail` rather than assuming it.
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
 * gedung") remain waived for the Kelas Pagi and Kelas Malam intakes for the whole
 * registration period, unchanged by the September campaign. Under the SK updating the
 * RPL concession, RPL now carries this same waiver too, on top of its own halved
 * per-credit conversion fee (see `rplConversion`).
 *
 * The Rp2.000.000 needed to start attending classes is the same on every route, RPL
 * included.
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

/**
 * The registration wave currently open.
 *
 * `name` is an ADMINISTRATIVE label. It gets interpolated into sentences like
 * "Rincian biaya resmi ...", so it has to stay a noun phrase. The campaign slogan lives
 * in campaignTagline below, deliberately separate.
 *
 * No wave number here. The next number was never supplied, and "Gelombang Terakhir" works
 * as its own label; inventing "Gelombang 3" would publish an official designation that has
 * no source behind it.
 */
export const promoPeriod = {
  name: "Gelombang Terakhir",
  academicYear: "2026/2027",
  startDate: "2026-09-01",
  endDate: "2026-09-30",
};

/**
 * September campaign line.
 *
 * It sells the change in the person rather than the size of the discount, and UNIBA has
 * products that actually deliver that: RPL converts work experience into credits, Kelas
 * Malam removes the need to stop working, and finishing in 2 years without a skripsi
 * completes the upgrade instead of leaving it hanging.
 *
 * `lines` exists so the hero can set the two halves on separate lines without splitting
 * the string in the component.
 */
export const campaignTagline = {
  full: "Upgrade Dirimu, Upgrade Masa Depanmu",
  lines: ["Upgrade Dirimu,", "Upgrade Masa Depanmu"],
} as const;

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
    accentClass: "from-uniba-sky-deep to-uniba-sky",
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
  // A real route among the anchors. Both Navbar and Footer branch on the leading "#".
  { label: "Program S2", href: "/s2" },
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
  /** Action label. Without one the hero bar reads as a notice, not a link. */
  ctaLabel: "Lihat Program",
};

/**
 * The study programmes that actually run RPL.
 *
 * This is NOT every programme with a fee group. The /rpl page used to list all nine
 * priced programmes, which advertised RPL on four that do not offer it -- Agribisnis,
 * Peternakan, Teknik Sipil and Informatika. A working adult could have read that page,
 * paid to register, and been turned away at the counter.
 *
 * Ordered as written, not sorted, so the table reads in the order the campus lists them.
 */
export const rplProgramIds = [
  "manajemen",
  "akuntansi",
  "ilmu-hukum",
  "agroteknologi",
  "teknik-industri",
] as const;

/** The programmes open to RPL, in listing order. Throws if an id ever goes stale. */
export function getRplPrograms(): StudyProgram[] {
  return rplProgramIds.map((id) => {
    const program = studyPrograms.find((p) => p.id === id);
    if (!program) {
      throw new Error(`rplProgramIds references unknown study program "${id}"`);
    }
    if (!program.feeGroupId) {
      throw new Error(`RPL programme "${id}" has no fee group, so it cannot be priced`);
    }
    return program;
  });
}

/**
 * The RPL conversion fee, charged once per credit recognised from prior work experience.
 *
 * This is the concession that is EXCLUSIVE to RPL, on top of the Rp4.300.000 Pendaftaran +
 * SPI waiver it now shares with Kelas Pagi and Kelas Malam under the updated SK. Everything
 * else -- SPP Basis, SPP SKS at the Kelas Malam rate, Biaya Lain-lain -- matches the Kelas
 * Malam schedule exactly.
 *
 * How many credits an applicant is granted is decided case by case from their transcript
 * and portfolio, so there is no single conversion total to publish. `ILLUSTRATION_SKS`
 * exists only to show the arithmetic at a few plausible counts; it is never presented as
 * a quote.
 */
export const rplConversion = {
  normalPerSks: 100_000,
  promoPerSks: 50_000,
  /** Credit counts used purely to demonstrate the rate. Not an offer. */
  illustrationSks: [60, 80, 100] as const,
  label: "Biaya Konversi RPL",
  unit: "per SKS diakui",
  note:
    "Jumlah SKS yang diakui ditentukan per pendaftar, berdasarkan transkrip dan portofolio pengalaman kerja. Angka di atas adalah ilustrasi tarif, bukan penawaran.",
  /**
   * Stated on the page rather than left out. A visitor arriving from the homepage has
   * just been told "Gratis Uang Gedung, potongan Rp4.300.000" on every screen, and RPL
   * now honours that too -- plus the conversion concession that is exclusive to this
   * route. Saying both plainly, together, is both the honest and the more persuasive
   * order.
   */
  waiverNote:
    "Jalur RPL kini juga mendapat potongan Rp4.300.000 untuk Pendaftaran dan SPI, sama seperti Kelas Pagi dan Kelas Malam — ditambah biaya konversi per SKS yang dipotong setengah, khusus untuk jalur ini.",
};

/** Cost of converting `sks` credits, at both the normal and the promo rate. */
export function calculateRplConversion(sks: number) {
  const normal = sks * rplConversion.normalPerSks;
  const promo = sks * rplConversion.promoPerSks;
  return { sks, normal, promo, saving: normal - promo };
}

export function getFacultyPrograms(facultyId: string): StudyProgram[] {
  return studyPrograms.filter((program) => program.facultyId === facultyId);
}

/** Only programs with official fee data — safe for Simulasi Biaya. */
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

/**
 * Semester 1 for an RPL intake.
 *
 * Same official figures as Kelas Malam, and now the same Pendaftaran + SPI waiver too --
 * `waivedTotal` sits beside `semesterTotal` exactly as it does in
 * `calculateSemester1Detail`. Kept as its own function rather than reusing that one
 * because RPL always bills at the Kelas Malam SPP SKS rate specifically, not a
 * caller-supplied `classType`.
 *
 * The conversion fee is deliberately NOT folded in. It is billed per recognised credit,
 * the credit count is decided per applicant, and mixing an individual assessment into a
 * published semester total would turn a fixed figure into a guess.
 */
export function calculateRplSemester1Detail(program: StudyProgram) {
  const group = getFeeGroup(program);
  const sppSks = group.sppSks.karyawan;
  const waivedTotal = group.pendaftaran + group.spi;
  const semesterTotal = group.sppBasis + sppSks + group.biayaLainLain;
  const downPayment = Math.min(paymentScheme.downPayment, semesterTotal);

  return {
    pendaftaran: group.pendaftaran,
    spi: group.spi,
    sppBasis: group.sppBasis,
    sppSks,
    biayaLainLain: group.biayaLainLain,
    waivedTotal,
    semesterTotal,
    downPayment,
    remaining: semesterTotal - downPayment,
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

/* ---------------------------------------------------------------------------
 * S2 / Magister
 *
 * A separate contract from the S1 tables above, because the two are priced on
 * different shapes entirely. S1 quotes per semester against SPP Basis + SPP SKS and a
 * one-off SPI; S2 quotes a flat SPP every semester with named milestone fees attached to
 * the semesters they fall in -- matrikulasi at the start, seminar proposal in semester 2,
 * the thesis examination in semester 3. Forcing S2 through calculateSemester1Detail would
 * have meant inventing an SPI and an SKS rate that do not exist on this route.
 * ------------------------------------------------------------------------ */

export interface S2FeeItem {
  label: string;
  amount: number;
  /** Recurring every semester, as opposed to a one-off milestone charge. */
  recurring?: boolean;
}

export interface S2Semester {
  semester: number;
  items: S2FeeItem[];
}

/** Verbatim from the official S2 fee schedule. Do not adjust without a new document. */
export const s2FeeSchedule: S2Semester[] = [
  {
    semester: 1,
    items: [
      { label: "Pendaftaran", amount: 500_000 },
      { label: "SPP", amount: 5_400_000, recurring: true },
      { label: "Biaya Lain-lain", amount: 1_900_000 },
      { label: "Matrikulasi", amount: 1_000_000 },
    ],
  },
  {
    semester: 2,
    items: [
      { label: "SPP", amount: 5_400_000, recurring: true },
      { label: "Seminar Proposal", amount: 500_000 },
    ],
  },
  {
    semester: 3,
    items: [
      { label: "SPP", amount: 5_400_000, recurring: true },
      { label: "Ujian Tesis", amount: 1_500_000 },
    ],
  },
  {
    semester: 4,
    items: [{ label: "SPP", amount: 5_400_000, recurring: true }],
  },
];

/** The figure that secures a seat, and the total the schedule above adds up to. */
export const s2Payment = {
  downPayment: 2_400_000,
  /**
   * Stated on the official schedule as Rp27.000.000. Asserted rather than printed:
   * the page derives every total from the line items, so a typo in any single line
   * would otherwise publish a schedule that quietly disagrees with its own sum.
   */
  statedGrandTotal: 27_000_000,
  semesters: 4,
};

export function s2SemesterTotal(semester: S2Semester): number {
  return semester.items.reduce((sum, item) => sum + item.amount, 0);
}

export function s2GrandTotal(): number {
  const total = s2FeeSchedule.reduce((sum, s) => sum + s2SemesterTotal(s), 0);
  if (total !== s2Payment.statedGrandTotal) {
    throw new Error(
      `S2 fee schedule adds up to ${total} but the official document states ` +
        `${s2Payment.statedGrandTotal}. One of the two is wrong; do not publish either.`
    );
  }
  if (s2FeeSchedule.length !== s2Payment.semesters) {
    throw new Error("s2FeeSchedule length disagrees with s2Payment.semesters");
  }
  return total;
}

/**
 * The two Magister routes, with the degree titles UNIBA publishes for them.
 *
 * Accreditation is carried per programme and only where UNIBA actually states it. The
 * PMB portal publishes "Baik Sekali" for Manajemen and publishes none for Hukum, so
 * none is claimed for Hukum -- an invented grade on a postgraduate page is the kind of
 * thing a prospective student checks against BAN-PT directly.
 */
export const s2Programs = [
  {
    id: "s2-manajemen",
    name: "Magister Manajemen",
    degree: "M.Si",
    accreditation: "Baik Sekali",
    summary:
      "Untuk yang sudah memimpin tim atau unit dan butuh dasar analitis untuk keputusan " +
      "yang lebih besar — perencanaan, pengendalian, dan pengambilan keputusan berbasis data.",
    prospects: [
      "Manajer / Direktur Perusahaan",
      "Konsultan Manajemen Senior",
      "Dosen / Akademisi",
      "Peneliti Bisnis",
      "Wirausahawan Strategis",
    ],
  },
  {
    id: "s2-hukum",
    name: "Magister Hukum",
    degree: "M.H.",
    concentration: "Cyber Law",
    summary:
      "Satu-satunya konsentrasi hukum siber di Solo Raya. Visi program studinya menyebut " +
      "hukum siber secara eksplisit, bukan sebagai mata kuliah pilihan.",
    prospects: [
      "Pengacara / Advokat",
      "Konsultan hukum perusahaan atau institusi",
      "Hakim",
      "Jaksa",
      "Polisi",
      "Dosen",
      "Birokrat",
      "Perbankan",
      "Peneliti masalah hukum",
    ],
  },
] as const;

/**
 * Why an S2 page exists at all, in the words the audience uses.
 *
 * Sourced from UNIBA's own reporting on its BKPSDM Kota Surakarta collaboration: for an
 * ASN, a higher qualification maps directly onto job class and talent-management
 * weighting. That is a concrete career mechanism, not a slogan, and it is the strongest
 * reason this page has to say anything at all.
 */
export const s2Reasons = [
  {
    title: "Naik jenjang, naik kelas jabatan",
    body:
      "Bagi ASN, kualifikasi pendidikan setingkat lebih tinggi berbanding lurus dengan " +
      "penyesuaian kelas jabatan dan bobot penilaian dalam talent management.",
  },
  {
    // Named days deliberately absent. This claim has been wrong twice -- first as
    // "Senin-Jumat malam", borrowed from a UNIBA article about the D3-to-S1 route, then
    // as "Jumat-Minggu", which overcorrected -- so the page now states only the part
    // that has held throughout: the timetable sits outside working hours. The actual
    // day grid belongs with admissions, like the intake dates already do.
    title: "Kelas di luar jam kerja",
    body:
      "Perkuliahan digelar di luar jam kerja, sehingga pekerjaan dan tugas kedinasan " +
      "sehari-hari tetap jalan.",
  },
  {
    title: "43 tahun di pusat Kota Solo",
    body:
      "Kampus di Jl. KH Agus Salim No. 10, Purwosari — dapat ditempuh langsung selepas jam " +
      "kerja tanpa keluar kota.",
  },
] as const;

/** The hero's entry point to /s2, mirroring rplPromo. */
export const s2Promo = {
  title: "Program S2",
  description: "Magister Manajemen & Magister Hukum — lanjut kuliah tanpa berhenti kerja.",
  ctaLabel: "Lihat Program",
};

/**
 * Registration for a Magister goes through WhatsApp, and only WhatsApp.
 *
 * This is not a styling preference, it is a routing fact: the self-serve PMB portal
 * handles the S1 intake. Offering it on this page -- which the shared DaftarDialog did
 * -- sends a postgraduate applicant to a form that cannot take them, and the lead is
 * most likely lost at that point rather than redirected.
 *
 * The prefilled message names the programme so admissions can route the conversation
 * without a round trip.
 */
export const s2Registration = {
  channelNote:
    "Pendaftaran Program Magister dilayani langsung oleh tim admisi melalui WhatsApp, " +
    "bukan lewat portal pendaftaran online.",
  waMessage:
    "Assalamu'alaikum, saya ingin mendaftar Program Magister (S2) UNIBA Surakarta. " +
    "Mohon informasi jadwal kelas dan langkah pendaftarannya.",
};

/** The admissions WhatsApp link for the Magister route, message already filled in. */
export function s2WhatsAppLink(): string {
  return `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(
    s2Registration.waMessage
  )}`;
}

/** Steps that are specific to postgraduate entry rather than the S1 flow. */
export const s2Notes = {
  asn:
    "Khusus ASN: ajukan rekomendasi ke BKPSDM instansi Anda sebelum mendaftar, sesuai " +
    "prosedur administrasi kepegawaian yang berlaku.",
  thesis:
    "Lulusan S2 memaparkan hasil tesisnya agar temuannya dapat diterapkan di unit kerja " +
    "masing-masing.",
} as const;
