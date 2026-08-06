"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Share2, X } from "lucide-react";

import { contactInfo } from "@/data/unibaData";
import { InstagramGlyph, TiktokGlyph, YoutubeGlyph } from "@/components/SocialIcons";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { cn } from "@/lib/utils";

const instagramHref = contactInfo.socials.find((s) => s.label === "Instagram")?.href ?? "#";
const tiktokHref = contactInfo.socials.find((s) => s.label === "TikTok")?.href ?? "#";
const youtubeHref = contactInfo.socials.find((s) => s.label === "YouTube")?.href ?? "#";

const SOCIAL_LINKS = [
  {
    label: "Instagram UNIBA Surakarta",
    href: instagramHref,
    Icon: InstagramGlyph,
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    badge: null,
  },
  {
    label: "Instagram PMB UNIBA",
    href: contactInfo.pmbInstagram,
    Icon: InstagramGlyph,
    className: "bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af]",
    badge: "PMB",
  },
  {
    label: "TikTok UNIBA Surakarta",
    href: tiktokHref,
    Icon: TiktokGlyph,
    className: "bg-black",
    badge: null,
  },
  {
    label: "YouTube UNIBA Surakarta",
    href: youtubeHref,
    Icon: YoutubeGlyph,
    className: "bg-[#FF0000]",
    badge: null,
  },
] as const;

/**
 * A collapsible stack of official social links, anchored above the WhatsApp
 * FAB in StickyCTA so the two floating clusters never overlap.
 */
export default function SocialFloatingDock() {
  const visible = useScrollReveal(400);
  const [open, setOpen] = useState(false);

  if (!visible) return null;

  return (
    <div className="fixed right-6 bottom-40 z-50 flex flex-col-reverse items-center gap-3 lg:bottom-24">
      <motion.button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Tutup tautan sosial media" : "Buka tautan sosial media"}
        aria-expanded={open}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="flex size-12 items-center justify-center rounded-full bg-uniba-navy text-white shadow-lg shadow-black/25 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
      >
        {open ? (
          <X className="size-5" aria-hidden="true" />
        ) : (
          <Share2 className="size-5" aria-hidden="true" />
        )}
      </motion.button>

      <AnimatePresence>
        {open
          ? SOCIAL_LINKS.map(({ label, href, Icon, className, badge }, index) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                initial={{ opacity: 0, scale: 0.6, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.6, y: 16 }}
                transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className={cn(
                  "relative flex size-11 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none",
                  className
                )}
              >
                <Icon className="size-5" />
                {badge ? (
                  <span className="absolute -right-1 -bottom-1 rounded-full bg-white px-1 text-[8px] font-bold text-uniba-navy ring-1 ring-uniba-navy/20">
                    {badge}
                  </span>
                ) : null}
              </motion.a>
            ))
          : null}
      </AnimatePresence>
    </div>
  );
}
