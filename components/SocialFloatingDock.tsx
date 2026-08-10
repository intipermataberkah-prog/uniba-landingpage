"use client";

import { motion } from "framer-motion";

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
 * The official social links, shown as a permanent stack above the WhatsApp FAB
 * in StickyCTA so the two floating clusters never overlap.
 *
 * These used to sit behind a Share2 toggle. A collapsed dock costs a tap before
 * anything is even discoverable, and the icons are the recognisable part — the
 * share glyph told visitors nothing about what was inside. They are always open now.
 *
 * Icons are one step smaller on phones so four of them plus the FAB still clear
 * the mobile sticky bottom bar.
 */
export default function SocialFloatingDock() {
  const visible = useScrollReveal(400);

  if (!visible) return null;

  return (
    <nav
      aria-label="Sosial media UNIBA Surakarta"
      className="fixed right-6 bottom-40 z-50 flex flex-col items-center gap-2.5 lg:bottom-24 lg:gap-3"
    >
      {SOCIAL_LINKS.map(({ label, href, Icon, className, badge }, index) => (
        <motion.a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          title={label}
          initial={{ opacity: 0, scale: 0.6, x: 16 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.25, ease: "easeOut", delay: index * 0.05 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          className={cn(
            "relative flex size-10 items-center justify-center rounded-full text-white shadow-lg shadow-black/20 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none sm:size-11",
            className
          )}
        >
          <Icon className="size-4.5 sm:size-5" />
          {badge ? (
            <span className="absolute -right-1 -bottom-1 rounded-full bg-white px-1 text-[8px] font-bold text-uniba-navy ring-1 ring-uniba-navy/20">
              {badge}
            </span>
          ) : null}
        </motion.a>
      ))}
    </nav>
  );
}
