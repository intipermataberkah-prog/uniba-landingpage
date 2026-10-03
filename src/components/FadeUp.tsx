"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Menandai [data-fade-up] yang masuk layar; gerak dan kondisi reduced-motion ada di globals.css.
export function FadeUp() {
  const pathname = usePathname();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-shown", "");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-fade-up]:not([data-shown])").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
