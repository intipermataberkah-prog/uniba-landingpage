// Blok 3 (PRD): 2–6 angka dengan label.

type StatsProps = {
  items: { value: string; label: string }[];
};

export function Stats({ items }: StatsProps) {
  return (
    <section aria-label="UNIBA dalam angka" className="bg-white">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-10 px-4 pt-4 pb-16 sm:px-6 lg:grid-cols-4 lg:px-8">
        {items.map((item) => (
          <div key={item.label} data-fade-up className="flex flex-col-reverse border-t border-uniba-navy/15 pt-5">
            <dt className="mt-1 text-sm text-slate-600">{item.label}</dt>
            <dd className="text-4xl font-semibold tracking-tight text-uniba-navy tabular-nums sm:text-5xl">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
