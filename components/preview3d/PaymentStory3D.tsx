"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wallet, PiggyBank, CalendarClock } from "lucide-react";

import { Container } from "@/components/Container";
import { cn } from "@/lib/utils";
import { bentoFeatures, paymentScheme } from "@/data/unibaData";

/**
 * Pinned three-beat scroll story for the payment scheme.
 *
 * Every string is read from data/unibaData.ts — the beats are the officially
 * documented scheme (waiver, 60% up front, flexible 40%), not marketing written
 * for this page. Cards arrive on a rotateY/translateZ arc so the depth reads as
 * one continuous camera move with the hero above it.
 */

const cicilan = bentoFeatures.find((f) => f.id === "cicilan");

/**
 * Deliberately unequal. Three identical cards in a row is a named AI tell, and
 * it also misreports the offer: the 60% up front is the fact that decides
 * whether someone can enrol at all, so it gets the dominant cell and the gold
 * surface while the other two beats sit beside it as supporting detail.
 */
const BEATS = [
  {
    icon: Wallet,
    kicker: `${paymentScheme.downPaymentPercent}%`,
    title: "Semester 1",
    body: cicilan?.description ?? "",
    span: "md:col-span-7 md:row-span-2",
    lead: true,
  },
  {
    icon: PiggyBank,
    kicker: `${paymentScheme.remainingPercent}%`,
    title: "Sisa Pembayaran",
    body: paymentScheme.remainingPolicy,
    span: "md:col-span-5",
    lead: false,
  },
  {
    icon: CalendarClock,
    kicker: "Semester 2+",
    title: "Seterusnya",
    body: paymentScheme.nextSemesterPolicy,
    span: "md:col-span-5",
    lead: false,
  },
];

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function PaymentStory3D() {
  const rootRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cards = gsap.utils.toArray<HTMLElement>(".story-card");

        // Only set the off-screen start state inside the branch — under reduced
        // motion the cards must stay at their natural, readable position.
        gsap.set(cards, { z: -700, rotateY: -22, opacity: 0 });

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 0.6,
            // No `pin` here either — see the note in Hero3D. CSS sticky holds
            // the stage; ScrollTrigger only reports progress.
          },
        });

        // One stagger beats three hand-placed tweens: same result, fewer
        // instances for ScrollTrigger to keep in sync.
        timeline.to(cards, {
          z: 0,
          rotateY: 0,
          opacity: 1,
          ease: "power2.out",
          duration: 1,
          stagger: 0.85,
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative h-[280svh] bg-uniba-navy-950">
      <div
        className="sticky top-0 flex h-svh items-center overflow-hidden"
        style={{ perspective: "1400px" }}
      >
        <div aria-hidden="true" className="absolute inset-0 bg-batik-parang opacity-60" />

        <Container className="relative">
          <h2 className="max-w-2xl text-balance font-heading text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Skema Pembayaran
          </h2>

          <div
            className="mt-12 grid gap-5 md:grid-cols-12"
            style={{ transformStyle: "preserve-3d" }}
          >
            {BEATS.map(({ icon: Icon, kicker, title, body, span, lead }) => (
              <article
                key={title}
                className={cn(
                  "story-card flex flex-col rounded-2xl p-7",
                  span,
                  lead
                    ? "justify-end bg-uniba-gold-gradient text-uniba-navy-950 sm:p-9"
                    : "border border-white/12 bg-uniba-navy/60"
                )}
                style={{ transformStyle: "preserve-3d" }}
              >
                <span
                  className={cn(
                    "flex size-12 items-center justify-center rounded-xl",
                    lead
                      ? "bg-uniba-navy-950/12 text-uniba-navy-950"
                      : "bg-uniba-gold-gradient text-uniba-navy"
                  )}
                >
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <p
                  className={cn(
                    "mt-5 font-heading font-extrabold tabular-nums",
                    lead
                      ? "text-6xl text-uniba-navy-950 sm:text-7xl"
                      : "text-4xl text-uniba-gold-soft"
                  )}
                >
                  {kicker}
                </p>
                <h3
                  className={cn(
                    "mt-1 font-heading font-bold",
                    lead ? "text-2xl text-uniba-navy-950 sm:text-3xl" : "text-xl text-white"
                  )}
                >
                  {title}
                </h3>
                <p
                  className={cn(
                    "mt-3 leading-relaxed",
                    lead
                      ? "max-w-xl text-base text-uniba-navy-950/80"
                      : "text-sm text-white/75"
                  )}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
