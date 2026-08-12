"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, GraduationCap } from "lucide-react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import { VeoSlot } from "@/components/preview3d/VeoSlot";
import { rplPromo, trustBadges } from "@/data/unibaData";

/**
 * Scroll-driven 3D depth hero.
 *
 * The "3D" is real perspective projection, not a parallax fake: a single
 * preserve-3d group holds batik planes at fixed translateZ depths, and scrolling
 * flies the camera forward through them, so near planes separate faster than far
 * ones exactly as they should.
 *
 * Deliberately CSS transforms rather than WebGL. three.js + fiber + drei is
 * roughly 600KB before a single mesh, and this page exists to convert paid
 * mobile traffic — the compositor gets the same visual for ~0KB, and every
 * animated property here is transform/opacity so it never triggers layout.
 */

const DEPTH_PLANES = [
  { z: -2400, opacity: 0.16, scale: 1.0 },
  { z: -1900, opacity: 0.2, scale: 1.0 },
  { z: -1400, opacity: 0.26, scale: 1.0 },
  { z: -950, opacity: 0.3, scale: 1.0 },
  { z: -520, opacity: 0.34, scale: 1.0 },
  { z: -160, opacity: 0.38, scale: 1.0 },
];

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function Hero3D() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      // matchMedia rather than an early return: when the visitor flips the OS
      // setting, GSAP reverts this branch itself — pin spacing and inline
      // transforms included — instead of leaving a half-applied scene behind.
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // NOTE: deliberately no `pin`. ScrollTrigger's pin wraps the element
            // in a .pin-spacer and writes measured width/height inline. Under
            // React StrictMode the mount → revert → remount cycle let it measure
            // a transitional 0×0 box and bake `height:0;width:0` in, after which
            // every refresh re-read the element it had already collapsed. CSS
            // `position: sticky` on the stage does the pinning instead, so there
            // is no DOM surgery and nothing to mis-measure.
          },
        });

        // Fly the camera forward through the plane stack.
        timeline.to(".depth-group", { z: 2000, ease: "none" }, 0);

        // Planes fade as they pass the camera so nothing clips through the type.
        timeline.to(
          ".depth-plane",
          { opacity: 0, ease: "none", stagger: { each: 0.06, from: "end" } },
          0
        );

        // Headline recedes and releases slightly ahead of the planes.
        timeline.to(".hero-copy", { z: -420, opacity: 0, ease: "none" }, 0);
        timeline.to(".hero-aside", { y: -60, opacity: 0, ease: "none" }, 0);
      });
    },
    { scope: rootRef }
  );

  return (
    // Tall track supplies the scroll distance; the sticky stage inside is what
    // the visitor actually sees held in place.
    <section ref={rootRef} className="relative h-[240svh]">
      <div
        className="sticky top-0 isolate h-svh overflow-hidden bg-uniba-gradient"
        style={{ perspective: "1100px", perspectiveOrigin: "50% 45%" }}
      >
      {/* Veo clip sits furthest back; falls back to the batik ground until it exists. */}
      <VeoSlot
        src="/veo/hero.mp4"
        webm="/veo/hero.webm"
        poster="/veo/hero-poster.jpg"
        label="Suasana kampus UNIBA Surakarta"
        className="absolute inset-0 -z-10"
        fallback={
          <div className="size-full bg-uniba-gradient">
            <div className="size-full bg-batik-kawung opacity-40" />
          </div>
        }
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-uniba-navy-950/55"
      />

      {/* The 3D stack */}
      <div
        aria-hidden="true"
        className="depth-group pointer-events-none absolute inset-0"
        style={{ transformStyle: "preserve-3d" }}
      >
        {DEPTH_PLANES.map((plane, index) => (
          <div
            key={plane.z}
            className="depth-plane absolute inset-[-25%] bg-batik-kawung"
            style={{
              transform: `translateZ(${plane.z}px) scale(${plane.scale})`,
              opacity: plane.opacity,
              // Far planes tile larger so the motif keeps a constant apparent
              // size as the camera closes on them.
              backgroundSize: `${88 + index * 26}px ${88 + index * 26}px`,
            }}
          />
        ))}
      </div>

      <Container className="relative flex h-full items-center">
        <div className="grid w-full gap-10 lg:grid-cols-12 lg:items-end">
          <div className="hero-copy lg:col-span-7" style={{ transformStyle: "preserve-3d" }}>
            {/* Copy is byte-identical to the live hero. Only the treatment changed:
                gradient-filled headline text is a named AI tell, so emphasis is
                carried by solid colour and weight instead. */}
            <h1 className="max-w-3xl text-balance font-heading text-[2.15rem] font-bold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-[3.4rem]">
              Kuliah Tanpa Beban Finansial: Gratis Uang Gedung,{" "}
              <span className="text-white">Promo Kemerdekaan</span> Dapatkan Potongan{" "}
              <span className="relative inline-block whitespace-nowrap">
                <span className="font-extrabold text-uniba-gold-soft">4.3 JUTA</span>
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-0 h-[3px] w-full rounded-full bg-uniba-gold-deep"
                />
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-balance text-base leading-relaxed text-white/80 sm:text-lg">
              Raih gelar Sarjana resmi di Universitas Islam Batik Surakarta dengan jadwal kuliah
              fleksibel dan biaya yang bisa diangsur perbulan.
            </p>

            <div className="mt-9 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
              <DaftarDialog
                trigger={
                  <Button
                    size="lg"
                    // Tinted shadow and an inner highlight rather than an outer
                    // glow, which reads as neon and is a default-look giveaway.
                    className="group h-12 bg-uniba-gold-gradient px-8 text-[0.95rem] font-semibold text-uniba-navy shadow-[0_10px_28px_-12px_rgba(15,44,89,0.75),inset_0_1px_0_rgba(255,255,255,0.45)] transition-transform hover:-translate-y-0.5 hover:brightness-105"
                  >
                    Daftar Sekarang (Gratis Uang Gedung)
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Button>
                }
              />
            </div>
          </div>

          <div className="hero-aside lg:col-span-4 lg:col-start-9">
            <div className="rounded-2xl border border-uniba-gold/35 bg-uniba-navy/45 p-5 backdrop-blur-sm">
              <span className="flex size-11 items-center justify-center rounded-xl bg-uniba-gold-gradient text-uniba-navy">
                <GraduationCap className="size-6" aria-hidden="true" />
              </span>
              <p className="mt-4 text-[11px] font-bold uppercase tracking-[0.16em] text-uniba-gold-soft">
                {rplPromo.title}
              </p>
              <p className="mt-1 text-sm leading-snug text-white/85">{rplPromo.description}</p>
            </div>

            <ul className="mt-4 grid gap-2">
              {trustBadges.map((badge) => (
                <li
                  key={badge.label}
                  className="rounded-xl border border-white/12 bg-uniba-navy-950/40 px-4 py-2.5"
                >
                  <p className="text-sm font-bold text-white">{badge.label}</p>
                  <p className="text-xs text-white/60">{badge.sublabel}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Container>
      </div>
    </section>
  );
}
