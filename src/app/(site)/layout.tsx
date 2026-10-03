import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";

import { FadeUp } from "@/components/FadeUp";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

// Hanya potongan italic yang dimuat, karena hanya judul hero yang memakainya.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument-serif",
});

export const metadata: Metadata = {
  title: {
    default: "Universitas Islam Batik Surakarta",
    template: "%s | UNIBA Surakarta",
  },
  description:
    "Situs resmi Universitas Islam Batik Surakarta: fakultas, program studi, berita, dan pendaftaran mahasiswa baru.",
  // Staging tidak boleh diindeks (Arsitektur §15). Dibuka saat tayang.
  robots: { index: false, follow: false },
};

export default function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${geist.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-svh flex-col bg-white font-sans text-slate-900">
        <a
          href="#konten"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-uniba-navy focus:px-4 focus:py-2 focus:text-white"
        >
          Lewati ke konten
        </a>
        <SiteHeader />
        <main id="konten" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <FadeUp />
      </body>
    </html>
  );
}
