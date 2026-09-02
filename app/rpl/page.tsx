import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  GraduationCap,
  ShieldCheck,
  Users,
  BadgeCheck,
  Check,
} from "lucide-react";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import SocialFloatingDock from "@/components/SocialFloatingDock";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Reveal } from "@/components/Reveal";
import { CloudDrift } from "@/components/CloudDrift";
import { SkyBackdrop } from "@/components/SkyBackdrop";
import { DaftarDialog } from "@/components/DaftarDialog";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";
import { getBaseUrl } from "@/lib/site";
import { cn, formatIDR } from "@/lib/utils";
import {
  bentoFeatures,
  calculateRplConversion,
  calculateRplSemester1Detail,
  classTypeLabels,
  contactInfo,
  enrollmentSteps,
  faqItems,
  feeExclusions,
  paymentScheme,
  rplConversion,
  rplPromo,
  getRplPrograms,
  rplProgramIds,
  testimonials,
  trustBadges,
} from "@/data/unibaData";

/**
 * Program RPL landing page.
 *
 * CONTENT RULE: every factual claim here is rendered from data/unibaData.ts. Nothing
 * about RPL entry requirements, how many SKS a given job converts to, or class
 * timetables is asserted beyond what the content contract already states — those
 * specifics are routed to the admissions team through DaftarDialog instead of guessed.
 *
 * Rendered entirely on the server (no motion wrapper) so the copy is in the initial
 * HTML for crawlers; the page targets "kuliah karyawan Solo" / "kelas malam Solo",
 * which no Solo-based campus currently ranks for.
 */

/** Purely structural labels — no claims live here, see the content rule above. */
const LABELS = {
  back: "Kembali ke Halaman Utama",
  advantages: "Kenapa Program RPL",
  programs: "Pilihan Program Studi",
  // Was "Seluruh program studi S1 di bawah ini" -- true of the table, but it read as
    // "every S1 programme", which is exactly the wrong impression on a page that now
    // lists five of nine. The count is derived so it cannot drift from the list.
  programsDesc: `${rplProgramIds.length} program studi S1 di bawah ini membuka jalur RPL dengan skema biaya Kelas Malam.`,
  fees: "Rincian Biaya RPL",
  feesDesc:
    "Skema biaya RPL mengikuti Kelas Malam, dengan satu potongan yang hanya ada di jalur ini.",
  conversion: "Potongan khusus RPL",
  semester1: "Biaya Semester 1",
  story: "Cerita Alumni",
  steps: "Cara Daftar",
  faq: "Pertanyaan yang Sering Diajukan",
  ctaTitle: "Siap Jadi Bagian UNIBA?",
} as const;

const trustBadgeIcons = [ShieldCheck, Users, BadgeCheck];

// Features already written for the working-adult / RPL audience, pulled by id.
const FEATURE_IDS = ["rpl", "karyawan", "tugas-akhir", "cicilan"] as const;
const rplFeatures = FEATURE_IDS.map((id) =>
  bentoFeatures.find((feature) => feature.id === id)
).filter((feature): feature is NonNullable<typeof feature> => feature !== undefined);

/**
 * Only the programmes that actually run RPL -- five of the nine priced ones.
 *
 * This used to be every programme with a fee group, which put Agribisnis, Peternakan,
 * Teknik Sipil and Informatika on a page promising RPL they do not offer.
 */
const rplPrograms = getRplPrograms();

/** The two contract questions that speak to this audience, verbatim. */
const rplFaqs = faqItems.filter((item) => /kelas karyawan|bunga/i.test(item.question));

/** The alumnus whose testimonial is explicitly a Kelas Karyawan story. */
const rplTestimonial = testimonials.find((t) => /kelas karyawan/i.test(t.program));

