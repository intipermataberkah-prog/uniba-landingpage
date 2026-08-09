"use client";

import { motion } from "framer-motion";

import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/Container";
import { RegistrationDialog } from "@/components/RegistrationDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icon-map";
import { scholarships } from "@/data/unibaData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function ScholarshipsSection() {
  return (
    <section id="beasiswa" className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Program Beasiswa yang Luas untuk Semua Talenta"
          description="Dari prestasi akademik hingga hafalan Al-Qur'an — ada jalur beasiswa untuk berbagai pencapaianmu."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {scholarships.map((scholarship) => {
            const Icon = iconMap[scholarship.iconName];

            return (
              <motion.div
                key={scholarship.id}
                variants={itemVariants}
                className="group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-elev-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elev-3 sm:p-7"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-uniba-gold-gradient transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                <div className="mb-5 inline-flex size-12 w-fit items-center justify-center rounded-xl bg-uniba-navy/5 text-uniba-navy ring-1 ring-inset ring-uniba-navy/10 transition-all duration-300 group-hover:bg-uniba-gold/15 group-hover:text-uniba-amber group-hover:ring-uniba-gold/30">
                  <Icon className="size-6" />
                </div>

                <h3 className="mb-2 font-heading text-lg font-semibold text-slate-dark">
                  {scholarship.name}
                </h3>

                <p className="mb-5 flex-1 text-sm text-muted-foreground sm:text-base">
                  {scholarship.description}
                </p>

                <Badge
                  variant="outline"
                  className="h-auto w-fit border-transparent bg-uniba-gold-gradient px-3 py-1.5 text-xs font-semibold text-slate-dark shadow-sm sm:text-sm"
                >
                  {scholarship.coverage}
                </Badge>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.15 }}
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
