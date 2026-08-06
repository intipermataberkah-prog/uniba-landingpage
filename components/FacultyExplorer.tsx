"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, CircleCheck } from "lucide-react";
import { Container } from "@/components/Container";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/ui/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { iconMap } from "@/lib/icon-map";
import { cn } from "@/lib/utils";
import {
  faculties,
  getFacultyPrograms,
  studyPrograms,
  type StudyProgram,
} from "@/data/unibaData";

function ProgramCard({
  program,
  accentClass,
  index,
}: {
  program: StudyProgram;
  accentClass: string;
  index: number;
}) {
  const [revealed, setRevealed] = useState(false);
  const panelId = `prospek-${program.id}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: "easeOut" }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-uniba-navy/10 bg-white p-6 shadow-elev-1 transition-all duration-300 hover:-translate-y-1.5 hover:border-uniba-navy/15 hover:shadow-elev-3"
    >
      <div
        aria-hidden="true"
        className={cn("absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r", accentClass)}
      />

      <h3 className="text-lg font-bold text-slate-dark">{program.name}</h3>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Badge variant="secondary" className="w-fit">
          {program.accreditation}
        </Badge>
        {!program.feeGroupId ? (
          <Badge variant="outline" className="w-fit border-uniba-navy/20 text-uniba-navy/70">
            Info biaya: hubungi admisi
          </Badge>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setRevealed((prev) => !prev)}
        aria-expanded={revealed}
        aria-controls={panelId}
        className="mt-5 flex w-full items-center justify-between rounded-lg border border-slate-900/10 bg-alabaster px-3.5 py-2.5 text-left text-sm font-semibold text-uniba-navy transition-colors hover:bg-uniba-navy/5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-uniba-blue-bright"
      >
        <span>Prospek Kerja</span>
        <ChevronDown
          aria-hidden="true"
          className={cn(
            "size-4 shrink-0 transition-transform duration-300",
            revealed && "rotate-180"
          )}
        />
      </button>

      <div
        id={panelId}
        className={cn(
          "grid transition-all duration-300 ease-out",
          revealed
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0 group-hover:grid-rows-[1fr] group-hover:opacity-100 group-focus-within:grid-rows-[1fr] group-focus-within:opacity-100"
        )}
      >
        <div className="overflow-hidden">
          <ul className="mt-4 flex flex-wrap gap-2 pt-0.5">
            {program.careerProspects.map((career) => (
              <li
                key={career}
                className="inline-flex items-center gap-1.5 rounded-full bg-uniba-navy/5 px-3 py-1 text-xs font-medium text-uniba-navy ring-1 ring-uniba-navy/10"
              >
                <CircleCheck aria-hidden="true" className="size-3.5 text-uniba-blue-bright" />
                {career}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

export default function FacultyExplorer() {
  return (
    <section id="program-studi" className="bg-alabaster py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Program Studi"
          title={`${faculties.length} Fakultas, ${studyPrograms.length} Program Studi Unggulan`}
          description="Semua program studi terakreditasi BAN-PT, dirancang untuk membekali kamu dengan kompetensi yang relevan dengan dunia kerja."
        />

        <Tabs defaultValue={faculties[0].id} className="mt-12 items-center sm:mt-16">
          <TabsList className="h-auto w-full flex-wrap justify-center gap-2 rounded-2xl bg-white p-2 shadow-elev-1 ring-1 ring-uniba-navy/10 sm:w-fit sm:flex-nowrap">
            {faculties.map((faculty) => {
              const Icon = iconMap[faculty.iconName];
              return (
                <TabsTrigger
                  key={faculty.id}
                  value={faculty.id}
                  className="h-auto flex-none gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-dark/70 data-active:bg-uniba-navy data-active:text-white data-active:shadow-md sm:text-base"
                >
                  {Icon ? <Icon aria-hidden="true" className="size-4 shrink-0" /> : null}
                  <span>{faculty.shortName}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {faculties.map((faculty) => (
            <TabsContent key={faculty.id} value={faculty.id} className="mt-10 w-full sm:mt-12">
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5 }}
                className="mx-auto max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
              >
                {faculty.description}
              </motion.p>

              <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {getFacultyPrograms(faculty.id).map((program, index) => (
                  <ProgramCard
                    key={program.id}
                    program={program}
                    accentClass={faculty.accentClass}
                    index={index}
                  />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </Container>
    </section>
  );
}
