export default function InfoCard({ icon, title, description }: { icon?: string; title: string; description: string }) {
  return (
    <div className="rounded-2xl border border-charcoal/10 bg-white p-6 shadow-[0_4px_20px_rgba(27,27,27,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(27,27,27,0.08)]">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-limeCTA text-2xl text-charcoal">{icon ?? "🔹"}</div>
      <h4 className="text-lg font-semibold text-charcoal">{title}</h4>
      <p className="mt-2 text-sm text-bodyText/80">{description}</p>
    </div>
  );
}
