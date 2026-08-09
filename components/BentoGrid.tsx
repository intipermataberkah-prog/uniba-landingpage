"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/Container";
import { iconMap } from "@/lib/icon-map";
import { bentoFeatures } from "@/data/unibaData";
import { cn } from "@/lib/utils";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function BentoGrid() {
  return (
    <section id="keunggulan" className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          title="Kampus yang Dirancang untuk Kemudahanmu"
          description={`${bentoFeatures.length} alasan utama mengapa ribuan mahasiswa memilih UNIBA Surakarta sebagai tempat menempuh pendidikan tinggi.`}
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-12 grid grid-flow-row-dense grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4 lg:auto-rows-fr lg:gap-6"
        >
          {bentoFeatures.map((feature) => {
            const Icon = iconMap[feature.iconName];
            const isLarge = feature.size === "large";

            return (
              <motion.div
                key={feature.id}
                variants={itemVariants}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-elev-1 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-elev-3 sm:p-8",
                  isLarge
                    ? "sm:col-span-2 sm:row-span-1 lg:col-span-2 lg:row-span-2 lg:p-10"
                    : "lg:col-span-1 lg:row-span-1"
                )}
              >
                {/* Gold top accent reveal */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-uniba-gold-gradient transition-transform duration-300 ease-out group-hover:scale-x-100"
                />
                {isLarge ? (
                  <>
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -top-16 -right-16 size-56 rounded-full bg-uniba-gold-gradient opacity-10 blur-3xl"
                    />
                    <Icon
                      aria-hidden
                      className="pointer-events-none absolute -right-8 -bottom-8 size-48 rotate-12 text-uniba-navy/5"
                      strokeWidth={1.25}
                    />
                  </>
                ) : null}

                <div
                  className={cn(
                    "relative z-10 mb-5 inline-flex w-fit items-center justify-center rounded-xl bg-uniba-navy/5 text-uniba-navy ring-1 ring-inset ring-uniba-navy/10 transition-all duration-300 group-hover:bg-uniba-gold/15 group-hover:text-uniba-amber group-hover:ring-uniba-gold/30",
                    isLarge ? "size-14" : "size-12"
                  )}
                >
                  <Icon className={isLarge ? "size-7" : "size-6"} />
                </div>

                <h3
                  className={cn(
                    "relative z-10 font-heading font-semibold text-slate-dark",
                    isLarge ? "mb-3 text-2xl sm:text-3xl" : "mb-2 text-lg"
                  )}
                >
                  {feature.title}
                </h3>

                <p
                  className={cn(
                    "relative z-10 text-muted-foreground",
                    isLarge ? "max-w-md text-base sm:text-lg" : "text-sm sm:text-base"
                  )}
                >
                  {feature.description}
                </p>

                {isLarge ? (
                  <div
                    aria-hidden
                    className="relative z-10 mt-6 h-1 w-16 rounded-full bg-uniba-gold-gradient"
                  />
                ) : null}
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}
