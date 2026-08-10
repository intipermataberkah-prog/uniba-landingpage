"use client";

import { useCallback, useEffect, useRef, useSyncExternalStore } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "uniba-bgm";
const VOLUME = 0.22;

/** Events after which the element's ready/paused/muted state may have changed. */
const MEDIA_EVENTS = [
  "play",
  "pause",
  "volumechange",
  "canplay",
  "loadeddata",
  "emptied",
] as const;

/**
 * Compact snapshot of the element, as a primitive so Object.is comparison is
 * stable between reads and useSyncExternalStore does not loop.
 */
function readSnapshot(audio: HTMLAudioElement | null): string {
  if (!audio) return "0|0|1";
  const ready = audio.readyState >= 2 ? 1 : 0;
  const playing = audio.paused ? 0 : 1;
  const muted = audio.muted ? 1 : 0;
  return `${ready}|${playing}|${muted}`;
}

/**
 * Looping background audio that starts as early as the browser allows.
 *
 * Unmuted autoplay cannot be forced. Chrome, Safari and Firefox all reject
 * play() with sound until the document has "user activation", and Chrome will
 * actively pause a muted element if you unmute it without activation. So this
 * uses the strongest legal approach, in two stages:
 *
 *   1. Try unmuted play() immediately. This SUCCEEDS for returning visitors —
 *      Chrome's Media Engagement Index grants the origin autoplay once someone
 *      has played media here a few times, and Safari does the same per-site.
 *      Those users get true sound-on-open with no interaction.
 *
 *   2. If it is rejected, fall back to MUTED autoplay, which is always allowed.
 *      The track is then already decoding and looping silently, so the first
 *      time the visitor clicks/taps/keys anything we only have to flip
 *      `muted = false` — sound is instant, with no play() latency or restart.
 *
 * Only genuine user-activation events are listened for. scroll and mousemove do
 * NOT grant activation per the HTML spec, so unmuting from them would just get
 * the element paused by Chrome.
 *
 * An explicit mute is remembered in localStorage and suppresses all of it. The
 * toggle is mandatory, not a nicety: WCAG 2.2 SC 1.4.2 requires a stop mechanism
 * for any audio that plays longer than three seconds.
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * The element is an external system, so read it rather than mirror it in state.
   * This matters concretely: an `autoPlay` element fires `play` (and often
   * `canplay`) BEFORE React attaches its JSX handlers, so onPlay/onCanPlay props
   * silently miss the first events and the control renders the wrong icon.
   * Subscribing reads the live element instead of trying to catch every event.
   */
  const subscribe = useCallback((onStoreChange: () => void) => {
    const audio = audioRef.current;
    if (!audio) return () => {};
    MEDIA_EVENTS.forEach((e) => audio.addEventListener(e, onStoreChange));
    return () => {
      MEDIA_EVENTS.forEach((e) => audio.removeEventListener(e, onStoreChange));
    };
  }, []);

  const snapshot = useSyncExternalStore(
    subscribe,
    () => readSnapshot(audioRef.current),
    () => "0|0|1"
  );

  const [readyFlag, playingFlag, mutedFlag] = snapshot.split("|");
  const ready = readyFlag === "1";
  const playing = playingFlag === "1";
  const muted = mutedFlag === "1";

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // The markup carries `autoPlay muted`, so the element starts itself before
    // this runs. If the visitor previously opted out, actually stop it rather
    // than leaving it decoding silently forever.
    if (localStorage.getItem(STORAGE_KEY) === "off") {
      audio.pause();
      return;
    }

    let cancelled = false;

    // Real user-activation events only — scroll/mousemove do not count.
    const ACTIVATION = ["pointerdown", "click", "keydown", "touchend"] as const;

    const unmute = () => {
      const el = audioRef.current;
      if (!el || localStorage.getItem(STORAGE_KEY) === "off") return;
      el.muted = false;
      el.volume = VOLUME;
      void el.play().catch(() => {});
      detach();
    };

    const detach = () => {
      ACTIVATION.forEach((e) => window.removeEventListener(e, unmute));
    };

    const attach = () => {
      ACTIVATION.forEach((e) =>
        window.addEventListener(e, unmute, { passive: true })
      );
    };

    audio.volume = VOLUME;

    // Stage 1 — try for real autoplay with sound.
    audio.muted = false;
    audio
      .play()
      .then(() => {
        // Allowed outright. Nothing else to do.
      })
      .catch(() => {
        if (cancelled) return;
        // Stage 2 — muted autoplay is always permitted; unmute on first gesture.
        audio.muted = true;
        void audio.play().catch(() => {});
        attach();
      });

    return () => {
      cancelled = true;
      detach();
    };
  }, []);

  const audible = playing && !muted;

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audible) {
      audio.pause();
      localStorage.setItem(STORAGE_KEY, "off");
    } else {
      localStorage.setItem(STORAGE_KEY, "on");
      audio.muted = false;
      audio.volume = VOLUME;
      void audio.play().catch(() => {});
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/backsound.mp3"
        loop
        autoPlay
        // Starts muted in markup so the browser never blocks the initial load;
        // the effect above immediately tries to promote it to unmuted.
        muted
        playsInline
        preload="auto"
        // No onPlay/onCanPlay/onVolumeChange here on purpose — subscribe() above
        // owns those events, and JSX handlers would miss the ones that fire
        // before React attaches them.
      />

      {ready ? (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={audible}
          aria-label={audible ? "Matikan musik latar" : "Putar musik latar"}
          title={audible ? "Matikan musik latar" : "Putar musik latar"}
          className="fixed bottom-20 left-4 z-50 flex size-12 cursor-pointer items-center justify-center rounded-full bg-uniba-navy text-uniba-gold shadow-lg shadow-black/25 ring-1 ring-white/15 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none lg:bottom-6 lg:left-6"
        >
          {audible ? (
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 animate-ping rounded-full bg-uniba-navy/40"
            />
          ) : null}
          {audible ? (
            <Volume2 className="size-5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </>
  );
}
