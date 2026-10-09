"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Radio, BadgeDollarSign, FlaskConical, GraduationCap, Sprout, Church, Globe2, BookOpen, ArrowRight } from "lucide-react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";

const DEPT_ICONS = [Radio, BadgeDollarSign, FlaskConical, GraduationCap, Sprout, Church];
const DEPT_COLORS = ["#1B1B1B","#1B1B1B","#1B1B1B","#1B1B1B","#1B1B1B","#1B1B1B"];
const BRANCH_ICONS = ["🏛","⛪","⛪","⛪","⛪","✈"];

interface C {
  heroTag: string; heroTitle: string; heroP: string;
  ministriesTitle: string;
  depts: { title: string; desc: string }[];
  eduTitle: string;
  programs: { name: string; duration: string }[];
  branchesTitle: string;
  branches: { name: string; detail: string }[];
  ctaTitle: string; ctaLms: string; ctaDonate: string;
  lmsNav: string; donateNav: string;
}

export default function DepartmentsClient({ locale, c }: { locale: string; c: C }) {
  const isAm = locale === "am";
  const prefix = locale === "en" ? "/en" : "/am";
  const h = (p: string) => `${prefix}${p}`;

  const serif = clsx("font-serif", isAm && "font-ethiopic");
  const body  = isAm ? "font-ethiopic" : "font-sans";

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-end pb-20 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B1B1B 0%,#1B1B1B 40%,#1B1B1B 75%,#1B1B1B 100%)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle,rgba(0,208,132,.06) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute right-0 top-0 w-[40vw] h-full opacity-10 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 80% 50%,#00D084,transparent 65%)" }} />
        <div className="relative z-10 max-w-4xl">
          <Reveal>
            <span className={clsx("inline-flex items-center gap-3 text-gold mb-5",
              isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.28em]")}>
              <span className="block w-8 h-px bg-gold flex-shrink-0" />
              {c.heroTag}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className={clsx("font-serif font-semibold text-white mb-6 leading-[1.08]",
              "text-[clamp(2.2rem,5vw,3.8rem)]", isAm && "font-ethiopic leading-[1.4]")}>
              {c.heroTitle}
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className={clsx("text-mist/62 max-w-[52ch] leading-[1.85]",
              isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.96rem]")}>
              {c.heroP}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── MINISTRIES ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className={clsx(serif, "font-semibold text-deep text-[clamp(1.8rem,3vw,2.6rem)]")}>{c.ministriesTitle}</h2>
            <div className="w-14 h-[2px] bg-gradient-to-r from-forest to-transparent mx-auto mt-5 rounded-full" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.depts.map((dept, i) => {
              const Icon = DEPT_ICONS[i];
              return (
                <Reveal key={i} delay={i * 0.07} direction="up">
                  <div className="group h-full p-8 rounded-2xl border border-transparent
                    hover:border-forest/35 hover:shadow-[0_8px_40px_rgba(27,27,27,.1)]
                    transition-all duration-300 cursor-default"
                    style={{ background: "#F7F7F7" }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300"
                      style={{ background: `${DEPT_COLORS[i]}18` }}>
                      <Icon size={20} strokeWidth={1.6} style={{ color: DEPT_COLORS[i] }}
                        className="group-hover:scale-110 transition-transform duration-300" />
                    </div>
                    <h3 className={clsx(serif, "font-semibold text-deep mb-3 leading-snug",
                      isAm ? "text-[0.98rem]" : "text-[1.1rem]")}>
                      {dept.title}
                    </h3>
                    <div className="w-8 h-[1.5px] bg-gold/50 rounded-full mb-4" />
                    <p className={clsx(body, "text-deep/62 leading-relaxed",
                      isAm ? "text-[0.82rem]" : "text-[0.84rem]")}>
                      {dept.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── EDUCATION PROGRAMS ── */}
      <section className="py-28 px-8" style={{ background: "linear-gradient(180deg,#1B1B1B,#1B1B1B)" }}>
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className={clsx(serif, "font-semibold text-mist text-[clamp(1.8rem,3vw,2.6rem)]")}>{c.eduTitle}</h2>
            <div className="w-14 h-[2px] bg-gradient-to-r from-gold to-transparent mx-auto mt-5 rounded-full" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {c.programs.map((prog, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="relative p-7 rounded-2xl text-center border border-sage/15
                  hover:border-sage/35 hover:bg-sage/[0.04] transition-all duration-300 group"
                  style={{ background: "rgba(11,43,38,0.5)" }}>
                  <div className="font-serif text-[2.8rem] font-semibold text-gold leading-none mb-3">
                    {i + 1}
                  </div>
                  <h3 className={clsx(serif, "font-semibold text-mist mb-2 leading-snug",
                    isAm ? "text-[0.92rem]" : "text-[1rem]")}>
                    {prog.name}
                  </h3>
                  <span className={clsx("inline-block px-3 py-1 rounded-full text-sage border border-sage/25",
                    isAm ? "font-ethiopic text-[0.68rem]" : "font-sans text-[0.6rem] uppercase tracking-[0.12em]",
                    "bg-sage/10")}>
                    {prog.duration}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── BRANCHES / DIOCESES ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className={clsx(serif, "font-semibold text-deep text-[clamp(1.8rem,3vw,2.6rem)]")}>{c.branchesTitle}</h2>
            <div className="w-14 h-[2px] bg-gradient-to-r from-forest to-transparent mx-auto mt-5 rounded-full" />
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.branches.map((branch, i) => (
              <Reveal key={i} delay={i * 0.07} direction="up">
                <div className="flex items-center gap-4 p-6 rounded-2xl bg-white border border-transparent
                  hover:border-forest/30 hover:shadow-[0_4px_24px_rgba(27,27,27,.1)]
                  transition-all duration-300 group cursor-default">
                  <span className="text-2xl flex-shrink-0 opacity-70">{BRANCH_ICONS[i]}</span>
                  <div>
                    <h3 className={clsx(serif, "font-semibold text-deep mb-1 leading-snug",
                      isAm ? "text-[0.92rem]" : "text-[0.98rem]")}>{branch.name}</h3>
                    <p className={clsx(body, "text-deep/50", isAm ? "text-[0.72rem]" : "text-[0.7rem]")}>{branch.detail}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl p-12 lg:p-16 text-center"
              style={{ background: "#F7F7F7", border: "2px dashed rgba(27,27,27,0.18)" }}>
              {["top-4 left-4","top-4 right-4","bottom-4 left-4","bottom-4 right-4"].map((pos, i) => (
                <div key={i} className={`absolute ${pos} w-5 h-5 opacity-50`} style={{
                  borderTop: i < 2 ? "2px solid rgba(27,27,27,.4)" : "none",
                  borderBottom: i >= 2 ? "2px solid rgba(27,27,27,.4)" : "none",
                  borderLeft: i % 2 === 0 ? "2px solid rgba(27,27,27,.4)" : "none",
                  borderRight: i % 2 === 1 ? "2px solid rgba(27,27,27,.4)" : "none",
                }} />
              ))}
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-forest/10 mb-8 mx-auto">
                <Globe2 size={22} className="text-forest" strokeWidth={1.6} />
              </div>
              <h2 className={clsx(serif, "font-semibold text-deep mb-10",
                "text-[clamp(1.5rem,3vw,2rem)]", isAm && "leading-[1.5]")}>
                {c.ctaTitle}
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href={h("/lms/login")} className={clsx("group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold",
                  "bg-forest text-mist shadow-[0_4px_24px_rgba(27,27,27,.35)] hover:bg-mid hover:-translate-y-0.5 transition-all",
                  isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.82rem] uppercase tracking-[0.1em]")}>
                  {c.ctaLms}<ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href={h("/donate")} className={clsx("group inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold",
                  "border-2 border-forest text-forest hover:bg-forest hover:text-mist hover:-translate-y-0.5 transition-all",
                  isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.82rem] uppercase tracking-[0.1em]")}>
                  {c.ctaDonate}<ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
