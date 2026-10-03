"use client";

import { useState } from "react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DaftarDialog } from "@/components/DaftarDialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { DURATION, EASE_OUT_EXPO } from "@/lib/motion";
import { contactInfo, navLinks } from "@/data/unibaData";

function LogoMark({ compact = false }: { compact?: boolean }) {
  const size = compact ? 32 : 36;
  return (
    <span className="flex items-center gap-2.5">
      <Image
        src="/logo-uniba.png"
        alt="Logo UNIBA Surakarta"
        width={size}
        height={size}
        className="shrink-0"
        priority
      />
      <span className="font-heading text-lg font-semibold whitespace-nowrap text-uniba-navy">
        UNIBA <span className="text-uniba-sky-deep">Surakarta</span>
      </span>
    </span>
  );
}

/**
 * Floating header.
 *
 * This used to be a full-bleed sticky bar with a bottom border, a shadow and a
 * frosted white fill. Measuring the reference showed its header is `fixed`, inset
 * 8px from the edges, and at rest completely transparent: no background, no
 * border, no shadow. That is where the clean feeling at the top of that page comes
 * from. There is no chrome cutting a line across the design, so the hero runs
 * straight to the top edge.
 *
 * So the bar is not deleted, it is made invisible until it is needed. At rest the
 * sky hero is unbroken; once the visitor scrolls past it, a small pill surface
 * fades in so the nav and the Daftar CTA stay legible over content. Deleting the
 * header outright would also throw away the primary conversion path, which is not
 * a trade this page can afford.
 *
 * Fixed, not sticky. Sticky kept the header in normal flow, so it occupied its
 * own 64px band with the white page ground behind it and the sky hero could only
 * begin underneath. Taking it out of flow lets the hero start at the very top
 * edge, so the sky runs full bleed and the header floats over it.
 *
 * This was sticky only because AnnouncementBar sat above it and would have been
 * covered. That bar is gone, so the constraint is gone with it. The hero's own
 * top padding (96px and up) already clears the 64px header, so nothing needs a
 * spacer.
 */
export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // useScroll rather than a window scroll listener: it is throttled to the frame
  // loop instead of firing React state on every scroll event.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const next = v > 24;
    setScrolled((prev) => (prev === next ? prev : next));
  });

  // navLinks are bare "#section" anchors, which only resolve on the homepage. On any
  // other route they would point at a section that does not exist there, so send the
  // visitor home first and let the browser scroll to the anchor on arrival.
  const onHome = pathname === "/";
  const resolveHref = (href: string) =>
    onHome || !href.startsWith("#") ? href : `/${href}`;

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: DURATION.reveal, ease: EASE_OUT_EXPO }}
      className="fixed inset-x-0 top-2 z-50 px-2 sm:top-3 sm:px-3"
    >
      <div
        className={cn(
          "mx-auto flex h-16 max-w-[68rem] items-center justify-between gap-4 rounded-2xl border px-3 sm:px-4",
          "transition-[background-color,border-color,box-shadow] duration-500 ease-out",
          scrolled
            ? "border-uniba-navy/8 bg-white/80 shadow-sm backdrop-blur-xl"
            : "border-transparent bg-transparent"
        )}
      >
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
              href={resolveHref(link.href)}
              className="group relative py-1 text-sm text-uniba-navy/75 transition-colors hover:text-uniba-navy"
            >
              {link.label}
              <span className="absolute -bottom-0.5 left-0 h-px w-0 rounded-full bg-uniba-sky-deep transition-all duration-300 ease-out group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-2.5 lg:flex">
          <DaftarDialog
            trigger={
              <Button className="h-10 rounded-full bg-uniba-navy px-5 text-sm font-medium text-white transition-colors hover:bg-uniba-navy-deep">
                Daftar PMB
              </Button>
            }
          />
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
                  href={resolveHref(link.href)}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base text-uniba-navy/85 transition-colors hover:bg-uniba-navy/5 hover:text-uniba-navy"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-auto flex flex-col gap-3 border-t border-border p-4">
              <Button
                asChild
                variant="outline"
                className="h-11 w-full rounded-full border-uniba-navy/15 text-uniba-navy hover:bg-uniba-navy/5 hover:text-uniba-navy"
                onClick={() => setMobileOpen(false)}
              >
                <a href={resolveHref("#simulasi-biaya")}>Simulasi Biaya</a>
              </Button>
              <DaftarDialog
                trigger={
                  <Button className="h-11 w-full rounded-full bg-uniba-navy font-medium text-white hover:bg-uniba-navy-deep">
                    Daftar PMB
                  </Button>
                }
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </motion.header>
  );
}
