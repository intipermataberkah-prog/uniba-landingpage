import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import Hero3D from "@/components/preview3d/Hero3D";
import PaymentStory3D from "@/components/preview3d/PaymentStory3D";
import ScrollRefresh from "@/components/preview3d/ScrollRefresh";
import BentoGrid from "@/components/BentoGrid";
import TuitionCalculator from "@/components/TuitionCalculator";
import FAQSection from "@/components/FAQSection";
import Footer from "@/components/Footer";

/**
 * Design prototype for the GSAP 3D scroll direction. NOT the live landing page.
 *
 * noindex/nofollow is mandatory here: this route serves the same copy as "/", so
 * letting Google index it would create a duplicate-content competitor against
 * the page the ad budget points at.
 *
 * Below the two 3D sections it reuses the real BentoGrid, TuitionCalculator and
 * FAQ so the new treatment can be judged in context rather than in isolation.
 */
export const metadata: Metadata = {
  // Hyphen, not an em-dash: this string renders in the browser tab.
  title: "Preview 3D - Prototype",
  robots: { index: false, follow: false, nocache: true },
};

export default function Preview3DPage() {
  return (
    <>
      <div className="fixed top-4 left-1/2 z-50 -translate-x-1/2">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-uniba-navy-950/80 px-4 py-2 text-xs font-bold text-white backdrop-blur-sm transition-colors hover:border-uniba-gold/60"
        >
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          PROTOTYPE — kembali ke situs live
        </Link>
      </div>

      <main className="flex-1">
        <Hero3D />
        <PaymentStory3D />
        <BentoGrid />
        <TuitionCalculator />
        <FAQSection />
      </main>

      <Footer />
      {/* Last on the page on purpose: both scroll sections must exist before
          their start/end boundaries are recomputed. */}
      <ScrollRefresh />
    </>
  );
}
