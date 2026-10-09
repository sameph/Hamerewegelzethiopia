"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useMotionValue, animate, useInView } from "framer-motion";
import { ShieldCheck, Cpu, Scale, GraduationCap } from "lucide-react";
import { LanguageProvider } from "@/context/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { useRef } from "react";
import clsx from "clsx";
import type { Locale } from "@/context/LanguageContext";

// ── Animated counter ────────────────────────────────────────
function StatCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const val = useMotionValue(0);
  const [display, setDisplay] = useState("0");
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(val, target, {
      duration: 1.8, ease: "easeOut",
      onUpdate: (v) => setDisplay(Math.floor(v).toLocaleString()),
    });
    return ctrl.stop;
  }, [inView, target, val]);
  return <span ref={ref}>{display}{suffix}</span>;
}

interface AboutStrings {
  historyTag: string; historyTitle: string;
  historyP1: string; historyP2: string; historyP3: string;
  statsTitle: string;
  stat1Val: string; stat1Label: string;
  stat2Val: string; stat2Label: string;
  stat3Val: string; stat3Label: string;
  stat4Val: string; stat4Label: string;
  pillarsTitle: string;
  p1Title: string; p1Desc: string;
  p2Title: string; p2Desc: string;
  p3Title: string; p3Desc: string;
  p4Title: string; p4Desc: string;
  mapTitle: string; mapSub: string;
  ctaTitle: string; ctaApply: string; ctaSupport: string;
}

interface Props { locale: Locale; strings: AboutStrings; }

const pillarIcons = [ShieldCheck, Cpu, Scale, GraduationCap];
const pillarColors = ["#00D084", "#D6FF00", "#00D084", "#D6FF00"];

