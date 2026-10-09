type Level = { title: string; description: string; icon?: string };

export default function HierarchyTree({ levels }: { levels: Level[] }) {
  return (
    <section className="relative mx-auto max-w-5xl py-12 px-4">
      <div className="absolute left-5 top-8 h-[calc(100%-3rem)] w-0.5 bg-amber-200/60 md:left-1/2" />
      <div className="space-y-8">
        {levels.map((level, idx) => (
          <div
            key={level.title}
            className="relative flex flex-col rounded-xl border border-amber-100/30 bg-white/80 p-6 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl md:flex-row md:items-start"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-200 text-xl font-bold text-[#1B1B1B]">
              {level.icon ?? `${idx + 1}`}
            </div>
            <div className="mt-4 md:mt-0 md:ml-5">
              <h3 className="text-xl font-semibold text-[#1B1B1B]">{level.title}</h3>
              <p className="mt-2 text-sm text-slate-600">{level.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
