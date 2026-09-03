import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, GraduationCap } from "lucide-react";

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
import { getBaseUrl } from "@/lib/site";
import { formatIDR } from "@/lib/utils";
import {
  contactInfo,
  s2FeeSchedule,
  s2GrandTotal,
  s2Notes,
  s2Payment,
  s2Programs,
  s2Reasons,
  s2SemesterTotal,
} from "@/data/unibaData";

/**
 * Magister (S2) landing page.
 *
 * CONTENT RULE, as on every other route here: every factual claim renders from
 * data/unibaData.ts. The fee schedule is verbatim from the official S2 document, the
 * degree titles and the Cyber Law concentration are UNIBA's own published wording, and
 * the career mechanism for ASN comes from UNIBA's reporting on its BKPSDM Kota Surakarta
 * collaboration. Nothing about intake dates, entrance tests or credit transfer is
 * asserted -- those go to admissions through DaftarDialog rather than being guessed.
 *
 * Why this page is separate from the S1 routes rather than a section on them: the
 * audience is different in kind. An S1 visitor is choosing whether to study at all; an
 * S2 visitor already has a degree and a job, and is weighing a specific career return.
 * The whole page is built around the second question.
 *
 * Server-rendered throughout so the copy is in the initial HTML.
 */

/** Purely structural labels; the claims live in the data. */
const LABELS = {
  back: "Kembali ke Halaman Utama",
  eyebrow: "Program Magister",
  title: "Lanjut S2 tanpa berhenti kerja",
  reasons: "Kenapa S2 di UNIBA",
  programs: "Dua Pilihan Magister",
  fees: "Rincian Biaya Sampai Lulus",
  feesDesc:
    "Empat semester, setiap komponen ditulis di semester tempat ia ditagih. Tidak ada biaya yang muncul belakangan.",
  ctaTitle: "Siap Ambil Magister?",
} as const;

const grandTotal = s2GrandTotal();
const recurringSpp = s2FeeSchedule[0].items.find((item) => item.recurring)?.amount ?? 0;

const pageTitle = "Program S2 — Magister Manajemen & Magister Hukum Solo";

export const metadata: Metadata = {
  title: pageTitle,
  description:
    "Program Magister UNIBA Surakarta: Magister Manajemen (M.Si/M.M.) dan Magister Hukum " +
    "(M.H. konsentrasi Cyber Law). Kelas malam Senin–Jumat, mulai kuliah cukup Rp2.400.000.",
  alternates: { canonical: "/s2" },
  openGraph: {
    type: "website",
    url: "/s2",
    title: pageTitle,
    siteName: "UNIBA Surakarta",
  },
};

