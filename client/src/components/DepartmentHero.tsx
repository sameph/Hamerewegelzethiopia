export default function DepartmentHero({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <section className="w-full bg-main-gradient py-20 text-center text-white">
      <div className="mx-auto max-w-3xl px-4">
        <p className="mb-2 text-sm uppercase tracking-widest text-brightYellow">Department</p>
        <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-4 text-lg text-mint/90 sm:text-xl">{subtitle}</p>
      </div>
    </section>
  );
}
