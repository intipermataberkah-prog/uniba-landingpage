"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, BadgeCheck, GraduationCap, ArrowRight } from "lucide-react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import BatikLoom from "@/components/BatikLoom";
import { rplPromo, trustBadges } from "@/data/unibaData";

const trustBadgeIcons = [ShieldCheck, Users, BadgeCheck];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden bg-uniba-gradient">
      {/* Static kawung ground — the no-JS / reduced-motion fallback for the loom */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-20"
      />

      {/* Generative batik loom: the hero's single authored moment */}
      <BatikLoom className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Depth, kept subordinate to the weave */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-uniba-gold/20 blur-3xl sm:size-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-uniba-blue-bright/25 blur-3xl sm:size-96"
      />

      <Container>
        <div className="relative flex flex-col items-center py-20 text-center sm:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="flex flex-col items-center"
          >
            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-4xl text-balance font-heading text-[2.25rem] font-extrabold leading-[1.05] tracking-[-0.03em] text-white sm:text-6xl lg:text-7xl"
            >
              Kuliah Tanpa Beban Finansial: Gratis Uang Gedung, Promo Kemerdekaan Dapatkan
              Potongan <span className="text-uniba-gold-soft">4.3 JUTA</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-7 max-w-[58ch] text-balance text-base leading-relaxed text-white/75 sm:text-lg"
            >
              Raih gelar Sarjana resmi di Universitas Islam Batik Surakarta dengan jadwal kuliah
              fleksibel dan biaya yang bisa diangsur perbulan.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row"
            >
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
                className="h-12 w-full border-white/25 bg-transparent px-8 text-[0.95rem] text-white transition-colors hover:border-white/45 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a href="#simulasi-biaya">Simulasi Cicilan Biaya</a>
              </Button>
            </motion.div>

            {/* Positioning line — sits below the heading, never as a kicker above it */}
            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-12 text-sm font-medium text-uniba-gold-soft/90"
            >
              Kampus Terjangkau, Berkualitas &amp; Paling Fleksibel
            </motion.p>

            {/* Trust row: rule-separated columns, not cards */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 grid w-full max-w-4xl grid-cols-1 gap-y-6 border-t border-white/12 pt-8 sm:grid-cols-3 sm:gap-x-8"
            >
              {trustBadges.map((badge, index) => {
                const Icon = trustBadgeIcons[index] ?? ShieldCheck;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center justify-center gap-3 text-left sm:not-first:border-l sm:not-first:border-white/12"
                  >
                    <Icon className="size-5 shrink-0 text-uniba-gold" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-white">{badge.label}</p>
                      <p className="text-xs text-white/55">{badge.sublabel}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>

            {/* Program RPL */}
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 w-full max-w-4xl"
            >
              <div className="flex items-center gap-4 rounded-2xl bg-uniba-navy-950/50 px-5 py-4 text-left ring-1 ring-uniba-gold/25">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-uniba-gold-gradient text-uniba-navy sm:size-11">
                  <GraduationCap className="size-5 sm:size-6" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-heading text-sm font-bold text-uniba-gold-soft sm:text-base">
                    {rplPromo.title}
                  </p>
                  <p className="mt-0.5 text-sm leading-snug text-white/75">
                    {rplPromo.description}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
