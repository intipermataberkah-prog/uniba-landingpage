"use client";

import { useEffect, useRef } from "react";

/**
 * Generative kawung batik rendered on canvas — the hero's single authored
 * moment. The university is named for batik, so the texture comes from the
 * subject's own world rather than being decoration.
 *
 * The motif weaves in on load (diagonal loom sweep), then breathes. The pointer
 * warms nearby motifs like light moving across cloth.
 *
 * Progressive enhancement: without JS or with reduced motion the CSS
 * `.bg-batik-kawung` ground underneath still carries the pattern. The canvas
 * lazily starts only when visible, pauses off-screen and on tab-hide, and caps
 * DPR so mid-range Android stays at 60fps.
 */
export default function BatikLoom({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let rafId = 0;
    let startedAt = 0;
    let running = false;

    // Pointer warmth, eased toward the real cursor so motion stays smooth.
    const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, strength: 0, tStrength: 0 };

    function resize() {
      const parent = canvas!.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.floor(width * dpr);
      canvas!.height = Math.floor(height * dpr);
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    /** One kawung unit: four overlapping ovals around a center, plus a seed dot. */
    function drawMotif(x: number, y: number, r: number, alpha: number, warm: number) {
      const c = ctx!;
      const off = r * 0.62;

      // Gold strokes carry the brand; white keeps the weave from going muddy.
      c.strokeStyle = `rgba(212, 175, 55, ${alpha * (0.55 + warm * 0.9)})`;
      c.lineWidth = 1.1;
      c.beginPath();
      c.ellipse(x - off, y, r, r * 0.74, 0, 0, Math.PI * 2);
      c.ellipse(x + off, y, r, r * 0.74, 0, 0, Math.PI * 2);
      c.stroke();

      c.strokeStyle = `rgba(226, 236, 255, ${alpha * (0.3 + warm * 0.55)})`;
      c.beginPath();
      c.ellipse(x, y - off, r * 0.74, r, 0, 0, Math.PI * 2);
      c.ellipse(x, y + off, r * 0.74, r, 0, 0, Math.PI * 2);
      c.stroke();

      if (warm > 0.05) {
        c.fillStyle = `rgba(245, 158, 11, ${alpha * warm * 0.75})`;
        c.beginPath();
        c.arc(x, y, r * 0.13, 0, Math.PI * 2);
        c.fill();
      }
    }

    function render(now: number) {
      if (!startedAt) startedAt = now;
      const t = (now - startedAt) / 1000;
      const c = ctx!;

      c.clearRect(0, 0, width, height);

      // Larger motifs on small screens keep the weave legible and cheap to draw.
      const spacing = width < 640 ? 104 : width < 1024 ? 116 : 128;
      const r = spacing * 0.29;
      const cols = Math.ceil(width / spacing) + 2;
      const rows = Math.ceil(height / spacing) + 2;
      const diagMax = cols + rows;

      // Loom sweep: the weave lays itself in along the diagonal, once.
      const weaveIn = reduceMotion ? 1 : Math.min(t / 1.65, 1);
      const eased = 1 - Math.pow(1 - weaveIn, 3);

      pointer.x += (pointer.tx - pointer.x) * 0.08;
      pointer.y += (pointer.ty - pointer.y) * 0.08;
      pointer.strength += (pointer.tStrength - pointer.strength) * 0.06;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          // Offset every other row so the motifs interlock like real kawung.
          const x = col * spacing + (row % 2 === 0 ? 0 : spacing / 2);
          const y = row * spacing * 0.86;

          const diag = (col + row) / diagMax;
          const revealed = eased * 1.25 - diag;
          if (revealed <= 0) continue;
          const reveal = Math.min(revealed, 1);

          // Slow breath travelling across the cloth.
          const breath = reduceMotion
            ? 0
            : Math.sin(t * 0.55 - (col + row) * 0.35) * 0.5 + 0.5;

          let warm = 0;
          if (pointer.strength > 0.01) {
            const dx = x - pointer.x;
            const dy = y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const radius = spacing * 2.4;
            if (dist < radius) {
              warm = (1 - dist / radius) ** 2 * pointer.strength;
            }
          }

          const alpha = reveal * (0.3 + breath * 0.22);
          drawMotif(x, y, r, alpha, warm);
        }
      }

      if (running) rafId = requestAnimationFrame(render);
    }

    function start() {
      if (running) return;
      running = true;
      // Reduced motion: draw a single settled frame, never animate.
      if (reduceMotion) {
        running = false;
        startedAt = 0;
        render(performance.now());
        return;
      }
      rafId = requestAnimationFrame(render);
    }

    function stop() {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = 0;
    }

    function onPointerMove(event: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();
      pointer.tx = event.clientX - rect.left;
      pointer.ty = event.clientY - rect.top;
      pointer.tStrength = 1;
    }

    function onPointerLeave() {
      pointer.tStrength = 0;
    }

    function onVisibility() {
      if (document.hidden) stop();
      else if (visible) start();
    }

    let visible = false;
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0]?.isIntersecting ?? false;
        if (visible && !document.hidden) start();
        else stop();
      },
      { threshold: 0 }
    );

    resize();
    observer.observe(canvas);

    const onResize = () => {
      resize();
      if (reduceMotion) {
        startedAt = 0;
        render(performance.now());
      }
    };

    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVisibility);
    // Pointer warmth is a desktop affordance; touch scrolling should not fight it.
    const host = canvas.parentElement;
    host?.addEventListener("pointermove", onPointerMove);
    host?.addEventListener("pointerleave", onPointerLeave);

    return () => {
      stop();
      observer.disconnect();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      host?.removeEventListener("pointermove", onPointerMove);
      host?.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={className}
    />
  );
}
