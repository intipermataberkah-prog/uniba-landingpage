"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "uniba-bgm";
const VOLUME = 0.22;

/**
 * Looping background audio, on by default.
 *
 * "Always on" is the intent, but it cannot be literally guaranteed: every current
 * browser blocks unmuted autoplay until the page has received a user gesture, and
 * a blocked play() rejects rather than throwing. So this tries three things in
 * order, and the first one the browser permits wins:
 *
 *   1. play() immediately on mount — works on repeat visits where the origin has
 *      earned Chrome's Media Engagement Index, and whenever the user has
 *      previously interacted with the site.
 *   2. play() on the first pointer/key/touch/scroll event, if step 1 was blocked.
 *   3. play() when the tab regains visibility, covering the case where the page
 *      was opened in a background tab.
 *
 * The visitor's explicit choice always wins over all of it: once they hit the
 * toggle, "off" is remembered in localStorage and no auto-start is attempted again.
 * The control is not optional — WCAG 2.2 SC 1.4.2 requires a stop mechanism for
 * any audio that plays longer than three seconds.
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const startedRef = useRef(false);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  const optedOut = () =>
    typeof window !== "undefined" && localStorage.getItem(STORAGE_KEY) === "off";

  /**
   * Attempts playback. Resolves true if the browser allowed it.
   *
   * Deliberately does not setPlaying — the <audio> element's own onPlay/onPause
   * are the single source of truth for that flag. Keeping it that way also means
   * this never sets state from inside an effect.
   */
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || startedRef.current || optedOut()) return false;

    audio.volume = VOLUME;
    try {
      await audio.play();
      startedRef.current = true;
      return true;
    } catch {
      // Autoplay policy blocked it — a later gesture will retry.
      return false;
    }
  }, []);

  // The file can already be loadable before React attaches onCanPlay (fast cache
  // hit), which would otherwise leave the control permanently unrendered.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audio.readyState >= 2) setReady(true);
  }, []);

  useEffect(() => {
    if (optedOut()) return;

    void attemptPlay();

    const onGesture = () => {
      void attemptPlay().then((ok) => {
        if (ok) removeGestureListeners();
      });
    };
    const onVisible = () => {
      if (!document.hidden) void attemptPlay();
    };

    const events = ["pointerdown", "keydown", "touchstart", "scroll"] as const;
    const removeGestureListeners = () => {
      events.forEach((e) => window.removeEventListener(e, onGesture));
    };

    events.forEach((e) =>
      window.addEventListener(e, onGesture, { passive: true })
    );
    document.addEventListener("visibilitychange", onVisible);

    return () => {
      removeGestureListeners();
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [attemptPlay]);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    // onPlay / onPause drive `playing`; this only drives the audio element.
    if (playing) {
      audio.pause();
      startedRef.current = false;
      localStorage.setItem(STORAGE_KEY, "off");
    } else {
      localStorage.setItem(STORAGE_KEY, "on");
      audio.volume = VOLUME;
      audio
        .play()
        .then(() => {
          startedRef.current = true;
        })
        .catch(() => {});
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/backsound.mp3"
        loop
        autoPlay
        preload="auto"
        onCanPlay={() => setReady(true)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />

      {ready ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={playing}
          aria-label={playing ? "Matikan musik latar" : "Putar musik latar"}
          title={playing ? "Matikan musik latar" : "Putar musik latar"}
          className="fixed bottom-20 left-4 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full bg-uniba-navy text-uniba-gold shadow-lg shadow-black/25 ring-1 ring-white/15 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none lg:bottom-6 lg:left-6"
        >
          {playing ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-uniba-navy/40"
            />
          ) : null}
          {playing ? (
            <Volume2 className="size-5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </>
  );
}
