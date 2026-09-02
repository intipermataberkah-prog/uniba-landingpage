"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";

/**
 * A sheet of torn paper that sweeps the screen while the route changes.
 *
 * The RPL bar in the hero is the one link on this page that goes somewhere rather than
 * scrolling, and it used to change the page with no acknowledgement at all. This gives
 * that click a cut: a sheet sweeps in from the left, the navigation is released behind
 * it, and the sheet carries on out to the right with /rpl already standing there.
 *
 * It lives in the root layout, not in the hero, and that placement is the whole design.
 * The hero unmounts the moment the route commits, so an overlay owned by it would be
 * destroyed mid-sweep and the new page would snap in bare. Owning the sheet at the
 * layout level lets one continuous movement span two pages.
 *
 * Sequencing, and why it is ordered this way:
 *
 *   cover   the sheet arrives. Nothing else happens yet -- pushing at the same time
 *           risks the new page painting before the sheet has covered the old one,
 *           which is the exact flash this is meant to hide.
 *   push    released when the sheet has covered -- from the animation's completion
 *           callback, and from a timer, whichever lands first. See SETTLE_MS.
 *   hold    a floor of 140ms. On a prefetched route the commit is instant and the
 *           sheet would turn around before the eye registers it had arrived.
 *   reveal  released on the pathname actually changing, so the sheet never lifts on a
 *           page that has not rendered yet.
 *
 * The failsafe matters more than any of it. If the navigation stalls or fails, an
 * overlay waiting on a pathname that never changes leaves the visitor staring at a
 * blank sheet with no way out. So the reveal also fires on a timeout regardless.
 */

const COVER_MS = 380;
const REVEAL_MS = 460;
const HOLD_MS = 140;
// Long enough that a slow 3G route commit still lands inside it, short enough that a
// genuinely failed navigation does not read as a broken site.
const FAILSAFE_MS = 3200;
// Every step is ALSO driven by a timer, not only by onAnimationComplete.
//
// A decorative animation must never be able to break navigation, and hanging the
// router.push off the completion callback alone does exactly that: a tab backgrounded
// mid-sweep, or any environment where the frame loop stalls, leaves the callback unfired
// and the link simply dead. Both paths run, whichever lands first wins, and the commit is
// idempotent.
const SETTLE_MS = 120;

/**
 * Positions as a percentage of the sheet's own width, which is 200vw.
 *
 * The sheet has to be that wide because its guaranteed-solid core is only the band
 * between the deepest bay on each torn edge -- about 63% of the element. At 100vw the
 * torn left edge would still be inside the viewport when the sheet was nominally
 * "covering", leaving a ragged strip of the old page showing down the left.
 *
 *   -100%  clear of the left edge of the screen
 *    -22%  solid core spans -13vw to 113vw: covered, with both tears off-screen
 *     50%  clear of the right edge
 */
const OFF_LEFT = "-100%";
const COVERED = "-22%";
const OFF_RIGHT = "50%";

type Phase = "idle" | "cover" | "reveal";

const TearContext = createContext<((href: string) => void) | null>(null);

/** Navigate with the tear. Returns a no-op outside the provider. */
export function usePaperTear() {
  return useContext(TearContext);
}

export function PaperTearProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  const [phase, setPhase] = useState<Phase>("idle");
  const target = useRef<string | null>(null);
  const coveredAt = useRef(0);
  const committed = useRef(false);
  const failsafe = useRef<ReturnType<typeof setTimeout> | null>(null);

  const tearTo = useCallback(
    (href: string) => {
      // Already there: the pathname would never change, so the sheet would sit on the
      // failsafe for three seconds over a page that never moved.
      if (href === pathname) return;
      if (reduced) {
        router.push(href);
        return;
      }
      setPhase((current) => {
        if (current !== "idle") return current;
        target.current = href;
        committed.current = false;
        return "cover";
      });
    },
    [pathname, reduced, router]
  );

  // Release the sheet once the route it was hiding has actually rendered.
  useEffect(() => {
    if (phase !== "cover" || !target.current) return;
    if (pathname !== target.current) return;

    const wait = Math.max(0, HOLD_MS - (Date.now() - coveredAt.current));
    const t = setTimeout(() => setPhase("reveal"), wait);
    return () => clearTimeout(t);
  }, [pathname, phase]);

  useEffect(() => {
    return () => {
      if (failsafe.current) clearTimeout(failsafe.current);
    };
  }, []);

  const commit = useCallback(() => {
    if (committed.current || !target.current) return;
    committed.current = true;
    coveredAt.current = Date.now();
    router.push(target.current);
    failsafe.current = setTimeout(() => setPhase("reveal"), FAILSAFE_MS);
  }, [router]);

  // Timer backstop for the commit. See SETTLE_MS.
  useEffect(() => {
    if (phase !== "cover") return;
    const t = setTimeout(commit, COVER_MS + SETTLE_MS);
    return () => clearTimeout(t);
  }, [phase, commit]);

  // Timer backstop for returning to idle. Without it a reveal whose callback never
  // fires leaves the sheet parked off-screen and every later click inert.
  useEffect(() => {
    if (phase !== "reveal") return;
    const t = setTimeout(() => {
      if (failsafe.current) clearTimeout(failsafe.current);
      target.current = null;
      setPhase("idle");
    }, REVEAL_MS + SETTLE_MS);
    return () => clearTimeout(t);
  }, [phase]);

  const x = phase === "cover" ? COVERED : phase === "reveal" ? OFF_RIGHT : OFF_LEFT;

  return (
    <TearContext.Provider value={tearTo}>
      {children}
      <motion.div
        aria-hidden="true"
        // pointer-events stays off in every phase. The sheet is decoration over a
        // navigation that is already committed; letting it swallow a click would only
        // ever cost the visitor one.
        className="pointer-events-none fixed inset-y-0 left-0 z-[100] w-[200vw]"
        initial={false}
        animate={{ x }}
        transition={
          phase === "cover"
            ? // A cut is decisive: quick attack, no float on arrival.
              { duration: COVER_MS / 1000, ease: [0.5, 0, 0.2, 1] }
            : phase === "reveal"
              ? // Leaving is longer and softer, on the house curve, so the page it
                // uncovers gets a moment to settle rather than being snapped at.
                { duration: REVEAL_MS / 1000, ease: [0.16, 1, 0.22, 1] }
              : { duration: 0 }
        }
        onAnimationComplete={() => {
          if (phase === "cover") commit();
          if (phase === "reveal") {
            if (failsafe.current) clearTimeout(failsafe.current);
            target.current = null;
            setPhase("idle");
          }
        }}
      >
        {/*
          Two sheets, not one, and this is what makes the cut legible.

          A white sheet sweeping over a page whose hero is a near-white sky is almost
          the same value as the thing it is covering, so the transition reads as a
          vague brightening rather than as anything being cut. The navy sheet runs a
          few pixels ahead of the paper one, so its torn edge arrives first as a dark
          leading line -- which is also, literally, what a layered papercut is.

          The offset is a static transform on the child. The parent carries the whole
          sweep, so this costs nothing per frame.
        */}
        <span
          aria-hidden="true"
          className="paper-tear absolute inset-0 translate-x-[42px] bg-uniba-navy"
        />
        <span aria-hidden="true" className="paper-tear paper-tear--sheet absolute inset-0">
          <span className="bg-grain absolute inset-0 opacity-[0.07]" />
        </span>
      </motion.div>
    </TearContext.Provider>
  );
}

export default PaperTearProvider;
