"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Menu } from "lucide-react";

import { Container } from "@/components/Container";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { contactInfo, navLinks } from "@/data/unibaData";

function LogoMark({ compact = false }: { compact?: boolean }) {
  const size = compact ? 32 : 38;
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo-uniba.jpg"
        alt="Logo UNIBA Surakarta"
        width={size}
        height={size}
        className="shrink-0 rounded-md ring-1 ring-uniba-navy/10"
        priority
      />
      <span className="font-heading text-lg font-bold whitespace-nowrap text-uniba-navy">
        UNIBA <span className="text-uniba-amber">Surakarta</span>
      </span>
    </span>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-40 border-b border-uniba-navy/10 bg-white/80 shadow-elev-1 backdrop-blur-lg supports-[backdrop-filter]:bg-white/70"
    >
      <Container className="flex h-16 items-center justify-between gap-4">
        <a
          href={contactInfo.website}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Situs resmi UNIBA Surakarta (uniba.ac.id)"
          className="shrink-0"
        >
          <LogoMark />
        </a>

        {/* Desktop nav links */}
        <nav aria-label="Navigasi utama" className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="group relative py-1 text-sm font-medium text-uniba-navy/80 transition-colors hover:text-uniba-blue-bright"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-0.5 w-0 rounded-full bg-uniba-blue-bright transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <Button
            asChild
            variant="outline"
            className="h-10 border-uniba-navy/15 px-4 text-uniba-navy hover:border-uniba-navy/25 hover:bg-uniba-navy/5 hover:text-uniba-navy"
          >
            <a href="#simulasi-biaya">Simulasi Biaya</a>
          </Button>
          <Button
            asChild
            className="h-10 bg-uniba-gold-gradient px-5 font-semibold text-uniba-navy shadow-sm transition-transform hover:-translate-y-0.5 hover:brightness-105"
          >
            <a href={contactInfo.pmbWebsite} target="_blank" rel="noopener noreferrer">
              Daftar PMB
            </a>
          </Button>
        </div>

        {/* Mobile menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              aria-label="Buka menu navigasi"
            >
              <Menu className="size-5 text-uniba-navy" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="flex w-4/5 flex-col gap-0 sm:max-w-xs">
            <SheetHeader className="border-b border-border">
              <SheetTitle className="flex items-center text-left">
                <LogoMark compact />
              </SheetTitle>
            </SheetHeader>

            <nav aria-label="Navigasi mobile" className="flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-md px-3 py-2.5 text-base font-medium text-uniba-navy/85 transition-colors hover:bg-uniba-navy/5 hover:text-uniba-blue-bright"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
              <Button
                asChild
                variant="outline"
                className="h-11 w-full border-uniba-navy/15 text-uniba-navy hover:bg-uniba-navy/5 hover:text-uniba-navy"
                onClick={() => setMobileOpen(false)}
              >
                <a href="#simulasi-biaya">Simulasi Biaya</a>
              </Button>
              <Button
                asChild
                className="h-11 w-full bg-uniba-gold-gradient font-semibold text-uniba-navy hover:brightness-105"
                onClick={() => setMobileOpen(false)}
              >
                <a href={contactInfo.pmbWebsite} target="_blank" rel="noopener noreferrer">
                  Daftar PMB
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </Container>
    </motion.header>
  );
}
