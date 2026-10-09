import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type ServicesSectionProps = {
  locale: Locale;
};

const labels = {
  en: {
    eyebrow: "Services and Programs",
    title: "Our main services are designed to build people, strengthen faith, and serve communities.",
    subtitle: "At the heart of everything we do is a commitment to vital renewal. Our services and programs are strategically structured to drive systemic reformation.",
    cta: "Explore Departments",
    services: [
      {
        title: "Teaching Programs",
        text: "Structured faith formation, biblical teaching, and accessible learning experiences for every stage of growth.",
      },
      {
        title: "Evangelism",
        text: "Mission-focused outreach that connects the Gospel with real people, real questions, and real communities.",
      },
      {
        title: "Development and Relief",
        text: "Compassionate support initiatives that address practical needs and strengthen dignity at the local level.",
      },
      {
        title: "Training",
        text: "Leadership, ministry, and service training built to multiply capable servants and resilient teams.",
      },
    ],
  },
  am: {
    eyebrow: "አገልግሎቶች እና ፕሮግራሞች",
    title: "ለለውጥ፣ ለእድገት እና ለጠንካራ የአገልግሎት ማህበረሰብ የተነደፉ ፕሮግራሞች።",
    subtitle: "At the heart of everything we do is a commitment to vital renewal. Our services and programs are strategically structured to drive systemic reformation.",
    cta: "ክፍሎችን ያስሱ",
    services: [
      {
        title: "የትምህርት ፕሮግራሞች",
        text: "በእምነት ሥልጠና፣ በመጽሐፍ ቅዱስ ትምህርት እና በተደራሽ የመማር ልምድ የተደገፉ ፕሮግራሞች።",
      },
      {
        title: "ወንጌል ስርጭት",
        text: "ወንጌልን ከሰዎች ሕይወት፣ ከጥያቄዎቻቸው እና ከማህበረሰባቸው ጋር በቀጥታ የሚያገናኝ የተልዕኮ ሥራ።",
      },
      {
        title: "የርህራሄ ሥራ",
        text: "ተግባራዊ ፍላጎቶችን የሚመልሱ እና በአካባቢ ደረጃ ክብርን የሚጠናክሩ የድጋፍ ተግባራት።",
      },
      {
        title: "ሥልጠና",
        text: "ብቁ አገልጋዮችን እና ጠንካራ ቡድኖችን ለማብዛት የተሰሩ የአመራር እና የአገልግሎት ሥልጠናዎች።",
      },
    ],
  },
} as const;

export default function ServicesSection({ locale }: ServicesSectionProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = labels[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="bg-[#f0f4e2] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className={`text-black text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.2em]"}`}>
              {copy.eyebrow}
            </p>
            <h2 className={`mt-4 text-3xl text-[#121a11] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.4]" : "font-serif font-semibold leading-tight"}`}>
              {copy.title}
            </h2>
            <p className={`mt-4 text-sm leading-7 text-[#121a11] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
              {copy.subtitle}
            </p>
          </div>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {copy.services.map((service, index) => (
            <article key={service.title} className="group rounded-2xl border border-[#121a11]/10 bg-[#e8efc8] p-5 shadow-[0_10px_22px_rgba(23,35,18,0.08)] transition-all duration-300 hover:-translate-y-0.5">
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[#121a11]/12 bg-[#d6ff00]/26 font-serif text-sm text-[#121a11]">
                {index + 1}
              </div>
              <h3 className={`text-xl font-bold text-[#121a11] ${isAmharic ? "font-ethiopic leading-[1.45]" : "font-serif font-semibold"}`}>
                {service.title}
              </h3>
              <p className={`mt-3 text-sm leading-7 font-bold text-[#121a11] ${isAmharic ? "font-ethiopic text-base" : "font-sans"}`}>
                {service.text}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}