export default function S2Page() {
  const baseUrl = getBaseUrl();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "PMB UNIBA Surakarta", item: `${baseUrl}/` },
          { "@type": "ListItem", position: 2, name: LABELS.eyebrow, item: `${baseUrl}/s2` },
        ],
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
                Lanjut S2{" "}
                <span className="font-accent font-normal italic text-uniba-sky-deep">
                  tanpa berhenti kerja
                </span>
              </Reveal>

              <Reveal
                as="p"
                index={2}
                className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-uniba-navy/70 sm:text-lg"
              >
                Magister Manajemen dan Magister Hukum, kelas malam Senin–Jumat di pusat Kota
                Solo. Mulai kuliah cukup{" "}
                <strong className="font-semibold text-uniba-navy">
                  {formatIDR(s2Payment.downPayment)}
                </strong>
                .
              </Reveal>

              {/* The total up front, not buried. Someone weighing a Magister is comparing
                  a number against a salary, and hiding it only delays the question. */}
              <Reveal
                index={3}
                className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-full border border-uniba-navy/10 bg-white/80 px-5 py-2.5 text-sm shadow-sm backdrop-blur-sm"
              >
                <span className="font-semibold text-uniba-sky-deep">
                  Total sampai lulus {formatIDR(grandTotal)}
                </span>
                <span
                  aria-hidden="true"
                  className="hidden h-4 w-px bg-uniba-navy/15 sm:inline-block"
                />
                <span className="text-uniba-navy/75">
                  {s2Payment.semesters} semester &middot; SPP {formatIDR(recurringSpp)} / semester
                </span>
              </Reveal>

              <Reveal
                index={4}
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
                  <a href="#biaya-s2">Lihat Rincian Biaya</a>
                </Button>
              </Reveal>
            </div>
          </Container>
        </section>

        {/* ---------------- Why ---------------- */}
        <section className="bg-uniba-cloud/50 py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading eyebrow={LABELS.eyebrow} title={LABELS.reasons} />
            <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
              {s2Reasons.map((reason, index) => (
                <Reveal
                  as="article"
                  key={reason.title}
                  index={index}
                  className="rounded-2xl border border-uniba-navy/10 bg-white p-7 shadow-elev-1 transition-transform hover:-translate-y-0.5 sm:p-8"
                >
                  <span className="flex size-12 items-center justify-center rounded-xl bg-uniba-sky/12 text-uniba-sky-deep ring-1 ring-uniba-sky/25">
                    <GraduationCap className="size-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-5 font-heading text-xl font-bold tracking-tight text-slate-dark">
                    {reason.title}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{reason.body}</p>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------- Programmes ---------------- */}
        <section className="bg-white py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading eyebrow={LABELS.eyebrow} title={LABELS.programs} />
            <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
              {s2Programs.map((program, index) => (
                <Reveal
                  as="article"
                  key={program.id}
                  index={index}
                  className="flex flex-col rounded-2xl border border-uniba-navy/10 bg-white p-7 shadow-elev-1 sm:p-8"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-uniba-navy px-3 py-1 text-xs font-bold text-white">
                      {program.degree}
                    </span>
                    {"concentration" in program ? (
                      <span className="rounded-full bg-uniba-sky-gradient px-3 py-1 text-xs font-bold text-uniba-navy">
                        Konsentrasi {program.concentration}
                      </span>
                    ) : null}
                    {"accreditation" in program ? (
                      <span className="rounded-full bg-uniba-sky/12 px-3 py-1 text-xs font-semibold text-uniba-sky-deep ring-1 ring-uniba-sky/25">
                        Akreditasi {program.accreditation}
                      </span>
                    ) : null}
                  </div>

                  <h3 className="mt-4 font-heading text-2xl font-bold tracking-tight text-slate-dark">
                    {program.name}
                  </h3>
                  <p className="mt-3 leading-relaxed text-muted-foreground">{program.summary}</p>

                  <p className="mt-6 text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky-deep">
                    Profil lulusan
                  </p>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {program.prospects.map((prospect) => (
                      <li
                        key={prospect}
                        className="inline-flex items-center gap-1.5 rounded-full bg-uniba-navy/5 px-3 py-1 text-xs font-medium text-uniba-navy ring-1 ring-uniba-navy/10"
                      >
                        <Check className="size-3.5 text-uniba-sky-deep" aria-hidden="true" />
                        {prospect}
                      </li>
                    ))}
                  </ul>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>

        {/* ---------------- Fees ---------------- */}
        <section id="biaya-s2" className="bg-uniba-cloud/50 py-24 sm:py-32 lg:py-36">
          <Container>
            <SectionHeading
              eyebrow={LABELS.eyebrow}
              title={LABELS.fees}
              description={LABELS.feesDesc}
            />

            {/* One card per semester rather than one wide table. S2 is billed by
                milestone, not by a repeating row shape: semester 1 carries matrikulasi,
                semester 2 the seminar proposal, semester 3 the thesis examination. A
                grid would have to leave most cells blank and would hide exactly the
                thing a postgraduate visitor is trying to find -- when each cost lands. */}
            <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {s2FeeSchedule.map((semester, index) => (
                <Reveal
                  key={semester.semester}
                  index={index}
                  className="rounded-2xl border border-uniba-navy/10 bg-white p-6 shadow-elev-1 sm:p-7"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky-deep">
                    Semester {semester.semester}
                  </p>
                  <dl className="mt-4 space-y-2.5 text-sm">
                    {semester.items.map((item) => (
                      <div
                        key={item.label}
                        className="flex items-baseline justify-between gap-4"
                      >
                        <dt className="text-muted-foreground">{item.label}</dt>
                        <dd className="font-semibold text-slate-dark tabular-nums">
                          {formatIDR(item.amount)}
                        </dd>
                      </div>
                    ))}
                    <div className="flex items-baseline justify-between gap-4 border-t border-uniba-navy/10 pt-3">
                      <dt className="font-semibold text-slate-dark">Total semester</dt>
                      <dd className="font-heading text-lg font-extrabold text-uniba-navy tabular-nums">
                        {formatIDR(s2SemesterTotal(semester))}
                      </dd>
                    </div>
                  </dl>
                </Reveal>
              ))}
            </div>

            <Reveal
              index={1}
              className="mt-6 rounded-2xl bg-uniba-navy p-6 text-white sm:p-8"
            >
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-uniba-sky">
                    Untuk mulai kuliah
                  </p>
                  <p className="mt-2 font-heading text-4xl font-extrabold tabular-nums sm:text-5xl">
                    {formatIDR(s2Payment.downPayment)}
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">
                    Total {s2Payment.semesters} semester
                  </p>
                  <p className="mt-2 font-heading text-2xl font-bold tabular-nums text-white/90">
                    {formatIDR(grandTotal)}
                  </p>
                </div>
              </div>
            </Reveal>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Reveal
                as="p"
                index={2}
                className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {s2Notes.asn}
              </Reveal>
              <Reveal
                as="p"
                index={3}
                className="rounded-2xl bg-alabaster p-5 text-sm leading-relaxed text-muted-foreground"
              >
                {s2Notes.thesis}
              </Reveal>
            </div>
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
                Tanya jadwal kelas, syarat berkas, atau skema pembayaran langsung ke tim
                admisi.
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
