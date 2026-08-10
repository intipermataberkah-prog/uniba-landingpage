"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";

import { promoPeriod } from "@/data/unibaData";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

// End-of-day WIB (UTC+7) on the official promo end date — a fixed instant, so it's
// identical on the server and client render (no hydration mismatch).
const PROMO_DEADLINE = new Date(`${promoPeriod.endDate}T23:59:59+07:00`).getTime();

function getTimeLeft(deadline: number): TimeLeft {
  const diff = Math.max(deadline - Date.now(), 0);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

export default function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  useEffect(() => {
    const tick = () => setTimeLeft(getTimeLeft(PROMO_DEADLINE));

    tick();
    const intervalId = setInterval(tick, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const units: { label: string; value: string }[] = [
    { label: "Hari", value: timeLeft ? pad(timeLeft.days) : "--" },
    { label: "Jam", value: timeLeft ? pad(timeLeft.hours) : "--" },
    { label: "Menit", value: timeLeft ? pad(timeLeft.minutes) : "--" },
    { label: "Detik", value: timeLeft ? pad(timeLeft.seconds) : "--" },
  ];

  return (
    <AnimatePresence>
      {!dismissed ? (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="relative overflow-hidden bg-uniba-navy"
        >
          <div
            aria-hidden="true"
            className="bg-batik-parang pointer-events-none absolute inset-0 opacity-70"
          />
          <div className="relative flex flex-col items-center gap-2 px-4 py-2 pr-9 sm:flex-row sm:justify-center sm:gap-4 sm:pr-10">
            <p className="flex items-center gap-2 text-center text-sm font-medium text-alabaster sm:text-left">
              <PartyPopper className="hidden size-4 shrink-0 text-uniba-gold sm:inline" aria-hidden="true" />
              <span>
                Pendaftaran PMB Gelombang Utama Dibuka!{" "}
                <span className="text-gradient-gold font-semibold">
                  Gratis Uang Gedung, Cukup Bayar 60% di Semester 1
                </span>
              </span>
            </p>

            <div className="flex items-center gap-1.5" role="timer" aria-live="off">
              {units.map((unit) => (
                <div key={unit.label} className="flex flex-col items-center">
                  <span className="w-8 rounded-md bg-white/10 py-1 text-center font-mono text-xs font-semibold tabular-nums text-white ring-1 ring-white/10">
                    {unit.value}
                  </span>
                  <span className="mt-0.5 text-[10px] uppercase tracking-wide text-white/60">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            aria-label="Tutup pengumuman"
            onClick={() => setDismissed(true)}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full p-1 text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          >
            <X className="size-4" />
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
