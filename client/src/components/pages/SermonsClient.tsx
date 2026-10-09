"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Download, Youtube, Headphones, ChevronRight } from "lucide-react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";

const ICONS = ["🕊","📖","✝","🙏","⛪","📜"];
const TAGS_EN = ["Faith","Ministry","Heritage","Service","Mission","Grace"];

interface Sermon { title: string; speaker: string; date: string; duration: string; tag: string }
interface C {
  heroTag: string; heroTitle: string; heroP: string;
  featuredTitle: string; sermons: Sermon[];
  audioTitle: string;
  youtubeTitle: string; youtubeDesc: string; youtubeBtn: string;
  listen: string; download: string; watch: string;
  filterAll: string; filterAudio: string; filterVideo: string;
  archiveBtn: string;
}

export default function SermonsClient({ locale, c }: { locale: string; c: C }) {
  const isAm = locale === "am";
  const [filter, setFilter] = useState(0);
  const serif  = clsx("font-serif", isAm && "font-ethiopic");
  const body   = isAm ? "font-ethiopic" : "font-sans";
  const filters = [c.filterAll, c.filterVideo, c.filterAudio];

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-end pb-20 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 40%,#1B1B1B 80%,#1B1B1B)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,208,132,.07) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 max-w-4xl">
          <Reveal>
            <span className={clsx("inline-flex items-center gap-3 text-gold mb-5",
              isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.28em]")}>
              <span className="block w-8 h-px bg-gold flex-shrink-0" />{c.heroTag}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className={clsx("font-serif font-semibold text-white mb-6 leading-[1.08]",
              "text-[clamp(2.2rem,5vw,3.8rem)]", isAm && "font-ethiopic leading-[1.4]")}>{c.heroTitle}</h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className={clsx("text-mist/62 max-w-[52ch] leading-[1.85]",
              isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.96rem]")}>{c.heroP}</p>
          </Reveal>
        </div>
      </section>

      {/* ── FEATURED SERMONS ── */}
      <section className="py-28 px-8" style={{ background: "#1B1B1B" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <h2 className={clsx(serif, "font-semibold text-mist text-[clamp(1.6rem,2.8vw,2.2rem)]")}>{c.featuredTitle}</h2>
              {/* Filter pills */}
              <div className="flex gap-2">
                {filters.map((f, i) => (
                  <button key={i} onClick={() => setFilter(i)}
                    className={clsx("px-4 py-1.5 rounded-full border transition-all duration-200",
                      isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.65rem] uppercase tracking-[0.1em]",
                      filter === i
                        ? "border-sage bg-sage/15 text-sage"
                        : "border-sage/20 text-mist/45 hover:border-sage/40 hover:text-mist/65")}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.sermons.map((s, i) => (
              <Reveal key={i} delay={i * 0.06} direction="up">
                <div className="group flex flex-col h-full p-6 rounded-2xl border border-sage/10
                  hover:border-sage/30 hover:bg-sage/[0.03] transition-all duration-300"
                  style={{ background: "rgba(11,43,38,0.5)" }}>
                  <div className="flex justify-between items-start mb-5">
                    <span className="text-2xl opacity-60">{ICONS[i]}</span>
                    <span className={clsx("px-2.5 py-0.5 rounded-full border border-sage/20 bg-sage/10 text-sage",
                      isAm ? "font-ethiopic text-[0.62rem]" : "font-sans text-[0.55rem] uppercase tracking-[0.1em]")}>
                      {s.tag}
                    </span>
                  </div>
                  <h3 className={clsx(serif, "font-semibold text-mist mb-2 leading-snug flex-1",
                    isAm ? "text-[0.95rem]" : "text-[1.02rem]")}>{s.title}</h3>
                  <p className={clsx(body, "text-sage text-[0.75rem] mb-1")}>{s.speaker}</p>
                  <div className="flex justify-between items-center text-mist/35 mb-5">
                    <span className="font-sans text-[0.65rem]">{s.date}</span>
                    <span className="font-sans text-[0.65rem]">{s.duration}</span>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <button className={clsx("flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl",
                      "bg-forest/80 hover:bg-forest text-mist transition-colors duration-200",
                      isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.65rem] uppercase tracking-[0.08em]")}>
                      <Play size={12} fill="currentColor" />{c.listen}
                    </button>
                    <button className="w-10 h-10 rounded-xl border border-sage/20 hover:border-sage/45 flex items-center justify-center text-sage/50 hover:text-sage transition-all">
                      <Download size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center mt-12">
            <button className={clsx("inline-flex items-center gap-2 px-8 py-3 rounded-full border border-sage/30 text-sage",
              "hover:bg-sage/10 hover:border-sage/55 transition-all duration-200",
              isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.1em]")}>
              {c.archiveBtn}<ChevronRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── AUDIO SERMONS ── */}
      <section className="py-24 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className={clsx(serif, "font-semibold text-deep text-[clamp(1.6rem,2.8vw,2.2rem)] mb-3")}>{c.audioTitle}</h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-forest to-transparent mx-auto rounded-full" />
          </Reveal>
          <div className="space-y-3">
            {c.sermons.slice(0,4).map((s, i) => (
              <Reveal key={i} delay={i * 0.07}>
                <div className="flex items-center gap-4 p-5 rounded-xl bg-white border border-transparent
                  hover:border-forest/25 hover:shadow-[0_4px_20px_rgba(27,27,27,.08)] transition-all duration-250 group">
                  <div className="w-10 h-10 rounded-full bg-forest/10 flex items-center justify-center flex-shrink-0
                    group-hover:bg-forest/20 transition-colors">
                    <Headphones size={16} className="text-forest" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={clsx(serif, "font-semibold text-deep truncate",
                      isAm ? "text-[0.9rem]" : "text-[0.95rem]")}>{s.title}</p>
                    <p className={clsx(body, "text-deep/50 text-[0.72rem]")}>{s.speaker} · {s.duration}</p>
                  </div>
                  <button className={clsx("flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full",
                    "bg-forest text-mist hover:bg-mid transition-colors",
                    isAm ? "font-ethiopic text-[0.7rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.1em]")}>
                    <Play size={11} fill="currentColor" />{c.listen}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── YOUTUBE ARCHIVE ── */}
      <section className="py-24 px-8" style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 60%,#1B1B1B)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6"
              style={{ background: "rgba(255,0,0,0.15)", border: "1px solid rgba(255,0,0,0.25)" }}>
              <Youtube size={28} className="text-red-400" />
            </div>
            <h2 className={clsx(serif, "font-semibold text-mist mb-4 text-[clamp(1.5rem,2.8vw,2rem)]")}>{c.youtubeTitle}</h2>
            <p className={clsx(body, "text-mist/55 max-w-[42ch] mx-auto leading-relaxed mb-8",
              isAm ? "text-[0.88rem]" : "text-[0.92rem]")}>{c.youtubeDesc}</p>
            <a href="https://www.youtube.com/@hamerewengielzeethiopia2950" target="_blank" rel="noopener noreferrer"
              className={clsx("inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold",
                "transition-all duration-200 hover:-translate-y-0.5",
                isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.8rem] uppercase tracking-[0.1em]")}
              style={{ background: "#D6FF00", color: "#F7F7F7", boxShadow: "0 4px 24px rgba(255,0,0,0.35)" }}>
              <Youtube size={16} />{c.youtubeBtn}
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
}
