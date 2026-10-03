/**
 * Shared motion tokens, measured from the reference rather than chosen by feel.
 * See docs/teardown-getflect.md.
 *
 * The finding that mattered: the reference runs NO animation library. No GSAP, no
 * Framer Motion, no smooth-scroll hijack. It is plain CSS transitions triggered on
 * entry. So what makes it feel expensive is not more motion, it is fewer moves,
 * held longer, on a harder ease-out curve.
 *
 * Measured there: durations 0.55s to 1.0s, easings cubic-bezier(0.16, 1, 0.22, 1)
 * and cubic-bezier(0.22, 1, 0.36, 1), and transitions on `opacity, filter,
 * transform` together. That `filter` is the part usually left out: arriving out of
 * a slight blur reads far more considered than a plain fade-and-slide, because it
 * imitates something settling into focus rather than sliding on rails.
 */

/** The reference's primary curve. Fast departure, very long settle. */
export const EASE_OUT_EXPO = [0.16, 1, 0.22, 1] as const;

/** Its secondary curve, used on shorter interface transitions. */
export const EASE_OUT_SOFT = [0.22, 1, 0.36, 1] as const;

export const DURATION = {
  /** Interface feedback: colour, opacity on hover. */
  quick: 0.28,
  /** Standard content reveal. */
  reveal: 0.85,
  /** Large surfaces that should feel unhurried. */
  slow: 1.0,
} as const;

/**
 * Stagger between siblings: 18ms.
 *
 * This looks far too small, and that is the point. Measuring the reference showed
 * an arithmetic sequence of transition delays stepping 0.018s at a time
 * (0.018, 0.036, 0.054, 0.072, 0.09, 0.108), not the slow queue you would guess.
 *
 * The premium feel comes from LONG DURATION paired with a TIGHT stagger: siblings
 * set off almost together and then settle slowly, so the group reads as one
 * movement. A generous stagger, which is what this was before at 0.14s, makes
 * elements arrive one at a time like a list loading in, and that reads as cheap.
 */
export const STAGGER = 0.018;

/**
 * The house reveal.
 *
 * Blur is kept at 3px for two reasons, and the second one is the important one.
 * Compositing a heavy blur over a large surface is expensive on the mid-range
 * phones this page is bought for. More seriously, the failure mode of this effect
 * is UNREADABLE CONTENT: if a reveal never completes, whatever it was revealing
 * stays blurred. That already happened once, when three components had `filter`
 * on their `hidden` variant but not on `visible`, and Framer Motion leaves a
 * property at its hidden value when the target variant omits it.
 *
 * So: any variant that blurs in MUST blur out, and the amount stays small enough
 * that a stuck state is still legible rather than destroying the page.
 */
export const revealUp = {
  hidden: { opacity: 0, y: 20, filter: "blur(3px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** Same arrival without vertical travel, for elements already in position. */
export const revealIn = {
  hidden: { opacity: 0, filter: "blur(3px)" },
  visible: { opacity: 1, filter: "blur(0px)" },
};

/** Spread onto a motion component's `transition`. */
export const revealTransition = {
  duration: DURATION.reveal,
  ease: EASE_OUT_EXPO,
};

/** Viewport config so a reveal fires once, slightly before the element is centred. */
export const revealViewport = { once: true, margin: "-80px" } as const;
