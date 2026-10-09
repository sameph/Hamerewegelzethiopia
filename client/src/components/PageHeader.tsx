export default function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <section className="rounded-3xl border border-[#1B1B1B]/10 bg-white/95 p-8 shadow-[0_24px_60px_rgba(27,27,27,.08)]">
      {eyebrow ? (
        <p className="mb-3 text-sm uppercase tracking-[0.25em] text-amber-500">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl font-semibold text-[#1B1B1B] sm:text-4xl">{title}</h2>
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-700">{description}</p>
    </section>
  );
}
