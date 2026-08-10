import type { ReactNode } from "react";
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
        <span
          className={cn(
            "mb-5 inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-[0.18em]",
            align === "center" ? "justify-center" : "",
            light ? "text-uniba-gold-soft" : "text-uniba-amber"
          )}
        >
          <span
            aria-hidden="true"
            className="h-px w-8 rounded-full bg-uniba-gold-gradient"
          />
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "text-balance font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.6rem] lg:leading-[1.1]",
          light ? "text-white" : "text-slate-dark"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "mx-auto mt-5 max-w-2xl text-balance text-base leading-relaxed sm:text-lg",
            light ? "text-white/70" : "text-muted-foreground"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
