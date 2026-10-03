import type { CSSProperties } from "react";

/**
 * Two banks of cloud drifting across a section, at different speeds.
 *
 * This replaces the batik kawung overlay that used to sit on every navy surface. The
 * pattern was a fixed 88px SVG tile: at a glance it read as textile, it repeated
 * visibly on a wide screen, and it said nothing the rest of the page was saying. The
 * campaign is built on one picture -- masa depan cerah, a bright sky -- so the surfaces
 * that were textile become weather.
 *
 * Why CSS and not Framer Motion, on a page that already ships Framer Motion: this is an
 * ambient loop with no state, no trigger and nothing to interrupt. Two keyframed
 * transforms cost nothing and run on the compositor; driving them through React would
 * add a subscription per layer for an animation that never changes. Framer Motion earns
 * its place on the scroll reveals, not here.
 *
 * The seam problem is why the strip is generated rather than drawn. A drifting layer has
 * to meet itself exactly once per loop, so `scripts/make-sky.py` renders it with x-
 * periodic noise -- every octave, both displacement fields, and the sampler that reads
 * through them -- and measures the join before writing the file. The element is 200%
 * wide holding two copies of the strip and travels exactly -50%, which lands one full
 * copy along.
 *
 * Two layers, not three. Each one is a composited surface twice the width of its
 * section, and this component appears on five of them; a third layer would triple that
 * texture memory on phones to add depth nobody would notice under 22% opacity.
 *
 * Server component: no state, no effects, no JavaScript shipped.
 */

interface CloudDriftProps {
  className?: string;
  /**
   * Scales both layers. Under 1 for surfaces where content sits directly on top,
   * above 1 for a mostly empty band that can carry more weather.
   */
  intensity?: number;
}

type LayerStyle = CSSProperties & { "--cloud-speed": string };

export function CloudDrift({ className = "", intensity = 1 }: CloudDriftProps) {
  const upper: LayerStyle = {
    "--cloud-speed": "185s",
    top: "-8%",
    height: "64%",
    opacity: 0.22 * intensity,
  };
  // Slower-looking because it is nearer: the lower bank runs the other way and finishes
  // sooner, which is what separates the two planes. Matched speeds read as one sheet.
  const lower: LayerStyle = {
    "--cloud-speed": "115s",
    bottom: "-12%",
    height: "56%",
    opacity: 0.14 * intensity,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <span className="cloud-layer" style={upper} />
      <span className="cloud-layer cloud-layer--reverse" style={lower} />
    </div>
  );
}

export default CloudDrift;
