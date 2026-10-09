export default function ListSection({
  title,
  description,
  items,
}: {
  title: string;
  description?: string;
  items: { title: string; detail?: string }[];
}) {
  return (
    <section className="rounded-3xl border border-limePrimary/15 bg-gradient-to-b from-[#F7F7F7] to-[#F7F7F7] p-8 shadow-[0_18px_40px_rgba(27,27,27,.08)]">
      <h3 className="text-2xl font-semibold text-[#1B1B1B]">{title}</h3>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-[#333333]/80">{description}</p>
      ) : null}
      <ul className="mt-6 space-y-4">
        {items.map((item, index) => (
          <li key={index} className="rounded-2xl border border-limePrimary/10 bg-white/55 p-4 backdrop-blur-sm">
            <p className="font-semibold text-[#1B1B1B]">{item.title}</p>
            {item.detail ? (
              <p className="mt-2 text-sm leading-relaxed text-[#333333]/72">{item.detail}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
