"use client";

import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const STORAGE_KEY = "uniba-bgm";
const VOLUME = 0.22;

/**
 * Subtle background music with a floating on/off control (bottom-left, clear of
 * the WhatsApp FAB and social dock on the right). Browsers block autoplay with
 * sound until a user gesture, so playback starts on the visitor's first
 * interaction — unless they previously muted it (remembered in localStorage).
 * The control only renders once the audio file is actually loadable.
 */
export default function BackgroundMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  // The audio may already be loadable by the time React mounts (fast local
  // load fires `canplay` before the handler attaches), so check readyState too.
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audio.readyState >= 2) setReady(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem(STORAGE_KEY) === "off") return;

    const start = () => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.volume = VOLUME;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      cleanup();
    };
    const cleanup = () => {
      window.removeEventListener("pointerdown", start);
      window.removeEventListener("keydown", start);
      window.removeEventListener("touchstart", start);
    };

    window.addEventListener("pointerdown", start, { once: true });
    window.addEventListener("keydown", start, { once: true });
    window.addEventListener("touchstart", start, { once: true });
    return cleanup;
  }, []);

  function toggle() {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "off");
    } else {
      audio.volume = VOLUME;
      audio.play().then(() => setPlaying(true)).catch(() => {});
      localStorage.setItem(STORAGE_KEY, "on");
    }
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/backsound.mp3"
        loop
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
          className="fixed bottom-20 left-4 z-50 flex size-12 items-center justify-center rounded-full bg-uniba-navy text-uniba-gold shadow-lg shadow-black/25 ring-1 ring-white/15 transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-uniba-gold focus-visible:ring-offset-2 focus-visible:outline-none lg:bottom-6 lg:left-6"
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
