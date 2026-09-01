/**
 * Sky and clouds behind the hero.
 *
 * Two layers, in this order:
 *
 *   1. A CSS gradient sky. This is the floor, not a placeholder. If the image
 *      404s, is still in flight, or the connection dies, the hero still has a
 *      sky and navy type still reads against it.
 *   2. A generated sky photograph on top, art-directed per breakpoint.
 *
 * The photograph earns its place on measurement, not taste. Compressed to WebP it
 * is 9 KB desktop and 8 KB mobile, because a smooth sky is close to the best case
 * for that codec. The earlier objection to using an image at all was that the CSS
 * version cost zero; at 9 KB that objection no longer holds.
 *
 * Contrast was checked before shipping rather than assumed: across the centre band
 * where the headline, price deck and CTA actually sit, the darkest sampled cell
 * still gives 11:1 against navy ink. AA wants 4.5:1.
 *
 * The metaphor is why this is here at all: masa depan cerah. A clear sky is the
 * plainest picture of a bright future, and it is also why the palette dropped gold
 * for blue.
 *
 * Server component: no state, no effects, no JS shipped.
 */
export function SkyBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Layer 1: CSS sky. Always present, never waits on the network. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#8ec9f0_0%,#bfe0f7_28%,#e2f1fc_62%,#f7fbff_100%)]" />

      {/* Layer 2: the photograph, art-directed. Portrait crop below sm so the
          clouds stay in the upper third on a phone instead of being cropped to
          a flat wash. */}
      <picture>
        <source
          media="(max-width: 639px)"
          srcSet="/sky/hero-sky-mobile.webp"
          type="image/webp"
        />
        <img
          src="/sky/hero-sky.webp"
          alt=""
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 size-full object-cover"
        />
      </picture>

      {/* Drifting cloud veils over the photo. Subtle: this adds life without
          competing with the still image underneath. */}
      <div
        className="sky-drift absolute inset-x-0 top-[12%] h-[46%] opacity-40"
        style={{
          backgroundImage: [
            "radial-gradient(34% 44% at 14% 60%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 72%)",
            "radial-gradient(40% 48% at 80% 56%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0) 72%)",
          ].join(","),
        }}
      />

      {/* Horizon wash so type near the bottom always has a calm ground under it,
          and so the section melts into the white band that follows. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.9)_72%,#ffffff_100%)]" />
    </div>
  );
}

export default SkyBackdrop;
