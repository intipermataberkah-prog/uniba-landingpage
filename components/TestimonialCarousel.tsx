"use client";

import { useCallback, useSyncExternalStore } from "react";
import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Quote,
  Landmark,
  Building2,
  Factory,
  Cpu,
  Gavel,
  Wheat,
  type LucideIcon,
} from "lucide-react";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import { testimonials, type Testimonial } from "@/data/unibaData";

const careerFields: { label: string; icon: LucideIcon }[] = [
  { label: "Perbankan", icon: Landmark },
  { label: "Instansi Pemerintah", icon: Building2 },
  { label: "Industri Manufaktur", icon: Factory },
  { label: "Sektor Teknologi", icon: Cpu },
  { label: "Notaris & Hukum", icon: Gavel },
  { label: "Agribisnis", icon: Wheat },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-8 shadow-elev-3 sm:p-10">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-uniba-gold-gradient"
      />
      <Quote
        aria-hidden="true"
        strokeWidth={1}
        className="pointer-events-none absolute -top-6 -right-6 size-32 text-uniba-navy/5"
      />

      <Quote
        aria-hidden="true"
        strokeWidth={1.5}
        className="relative z-10 mb-4 size-8 shrink-0 text-uniba-gold"
      />

      <blockquote className="relative z-10 flex-1 text-balance text-lg leading-relaxed font-medium text-slate-dark sm:text-xl">
        “{testimonial.quote}”
      </blockquote>

      <footer className="relative z-10 mt-8 border-t border-uniba-navy/10 pt-6">
        <p className="font-heading text-base font-bold text-slate-dark">{testimonial.name}</p>
        <p className="text-sm text-muted-foreground">
          {testimonial.program} &middot; {testimonial.cohort}
        </p>
      </footer>

      <div className="relative z-10 mt-5 flex items-stretch gap-3 rounded-xl bg-uniba-gold/10 px-4 py-3">
        <span aria-hidden="true" className="w-1 shrink-0 rounded-full bg-uniba-gold-gradient" />
        <p className="self-center text-sm font-semibold text-uniba-navy">{testimonial.outcome}</p>
      </div>
    </article>
  );
}

/**
 * Tracks the carousel's active snap index by subscribing directly to embla's
 * own event emitter (an external system), rather than mirroring it into
 * React state from inside an effect body.
 */
function useSelectedSnap(emblaApi: UseEmblaCarouselType[1]) {
  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      if (!emblaApi) return () => {};
      emblaApi.on("select", onStoreChange);
      emblaApi.on("reInit", onStoreChange);
      return () => {
        emblaApi.off("select", onStoreChange);
        emblaApi.off("reInit", onStoreChange);
      };
    },
    [emblaApi]
  );

  const getSnapshot = useCallback(
    () => (emblaApi ? emblaApi.selectedScrollSnap() : 0),
    [emblaApi]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => 0);
}

export default function TestimonialCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "center" });
  const selectedIndex = useSelectedSnap(emblaApi);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi]);

  return (
    <section id="testimoni" className="relative overflow-hidden bg-uniba-navy py-20 sm:py-28">
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-batik-kawung opacity-20" />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-16 size-96 rounded-full bg-uniba-blue-bright/20 blur-3xl"
      />
      <Container className="relative">
        <SectionHeading
          light
          title="Mereka Sudah Membuktikannya"
          description="Dengar langsung dari mahasiswa dan alumni UNIBA Surakarta yang telah merasakan manfaat kuliah berkualitas dengan biaya terjangkau dan pembayaran fleksibel."
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12"
        >
          <div className="mx-auto max-w-3xl">
            <div
              ref={emblaRef}
              className="overflow-hidden"
              role="region"
              aria-roledescription="carousel"
              aria-label="Testimoni alumni UNIBA Surakarta"
            >
              <div className="flex touch-pan-y">
                {testimonials.map((testimonial, index) => (
                  <div
                    key={testimonial.id}
                    className="min-w-0 shrink-0 grow-0 basis-full px-1 sm:px-2"
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`Testimoni ${index + 1} dari ${testimonials.length}`}
                    aria-hidden={index !== selectedIndex}
                  >
                    <TestimonialCard testimonial={testimonial} />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center justify-center gap-4 sm:gap-6">
              <button
                type="button"
                onClick={scrollPrev}
                aria-label="Testimoni sebelumnya"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-uniba-navy/15 bg-white text-uniba-navy shadow-sm transition-colors duration-300 hover:bg-uniba-navy hover:text-white focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <ChevronLeft className="size-5" aria-hidden="true" />
              </button>

              <div
                className="flex items-center gap-2"
                role="tablist"
                aria-label="Pilih testimoni"
              >
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => scrollTo(index)}
                    role="tab"
                    aria-selected={index === selectedIndex}
                    aria-label={`Ke testimoni ${index + 1}`}
                    className={cn(
                      "h-2.5 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none",
                      index === selectedIndex
                        ? "w-8 bg-uniba-gold"
                        : "w-2.5 bg-uniba-navy/20 hover:bg-uniba-navy/40"
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={scrollNext}
                aria-label="Testimoni berikutnya"
                className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-uniba-navy/15 bg-white text-uniba-navy shadow-sm transition-colors duration-300 hover:bg-uniba-navy hover:text-white focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <ChevronRight className="size-5" aria-hidden="true" />
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-20"
        >
          <p className="text-center text-xs font-semibold tracking-[0.16em] text-white/55 uppercase sm:text-sm">
            Bidang Karier Alumni
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            {careerFields.map((field) => {
              const Icon = field.icon;
              return (
                <div
                  key={field.label}
                  className="inline-flex items-center gap-2 rounded-full border border-uniba-navy/10 bg-white px-4 py-2 text-sm font-medium text-slate-dark shadow-sm"
                >
                  <Icon className="size-4 text-uniba-navy" aria-hidden="true" />
                  {field.label}
                </div>
              );
            })}
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
