import { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Blok 1 (PRD). Satu-satunya tempat latar langit dan huruf Instrument Serif boleh dipakai.

type Aksi = { label: string; href: string };

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  primaryAction: Aksi;
  secondaryAction?: Aksi;
};

export function Hero({ eyebrow, title, subtitle, primaryAction, secondaryAction }: HeroProps) {
  return (
    <section className="relative isolate overflow-hidden">
      <LatarLangit />
      <div className="mx-auto max-w-6xl px-4 pt-24 pb-28 sm:px-6 sm:pt-32 sm:pb-36 lg:px-8 lg:pt-40 lg:pb-44">
        <div className="max-w-2xl motion-safe:animate-fade-up">
          <p className="text-sm font-semibold text-uniba-navy-deep">{eyebrow}</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.05] tracking-tight text-uniba-navy italic sm:text-6xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-700">{subtitle}</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={primaryAction.href}
              className="inline-flex items-center gap-2 rounded-full bg-uniba-navy px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-uniba-navy-deep"
            >
              {primaryAction.label}
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="inline-flex items-center rounded-full border border-uniba-navy/15 bg-white px-6 py-3 text-sm font-semibold text-uniba-navy transition-colors hover:border-uniba-navy/40"
              >
                {secondaryAction.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Gradasi CSS jadi dasar supaya hero tetap berlangit selama gambar belum termuat.
// Kontras teks navy di atas gambar ini sudah diukur oleh landing/scripts/make-sky.py (≥ 8,8:1).
function LatarLangit() {
  const umum = { alt: "", sizes: "100vw" };
  const {
    props: { srcSet: desktop },
  } = getImageProps({ ...umum, src: "/sky/hero-sky.webp", width: 2000, height: 1116 });
  const {
    props: { srcSet: ponsel, ...img },
  } = getImageProps({ ...umum, src: "/sky/hero-sky-mobile.webp", width: 1100, height: 1970 });

  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#80b6e4_0%,#a9cfef_28%,#dcecf9_62%,#f9fcff_100%)]" />
      <picture>
        <source media="(min-width: 640px)" srcSet={desktop} />
        <source srcSet={ponsel} />
        <img {...img} alt="" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
      </picture>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-linear-to-b from-white/0 to-white" />
    </div>
  );
}
