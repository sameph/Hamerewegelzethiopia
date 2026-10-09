"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { Locale } from "@/context/LanguageContext";

type SocialProofProps = {
  locale: Locale;
};

const content = {
  en: {
    eyebrow: "Social Proof",
    title: "Built on trust, visible outcomes, and people who keep returning.",
    testimonials: [
      {
        quote: "The teaching programs feel grounded and practical. They help people grow in faith and in responsibility.",
        name: "Marta G.",
        role: "Community volunteer",
      },
      {
        quote: "Hamere Wengel creates a rare balance between spiritual depth and real support for families and learners.",
        name: "Samuel T.",
        role: "Program participant",
      },
      {
        quote: "The ministry feels organized, trustworthy, and committed to long-term transformation instead of short-term activity.",
        name: "Rahel B.",
        role: "Partner church leader",
      },
      {
        quote: "Their youth mentoring initiative gave our students practical direction and consistent spiritual support.",
        name: "Daniel K.",
        role: "Youth coordinator",
      },
      {
        quote: "The library and learning spaces are thoughtfully managed and genuinely helpful for long-term study.",
        name: "Hanna M.",
        role: "Theology student",
      },
    ],
  },
  am: {
    eyebrow: "ማህበራዊ ማረጋገጫ",
    title: "በእምነት፣ በታይቷል ተፅእኖ እና ደጋግመው በሚመለሱ ሰዎች የተገነባ።",
    testimonials: [
      {
        quote: "የትምህርት ፕሮግራሞቹ የተመሠረቱ እና ተግባራዊ ናቸው። ሰዎች በእምነትም በኃላፊነትም እንዲያድጉ ያግዛሉ።",
        name: "ማርታ ጂ.",
        role: "የማህበረሰብ በጎ ፈቃደኛ",
      },
      {
        quote: "ሐመረ ወንጌል መንፈሳዊ ጥልቀትን እና ለቤተሰቦችና ለተማሪዎች የሚሰጥ ተግባራዊ ድጋፍን በሚያምር ሁኔታ ያቀናጃል።",
        name: "ሳሙኤል ቲ.",
        role: "የፕሮግራም ተሳታፊ",
      },
      {
        quote: "ይህ አገልግሎት የተደራጀ፣ የሚታመን እና ለአጭር ጊዜ እንቅስቃሴ ሳይሆን ለረጅም ጊዜ ለውጥ የተሰጠ ነው።",
        name: "ራሄል ቢ.",
        role: "የአጋር ቤተ ክርስቲያን መሪ",
      },
      {
        quote: "የወጣቶች እንክብካቤ ፕሮግራሙ ለተማሪዎቻችን ተግባራዊ አቅጣጫ እና ቀጣይ መንፈሳዊ ድጋፍ ሰጥቷል።",
        name: "ዳንኤል ኬ.",
        role: "የወጣቶች አስተባባሪ",
      },
      {
        quote: "ቤተ መፃህፍቱ እና የመማሪያ አካባቢዎቹ በጥሩ ሁኔታ የተዘጋጁ ሲሆን ለረጅም ጊዜ ጥናት በጣም ይረዳሉ።",
        name: "ሐና መ.",
        role: "የሥነ-መለኮት ተማሪ",
      },
    ],
  },
} as const;

export default function SocialProof({ locale }: SocialProofProps) {
  const copy = content[locale];
  const isAmharic = locale === "am";
  const testimonials = copy.testimonials;
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [locale]);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  const featured = useMemo(() => testimonials[activeIndex] ?? testimonials[0], [activeIndex, testimonials]);

  return (
    <section className="bg-[#f0f4e2] px-4 py-16 sm:px-6 sm:py-20 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-5xl text-center">
        <p className={`text-[#000000] text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.2em]"}`}>
          {copy.eyebrow}
        </p>
        <h2 className={`mx-auto mt-5 max-w-3xl text-3xl text-[#121a11] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-tight"}`}>
          {locale === "am"
            ? "የእምነት መፍትሄ በማቅረብ ችግኝቶችን በግልፅ እና በፈጠራ እንዲቀንስ እንርዳለን"
            : "Community Recognition"}
        </h2>

        <div className="mx-auto mt-10 max-w-md rounded-2xl border border-[#121a11]/12 bg-[#f7f8ef] p-5 shadow-[0_12px_24px_rgba(18,26,17,0.08)]">
          <div className="min-h-[190px]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${locale}-${activeIndex}`}
                initial={{ opacity: 0, x: 28 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -28 }}
                transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className={`text-base leading-8 font-bold text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
                  “{featured.quote}”
                </p>
                <div className="mt-6 border-t border-[#121a11] pt-4">
                  <p className={`text-lg font-bold text-[#000000] ${isAmharic ? "font-ethiopic" : "font-serif font-semibold"}`}>{featured.name}</p>
                  <p className={`mt-1 text-xs font-bold text-[#000000]/62 ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.14em]"}`}>{featured.role}</p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="mt-4 flex items-center justify-center gap-2">
            {testimonials.map((item, index) => (
              <button
                key={`${item.name}-${index}`}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${index === activeIndex ? "bg-[#d6ff00]" : "bg-[#121a11]/80 hover:bg-[#121a11]"}`}
                aria-label={isAmharic ? `ምስክር ${index + 1}` : `Show testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}