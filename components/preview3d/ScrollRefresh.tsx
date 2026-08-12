"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Recomputes every ScrollTrigger's start/end once the page has actually settled.
 *
 * This exists because of a measured failure, not as a precaution. ScrollTrigger
 * refreshes itself on `load`, but in the App Router the components that create
 * these triggers hydrate *after* `load` has already fired, so that automatic
 * refresh never applies to them. The observed symptom was every trigger sitting
 * at `start: 0, end: null` and `progress: 0` forever: correct math, never run,
 * because the range had never resolved. A single refresh turned them into
 * 0 -> 1120 and 1920 -> 3360.
 *
 * Mounted last on the page so both scroll sections exist before it runs, and
 * refreshed again after webfonts land because Crimson/Jakarta swapping in
 * changes text height, which moves every trigger boundary below it.
 */
export default function ScrollRefresh() {
  useEffect(() => {
    // setTimeout rather than requestAnimationFrame: rAF is suspended while a tab
    // is backgrounded, so an rAF-gated refresh would never run for someone who
    // opens the page in a background tab and only reads it later. A macrotask
    // still lets hydration finish, and fires either way.
    const timer = setTimeout(() => ScrollTrigger.refresh(), 0);

    // Webfont swap changes text height, which moves every boundary below it.
    let cancelled = false;
    void document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return null;
}
