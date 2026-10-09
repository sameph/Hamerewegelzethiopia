import type { Locale } from "@/context/LanguageContext";

type PartnersLogosProps = {
  locale: Locale;
};

const partners = [
  { name: "Addis Fellowship", mark: "AF" },
  { name: "Hope Community", mark: "HC" },
  { name: "Selam Outreach", mark: "SO" },
  { name: "Mercy Initiative", mark: "MI" },
  { name: "Faith Works", mark: "FW" },
  { name: "Shalom Network", mark: "SN" },
];

export default function PartnersLogos({ locale }: PartnersLogosProps) {
  const isAmharic = locale === "am";
  const loopItems = [...partners, ...partners];

  return (
    <section className="bg-[#09110b] px-4 pb-10 pt-3 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.05] p-2 sm:p-3">
          <div className="partners-track flex w-max items-center gap-2 sm:gap-3">
            {loopItems.map((partner, index) => (
              <article key={`${partner.name}-${index}`} className="min-w-[150px] rounded-xl border border-white/10 bg-[#f3f7de] px-4 py-3 text-center shadow-[0_10px_16px_rgba(0,0,0,0.2)]">
                <div className="mx-auto mb-2 flex h-10 w-10 rotate-slow items-center justify-center rounded-full border border-[#121a11]/20 bg-[#d6ff00]/30 text-xs font-bold text-[#121a11]">
                  {partner.mark}
                </div>
                <p className={`text-xs text-[#121a11]/75 ${isAmharic ? "font-ethiopic" : "font-sans"}`}>{partner.name}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}