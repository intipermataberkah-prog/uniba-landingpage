"use client";

import { motion } from "framer-motion";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqItems } from "@/data/unibaData";

export default function FAQSection() {
  return (
    <section id="faq" className="bg-cream py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="FAQ"
          title="Pertanyaan yang Sering Diajukan"
          description="Masih ada yang ingin ditanyakan seputar biaya kuliah, cicilan, atau proses pendaftaran? Simak jawabannya di bawah ini."
        />

        <motion.div
          className="mx-auto mt-12 max-w-3xl rounded-2xl border border-uniba-navy/10 bg-white p-2 shadow-elev-2 sm:p-4"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <motion.div
                key={item.question}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
              >
                <AccordionItem
                  value={String(index)}
                  className="px-2 not-last:border-b border-uniba-navy/10 sm:px-3"
                >
                  <AccordionTrigger className="py-5 text-base font-semibold text-slate-dark sm:text-lg">
                    {item.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-muted-foreground">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </Container>
    </section>
  );
}
