"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { Container } from "@/components/Container";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icon-map";
import { enrollmentSteps } from "@/data/unibaData";

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function EnrollmentSteps() {
  return (
    <section id="cara-daftar" className="bg-alabaster py-20 sm:py-28">
      <Container>
        <SectionHeading
          title={`${enrollmentSteps.length} Langkah Mudah Jadi Mahasiswa UNIBA`}
          description="Proses pendaftaran yang cepat, transparan, dan tanpa ribet — dari simulasi biaya sampai resmi jadi mahasiswa."
        />

        <motion.ol
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative mt-16 grid grid-cols-1 gap-10 lg:grid-cols-4 lg:gap-6"
        >
          {enrollmentSteps.map((step, index) => {
            const Icon = iconMap[step.iconName];
            const isLast = index === enrollmentSteps.length - 1;

            return (
              <motion.li key={step.step} variants={itemVariants} className="group relative flex gap-5 lg:flex-col lg:items-center lg:gap-0 lg:text-center">
                {/* Mobile: vertical connector line on the left */}
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute top-14 left-7 -bottom-10 w-px bg-uniba-navy/15 lg:hidden"
                  />
                ) : null}

                {/* Desktop: horizontal connector line between circles */}
                {!isLast ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute top-7 left-[calc(50%+2.25rem)] hidden h-px w-[calc(100%-4.5rem)] bg-uniba-navy/15 lg:block"
                  />
                ) : null}

                <div className="relative z-10 flex size-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-uniba-navy to-uniba-blue-bright text-white shadow-elev-2 ring-4 ring-alabaster transition-transform duration-300 group-hover:scale-105">
                  <Icon className="size-6" aria-hidden />
                  <span className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-uniba-gold-gradient text-xs font-bold text-uniba-navy ring-2 ring-alabaster">
                    {step.step}
                  </span>
                </div>

                <div className="min-w-0 pt-1 lg:pt-5">
                  <Badge
                    variant="secondary"
                    className="mb-2 rounded-full font-semibold tracking-wide uppercase"
                  >
                    {step.duration}
                  </Badge>
                  <h3 className="font-heading text-lg font-semibold text-slate-dark">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground sm:text-base lg:mx-auto lg:max-w-[15rem]">
                    {step.description}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ol>
      </Container>
    </section>
  );
}