export default function AboutPageClient({ locale, strings: s }: Props) {
  const [showTop, setShowTop] = useState(false);
  const isAm = locale === "am";

  useEffect(() => {
    const h = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const hCls = isAm ? "font-ethiopic leading-[1.45]" : "font-serif leading-[1.12]";
  const pCls = isAm ? "font-ethiopic leading-[1.85] text-[0.95rem]" : "font-sans leading-[1.82] text-[0.95rem]";

  const stats = [
    { raw: s.stat1Val, label: s.stat1Label },
    { raw: s.stat2Val, label: s.stat2Label },
    { raw: s.stat3Val, label: s.stat3Label },
    { raw: s.stat4Val, label: s.stat4Label },
  ].map(({ raw, label }) => {
    const n = parseFloat(raw.replace(/[^\d.]/g, ""));
    const suffix = raw.replace(/[\d.,]/g, "").trim();
    return { n, suffix, label };
  });

  const pillars = [
    { title: s.p1Title, desc: s.p1Desc },
    { title: s.p2Title, desc: s.p2Desc },
    { title: s.p3Title, desc: s.p3Desc },
    { title: s.p4Title, desc: s.p4Desc },
  ];

  const inVP = { once: true, amount: 0.22 };

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />

      <main className={isAm ? "font-ethiopic" : "font-sans"}>

        {/* ══ 1. Heritage Split ══ */}
        <section className="flex flex-col lg:flex-row min-h-screen pt-[72px]">
          {/* Image */}
          <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-auto overflow-hidden">
            <motion.div
              className="absolute inset-0"
              initial={{ scale: 1.14 }} whileInView={{ scale: 1 }}
              transition={{ duration: 1.7, ease: [0.22,1,0.36,1] }}
              viewport={inVP}
            >
              <div
                className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                style={{ background: "linear-gradient(135deg,#1B1B1B 0%,#1B1B1B 35%,#1B1B1B 65%,#1B1B1B 100%)" }}
              >
                <span style={{ fontSize:"5rem", opacity:0.16 }}>⛪</span>
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.22em]" style={{ color:"rgba(0,208,132,0.3)" }}>
                  Cathedral Photo
                </span>
              </div>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="font-serif select-none" style={{ fontSize:"22rem", color:"rgba(0,208,132,.04)", lineHeight:1 }}>✞</span>
              </div>
            </motion.div>
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-10 md:px-16 lg:px-20 py-16 lg:py-24">
            <motion.div
              initial={{ opacity:0, y:32 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.85, ease:[0.22,1,0.36,1] }}
              viewport={inVP}
            >
              {/* Eyebrow tag */}
              <p
                className={clsx("flex items-center gap-3 mb-6 font-semibold", isAm ? "font-ethiopic text-[0.78rem] tracking-[0.08em]" : "font-sans text-[0.62rem] uppercase tracking-[0.3em]")}
                style={{ color:"#1B1B1B" }}
              >
                <span className="block h-[2px] w-9 rounded-full flex-shrink-0" style={{ background:"linear-gradient(to right,#1B1B1B,transparent)" }} />
                {s.historyTag}
                <span className="block h-[2px] flex-1 rounded-full" style={{ background:"linear-gradient(to right,rgba(201,169,110,.5),transparent)" }} />
              </p>

              {/* Title */}
              <h1 className={clsx("font-bold mb-8 text-[clamp(1.9rem,3.5vw,3rem)]", hCls)} style={{ color:"#1B1B1B" }}>
                {s.historyTitle}
              </h1>

              {/* Body paragraphs */}
              <div className="space-y-5">
                {[s.historyP1, s.historyP2, s.historyP3].map((p, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }}
                    transition={{ duration:0.65, ease:"easeOut", delay: 0.1 + i*0.1 }}
                    viewport={inVP}
                    className={pCls}
                    style={{ color:"rgba(5,31,32,0.72)" }}
                  >{p}</motion.p>
                ))}
              </div>

              {/* Gold divider */}
              <div className="w-14 h-0.5 rounded-full my-8" style={{ background:"linear-gradient(to right,#D6FF00,transparent)" }} />

              {/* CTA link */}
              <Link href="#mission" className={clsx("inline-flex items-center gap-2 font-semibold hover:gap-3 transition-all duration-200", isAm ? "font-ethiopic text-[0.88rem]" : "font-sans text-[0.75rem] uppercase tracking-[0.16em]")} style={{ color:"#1B1B1B" }}>
                {isAm ? "ሙሉ ዝርዝር ይመልከቱ" : "Read Our Full Story"}
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}><path d="M3 8h10M9 4l4 4-4 4"/></svg>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ══ 2. Stats ══ */}
        <section className="py-20 px-6" style={{ background:"#1B1B1B" }}>
          <div className="max-w-5xl mx-auto">
            <motion.h2
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.7 }} viewport={inVP}
              className={clsx("text-center mb-12 font-bold text-[clamp(1.3rem,2.5vw,1.9rem)]", hCls)}
              style={{ color:"#F7F7F7" }}
            >{s.statsTitle}</motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {stats.map(({ n, suffix, label }, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
                  transition={{ duration:0.65, delay: i*0.1 }} viewport={inVP}
                  className="flex flex-col items-center text-center p-6 rounded-2xl"
                  style={{ background:"rgba(5,31,32,.45)", border:"1px solid rgba(0,208,132,.1)" }}
                >
                  <div className="font-serif text-[2.6rem] font-bold leading-none" style={{ color:"#D6FF00" }}>
                    <StatCounter target={n} suffix={suffix} />
                  </div>
                  <div className={clsx("mt-2", isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.6rem] uppercase tracking-[0.2em]")} style={{ color:"rgba(247,247,247,.5)" }}>
                    {label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ══ 3. Four Pillars ══ */}
        <section className="bg-white py-24 px-6">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.75 }} viewport={inVP}
              className="text-center mb-14"
            >
              <h2 className={clsx("font-bold text-[clamp(1.7rem,3vw,2.5rem)]", hCls)} style={{ color:"#1B1B1B" }}>
                {s.pillarsTitle}
              </h2>
              <div className="w-16 h-0.5 mx-auto mt-5 rounded-full" style={{ background:"linear-gradient(to right,transparent,#1B1B1B,transparent)" }} />
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pillars.map(({ title, desc }, i) => {
                const Icon = pillarIcons[i];
                const ic = pillarColors[i];
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }}
                    transition={{ duration:0.65, delay: i*0.1 }} viewport={inVP}
                    whileHover={{ y:-4, boxShadow:"0 12px 40px rgba(27,27,27,.18)", borderColor:"#1B1B1B" }}
                    className="relative p-8 rounded-2xl cursor-default transition-colors duration-300"
                    style={{ background:"#F7F7F7", border:"1.5px solid transparent" }}
                  >
                    <span className="absolute top-4 right-5 font-serif text-[3.5rem] font-bold select-none pointer-events-none" style={{ color:"rgba(27,27,27,.07)", lineHeight:1 }}>{i+1}</span>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background:"rgba(27,27,27,.12)" }}>
                      <Icon size={20} color={ic} strokeWidth={1.8} />
                    </div>
                    <h3 className={clsx("font-bold text-[1.1rem] mb-3", hCls)} style={{ color:"#1B1B1B" }}>{title}</h3>
                    <p className={clsx("text-[0.88rem]", pCls)} style={{ color:"rgba(5,31,32,.65)" }}>{desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ══ 4. Global Map ══ */}
        <section className="relative overflow-hidden py-24 px-6" style={{ background:"#F7F7F7" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage:"radial-gradient(circle,rgba(27,27,27,.08) 1px,transparent 1px)", backgroundSize:"32px 32px" }} />
          <div className="max-w-5xl mx-auto relative z-10">
            <motion.div
              initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }}
              transition={{ duration:0.75 }} viewport={inVP}
              className="text-center mb-12"
            >
              <h2 className={clsx("font-bold text-[clamp(1.7rem,3vw,2.5rem)] mb-4", hCls)} style={{ color:"#1B1B1B" }}>{s.mapTitle}</h2>
              <p className={clsx("max-w-xl mx-auto", pCls)} style={{ color:"rgba(5,31,32,.65)" }}>{s.mapSub}</p>
            </motion.div>

            <motion.div
              initial={{ opacity:0, scale:0.95 }} whileInView={{ opacity:1, scale:1 }}
              transition={{ duration:1, ease:[0.22,1,0.36,1] }} viewport={inVP}
              className="rounded-2xl overflow-hidden"
              style={{ background:"linear-gradient(135deg,#1B1B1B 0%,#1B1B1B 40%,#1B1B1B 100%)", boxShadow:"0 24px 60px rgba(27,27,27,.25),0 0 0 1.5px rgba(0,208,132,.12)" }}
            >
              <svg viewBox="0 0 900 440" style={{ display:"block", width:"100%" }}>
                {Array.from({length:9}).map((_,i)=><line key={`h${i}`} x1={0} y1={(i+1)*44} x2={900} y2={(i+1)*44} stroke="rgba(0,208,132,.05)" strokeWidth={1}/>)}
                {Array.from({length:17}).map((_,i)=><line key={`v${i}`} x1={(i+1)*50} y1={0} x2={(i+1)*50} y2={440} stroke="rgba(0,208,132,.05)" strokeWidth={1}/>)}
                <line x1={0} y1={220} x2={900} y2={220} stroke="rgba(0,208,132,.08)" strokeWidth={1} strokeDasharray="6 4"/>
                {/* Africa */}
                <path d="M420 115 L462 108 L492 128 L502 178 L512 218 L492 268 L462 308 L440 288 L418 248 L408 198 L414 158 Z" fill="rgba(0,208,132,.1)" stroke="rgba(0,208,132,.18)" strokeWidth={1}/>
                {/* Europe */}
                <path d="M390 76 L432 72 L442 94 L420 108 L398 103 L383 88 Z" fill="rgba(0,208,132,.08)" stroke="rgba(0,208,132,.14)" strokeWidth={1}/>
                {/* Americas */}
                <path d="M158 78 L198 73 L220 98 L214 138 L200 188 L180 228 L164 198 L148 158 L144 118 Z" fill="rgba(0,208,132,.07)" stroke="rgba(0,208,132,.12)" strokeWidth={1}/>
                {/* Asia */}
                <path d="M510 78 L622 68 L682 88 L702 128 L662 148 L602 138 L542 118 L510 98 Z" fill="rgba(0,208,132,.07)" stroke="rgba(0,208,132,.12)" strokeWidth={1}/>
                {/* Aus */}
                <path d="M658 278 L698 273 L718 293 L713 313 L688 318 L663 303 Z" fill="rgba(0,208,132,.06)" stroke="rgba(0,208,132,.11)" strokeWidth={1}/>

                {/* HQ — Addis Ababa */}
                <motion.circle cx={460} cy={208} r={6} fill="#00D084"
                  initial={{ r:4, opacity:0.8 }} animate={{ r:14, opacity:0 }} transition={{ duration:2.4, repeat:Infinity, ease:"easeOut" }}/>
                <circle cx={460} cy={208} r={6} fill="#00D084"/>
                {/* Ethiopia */}
                <circle cx={444} cy={184} r={4} fill="#00D084" opacity={0.85}/>
                <circle cx={476} cy={228} r={4} fill="#00D084" opacity={0.85}/>
                <circle cx={438} cy={248} r={3} fill="#00D084" opacity={0.55}/>
                {/* Europe diaspora */}
                <circle cx={410} cy={85}  r={3} fill="#00D084" opacity={0.7}/>
                <circle cx={430} cy={79}  r={2.5} fill="#00D084" opacity={0.55}/>
                <circle cx={393} cy={82}  r={2.5} fill="#00D084" opacity={0.55}/>
                {/* N America */}
                <circle cx={192} cy={103} r={3} fill="#00D084" opacity={0.7}/>
                <circle cx={164} cy={113} r={2.5} fill="#00D084" opacity={0.5}/>
                {/* Asia */}
                <circle cx={602} cy={108} r={3} fill="#00D084" opacity={0.6}/>
                {/* Australia */}
                <circle cx={684} cy={293} r={3} fill="#00D084" opacity={0.6}/>
              </svg>

              <div className="flex items-center gap-2 p-4 border-t border-sage/10">
                <div className="w-3 h-3 rounded-full" style={{ background:"#00D084" }}/>
                <span className="font-sans text-[0.6rem] uppercase tracking-[0.16em]" style={{ color:"rgba(247,247,247,.45)" }}>
                  {isAm ? "ቅርንጫፎቻችን — ሁሉም አህጉሮች" : "Our branches across all continents"}
                </span>
                <span className="ml-auto font-sans text-[0.6rem]" style={{ color:"rgba(247,247,247,.3)" }}>
                  Addis Ababa HQ ★
                </span>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ══ 5. CTA ══ */}
        <section className="bg-white py-24 px-6">
          <motion.div
            initial={{ opacity:0, y:30 }} whileInView={{ opacity:1, y:0 }}
            transition={{ duration:0.8, ease:[0.22,1,0.36,1] }} viewport={inVP}
            className="max-w-3xl mx-auto text-center rounded-3xl p-12 md:p-16"
            style={{ background:"#F7F7F7", border:"2px dashed rgba(27,27,27,.2)" }}
          >
            <div className="text-[2rem] mb-6 select-none" style={{ color:"rgba(27,27,27,.25)" }}>✞</div>
            <h2 className={clsx("font-bold mb-10 text-[clamp(1.5rem,2.8vw,2.2rem)]", hCls)} style={{ color:"#1B1B1B" }}>
              {s.ctaTitle}
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a href="#colleges" whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                className={clsx("px-8 py-3.5 rounded-full font-bold text-white transition-all", isAm ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.8rem] uppercase tracking-[0.14em]")}
                style={{ background:"#1B1B1B" }}
              >{s.ctaApply}</motion.a>
              <motion.a href="#donate" whileHover={{ y:-2 }} whileTap={{ scale:0.97 }}
                className={clsx("px-8 py-3.5 rounded-full font-bold transition-all", isAm ? "font-ethiopic text-[0.92rem]" : "font-sans text-[0.8rem] uppercase tracking-[0.14em]")}
                style={{ background:"white", border:"2px solid #1B1B1B", color:"#1B1B1B" }}
              >{s.ctaSupport}</motion.a>
            </div>
          </motion.div>
        </section>

      </main>
      <Footer />

      {/* Back to top */}
      <AnimatePresence>
        {showTop && (
          <motion.button
            initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0, scale:0.8 }}
            transition={{ duration:0.25 }}
            onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}
            className="fixed bottom-10 right-10 z-50 w-11 h-11 rounded-full flex items-center justify-center"
            style={{ background:"rgba(5,31,32,.85)", backdropFilter:"blur(10px)", border:"1px solid rgba(0,208,132,.25)", color:"#00D084", boxShadow:"0 8px 28px rgba(27,27,27,.4)" }}
            aria-label="Back to top"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={2}><path d="M8 12V4M4 8l4-4 4 4"/></svg>
          </motion.button>
        )}
      </AnimatePresence>
    </LanguageProvider>
  );
}
