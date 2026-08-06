"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  Users,
  BadgeCheck,
  GraduationCap,
  ArrowRight,
  Star,
} from "lucide-react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import { cn } from "@/lib/utils";
import { rplPromo, trustBadges } from "@/data/unibaData";

const trustBadgeIcons = [ShieldCheck, Users, BadgeCheck];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Premium "gold foil ticket" that replaces the old flat tilted box. Reads as a
 * promo coupon/seal — the framing the user asked for — with a sheen sweep,
 * perforation, seal chip and gentle float. Content is unchanged (rplPromo).
 */
function RplTicket() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      aria-label={`${rplPromo.title}: ${rplPromo.description}`}
      initial={{ opacity: 0, y: -14, scale: 0.9, rotate: -5 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotate: -2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
      whileHover={{ rotate: 0, y: -3, scale: 1.03 }}
      className="relative z-20 mx-auto mt-4 mb-1 w-[11.5rem] sm:absolute sm:top-6 sm:left-6 sm:mx-0 sm:mt-0 sm:mb-0 sm:w-56"
    >
      <div
        className={cn(
          "gold-sheen relative overflow-hidden rounded-2xl bg-uniba-gold-gradient p-[3px] shadow-gold-glow",
          !reduceMotion && "sm:animate-float"
        )}
      >
        {/* Inner ticket face with dashed coupon border */}
        <div className="relative rounded-[13px] border border-dashed border-uniba-navy/35 bg-uniba-gold-gradient px-3.5 py-3 sm:px-4 sm:py-3.5">
          {/* Sparkle accent */}
          <Star
            aria-hidden="true"
            className="absolute top-2 right-2 size-3 fill-white/70 text-white/70"
          />

          {/* Seal + kicker */}
          <div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-uniba-navy text-uniba-gold shadow-sm ring-2 ring-white/40 sm:size-8">
              <GraduationCap className="size-4 sm:size-[18px]" aria-hidden="true" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-uniba-navy/70">
              Program
            </span>
          </div>

          {/* Title */}
          <p className="mt-2 font-heading text-base font-extrabold leading-none text-uniba-navy sm:text-lg">
            {rplPromo.title}
          </p>

          {/* Perforation */}
          <div
            aria-hidden="true"
            className="my-2.5 border-t border-dashed border-uniba-navy/25"
          />

          {/* Description */}
          <p className="text-[11px] font-medium leading-snug text-uniba-navy/80 sm:text-xs">
            {rplPromo.description}
          </p>
        </div>
      </div>
    </motion.aside>
  );
}

export default function Hero() {
  return (
    <section id="beranda" className="relative overflow-hidden bg-uniba-gradient">
      {/* Batik motif + film grain overlays */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grain opacity-[0.15] mix-blend-overlay"
      />

      {/* Decorative blurred orbs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-uniba-gold/25 blur-3xl sm:size-96"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 bottom-0 size-72 rounded-full bg-uniba-blue-bright/30 blur-3xl sm:size-96"
      />

      {/* RPL promo — premium gold ticket */}
      <RplTicket />

      <Container>
        <div className="relative flex flex-col items-center pt-8 pb-24 text-center sm:py-36">
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.12 }}
            className="flex flex-col items-center"
          >
            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="glass-panel-dark mb-8 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-lg shadow-black/10"
            >
              <Sparkles className="size-4 text-uniba-gold" aria-hidden="true" />
              <span className="text-uniba-gold-soft">
                Kampus Terjangkau, Berkualitas &amp; Paling Fleksibel di Solo
              </span>
            </motion.div>

            <motion.h1
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="max-w-4xl text-balance font-heading text-[2.15rem] font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              Kuliah Tanpa Beban Finansial: Gratis Uang Gedung,{" "}
              <span className="text-gradient-merah-putih">Promo Kemerdekaan</span> Dapatkan
              Potongan{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="text-gradient-gold">4.3 JUTA</span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-uniba-gold-gradient"
                />
              </span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg"
            >
              Raih gelar Sarjana resmi di Universitas Islam Batik Surakarta dengan jadwal kuliah
              fleksibel dan biaya yang bisa diangsur perbulan.
            </motion.p>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
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
                className="h-12 w-full border-white/25 bg-white/5 px-8 text-[0.95rem] text-white backdrop-blur-sm transition-colors hover:border-white/40 hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <a href="#simulasi-biaya">Simulasi Cicilan Biaya</a>
              </Button>
            </motion.div>

            <motion.div
              variants={fadeUp}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="mt-14 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4"
            >
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
            </motion.div>
          </motion.div>
        </div>
      </Container>

      {/* Soft bottom seam into the next (light) section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-alabaster/10"
      />
    </section>
  );
}
