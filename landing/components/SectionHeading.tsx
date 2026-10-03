import type { ReactNode } from "react";

import { Reveal } from "@/components/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Use on dark/navy backgrounds so text remains legible. */
  light?: boolean;
  className?: string;
}

/**
 * The heading block every section opens with.
 *
 * This carried no motion at all, which was the page's largest gap: eight sections each
 * snapped their eyebrow, title and description into place while the cards underneath
 * them animated in. Fixing it here rather than at eight call sites means the whole page
 * gains text motion from one change, and the three parts step in the house 18ms so the
 * block arrives as one movement instead of three.
 *
 * Still a server component. `Reveal` is the only client boundary, so the heading itself
 * ships no JavaScript and `/rpl` can keep rendering on the server.
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className
      )}
    >
      {eyebrow ? (
        <Reveal
          as="span"
          index={0}
          y={12}
          className={cn(
            "mb-5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]",
            align === "center" ? "justify-center" : "",
            light ? "text-uniba-sky-soft" : "text-uniba-sky-deep"
          )}
        >
          <span
            aria-hidden="true"
            className="h-px w-8 rounded-full bg-uniba-sky-gradient"
          />
          {eyebrow}
        </Reveal>
      ) : null}

      <Reveal
        as="h2"
        index={1}
        className={cn(
          "text-balance font-heading text-3xl font-semibold tracking-display sm:text-4xl lg:text-[2.6rem] lg:leading-heading",
          light ? "text-white" : "text-slate-dark"
        )}
      >
        {title}
      </Reveal>

      {description ? (
        <Reveal
          as="p"
          index={2}
          className={cn(
            "mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </Reveal>
      ) : null}
    </div>
  );
}
