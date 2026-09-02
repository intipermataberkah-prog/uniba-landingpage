import type { Metadata } from "next";
import { Geist, Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import BackgroundMusic from "@/components/BackgroundMusic";
import { PaperTearProvider } from "@/components/PaperTear";
import AnalyticsProvider from "@/components/analytics/AnalyticsProvider";
import {
  GoogleTagManager,
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import { getBaseUrl, siteConfig } from "@/lib/site";

/**
 * Closest licence-clean stand-ins for the reference's commercial pair
 * (PP Neue Montreal + PP Editorial New). See docs/teardown-getflect.md.
 *
 * Geist is a modern Swiss-influenced neo-grotesk with the same tight apertures
 * Neue Montreal has, and it carries both headings and body exactly as the
 * reference does with a single grotesk. Instrument Serif is the high-contrast
 * display serif standing in for Editorial New, loaded at 400 only because that
 * is the single weight the reference uses it at, sparingly, as an accent.
 */
const geist = Geist({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistBody = Geist({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-accent",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

const baseUrl = getBaseUrl();
const title = "PMB UNIBA Surakarta — Kuliah Terjangkau, Gratis Uang Gedung";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: title,
    template: "%s | UNIBA Surakarta",
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.university }],
  creator: siteConfig.university,
  publisher: siteConfig.university,
  category: "education",
  // Next normalises the root canonical and drops the trailing slash; Google
  // treats the two root forms as the same URL, so this is left as-is.
  alternates: {
    canonical: "/",
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: "/",
    siteName: "UNIBA Surakarta",
    title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${geist.variable} ${geistBody.variable} ${instrumentSerif.variable} h-full antialiased scroll-smooth`}
    >
      <GoogleTagManager />
      <body className="min-h-full flex flex-col bg-white text-slate-dark">
        <GoogleTagManagerNoScript />
        <AnalyticsProvider />
        {/* StructuredData is rendered per-page, not here: its FAQPage must mirror the
            questions actually visible on that page, and /rpl only shows a subset. */}
        {/* Here rather than inside a page so one sweep can span two routes: the page
            that starts the transition unmounts the moment the route commits. */}
        <PaperTearProvider>{children}</PaperTearProvider>
        {/* In the layout rather than the page so playback survives client-side
            navigation between / and /rpl instead of restarting each time. */}
        <BackgroundMusic />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
