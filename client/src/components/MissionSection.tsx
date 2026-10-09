"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import clsx from "clsx";

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  },
});

export default function MissionSection() {
  const { lang } = useLang();
  const t = translations[lang].mission;
  const isAmharic = lang === "am";
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.15 });

  return (
    <section id="mission" ref={sectionRef} className="grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      <div className="relative min-h-[480px] lg:min-h-[600px] overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 0.92 }}
          animate={inView ? { scale: 1 } : { scale: 0.92 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-8 rounded-[20px] overflow-hidden shadow-[0_0_60px_rgba(27,27,27,.45),0_20px_60px_rgba(5,31,32,.35)]">
            <div className="w-full h-full bg-gradient-to-br from-mid via-forest to-dark flex flex-col items-center justify-center gap-4">
              <span className="text-5xl opacity-30">+</span>
              <span className="text-sage/40 text-xs tracking-[0.2em] uppercase font-sans">
                Central Cathedral Photo
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="bg-mint flex flex-col justify-center px-12 lg:px-16 py-20">
        <motion.p
          variants={fadeUp(0.12)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={clsx(
            "flex items-center gap-3 text-forest font-medium mb-5",
            "before:content-[''] before:block before:w-7 before:h-0.5 before:bg-forest before:flex-shrink-0",
            isAmharic
              ? "font-ethiopic text-[0.76rem] tracking-[0.08em]"
              : "font-sans text-[0.68rem] uppercase tracking-[0.28em]"
          )}
        >
          {t.overline}
        </motion.p>

        <motion.h2
          variants={fadeUp(0.26)}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          className={clsx(
            "font-serif font-semibold text-deep leading-[1.18] mb-8",
            "text-[clamp(1.9rem,3.5vw,2.9rem)]",
            isAmharic && "font-ethiopic !leading-[1.45]"
          )}
        >
          {t.heading}
        </motion.h2>

        <motion.div variants={fadeUp(0.42)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-5">
          <p
            className={clsx(
              "flex items-center gap-2 text-forest font-medium mb-3",
              "before:content-[''] before:block before:w-2.5 before:h-2.5 before:rounded-full before:bg-forest before:flex-shrink-0",
              isAmharic
                ? "font-ethiopic text-[0.73rem] tracking-[0.1em]"
                : "font-sans text-[0.65rem] uppercase tracking-[0.22em]"
            )}
          >
            {t.mission_label}
          </p>
          <p
            className={clsx(
              "text-deep/80 leading-[1.88] border-l-[3px] border-forest pl-4 italic",
              isAmharic ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.97rem]"
            )}
          >
            {t.mission_text}
          </p>
        </motion.div>

        <motion.div variants={fadeUp(0.5)} initial="hidden" animate={inView ? "visible" : "hidden"} className="w-12 h-0.5 bg-gradient-to-r from-forest to-transparent rounded my-5" />

        <motion.div variants={fadeUp(0.58)} initial="hidden" animate={inView ? "visible" : "hidden"} className="mb-8">
          <p
            className={clsx(
              "flex items-center gap-2 text-forest font-medium mb-3",
              "before:content-[''] before:block before:w-2.5 before:h-2.5 before:rounded-full before:bg-forest before:flex-shrink-0",
              isAmharic
                ? "font-ethiopic text-[0.73rem] tracking-[0.1em]"
                : "font-sans text-[0.65rem] uppercase tracking-[0.22em]"
            )}
          >
            {t.vision_label}
          </p>
          <p
            className={clsx(
              "text-deep/80 leading-[1.88] border-l-[3px] border-forest pl-4 italic",
              isAmharic ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.97rem]"
            )}
          >
            {t.vision_text}
          </p>
        </motion.div>

        <motion.div variants={fadeUp(0.72)} initial="hidden" animate={inView ? "visible" : "hidden"} className="flex gap-3 flex-wrap">
          <Link
            href={`/${lang}/about`}
            className={clsx(
              "px-7 py-3 bg-forest text-mist rounded-sm font-medium",
              "hover:bg-mid hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(27,27,27,.45)]",
              "transition-all duration-250",
              isAmharic ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.78rem] uppercase tracking-[0.12em]"
            )}
          >
            {t.cta_story}
          </Link>
          <Link
            href={`/${lang}/departments`}
            className={clsx(
              "px-7 py-3 border-[1.5px] border-forest text-forest rounded-sm",
              "hover:bg-forest hover:text-mist hover:-translate-y-0.5",
              "transition-all duration-250",
              isAmharic ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.78rem] uppercase tracking-[0.12em]"
            )}
          >
            {t.cta_dept}
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
