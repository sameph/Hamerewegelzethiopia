import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type FinalCtaSectionProps = {
  locale: Locale;
};

const ctaText = {
  en: {
    title: "Ready to elevate your mission?",
    subtitle: "A clear starting point for communities, teams, and leaders ready for focused growth.",
    primary: "Join Us",
    secondary: "Read More",
  },
  am: {
    title: "ተልዕኮዎን ወደ ቀጣይ ደረጃ ለማድረስ ዝግጁ ነዎት?",
    subtitle: "ለቡድኖች፣ ለመሪዎች እና ለማህበረሰቦች ግልፅ የመጀመሪያ እርምጃ።",
    primary: "ይቀላቀሉ",
    secondary: "ተጨማሪ ያንብቡ",
  },
} as const;

export default function FinalCtaSection({ locale }: FinalCtaSectionProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = ctaText[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="relative isolate px-4 py-20 sm:px-6 sm:py-24 lg:px-12 lg:py-28">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_35%_20%,rgba(255,255,255,0.24),transparent_38%),linear-gradient(180deg,rgba(12,26,15,0.92),rgba(8,20,12,0.96))]" />
      <div className="mx-auto max-w-5xl text-center">
        <h2 className={`text-3xl text-[#f7f7f7] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-tight"}`}>
          {copy.title}
        </h2>
        <p className={`mx-auto mt-4 max-w-2xl text-sm leading-7 text-white ${isAmharic ? "font-ethiopic" : "font-sans"}`}>{copy.subtitle}</p>
      </div>
    </section>
  );
}
