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
import { DaftarDialog } from "@/components/DaftarDialog";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icon-map";
import { getBaseUrl } from "@/lib/site";
import { cn, formatIDR } from "@/lib/utils";
import {
  bentoFeatures,
  calculateSemester1Detail,
  classTypeLabels,
  contactInfo,
  enrollmentSteps,
  faqItems,
  feeExclusions,
  getFeeGroup,
  paymentScheme,
  rplPromo,
  studyPrograms,
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
  programsDesc:
    "Seluruh program studi S1 di bawah ini tersedia dengan skema biaya Kelas Malam.",
  fees: "Rincian Biaya Kelas Malam",
  feesDesc: "Angka resmi Gelombang 2 — bayar di awal hanya sebagian, sisanya diangsur.",
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

/** Only programs the official fee document covers can be priced. */
const pricedPrograms = studyPrograms.filter((p) => p.feeGroupId !== undefined);

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
        <section className="relative overflow-hidden bg-uniba-gradient">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-30"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grain opacity-[0.15] mix-blend-overlay"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-uniba-gold/25 blur-3xl sm:size-96"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-uniba-blue-bright/30 blur-3xl sm:size-96"
          />

          <Container>
            <div className="relative flex flex-col items-center py-20 text-center sm:py-32">
              <Link
                href="/"
                className="glass-panel-dark mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/85 transition-colors hover:text-uniba-gold-soft focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:outline-none"
              >
                <ArrowLeft className="size-4" aria-hidden="true" />
                {LABELS.back}
              </Link>

              <h1 className="max-w-4xl text-balance font-heading text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {rplPromo.title}:{" "}
                <span className="relative inline-block">
                  <span className="text-gradient-gold">{classTypeLabels.karyawan}</span>
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-uniba-gold-gradient"
                  />
                </span>{" "}
                untuk Kamu yang Sudah Bekerja
              </h1>

              <p className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
                {rplPromo.description}
              </p>

              <div className="mt-10 flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row">
                <DaftarDialog
                  trigger={
                    <Button
                      size="lg"
                      className="group h-12 bg-uniba-gold-gradient px-8 text-[0.95rem] font-semibold text-uniba-navy shadow-gold-glow transition-transform hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Daftar Sekarang (Gratis Uang Gedung)
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
                  <a href="#biaya-rpl">Lihat Rincian Biaya</a>
                </Button>
              </div>

              <div className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
                {trustBadges.map((badge, index) => {
                  const Icon = trustBadgeIcons[index] ?? ShieldCheck;
                  return (
                    <div
                      key={badge.label}
                      className="glass-panel-dark flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition-colors hover:bg-uniba-navy/45"
                    >
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-uniba-gold/15 ring-1 ring-uniba-gold/25">
                        <Icon className="size-4.5 text-uniba-gold" aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-white">{badge.label}</p>
                        <p className="truncate text-xs text-white/60">{badge.sublabel}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Container>
        </section>

        {/* ---------------- Advantages ---------------- */}
        <section className="bg-alabaster py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow={rplPromo.title} title={LABELS.advantages} />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
              {rplFeatures.map((feature, index) => {
                const Icon = iconMap[feature.iconName] ?? GraduationCap;
                const feature3d = index === 0;
                return (
                  <article
                    key={feature.id}
                    className={cn(
                      "rounded-2xl p-7 transition-transform hover:-translate-y-0.5 sm:p-8",
                      feature3d
                        ? "relative overflow-hidden bg-uniba-navy shadow-elev-3 md:col-span-2"
                        : "border border-uniba-navy/10 bg-white shadow-elev-1"
                    )}
                  >
                    {feature3d ? (
                      <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-40"
                      />
                    ) : null}
                    <div className="relative">
                      <span
                        className={cn(
                          "flex size-12 items-center justify-center rounded-xl",
                          feature3d
                            ? "bg-uniba-gold-gradient text-uniba-navy"
                            : "bg-uniba-gold/12 text-uniba-amber ring-1 ring-uniba-gold/25"
                        )}
                      >
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <h3
                        className={cn(
                          "mt-5 font-heading font-bold tracking-tight",
                          feature3d ? "text-2xl text-white sm:text-3xl" : "text-xl text-slate-dark"
                        )}
                      >
                        {feature.title}
                      </h3>
                      <p
                        className={cn(
                          "mt-3 leading-relaxed",
                          feature3d
                            ? "max-w-2xl text-white/80"
                            : "text-muted-foreground"
                        )}
                      >
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </Container>
        </section>

        {/* ---------------- Fees ---------------- */}
        <section id="biaya-rpl" className="bg-white py-20 sm:py-28">
          <Container>
            <SectionHeading
              eyebrow={classTypeLabels.karyawan}
              title={LABELS.fees}
              description={LABELS.feesDesc}
            />

            <div className="mt-14 overflow-hidden rounded-2xl border border-uniba-navy/10">
              <div className="hidden grid-cols-[1.6fr_1fr_1fr] gap-4 bg-uniba-navy px-6 py-4 sm:grid">
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  {LABELS.programs}
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  SPP SKS / Semester
                </span>
                <span className="text-right text-xs font-bold uppercase tracking-[0.14em] text-white/70">
                  Bayar di Awal ({paymentScheme.downPaymentPercent}%)
                </span>
              </div>

              <ul>
                {pricedPrograms.map((program) => {
                  const detail = calculateSemester1Detail(program, "karyawan");
                  const group = getFeeGroup(program);
                  return (
                    <li
                      key={program.id}
                      className="grid grid-cols-1 gap-2 border-b border-uniba-navy/8 px-5 py-5 last:border-b-0 odd:bg-alabaster/60 sm:grid-cols-[1.6fr_1fr_1fr] sm:items-center sm:gap-4 sm:px-6"
                    >
                      <div>
                        <p className="font-heading font-bold text-slate-dark">{program.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {program.accreditation}
                        </p>
                      </div>
                      <div className="flex items-baseline justify-between gap-2 sm:block">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          SPP SKS / Semester
                        </span>
                        <span className="text-sm font-bold text-slate-dark tabular-nums">
                          {formatIDR(group.sppSks.karyawan)}
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between gap-2 sm:block sm:text-right">
                        <span className="text-xs text-muted-foreground sm:hidden">
                          Bayar di Awal ({paymentScheme.downPaymentPercent}%)
                        </span>
                        <span className="font-heading text-lg font-extrabold text-uniba-amber tabular-nums">
                          {formatIDR(detail.downPayment)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <p className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground">
                {paymentScheme.remainingPolicy}
              </p>
              <p className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground">
                {paymentScheme.nextSemesterPolicy}
              </p>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{feeExclusions}</p>
          </Container>
        </section>

        {/* ---------------- Alumni story ---------------- */}
        {rplTestimonial ? (
          <section className="bg-alabaster py-20 sm:py-28">
            <Container>
              <SectionHeading eyebrow={classTypeLabels.karyawan} title={LABELS.story} />
              <figure className="mx-auto mt-12 max-w-3xl rounded-2xl border border-uniba-navy/10 bg-white p-8 shadow-elev-1 sm:p-10">
                <blockquote className="font-heading text-xl leading-relaxed text-slate-dark sm:text-2xl">
                  &ldquo;{rplTestimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-7 border-t border-uniba-navy/10 pt-6">
                  <p className="font-heading font-bold text-slate-dark">{rplTestimonial.name}</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {rplTestimonial.program} &middot; {rplTestimonial.cohort}
                  </p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-uniba-gold/12 px-3.5 py-1.5 text-sm text-uniba-navy ring-1 ring-uniba-gold/25">
                    <Check className="size-4 text-uniba-amber" aria-hidden="true" />
                    {rplTestimonial.outcome}
                  </p>
                </figcaption>
              </figure>
            </Container>
          </section>
        ) : null}

        {/* ---------------- Steps ---------------- */}
        <section className="bg-white py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="One Day Service" title={LABELS.steps} />
            <ol className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {enrollmentSteps.map((step) => {
                const Icon = iconMap[step.iconName] ?? GraduationCap;
                return (
                  <li
                    key={step.step}
                    className="rounded-2xl border border-uniba-navy/10 bg-alabaster p-6 transition-transform hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-heading text-4xl font-extrabold text-uniba-navy/12 tabular-nums">
                        {String(step.step).padStart(2, "0")}
                      </span>
                      <span className="flex size-10 items-center justify-center rounded-xl bg-uniba-gold/12 ring-1 ring-uniba-gold/25">
                        <Icon className="size-5 text-uniba-amber" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-heading text-lg font-bold text-slate-dark">
                      {step.title}
                    </h3>
                    <p className="mt-1 text-xs font-bold uppercase tracking-[0.14em] text-uniba-amber">
                      {step.duration}
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {step.description}
                    </p>
                  </li>
                );
              })}
            </ol>
          </Container>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="bg-alabaster py-20 sm:py-28">
          <Container>
            <SectionHeading eyebrow="FAQ" title={LABELS.faq} />
            <dl className="mx-auto mt-12 max-w-3xl">
              {rplFaqs.map((item) => (
                <div
                  key={item.question}
                  className="border-b border-uniba-navy/10 py-7 last:border-b-0"
                >
                  <dt className="font-heading text-lg font-bold text-slate-dark sm:text-xl">
                    {item.question}
                  </dt>
                  <dd className="mt-3 leading-relaxed text-muted-foreground">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </Container>
        </section>

        {/* ---------------- Final CTA ---------------- */}
        <section className="relative overflow-hidden bg-uniba-gradient py-20 sm:py-24">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-30"
          />
          <Container>
            <div className="relative flex flex-col items-center text-center">
              <h2 className="max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {LABELS.ctaTitle}
              </h2>
              <p className="mt-5 max-w-2xl text-balance leading-relaxed text-white/80">
                {rplPromo.description}
              </p>
              <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
                <DaftarDialog
                  trigger={
                    <Button
                      size="lg"
                      className="group h-12 bg-uniba-gold-gradient px-8 text-[0.95rem] font-semibold text-uniba-navy shadow-gold-glow transition-transform hover:-translate-y-0.5 hover:brightness-105"
                    >
                      Daftar Sekarang (Gratis Uang Gedung)
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
              </div>
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
