"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatIDR } from "@/lib/utils";
import {
  calculateNextSemesterMonthly,
  calculateSemester1Detail,
  classTypeLabels,
  contactInfo,
  faculties,
  feeExclusions,
  getFacultyProgramsWithPricing,
  nextSemesterInstallmentOptions,
  paymentScheme,
  promoPeriod,
  studyPrograms,
  type ClassType,
  type NextSemesterInstallmentMonths,
} from "@/data/unibaData";

const CLASS_TYPE_KEYS = Object.keys(classTypeLabels) as ClassType[];

// The Simulasi Biaya widget only covers the official Promo Kemerdekaan (S1) fee table —
// programs without pricing (e.g. S2) are deliberately excluded rather than estimated.
const PRICED_STUDY_PROGRAMS = studyPrograms.filter((program) => program.feeGroupId !== undefined);

export default function TuitionCalculator() {
  const [facultyId, setFacultyId] = useState(faculties[0].id);
  const [programId, setProgramId] = useState(
    () => getFacultyProgramsWithPricing(faculties[0].id)[0]?.id ?? PRICED_STUDY_PROGRAMS[0].id
  );
  const [classType, setClassType] = useState<ClassType>("reguler");
  const [nextSemesterMonths, setNextSemesterMonths] = useState<NextSemesterInstallmentMonths>(6);

  const availablePrograms = useMemo(() => getFacultyProgramsWithPricing(facultyId), [facultyId]);

  const program = useMemo(
    () =>
      PRICED_STUDY_PROGRAMS.find((item) => item.id === programId) ??
      availablePrograms[0] ??
      PRICED_STUDY_PROGRAMS[0],
    [programId, availablePrograms]
  );

  const detail = useMemo(() => calculateSemester1Detail(program, classType), [program, classType]);
  const nextSemester = useMemo(
    () => calculateNextSemesterMonthly(program, classType, nextSemesterMonths),
    [program, classType, nextSemesterMonths]
  );

  // Lightweight animated counter: eases the displayed down-payment figure from its
  // previous value to the newly computed one whenever a selection changes.
  const [displayedDownPayment, setDisplayedDownPayment] = useState(detail.downPayment);
  const previousDownPayment = useRef(detail.downPayment);

  useEffect(() => {
    const from = previousDownPayment.current;
    const to = detail.downPayment;

    if (from === to) {
      setDisplayedDownPayment(to);
      return;
    }

    const durationMs = 500;
    const start = performance.now();
    let frameId: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayedDownPayment(Math.round(from + (to - from) * eased));

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        previousDownPayment.current = to;
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [detail.downPayment]);

  function handleFacultyChange(nextFacultyId: string) {
    setFacultyId(nextFacultyId);
    const firstProgram = getFacultyProgramsWithPricing(nextFacultyId)[0];
    setProgramId(firstProgram ? firstProgram.id : "");
  }

  const waMessage = [
    "Assalamu'alaikum, saya ingin bertanya skema pembayaran kuliah di UNIBA Surakarta:",
    `Program Studi: ${program.name}`,
    `Kelas: ${classTypeLabels[classType]}`,
    `Total Biaya Semester 1: ${formatIDR(detail.semesterTotal)}`,
    `Dibayar di Awal (60%): ${formatIDR(detail.downPayment)}`,
    `Sisa (40%, fleksibel hingga akhir semester 1): ${formatIDR(detail.remaining)}`,
    `Pendaftaran & SPI: GRATIS (Potongan ${formatIDR(detail.waivedTotal)})`,
    `Cicilan Semester 2 dst: ${formatIDR(nextSemester.monthly)} / bulan (${nextSemesterMonths} bulan)`,
    "",
    "Mohon informasi langkah selanjutnya. Terima kasih.",
  ].join("\n");

  const waLink = `https://wa.me/${contactInfo.whatsapp}?text=${encodeURIComponent(waMessage)}`;

  return (
    <section id="simulasi-biaya" className="relative bg-alabaster py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Simulasi Biaya"
          title="Hitung Skema Pembayaran Kuliahmu"
          description={`Rincian biaya resmi ${promoPeriod.name} ${promoPeriod.wave} — Pendaftaran & SPI gratis, cukup bayar 60% di semester pertama, sisanya fleksibel hingga akhir semester 1.`}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto mt-12 max-w-6xl overflow-hidden rounded-3xl bg-white shadow-elev-3 ring-1 ring-uniba-navy/5 lg:mt-16"
        >
          <div className="grid lg:grid-cols-2">
            {/* Controls */}
            <div className="flex flex-col gap-7 p-6 sm:p-10 lg:p-12">
              <div>
                <h3 className="font-heading text-xl font-bold text-slate-dark">
                  Atur Simulasimu
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Sesuaikan pilihan di bawah ini, hasil estimasi akan otomatis diperbarui.
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tc-faculty">Pilih Fakultas</Label>
                <Select value={facultyId} onValueChange={handleFacultyChange}>
                  <SelectTrigger id="tc-faculty" className="w-full">
                    <SelectValue placeholder="Pilih fakultas" />
                  </SelectTrigger>
                  <SelectContent>
                    {faculties.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="tc-program">Pilih Program Studi</Label>
                <Select value={program.id} onValueChange={setProgramId}>
                  <SelectTrigger id="tc-program" className="w-full">
                    <SelectValue placeholder="Pilih program studi" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePrograms.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <span className="text-sm leading-none font-medium">Tipe Kelas</span>
                <div
                  role="radiogroup"
                  aria-label="Tipe Kelas"
                  className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                >
                  {CLASS_TYPE_KEYS.map((key) => {
                    const active = classType === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => setClassType(key)}
                        className={cn(
                          "rounded-xl px-4 py-3 text-sm font-semibold transition-colors focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
                          active
                            ? "bg-uniba-navy text-white shadow-sm"
                            : "bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {classTypeLabels[key]}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-uniba-navy/5 p-4 text-sm text-muted-foreground ring-1 ring-uniba-navy/10">
                <p>{paymentScheme.remainingPolicy}</p>
                <p className="mt-2">{paymentScheme.nextSemesterPolicy}</p>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Label htmlFor="tc-next-semester-months" className="text-uniba-navy">
                    Cicilan Semester 2 dst.
                  </Label>
                  <Select
                    value={String(nextSemesterMonths)}
                    onValueChange={(value) =>
                      setNextSemesterMonths(Number(value) as NextSemesterInstallmentMonths)
                    }
                  >
                    <SelectTrigger id="tc-next-semester-months" size="sm" className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {nextSemesterInstallmentOptions.map((months) => (
                        <SelectItem key={months} value={String(months)}>
                          {months} Bulan
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <p className="mt-2">
                  <span className="font-semibold text-uniba-navy">
                    {formatIDR(nextSemester.monthly)} / bulan
                  </span>{" "}
                  <span>
                    (total {formatIDR(nextSemester.total)} / semester, dicicil {nextSemesterMonths}{" "}
                    bulan)
                  </span>
                </p>
              </div>
            </div>

            {/* Live output */}
            <div className="relative flex flex-col justify-between overflow-hidden bg-uniba-gradient p-6 text-white sm:p-10 lg:p-12">
              <div aria-hidden className="bg-batik-kawung pointer-events-none absolute inset-0" />

              <div className="relative z-10 flex flex-col gap-6">
                <div>
                  <p className="text-xs font-semibold tracking-wide text-white/60 uppercase">
                    {program.name}
                  </p>
                  <p className="mt-1 text-sm text-white/60">{classTypeLabels[classType]}</p>
                </div>

                <div aria-live="polite" aria-atomic="true">
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/60">
                    Dibayar di Awal (60%)
                  </p>
                  <p className="text-gradient-gold mt-1 font-heading text-4xl leading-tight font-extrabold tabular-nums drop-shadow-[0_2px_16px_rgba(245,158,11,0.35)] sm:text-5xl">
                    {formatIDR(displayedDownPayment)}
                  </p>
                </div>

                <div className="space-y-2 rounded-2xl bg-white/5 p-4 text-sm ring-1 ring-white/10 backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Pendaftaran</span>
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-white/40 line-through">
                        {formatIDR(detail.pendaftaran)}
                      </span>
                      <span className="rounded-full bg-uniba-gold px-2 py-0.5 text-xs font-bold text-uniba-navy">
                        GRATIS
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">SPI (Uang Gedung)</span>
                    <span className="flex items-center gap-2 font-semibold">
                      <span className="text-white/40 line-through">{formatIDR(detail.spi)}</span>
                      <span className="rounded-full bg-uniba-gold px-2 py-0.5 text-xs font-bold text-uniba-navy">
                        GRATIS
                      </span>
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">SPP Basis</span>
                    <span className="font-semibold">{formatIDR(detail.sppBasis)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">SPP SKS (21 SKS)</span>
                    <span className="font-semibold">{formatIDR(detail.sppSks)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Biaya Lain-lain (satu kali)</span>
                    <span className="font-semibold">{formatIDR(detail.biayaLainLain)}</span>
                  </div>
                  <div className="my-1 h-px bg-white/15" />
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/70 font-medium">Total Biaya Semester 1</span>
                    <span className="font-bold">{formatIDR(detail.semesterTotal)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">Apabila Bayar 60%</span>
                    <span className="font-semibold">{formatIDR(detail.downPayment)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-white/60">
                      Sisa (40%, fleksibel hingga akhir semester 1)
                    </span>
                    <span className="font-semibold">{formatIDR(detail.remaining)}</span>
                  </div>
                </div>

                <p className="text-xs text-white/50">
                  *Berlaku untuk pendaftaran {promoPeriod.wave}, periode{" "}
                  {new Date(promoPeriod.startDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                  })}{" "}
                  – {new Date(promoPeriod.endDate).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  . {feeExclusions}
                </p>
              </div>

              <div className="relative z-10 mt-8">
                <Button asChild size="lg" variant="secondary" className="w-full sm:w-auto">
                  <a href={waLink} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="size-4" />
                    Tanya Skema Pembayaran via WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
