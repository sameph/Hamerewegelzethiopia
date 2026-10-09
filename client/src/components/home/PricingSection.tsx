import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type PricingSectionProps = {
  locale: Locale;
};

const pricingCopy = {
  en: {
    eyebrow: "How we work",
    title: "Adaptable plans for every college service",
    subtitle: "Adaptable plans that allow each ministry to modify support by selecting a donation plan. Select a strategy that best suits your goals.",
    cta: "Donate Plan",
    plans: [
      {
        name: "Student Scholarship",
        price: "",
        period: "",
        headline: "Fund a full semester for a theology student.",
        points: ["Tuition contribution", "Student mentoring support", "Academic continuity"],
      },
      {
        name: "Manuscript Digitisation",
        price: "",
        period: "",
        headline: "Preserve one Ge'ez manuscript for eternity.",
        points: ["Digital preservation workflow", "Archive metadata and cataloguing", "Long-term ministry access"],
      },
      {
        name: "Community Relief",
        price: "",
        period: "",
        headline: "Support food and medical aid for 10 families.",
        points: ["Food and essentials assistance", "Health support allocation", "Monthly relief coordination"],
      },
    ],
  },
  am: {
    eyebrow: "የስራ ሂደታችን",
    title: "ለእያንዳንዱ የኮሌጅ አገልግሎት ተስማሚ እቅዶች",
    subtitle: "እያንዳንዱ አገልግሎት በመዋጮ እቅድ ምርጫ ድጋፉን እንዲያስተካክል የሚያስችሉ ተለዋዋጭ እቅዶች። ለግቦትዎ ተስማሚ ስትራቴጂ ይምረጡ።",
    cta: "የመዋጮ እቅድ",
    plans: [
      {
        name: "የተማሪ ስኮላርሺፕ",
        price: "$120",
        period: "/ ሴሚስተር",
        headline: "ለሥነ-መለኮት ተማሪ አንድ ሙሉ ሴሚስተር ይሸፍኑ።",
        points: ["የትምህርት ክፍያ ድጋፍ", "የተማሪ እንክብካቤ", "የትምህርት ቀጣይነት"],
      },
      {
        name: "የጽሑፍ ዲጂታሊዜሽን",
        price: "$75",
        period: "/ ጽሑፍ",
        headline: "አንድ የግዕዝ ጽሑፍ ለዘላለም ጠብቁ።",
        points: ["የዲጂታል ጥበቃ ሂደት", "የማህደር መረጃ አያያዝ", "የረጅም ጊዜ ተደራሽነት"],
      },
      {
        name: "ማህ/ሰብ እርዳታ",
        price: "$200",
        period: "/ ወር",
        headline: "ለ10 ቤተሰቦች ምግብ እና ሕ/ዘ ድጋፍ ያቅርቡ።",
        points: ["የምግብ እና መሠረታዊ ድጋፍ", "የጤና እርዳታ ድርሻ", "ወርሃዊ እርዳታ ማስተባበር"],
      },
    ],
  },
} as const;

export default function PricingSection({ locale }: PricingSectionProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = pricingCopy[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="bg-[#09110b] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <p className={`text-[#d6ff00] text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.22em]"}`}>{copy.eyebrow}</p>
        <h2 className={`mt-4 text-3xl text-[#d6ff00] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-tight"}`}>
          {copy.title}
        </h2>
        <p className={`mt-4 max-w-2xl text-sm leading-7 text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>{copy.subtitle}</p>
                                                                
        <div className="mt-9 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {copy.plans.map((plan) => (
            <article key={plan.name} className="rounded-2xl border border-[#d7e6b5] bg-[#bccf8a] p-6 shadow-[0_18px_28px_rgba(0,0,0,0.22)]">
              <p className={`text-[#000000] text-[10px] ${isAmharic ? "font-ethiopic" : " font-bold font-sans uppercase tracking-[0.18em]"}`}>{plan.name}</p>
              <h3 className={`mt-3 text-2xl font-bold text-[#000000] ${isAmharic ? "font-ethiopic leading-[1.35]" : "font-serif font-bold leading-snug"}`}>{plan.headline}</h3>
              <ul className="mt-5 space-y-2">
                {plan.points.map((point) => (
                  <li key={point} className={`text-sm font-bold text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
                    • {point}                   
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