const pageTitle = `${rplPromo.title} — Kuliah Karyawan & ${classTypeLabels.karyawan} Solo`;

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Program RPL UNIBA Surakarta: konversi pengalaman kerja jadi SKS, kuliah Kelas Malam " +
    "fleksibel sambil bekerja, gratis uang gedung. Kampus di Laweyan, Kota Solo.",
  alternates: { canonical: "/rpl" },
  openGraph: {
    type: "website",
    url: "/rpl",
    title: pageTitle,
    siteName: "UNIBA Surakarta",
  },
};

export default function RplPage() {
  const baseUrl = getBaseUrl();

  // Schema mirrors only what this page actually renders, as Google requires.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PMB UNIBA Surakarta", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: rplPromo.title, item: `${baseUrl}/rpl` },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${baseUrl}/rpl#faq`,
        mainEntity: rplFaqs.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />

      <main className="flex-1">
        {/* ---------------- Hero ---------------- */}
        {/*
          The light sky hero, identical in treatment to the homepage.

          This was a navy gradient panel with white type, left over from before the sky
          campaign. Two things were wrong with it. It read as a different site: a visitor
          arriving from the homepage crossed from a bright sky to a dark panel with no
          reason given. And it broke the header outright -- the floating bar is
          transparent at rest and sets navy ink, which on a navy hero rendered the logo
          and wordmark navy-on-navy, effectively invisible.
        */}
        <section className="relative isolate overflow-hidden bg-white">
          <SkyBackdrop />

          <Container>
            <div className="relative flex flex-col items-center py-24 text-center sm:py-32 lg:py-40">
              <Reveal index={0} y={12} className="mb-8">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-uniba-navy/12 bg-white/70 px-4 py-2 text-sm font-medium text-uniba-navy shadow-sm backdrop-blur-sm transition-colors hover:border-uniba-navy/25 hover:bg-white focus-visible:ring-2 focus-visible:ring-uniba-sky-deep focus-visible:outline-none"
                >
                  <ArrowLeft className="size-4 text-uniba-sky-deep" aria-hidden="true" />
                  {LABELS.back}
                </Link>
              </Reveal>

              <Reveal
                as="h1"
                index={1}
                className="max-w-4xl text-balance font-heading text-[2.15rem] font-semibold leading-display tracking-display text-uniba-navy sm:text-5xl lg:text-[3.4rem]"
              >
                {rplPromo.title}:{" "}
                {/* Instrument Serif italic on the phrase that carries the promise --
                    the same one gesture the homepage tagline makes, in the same place. */}
                <span className="font-accent font-normal italic text-uniba-sky-deep">
                  {classTypeLabels.karyawan}
                </span>{" "}
                untuk Kamu yang Sudah Bekerja
              </Reveal>

              <Reveal
                as="p"
                index={2}
                className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-uniba-navy/70 sm:text-lg"
              >
                {rplPromo.description}
              </Reveal>

              <Reveal
                index={3}
                className="mt-10 flex w-full flex-col justify-center gap-3 sm:w-auto sm:flex-row"
              >
                <DaftarDialog
                  trigger={
                    <Button
                      size="lg"
                      className="group h-13 rounded-full bg-uniba-navy px-8 text-[0.95rem] font-medium text-white transition-transform hover:-translate-y-0.5 hover:bg-uniba-navy-deep"
                    >
                      Daftar Sekarang
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  }
                />
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-13 w-full rounded-full border-uniba-navy/15 bg-white/70 px-8 text-[0.95rem] text-uniba-navy backdrop-blur-sm transition-colors hover:border-uniba-navy/30 hover:bg-white hover:text-uniba-navy sm:w-auto"
                >
                  <a href="#biaya-rpl">Lihat Rincian Biaya</a>
                </Button>
              </Reveal>

              <Reveal
                index={4}
                className="mt-16 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3"
              >
                {trustBadges.map((badge, index) => {
                  const Icon = trustBadgeIcons[index] ?? ShieldCheck;
                  return (
                    <div
                      key={badge.label}
                      className="flex items-center gap-3 rounded-2xl border border-uniba-navy/8 bg-white/75 px-4 py-3 text-left backdrop-blur-sm"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-uniba-sky/15">
                        <Icon className="size-4.5 text-uniba-sky-deep" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-uniba-navy">{badge.label}</p>
                        <p className="text-xs leading-snug text-uniba-navy/55">
                          {badge.sublabel}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ---------------- Advantages ---------------- */}
        <section className="bg-uniba-cloud/50 py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading eyebrow={rplPromo.title} title={LABELS.advantages} />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
              {rplFeatures.map((feature, index) => {
                const Icon = iconMap[feature.iconName] ?? GraduationCap;
                const feature3d = index === 0;
                return (
                  <Reveal
                    as="article"
                    key={feature.id}
                    index={index}
                    className={cn(
                      "rounded-2xl p-7 transition-transform hover:-translate-y-0.5 sm:p-8",
                      feature3d
                        ? "relative overflow-hidden border border-uniba-navy/10 bg-white shadow-elev-3 md:col-span-2"
                        : "border border-uniba-navy/10 bg-white shadow-elev-1"
                    )}
                  >
                    {/* The homepage's large tile carries a soft sky wash in its corner
                        rather than a filled panel; this is the same gesture. */}
                    {feature3d ? (
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-uniba-sky-gradient opacity-10 blur-3xl"
                      />
                    ) : null}
                    <div className="relative">
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl",
                          feature3d
                            ? "bg-uniba-navy/5 text-uniba-navy ring-1 ring-inset ring-uniba-navy/10"
                            : "bg-uniba-sky/12 text-uniba-sky-deep ring-1 ring-uniba-sky/25"
                        )}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3
                        className={cn(
                          "mt-5 font-heading font-bold tracking-tight",
                          feature3d ? "text-2xl text-slate-dark sm:text-3xl" : "text-xl text-slate-dark"
                        )}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 leading-relaxed",
                          feature3d
                            ? "max-w-2xl text-base text-muted-foreground sm:text-lg"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ---------------- Fees ---------------- */}
        <section id="biaya-rpl" className="bg-white py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading
              eyebrow={classTypeLabels.karyawan}
              title={LABELS.fees}
              description={LABELS.feesDesc}
            />

            {/* The RPL concession, first, because it is the only thing on this page
                that differs from the Kelas Malam schedule. */}
            <Reveal className="mt-14 overflow-hidden rounded-2xl border border-uniba-sky/30 bg-uniba-cloud/60">
              <div className="flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-center lg:gap-10">
                <div className="lg:w-2/5">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky-deep">
                    {LABELS.conversion}
                  </p>
                  <h3 className="mt-2 font-heading text-xl font-bold text-slate-dark">
                    {rplConversion.label}
                  </h3>
                  <p className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="text-lg text-muted-foreground line-through tabular-nums">
                      {formatIDR(rplConversion.normalPerSks)}
                    </span>
                    <span className="font-heading text-3xl font-extrabold text-uniba-sky-deep tabular-nums sm:text-4xl">
                      {formatIDR(rplConversion.promoPerSks)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {rplConversion.unit}
                    </span>
                  </p>
                </div>

                {/* The rate multiplied out. One number cannot be published here -- the
                    recognised credit count is assessed per applicant -- so the page shows
                    the arithmetic at a few plausible counts and says so underneath. */}
                <ul className="flex-1 divide-y divide-uniba-navy/10 rounded-xl bg-white/70 px-4 ring-1 ring-uniba-navy/8">
                  {rplConversion.illustrationSks.map((sks) => {
                    const c = calculateRplConversion(sks);
                    return (
                      <li
                        key={sks}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3"
                      >
                        <span className="text-sm font-semibold text-slate-dark tabular-nums">
                          {sks} SKS
                        </span>
                        <span className="flex items-baseline gap-2.5">
                          <span className="text-sm text-muted-foreground line-through tabular-nums">
                            {formatIDR(c.normal)}
                          </span>
                          <span className="font-heading text-base font-bold text-uniba-navy tabular-nums">
                            {formatIDR(c.promo)}
                          </span>
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              <p className="border-t border-uniba-navy/10 bg-white/50 px-6 py-4 text-xs leading-relaxed text-muted-foreground sm:px-8">
                {rplConversion.note}
              </p>
            </Reveal>

            <Reveal
              as="p"
              index={1}
              className="mt-4 rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground"
            >
              {rplConversion.waiverNote}
            </Reveal>

            {/* Semester 1. Four columns instead of the previous two: the old table showed
                SPP SKS and a Bayar di Awal that is Rp2.000.000 on every row, so it printed
                the same figure nine times and never showed what the semester actually
                costs. It also ran through calculateSemester1Detail, which waives
                Pendaftaran + SPI -- a discount this route does not get. */}
            <Reveal index={2} className="mt-10">
              <h3 className="font-heading text-xl font-bold text-slate-dark">
                {LABELS.semester1}
              </h3>
              {/* Stated, not left to inference. RPL runs on five of the nine priced
                  programmes, and a visitor who does not find theirs in a shorter table
                  is more likely to assume an oversight than a restriction. */}
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                {LABELS.programsDesc}
              </p>
              <div className="mt-5 overflow-hidden rounded-2xl border border-uniba-navy/10">
                <div className="hidden grid-cols-[1.6fr_1fr_1fr_1.1fr] gap-4 bg-uniba-navy px-6 py-4 sm:grid">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    {LABELS.programs}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    SPP Basis
                  </span>
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    SPP SKS
                  </span>
                  <span className="text-right text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                    Total Semester 1
                  </span>
                </div>

                <ul>
                  {rplPrograms.map((program) => {
                    const detail = calculateRplSemester1Detail(program);
                    return (
                      <li
                        key={program.id}
                        className="grid grid-cols-1 gap-2 border-b border-uniba-navy/8 px-5 py-5 last:border-b-0 odd:bg-alabaster/60 sm:grid-cols-[1.6fr_1fr_1fr_1.1fr] sm:items-center sm:gap-4 sm:px-6"
                      >
                        <div>
                          <p className="font-heading font-bold text-slate-dark">{program.name}</p>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {program.accreditation}
                          </p>
                        </div>
                        <div className="flex items-baseline justify-between gap-2 sm:block">
                          <span className="text-xs text-muted-foreground sm:hidden">
                            SPP Basis
                          </span>
                          <span className="text-sm text-slate-dark tabular-nums">
                            {formatIDR(detail.sppBasis)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-2 sm:block">
                          <span className="text-xs text-muted-foreground sm:hidden">SPP SKS</span>
                          <span className="text-sm text-slate-dark tabular-nums">
                            {formatIDR(detail.sppSks)}
                          </span>
                        </div>
                        <div className="flex items-baseline justify-between gap-2 border-t border-uniba-navy/8 pt-2 sm:block sm:border-0 sm:pt-0 sm:text-right">
                          <span className="text-xs text-muted-foreground sm:hidden">
                            Total Semester 1
                          </span>
                          <span className="font-heading text-lg font-extrabold text-uniba-navy tabular-nums">
                            {formatIDR(detail.semesterTotal)}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </Reveal>

            {/* The figure that actually closes the sale, given its own weight. It is the
                same Rp2.000.000 as every other route -- that is the point. */}
            <Reveal index={3} className="mt-6 rounded-2xl bg-uniba-navy p-6 text-white sm:p-8">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky">
                Untuk mulai kuliah
              </p>
              <p className="mt-2 font-heading text-4xl font-extrabold tabular-nums sm:text-5xl">
                {formatIDR(paymentScheme.downPayment)}
              </p>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70">
                {paymentScheme.remainingPolicy}
              </p>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal
                as="p"
                index={1}
                className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {paymentScheme.remainingPolicy}
              </Reveal>
              <Reveal
                as="p"
                index={2}
                className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {paymentScheme.nextSemesterPolicy}
              </Reveal>
            </div>
            <Reveal
              as="p"
              index={3}
              className="mt-4 text-xs leading-relaxed text-muted-foreground"
            >
              {feeExclusions}
            </Reveal>
          </Container>
        </section>

        {/* ---------------- Alumni story ---------------- */}
        {rplTestimonial ? (
          <section className="bg-uniba-cloud/50 py-24 sm:py-32 lg:py-36">
            <Container>
              <SectionHeading eyebrow={classTypeLabels.karyawan} title={LABELS.story} />
              <Reveal
                as="figure"
                className="mx-auto mt-12 max-w-3xl rounded-2xl border border-uniba-navy/10 bg-white p-8 shadow-elev-1 sm:p-10"
              >
                <blockquote className="font-heading text-xl leading-relaxed text-slate-dark sm:text-2xl">
                  &ldquo;{rplTestimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 border-t border-uniba-navy/10 pt-6">
                  <p className="font-heading font-bold text-slate-dark">{rplTestimonial.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {rplTestimonial.program} &middot; {rplTestimonial.cohort}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-uniba-sky/12 px-3.5 py-1.5 text-sm text-uniba-navy ring-1 ring-uniba-sky/25">
                    <Check className="size-4 text-uniba-sky-deep" aria-hidden="true" />
                    {rplTestimonial.outcome}
                  </p>
                </figcaption>
              </Reveal>
            </Container>
          </section>
        ) : null}

        {/* ---------------- Steps ---------------- */}
        <section className="bg-white py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading eyebrow="One Day Service" title={LABELS.steps} />
            <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {enrollmentSteps.map((step, index) => {
                const Icon = iconMap[step.iconName] ?? GraduationCap;
                return (
                  <Reveal
                    as="li"
                    key={step.step}
                    index={index}
                    className="rounded-2xl border border-uniba-navy/10 bg-alabaster p-6 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-4xl font-extrabold text-uniba-navy/12 tabular-nums">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-xl bg-uniba-sky/12 ring-1 ring-uniba-sky/25">
                        <Icon className="size-5 text-uniba-sky-deep" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-slate-dark">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky-deep">
                      {step.duration}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </Reveal>
                );
              })}
            </ol>
          </Container>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="bg-uniba-cloud/50 py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading eyebrow="FAQ" title={LABELS.faq} />
            <dl className="mx-auto mt-12 max-w-3xl">
              {rplFaqs.map((item, index) => (
                <Reveal
                  key={item.question}
                  index={index}
                  y={14}
                  className="border-b border-uniba-navy/10 py-7 last:border-b-0"
                >
                  <dt className="font-heading text-lg font-bold text-slate-dark sm:text-xl">
                    {item.question}
                  </dt>
                  <dd className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</dd>
                </Reveal>
              ))}
            </dl>
          </Container>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="relative overflow-hidden bg-uniba-gradient py-20 sm:py-24">
          <CloudDrift />
          <Container>
            <div className="relative flex flex-col items-center text-center">
              <Reveal
                as="h2"
                index={0}
                className="max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl"
              >
                {LABELS.ctaTitle}
              </Reveal>
              <Reveal
                as="p"
                index={1}
                className="mt-5 max-w-2xl text-balance leading-relaxed text-white/80"
              >
                {rplPromo.description}
              </Reveal>
              <Reveal
                index={2}
                className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row"
              >
                <DaftarDialog
                  trigger={
                    <Button
                      size="lg"
                      className="group h-12 bg-uniba-sky-gradient px-8 text-[0.95rem] font-semibold text-uniba-navy shadow-sky-glow transition-transform hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Daftar Sekarang
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  }
                />
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 w-full border-white/25 bg-white/5 px-8 text-[0.95rem] text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white sm:w-auto"
                >
                  <a href={contactInfo.pmbWebsite} target="_blank" rel="noopener noreferrer">
                    {contactInfo.pmbWebsite.replace(/^https?:\/\//, "").replace(/\/$/, "")}
                  </a>
                </Button>
              </Reveal>
            </div>
          </Container>
        </section>
      </main>

      <Footer />
      <StickyCTA />
      <SocialFloatingDock />
    </>
  );
}
