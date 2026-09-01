"use client";

/* eslint-disable @next/next/no-img-element --
 * The sprite is a pre-sized, already optimised 65 KB WebP that renders at one fixed size
 * inside three transform layers. next/image would push it through the optimiser to build
 * a srcset for an asset with exactly one display size, and add a wrapper element inside
 * the transform chain, for no bandwidth saved. A warning left in the build is a warning
 * nobody reads.
 */

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";

/**
 * RIO, flown across the page by the scroll position.
 *
 * The brief was "terbang kesana kemari saat scrolling". Wandering at random is noise, so
 * he is given a job instead: he leads the reader down the page and lands beside the
 * closing call to action. Every waypoint below is chosen against a real section.
 *
 * Scroll POSITION drives him, not scroll events and not a timer. The reader can stop
 * halfway, reverse, or fling to the bottom, and RIO is wherever that progress says he is.
 * This is also why the asset is a still image rather than a video: a video plays on its
 * own clock and would have to be scrubbed to an arbitrary frame on every scroll tick.
 *
 * Three things separate this from a sticker sliding on rails:
 *
 *   1. The springs. Feeding the path straight into `x`/`y` tracks the scrollbar exactly
 *      and reads as a scrollbar ornament. Lagging behind and catching up is what reads as
 *      flight.
 *   2. The bob, which is CSS and independent of scroll, so he is still alive when the
 *      reader stops reading to think.
 *   3. He faces where he is going. The facing spring passes through zero on a turn, which
 *      squashes him edge-on for a frame or two -- that is the bank, and it is free.
 *
 * Everything animates on transform and opacity only. Nothing here touches layout.
 */

/**
 * The flight path: [scroll progress, x in vw, y in vh, rotation, scale].
 *
 * x is deliberately kept out of the 34-66vw band except while crossing. That band holds
 * the headline, the price deck, both buttons and the calculator's figures on every
 * breakpoint this component renders at, and a mascot drifting over the button the ad
 * budget is buying is a cost, not a decoration. `scripts/check-rio-path.mjs` samples the
 * path against the real element rectangles rather than trusting this comment.
 */
const PATH: readonly (readonly [number, number, number, number, number])[] = [
  [0.0, 80, 20, -6, 0.72], // hero, upper right: arrives small and far
  [0.09, 70, 52, 5, 0.9], // dives toward the fold
  [0.2, 78, 34, -4, 0.82], // alongside the tuition figure
  [0.34, 12, 44, 7, 0.92], // crosses left over the advantages
  [0.47, 82, 26, -5, 0.76], // back right, high and small
  [0.6, 10, 50, 6, 0.94], // left again, over the scholarships
  [0.72, 46, 18, -2, 1.0], // crossing the navy band, nearest the reader
  [0.85, 80, 46, 5, 0.84], // out right over the steps
  [1.0, 18, 34, -4, 0.96], // lands beside the closing CTA
];

const PROGRESS = PATH.map((p) => p[0]);
const at = (i: 1 | 2 | 3 | 4) => PATH.map((p) => p[i]);

const GLIDE = { stiffness: 42, damping: 18, mass: 0.9 } as const;
const BANK = { stiffness: 90, damping: 14, mass: 0.5 } as const;

export default function RioFlight() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const xRaw = useTransform(scrollYProgress, PROGRESS, at(1));
  const yRaw = useTransform(scrollYProgress, PROGRESS, at(2));
  const rotateRaw = useTransform(scrollYProgress, PROGRESS, at(3));
  const scaleRaw = useTransform(scrollYProgress, PROGRESS, at(4));

  const x = useSpring(xRaw, GLIDE);
  const y = useSpring(yRaw, GLIDE);
  const rotate = useSpring(rotateRaw, BANK);
  const scale = useSpring(scaleRaw, GLIDE);

  // Face the direction of horizontal travel, not the scroll direction: the path doubles
  // back, so those two disagree for most of the page. The source art faces left, so
  // moving right means mirroring.
  const xVelocity = useVelocity(x);
  const facing = useMotionValue(1);
  useMotionValueEvent(xVelocity, "change", (v) => {
    if (v > 0.4) facing.set(-1);
    else if (v < -0.4) facing.set(1);
  });
  const facingSpring = useSpring(facing, BANK);

  // Units have to be attached after the spring: springs animate numbers, not strings.
  const left = useTransform(x, (v) => `${v}vw`);
  const top = useTransform(y, (v) => `${v}vh`);

  if (reduced) {
    // A loop with no natural resting point gets parked rather than sped up. RIO stays on
    // the page; he simply stops flying.
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-[24vh] right-[6vw] z-30 hidden md:block"
      >
        <img src="/mascot/rio.webp" alt="" width={150} height={120} className="w-[150px]" />
      </div>
    );
  }

  return (
    <motion.div
      aria-hidden="true"
      // Decorative and non-interactive: it never intercepts a click, and it is hidden
      // below md, where a 150px mascot over a 375px column covers the content it is
      // meant to be pointing at.
      className="pointer-events-none fixed top-0 left-0 z-30 hidden md:block"
      style={{ x: left, y: top }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.6, ease: [0.16, 1, 0.22, 1] }}
    >
      <motion.div style={{ rotate, scale }}>
        <motion.div style={{ scaleX: facingSpring }}>
          <div className="rio-bob">
            <img
              src="/mascot/rio.webp"
              alt=""
              width={190}
              height={152}
              decoding="async"
              // The render is high-key and the sky is pale, so at 150px he loses his
              // edge against it. The shadow is what keeps him readable without
              // darkening the artwork itself.
              className="w-[150px] drop-shadow-[0_10px_22px_rgba(15,44,89,0.22)] lg:w-[180px]"
            />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
