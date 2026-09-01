/**
 * Sky and clouds, generated entirely in CSS.
 *
 * The reference site anchors its calmest section on a large photograph of sky.
 * That photograph is theirs, so this builds the same idea from layered radial
 * gradients instead: nothing is downloaded, there is no licence question, and it
 * costs zero bytes of image payload on a page bought with ad money.
 *
 * The metaphor is the reason it is here rather than decoration: masa depan cerah.
 * A clear sky is the plainest possible picture of a bright future, and it is also
 * why the palette dropped gold for blue. Sky IS the brand colour now.
 *
 * Server component: no state, no effects, no JS shipped.
 */
export function SkyBackdrop({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Ground: deep sky at the top falling to near-white at the horizon. */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#8ec9f0_0%,#bfe0f7_28%,#e2f1fc_62%,#f7fbff_100%)]" />

      {/* Cloud bank. Each puff is one soft radial; overlapping them at different
          sizes is what stops it reading as a row of identical circles. */}
      <div
        className="sky-drift absolute inset-x-0 top-[18%] h-[55%] opacity-90"
        style={{
          backgroundImage: [
            "radial-gradient(38% 46% at 12% 62%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 70%)",
            "radial-gradient(30% 40% at 26% 48%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0) 72%)",
            "radial-gradient(46% 52% at 44% 66%, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0) 70%)",
            "radial-gradient(26% 34% at 62% 44%, rgba(255,255,255,0.88) 0%, rgba(255,255,255,0) 74%)",
            "radial-gradient(40% 48% at 78% 60%, rgba(255,255,255,0.93) 0%, rgba(255,255,255,0) 70%)",
            "radial-gradient(24% 30% at 92% 40%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 76%)",
          ].join(","),
        }}
      />

      {/* A second, fainter bank higher up, drifting the other way for parallax. */}
      <div
        className="sky-drift-slow absolute inset-x-0 top-[4%] h-[34%] opacity-60"
        style={{
          backgroundImage: [
            "radial-gradient(30% 44% at 20% 60%, rgba(255,255,255,0.80) 0%, rgba(255,255,255,0) 74%)",
            "radial-gradient(36% 46% at 55% 50%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0) 74%)",
            "radial-gradient(28% 38% at 85% 62%, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0) 74%)",
          ].join(","),
        }}
      />

      {/* Horizon wash so type near the bottom always has a calm ground under it. */}
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_0%,rgba(255,255,255,0.85)_70%,#ffffff_100%)]" />
    </div>
  );
}

export default SkyBackdrop;
