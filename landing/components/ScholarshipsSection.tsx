"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/SectionHeading";
import { DURATION, EASE_OUT_EXPO, STAGGER, revealViewport } from "@/lib/motion";
import { Container } from "@/components/Container";
import { RegistrationDialog } from "@/components/RegistrationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icon-map";
import { scholarships } from "@/data/unibaData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: STAGGER, delayChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: "blur(3px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: DURATION.reveal, ease: EASE_OUT_EXPO },
  },
};

export default function ScholarshipsSection() {
  return (
    <section id="beasiswa" className="bg-white py-24 sm:py-32 lg:py-36">
      <Container>
        <SectionHeading
          eyebrow="Beasiswa"
          title="Program Beasiswa yang Luas untuk Semua Talenta"
          description="Dari prestasi akademik hingga hafalan Al-Qur'an — ada jalur beasiswa untuk berbagai pencapaianmu."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={revealViewport}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {scholarships.map((scholarship) => {
            const Icon = iconMap[scholarship.iconName];

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-uniba-navy/10 bg-white p-6 shadow-elev-1 transition-all duration-300 hover:-translate-y-1.5 hover:border-uniba-sky/40 hover:shadow-elev-3 sm:p-7"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-uniba-sky-gradient transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <div className="mb-5 inline-flex size-12 w-fit items-center justify-center rounded-xl bg-uniba-navy/5 text-uniba-navy ring-1 ring-inset ring-uniba-navy/10 transition-all duration-300 group-hover:bg-uniba-sky/15 group-hover:text-uniba-sky-deep group-hover:ring-uniba-sky/30">
                  <Icon className="size-6" />
                </div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-slate-dark">
                  {scholarship.name}
                </h3>

                <p className="mb-5 flex-1 text-sm text-muted-foreground sm:text-base">
                  {scholarship.description}
                </p>

                {/* `whitespace-normal` and `overflow-visible` override the Badge base,
                    which ships `whitespace-nowrap overflow-hidden`. Coverage strings run
                    to 45 characters -- "Gratis biaya kuliah penuh + uang saku bulanan" --
                    and in a card this width the base clipped them mid-word with no
                    ellipsis, so the offer simply ran off the edge. */}
                <Badge
                  variant="outline"
                  className="h-auto w-fit justify-start overflow-visible border-transparent bg-uniba-sky-gradient px-3 py-1.5 text-left text-xs leading-snug font-semibold whitespace-normal text-slate-dark shadow-sm sm:text-sm"
                >
                  {scholarship.coverage}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16, filter: "blur(3px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={revealViewport}
          transition={{ duration: DURATION.reveal, delay: 0.15, ease: EASE_OUT_EXPO }}
          className="glass-panel mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl p-6 text-center sm:flex-row sm:p-8 sm:text-left"
        >
          <p className="text-sm text-slate-dark sm:text-base">
            Ingin mengajukan beasiswa? <span className="font-semibold">Sampaikan saat mendaftar</span> —
            tim admisi kami akan membantu proses verifikasi berkasmu.
          </p>
          <RegistrationDialog
            trigger={
              <Button size="lg" className="w-full shrink-0 sm:w-auto">
                Tanyakan Beasiswa via Pendaftaran
              </Button>
            }
          />
        </motion.div>
      </Container>
    </section>
  );
}
