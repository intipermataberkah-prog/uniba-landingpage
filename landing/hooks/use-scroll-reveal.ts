"use client";

import { useEffect, useState } from "react";

/** True once the user has scrolled past `threshold` pixels from the top. */
export function useScrollReveal(threshold = 400) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setVisible(window.scrollY > threshold);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return visible;
}
