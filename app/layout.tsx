import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const siteUrl = "https://uniba.ac.id";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PMB UNIBA Surakarta — Kuliah Murah Solo, Cicilan Fleksibel",
    template: "%s | UNIBA Surakarta",
  },
  description:
    "Pendaftaran Mahasiswa Baru Universitas Islam Batik Surakarta. Kuliah S1 & S2 terakreditasi BAN-PT dengan biaya terjangkau, angsuran fleksibel tanpa bunga, dan kelas malam fleksibel di pusat Kota Solo.",
  keywords: [
    "PMB UNIBA Surakarta",
    "Kuliah Murah Solo",
    "Kelas Karyawan Surakarta",
    "Universitas Islam Batik Surakarta",
    "Kuliah Cicilan Solo",
    "Beasiswa UNIBA",
  ],
  authors: [{ name: "Universitas Islam Batik Surakarta" }],
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "UNIBA Surakarta",
    title: "PMB UNIBA Surakarta — Kuliah Murah Solo, Cicilan Fleksibel",
    description:
      "Kuliah S1 & S2 berkualitas, terakreditasi BAN-PT, biaya terjangkau dengan skema angsuran fleksibel. Daftar sekarang di UNIBA Surakarta.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "UNIBA Surakarta" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PMB UNIBA Surakarta — Kuliah Murah Solo, Cicilan Fleksibel",
    description:
      "Kuliah S1 & S2 berkualitas dengan biaya terjangkau & angsuran fleksibel di Universitas Islam Batik Surakarta.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${jakarta.variable} ${inter.variable} ${playfair.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col bg-alabaster text-slate-dark">
        {children}
      </body>
    </html>
  );
}
