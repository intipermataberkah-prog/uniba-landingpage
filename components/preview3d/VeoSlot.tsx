"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * A slot for a Veo-generated clip that is safe to ship before the clip exists.
 *
 * The file is requested normally; if it 404s (not rendered yet) the <video>
 * fires `error` and we fall back to the supplied artwork. That means this page
 * works today and upgrades itself the moment an MP4 lands in public/veo/ —
 * no manifest to maintain and no flag to remember to flip.
 *
 * Loading is deferred until the slot is near the viewport, because a hero video
 * that downloads eagerly competes with LCP on exactly the mid-range mobile
 * connections this landing page is bought for.
 */
export function VeoSlot({
  src,
  webm,
  poster,
  fallback,
  className = "",
  label,
}: {
  /** e.g. "/veo/hero.mp4" — fine if it does not exist yet. */
  src: string;
  webm?: string;
  poster?: string;
  /** Rendered when the clip is missing, errors, or motion is reduced. */
  fallback: ReactNode;
  className?: string;
  label: string;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [failed, setFailed] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const node = hostRef.current;
    if (!node || reduceMotion) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [reduceMotion]);

  // Under reduced motion we never play video at all — a looping clip is motion
  // the visitor explicitly asked the OS to suppress.
  const showVideo = inView && !failed && !reduceMotion;

  return (
    <div ref={hostRef} className={`relative overflow-hidden ${className}`}>
      <div className="absolute inset-0">{fallback}</div>

      {showVideo ? (
        <video
          className="absolute inset-0 size-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          poster={poster}
          aria-label={label}
          onError={() => setFailed(true)}
        >
          {webm ? <source src={webm} type="video/webm" /> : null}
          <source src={src} type="video/mp4" />
        </video>
      ) : null}
    </div>
  );
}

export default VeoSlot;
