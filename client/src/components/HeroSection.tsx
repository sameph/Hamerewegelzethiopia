"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import clsx from "clsx";

// Stagger variants
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.3 } },
};
const itemVariants = {
  hidden:  { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.22, 1, 0.36, 1] } },
};

export default function HeroSection() {
  const { lang } = useLang();
  const t = translations[lang].hero;
  const videoRef = useRef<HTMLVideoElement>(null);
  const isAmharic = lang === "am";

  // Ensure video plays after hydration
  useEffect(() => {
    videoRef.current?.play().catch(() => {});
  }, []);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-4 md:px-14 pt-20 overflow-hidden"
    >
      {/* ── Background video with Ken Burns ── */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          ref={videoRef}
          className="w-full h-full object-cover animate-[kenBurns_18s_ease-in-out_infinite_alternate]"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        >
          {/* <source src="/herosection.mp4" type="video/mp4" /> */}
        </video>
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-deep/90 via-deep/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-limePrimary/10 via-transparent to-deep/75" />
      </div>

      {/* ── Light beam effects ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[15%] w-px h-[70%] bg-gradient-to-b from-transparent via-limePrimary/18 to-transparent -rotate-[15deg] animate-[beamDrift_6s_ease-in-out_infinite]" />
        <div className="absolute top-[-10%] right-[25%] w-px h-[55%] bg-gradient-to-b from-transparent via-brightYellow/16 to-transparent -rotate-[8deg] animate-[beamDrift_9s_ease-in-out_infinite_reverse]" />
      </div>

      {/* ── Decorative rings ── */}
      <div className="absolute right-[-8vw] top-1/2 -translate-y-1/2 w-[58vw] h-[58vw] pointer-events-none">
        {[0, 0.6, 1.2, 1.8].map((delay, i) => (
          <div
            key={i}
            className="absolute inset-0 rounded-full border border-brightYellow/[0.11] animate-[ringPulse_4s_ease-in-out_infinite]"
            style={{
              inset: `${i * 12}%`,
              animationDelay: `${delay}s`,
            }}
          />
        ))}
      </div>

      {/* ── Cross watermark ── */}
      <div className="absolute right-[14vw] top-1/2 -translate-y-1/2 font-serif text-[22rem] leading-none text-brightYellow/[0.04] pointer-events-none select-none animate-[wmFloat_8s_ease-in-out_infinite]">
        ✞
      </div>

      {/* ── Hero Content ── */}
      <motion.div
        className="relative z-10 max-w-2xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          className={clsx(
            "flex items-center gap-2 text-brightYellow mb-5",
            "before:content-[''] before:block before:w-8 before:h-px before:bg-brightYellow before:flex-shrink-0",
            "after:content-['✦'] after:text-[0.6rem] after:opacity-70",
            isAmharic
              ? "font-ethiopic text-[0.78rem] tracking-[0.1em]"
              : "font-sans text-[0.68rem] uppercase tracking-[0.28em]"
          )}
        >
          {t.eyebrow}
        </motion.p>

        {/* Headline */}
        <motion.h1
          variants={itemVariants}
          className={clsx(
            "font-serif font-light leading-[1.08] text-white",
            "text-[clamp(2.8rem,6.5vw,6.2rem)]",
            isAmharic && "font-ethiopic !leading-[1.35] !text-[clamp(2rem,5vw,5rem)]"
          )}
        >
          {t.line1}
          <span className="block font-semibold">{t.line2}</span>
          <span className="block italic text-limeSecondary">{t.line3}</span>
        </motion.h1>

        {/* Divider */}
        <motion.div
          variants={itemVariants}
          className="w-16 h-px bg-gradient-to-r from-brightYellow to-transparent my-7"
        />

        {/* Motto */}
        <motion.p
          variants={itemVariants}
          className={clsx(
            "font-serif italic text-mint max-w-[40ch] leading-[1.65]",
            "text-[clamp(1.05rem,1.7vw,1.35rem)]",
            isAmharic && "font-ethiopic !leading-[1.8]"
          )}
        >
          <span className="text-brightYellow mr-0.5">&ldquo;</span>
          {t.motto}
          <span className="text-brightYellow ml-0.5">&rdquo;</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={itemVariants}
          className="flex gap-4 mt-10 flex-wrap items-center"
        >
          {/* SUPPORT US */}
          <a
            href="#donate"
            className={clsx(
              "relative overflow-hidden px-9 py-4 rounded-sm font-semibold",
              "gradient-primary text-deep",
              "shadow-[0_0_28px_rgba(214,255,0,.4),0_4px_20px_rgba(27,27,27,.4)]",
              "animate-pulse-gold hover:shadow-[0_0_55px_rgba(214,255,0,.6)] hover:-translate-y-0.5",
              "transition-all duration-250",
              isAmharic
                ? "font-ethiopic text-[0.88rem]"
                : "font-sans text-[0.83rem] uppercase tracking-[0.14em]"
            )}
          >
            ❤ {t.cta_support}
          </a>

          {/* LEARN MORE */}
          <a
            href="#mission"
            className={clsx(
              "px-8 py-4 rounded-sm border border-brightYellow/25 text-mint",
              "hover:border-brightYellow hover:text-brightYellow hover:bg-brightYellow/8 hover:shadow-[0_0_20px_rgba(214,255,0,.2)]",
              "hover:-translate-y-0.5 transition-all duration-300",
              isAmharic
                ? "font-ethiopic text-[0.88rem]"
                : "font-sans text-[0.83rem] uppercase tracking-[0.14em]"
            )}
          >
            {t.cta_learn}
          </a>
        </motion.div>
      </motion.div>

      {/* ── Scroll indicator — bottom-left ── */}
      <div className="absolute bottom-10 left-11 flex flex-col items-center gap-2 z-10 opacity-0 animate-[fadeIn_1s_1.4s_forwards]">
        <span
          className={clsx(
            "text-mint/70 text-[0.55rem] tracking-[0.3em] uppercase [writing-mode:vertical-rl] rotate-180",
            isAmharic && "font-ethiopic"
          )}
        >
          {t.scroll}
        </span>
        <div className="w-px h-14 bg-gradient-to-b from-brightYellow/15 to-limePrimary animate-scroll-down" />
      </div>
    </section>
  );
}
