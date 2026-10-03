import { ArrowUpRight } from "lucide-react";

// Blok 4 (PRD): kartu berisi nama jalur, ringkasan, dan tautan. Tanpa angka biaya.

type AdmissionPathsProps = {
  title: string;
  intro?: string;
  cards: { name: string; summary: string; link: { label: string; href: string } }[];
};

export function AdmissionPaths({ title, intro, cards }: AdmissionPathsProps) {
  return (
    <section id="jalur-pendaftaran" className="scroll-mt-16 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-tight text-uniba-navy sm:text-4xl">{title}</h2>
          {intro && <p className="mt-4 text-lg text-slate-600">{intro}</p>}
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card) => (
            <li
              key={card.name}
              data-fade-up
              className="flex flex-col rounded-2xl border border-uniba-navy/10 bg-white p-6 shadow-card transition-colors hover:border-uniba-navy/25 sm:p-8"
            >
              <h3 className="text-xl font-semibold text-uniba-navy">{card.name}</h3>
              <p className="mt-3 flex-1 text-slate-600">{card.summary}</p>
              <a
                href={card.link.href}
                className="mt-8 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-uniba-sky-deep transition-colors hover:text-uniba-navy"
              >
                {card.link.label}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
