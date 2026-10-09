"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/context/LanguageContext";

type ImportantMilestonesProps = {
  locale: Locale;
};

const content = {
  en: {
    eyebrow: "Important Milestones",
    title: "Measured progress across ministry, learning, and community impact.",
    milestones: [
      { value: "24+", label: "Active programs" },
      { value: "180", label: "Community partners" },
      { value: "3.2K", label: "Lessons learned this year" },
      { value: "12", label: "Service hubs" },
      { value: "Focus", label: "A focused entry point for teaching, evangelism, and compassionate outreach." },
    ],
  },
  am: {
    eyebrow: "አስፈላጊ ዋና ስኬቶች",
    title: "በአገልግሎት፣ በትምህርት እና በማህበረሰብ ተፅእኖ ውስጥ የሚለኩ እድገቶች።",
    milestones: [
      { value: "24+", label: "ንቁ ፕሮግራሞች" },
      { value: "180", label: "የማህበረሰብ አጋሮች" },
      { value: "3.2K", label: "የአመቱ ትምህርቶች" },
      { value: "12", label: "የአገልግሎት ማዕከላት" },
      { value: "ትኩረት", label: "ለትምህርት፣ ለወንጌል ስርጭት እና ለርህራሄ ሥራ ግልፅ የመግቢያ መንገድ።" },
    ],
  },
} as const;

function CountValue({ value, start }: { value: string; start: boolean }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const numericMatch = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
    if (!numericMatch) {
      setDisplay(value);
      return;
    }

    const target = Number(numericMatch[1]);
    const suffix = numericMatch[2] ?? "";
    if (!start || Number.isNaN(target)) {
      setDisplay(`0${suffix}`.trim());
      return;
    }

    let frame = 0;
    const duration = 1200;
    const startTs = performance.now();

    const tick = (ts: number) => {
      const progress = Math.min((ts - startTs) / duration, 1);
      const current = target * progress;
      const formatted = Number.isInteger(target) ? Math.round(current).toString() : current.toFixed(1);
      setDisplay(`${formatted}${suffix}`.trim());
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, start]);

  return <>{display}</>;
}

export default function ImportantMilestones({ locale }: ImportantMilestonesProps) {
  const copy = content[locale];
  const isAmharic = locale === "am";
  const ref = useRef<HTMLElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-[#d6ff00]/15 bg-[#09110b] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className={`text-[#d6ff00] text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.22em]"}`}>
            {copy.eyebrow}
          </p>
          <h2 className={`mt-4 text-3xl text-[#d6ff00] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-tight"}`}>
            {locale === "am" ? "ከአስር ዓመት በላይ የሆነ አገልግሎት" : "Over a decade helping communities grow"}
          </h2>
          <p className={`mt-5 max-w-3xl text-sm leading-7 text-[#ffffff] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
            {locale === "am"
              ? "በተልዕኮ ስራ፣ በትምህርት ፕሮግራሞች እና በማህበረሰብ ድጋፍ የታየ እድገት እንዲህ ነው።"
              : "From mission outreach to learning programs, these numbers reflect consistent, long-term community impact."}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {copy.milestones.slice(0, 4).map((item) => (
            <article key={`important-${item.label}`} className="rounded-2xl border border-white/14 bg-white/[0.04] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.2)]">
              <p className="number-counter text-4xl font-bold text-[#d6ff00]">
                <CountValue value={item.value} start={isInView} />
              </p>
              <p className={`mt-2 text-xs leading-6 text-[#f7f7f7] ${isAmharic ? "font-ethiopic text-sm" : "font-sans uppercase tracking-[0.16em]"}`}>{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}