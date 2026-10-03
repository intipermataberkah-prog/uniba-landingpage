"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

import { DURATION, EASE_OUT_EXPO, STAGGER, revealViewport } from "@/lib/motion";

/**
 * One text block arriving.
 *
 * The page had motion on its cards and none on its words. Every section heading, every
 * standing paragraph and the whole of `/rpl` rendered instantly while the grid beneath
 * them animated in, which reads as the copy being a static backdrop that the interesting
 * parts move against. This is the primitive that closes that gap.
 *
 * It follows the reference's model rather than Framer's: no parent orchestrator, no
 * `staggerChildren`. Each element owns its own viewport trigger and its own
 * `transition-delay`, exactly as a CSS-driven page does it. Two things fall out of that.
 * Server components can use it -- `/rpl` is a server route and could not host a client
 * variant parent without becoming one. And a block that scrolls into view alone still
 * animates, instead of waiting on siblings that may never enter the viewport.
 *
 * `index` exists so a run of siblings can step by the house 18ms. That interval looks
 * far too small written down and is the whole trick: siblings set off almost together
 * and settle slowly, so the group reads as one movement rather than as a list loading
 * in one row at a time.
 */

const TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
  li: motion.li,
  ul: motion.ul,
  ol: motion.ol,
  article: motion.article,
  figure: motion.figure,
} as const;

interface RevealProps {
  children: ReactNode;
  /** Which element to render. Defaults to a div. */
  as?: keyof typeof TAGS;
  /** Position in a run of siblings; stepped by STAGGER. */
  index?: number;
  /** Extra seconds on top of the index step. */
  delay?: number;
  /**
   * Vertical travel in px. Pass 0 for anything whose position is load-bearing -- an
   * element inside a flex row, or one that would otherwise nudge a neighbour.
   */
  y?: number;
  className?: string;
}

export function Reveal({
  children,
  as = "div",
  index = 0,
  delay = 0,
  y = 20,
  className,
}: RevealProps) {
  const Tag = TAGS[as];

  return (
    <Tag
      className={className}
      // Both variants name `filter`. A variant pair where only one side sets it leaves
      // the property pinned at its hidden value, which once shipped three sections of
      // this page permanently blurred.
      initial={{ opacity: 0, y, filter: "blur(3px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={revealViewport}
      transition={{
        duration: DURATION.reveal,
        ease: EASE_OUT_EXPO,
        delay: index * STAGGER + delay,
      }}
    >
      {children}
    </Tag>
  );
}

export default Reveal;
