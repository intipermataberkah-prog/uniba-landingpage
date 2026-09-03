"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import { contactInfo, s2WhatsAppLink } from "@/data/unibaData";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

/**
 * Floating overlay CTAs: a persistent WhatsApp shortcut plus a mobile/tablet
 * sticky bottom bar. Both stay hidden until the visitor has scrolled past the
 * Hero so they never collide with the Hero's own primary CTAs on load.
 *
 * `whatsappOnly` exists for /s2, where registration runs through admissions on
 * WhatsApp and the self-serve PMB portal cannot accept a postgraduate applicant.
 * The shared dialog offers that portal as its first option, so on that route the
 * bar has to skip the dialog entirely rather than present a dead end.
 */
export default function StickyCTA({ whatsappOnly = false }: { whatsappOnly?: boolean }) {
  const visible = useScrollReveal(400);
  const waHref = whatsappOnly
    ? s2WhatsAppLink()
    : `https://wa.me/${contactInfo.whatsapp}`;

  return (
    <>
      <AnimatePresence>
        {visible ? (
          <motion.a
            key="whatsapp-fab"
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Hubungi via WhatsApp"
            initial={{ opacity: 0, scale: 0.6, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.6, y: 16 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.94 }}
            className="fixed right-6 bottom-20 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#25D366] lg:bottom-6"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366] opacity-40"
            />
            <MessageCircle className="size-7" aria-hidden="true" />
          </motion.a>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {visible ? (
          <motion.div
            key="sticky-bottom-bar"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 bg-uniba-navy px-4 py-3 text-white shadow-[0_-4px_24px_rgba(0,0,0,0.2)] lg:hidden"
          >
            <p className="text-sm font-medium text-balance">Siap jadi bagian dari UNIBA?</p>
            {whatsappOnly ? (
              <Button
                asChild
                size="sm"
                className="shrink-0 bg-uniba-sky-gradient font-semibold text-uniba-navy hover:brightness-105"
              >
                <a href={waHref} target="_blank" rel="noopener noreferrer">
                  Daftar via WhatsApp
                </a>
              </Button>
            ) : (
              <DaftarDialog
                trigger={
                  <Button
                    size="sm"
                    className="shrink-0 bg-uniba-sky-gradient font-semibold text-uniba-navy hover:brightness-105"
                  >
                    Daftar Sekarang
                  </Button>
                }
              />
            )}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
