import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  /** Use on dark/navy backgrounds so text remains legible. */
  light?: boolean;
  className?: string;
}

/**
 * Section headings carry their own weight. There is deliberately no eyebrow or
 * kicker slot: a label above a heading is the clearest tell of assembled rather
 * than designed work, and here the heading below always restated it.
 */
export function SectionHeading({
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
      <h2
        className={cn(
          "text-balance font-heading text-3xl font-bold tracking-[-0.03em] sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
          light ? "text-white" : "text-slate-dark"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mx-auto mt-5 max-w-[62ch] text-balance text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
