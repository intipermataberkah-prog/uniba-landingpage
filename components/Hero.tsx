"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ShieldCheck,
  Users,
  BadgeCheck,
  GraduationCap,
  ArrowRight,
  CalendarClock,
} from "lucide-react";

import { DURATION, EASE_OUT_EXPO, STAGGER } from "@/lib/motion";
import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import { SkyBackdrop } from "@/components/SkyBackdrop";
import { formatIDR } from "@/lib/utils";
import {
  campaignTagline,
  feeGroups,
  paymentScheme,
  promoPeriod,
  rplPromo,
  trustBadges,
} from "@/data/unibaData";

const trustBadgeIcons = [ShieldCheck, Users, BadgeCheck];

// Pendaftaran + SPI are identical across every fee group and both are waived, so the
// advertised discount is derived rather than typed as a literal. If the official table
// ever changes, this number follows it instead of silently going stale.
const WAIVED_TOTAL = feeGroups[0].pendaftaran + feeGroups[0].spi;

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/**
 * Light sky hero.
 *
 * This was a dark navy panel with white type. It is now a bright sky with navy ink,
 * which is a structural change rather than a recolour: the reference this campaign is
 * modelled on opens light and lets the page breathe, and "masa depan cerah" only works
 * as a picture if the sky is actually bright.
 *
 * The primary CTA is solid navy on the light ground, mirroring the dark pill the
 * reference sets on its pale field. That is also the highest-contrast pairing
 * available here, which matters more than styling: this is the button the ad budget
 * is buying.
 */
export default function Hero() {
  return (
    <section id="beranda" className="relative isolate overflow-hidden bg-white">
      <SkyBackdrop />

      <Container>
        <div className="relative flex flex-col items-center py-24 text-center sm:py-32 lg:py-40">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: STAGGER }}
            className="flex w-full flex-col items-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
              className="mb-8 inline-flex items-center gap-2 rounded-full border border-uniba-navy/12 bg-white/70 px-4 py-2 text-sm text-uniba-navy shadow-sm backdrop-blur-sm"
            >
              <CalendarClock className="size-4 text-uniba-sky-deep" aria-hidden="true" />
              <span>{promoPeriod.name} &middot; Ditutup 30 September 2026</span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
              className="max-w-4xl text-balance font-heading text-[2.15rem] font-semibold leading-display tracking-display text-uniba-navy sm:text-5xl lg:text-[3.4rem]"
            >
              {campaignTagline.lines[0]}{" "}
              {/* The serif accent is the one place Instrument Serif appears above the
                  fold, exactly as the reference uses its display serif: sparingly, on
                  the phrase that carries the promise. */}
              <span className="font-accent font-normal italic text-uniba-sky-deep">
                {campaignTagline.lines[1]}
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
              className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-uniba-navy/70 sm:text-lg"
            >
              Mulai kuliah S1 resmi di Universitas Islam Batik Surakarta cukup dengan{" "}
              <strong className="font-semibold text-uniba-navy">
                {formatIDR(paymentScheme.downPayment)}
              </strong>
              . Sisanya diangsur fleksibel, tanpa bunga, tanpa jadwal cicilan tetap.
            </motion.p>

            {/* Price anchor. The Rp4,3 juta waiver is supporting proof, not the promise:
                it is the reason Rp2.000.000 is possible. */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
              className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 rounded-full border border-uniba-navy/10 bg-white/80 px-5 py-2.5 text-sm shadow-sm backdrop-blur-sm"
            >
              <span className="font-semibold text-uniba-sky-deep">Gratis Uang Gedung</span>
              <span
                aria-hidden="true"
                className="hidden h-4 w-px bg-uniba-navy/15 sm:inline-block"
              />
              <span className="text-uniba-navy/75">
                Potongan{" "}
                <strong className="font-semibold text-uniba-navy">
                  {formatIDR(WAIVED_TOTAL)}
                </strong>{" "}
                (Pendaftaran + SPI)
              </span>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
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
                <a href="#simulasi-biaya">Simulasi Cicilan Biaya</a>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
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
                      {/* Not truncated. "Tersebar di berbagai industri" needs about
                          165px at this size and the column gives it roughly that, so
                          `truncate` was cutting the proof short at common widths. */}
                      <p className="text-xs leading-snug text-uniba-navy/55">
                        {badge.sublabel}
                      </p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
              className="mt-3 w-full max-w-3xl"
            >
              <Link
                href="/rpl"
                className="group/rpl flex items-center gap-3.5 rounded-2xl border border-uniba-sky/40 bg-uniba-cloud/80 px-4 py-3.5 text-left backdrop-blur-sm transition-colors hover:border-uniba-sky-deep/40 hover:bg-uniba-cloud focus-visible:ring-2 focus-visible:ring-uniba-sky-deep focus-visible:outline-none sm:px-5"
              >
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-uniba-navy text-white sm:size-11">
                  <GraduationCap className="size-5 sm:size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-uniba-sky-deep uppercase">
                    {rplPromo.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-uniba-navy/80 sm:text-[15px]">
                    {rplPromo.description}
                  </p>
                </div>
                <ArrowRight
                  className="hidden size-4 shrink-0 text-uniba-sky-deep transition-transform group-hover/rpl:translate-x-0.5 sm:block"
                  aria-hidden="true"
                />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
