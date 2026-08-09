"use client";

import type { ReactNode } from "react";
import { ArrowRight, Globe, MessageCircle } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { contactInfo } from "@/data/unibaData";

const waHelpMessage =
  "Assalamu'alaikum, saya butuh bantuan untuk proses pendaftaran PMB UNIBA Surakarta.";
const waLink = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(waHelpMessage)}`;

/**
 * Choice modal for the primary "Daftar Sekarang" CTA: lets the visitor pick
 * between registering themselves on the official PMB portal or getting guided
 * help from the admissions team over WhatsApp.
 */
export function DaftarDialog({ trigger }: { trigger: ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">Daftar Sekarang</DialogTitle>
          <DialogDescription>
            Gratis Uang Gedung. Pilih cara pendaftaran yang paling nyaman untukmu.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-2 flex flex-col gap-3">
          {/* Option 1 — self-serve on the official PMB portal */}
          <a
            href={contactInfo.pmbWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-uniba-navy/10 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-uniba-gold/50 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-uniba-navy text-white">
              <Globe className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading font-semibold text-slate-dark">
                Langsung Daftar Online
              </span>
              <span className="block text-sm text-muted-foreground">
                Buka portal resmi PMB dan isi formulir sendiri.
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-uniba-navy/40 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>

          {/* Option 2 — guided help via WhatsApp admissions */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-4 rounded-2xl border border-uniba-navy/10 bg-white p-4 transition-all duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#25D366] text-white">
              <MessageCircle className="size-5" aria-hidden="true" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading font-semibold text-slate-dark">
                Bantuan Pendaftaran Via WhatsApp
              </span>
              <span className="block text-sm text-muted-foreground">
                Dibantu langsung oleh tim admisi PMB.
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-uniba-navy/40 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
        </div>
      </DialogContent>
    </Dialog>
  );
}
