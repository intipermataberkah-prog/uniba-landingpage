import type { ReactNode } from "react";

// 68rem (1088px) rather than max-w-7xl (1280px). The reference holds its content
// to 1064px, and a narrower measure is the single biggest lever on whether a page
// reads as editorial or as a wide dashboard.
import { cn } from "@/lib/utils";

export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-[68rem] px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
