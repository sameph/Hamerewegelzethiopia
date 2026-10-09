"use client";

import { ArrowRight, BookOpen } from "lucide-react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";

const CAT_COLORS: Record<string, string> = {
  Heritage: "#1B1B1B", Education: "#1B1B1B", Community: "#1B1B1B",
  Media: "#1B1B1B", Theology: "#1B1B1B", Events: "#1B1B1B",
  "ቅርስ": "#1B1B1B", "ትምህርት": "#1B1B1B", "ማህ/ሰብ": "#1B1B1B",
  "ሚዲያ": "#1B1B1B", "ሥነ-መለኮት": "#1B1B1B", "ዝግጅቶች": "#1B1B1B",
};
const POST_ICONS = ["📜","🎓","🌱","📡","✝","📅"];

interface Post { title: string; excerpt: string; author: string; date: string; cat: string }
interface C {
  heroTag: string; heroTitle: string; heroP: string;
  latestTitle: string; posts: Post[];
  readMore: string; viewAll: string;
  teachingsTitle: string;
  teachings: { title: string }[];
}

export default function BlogClient({ locale, c }: { locale: string; c: C }) {
  const isAm = locale === "am";
  const serif = clsx("font-serif", isAm && "font-ethiopic");
  const body  = isAm ? "font-ethiopic" : "font-sans";

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[55vh] flex items-end pb-20 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 40%,#1B1B1B 80%,#1B1B1B)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,208,132,.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
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

      {/* ── LATEST ARTICLES ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <h2 className={clsx(serif, "font-semibold text-deep text-[clamp(1.8rem,3vw,2.6rem)]")}>{c.latestTitle}</h2>
            <div className="w-14 h-[2px] bg-gradient-to-r from-forest to-transparent mx-auto mt-5 rounded-full" />
          </Reveal>

          {/* Featured post (first) */}
          <Reveal className="mb-8">
            <div className="group grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden border border-transparent
              hover:border-forest/25 hover:shadow-[0_8px_40px_rgba(27,27,27,.1)] transition-all duration-300">
              <div className="relative flex items-center justify-center min-h-[260px]"
                style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B,#1B1B1B)" }}>
                <span className="text-[5rem] opacity-20 select-none">{POST_ICONS[0]}</span>
                <div className="absolute top-5 left-5">
                  <span className="inline-block px-3 py-1 rounded-full text-[0.6rem] font-bold uppercase tracking-[0.1em] text-white"
                    style={{ background: CAT_COLORS[c.posts[0].cat] || "#1B1B1B" }}>
                    {c.posts[0].cat}
                  </span>
                </div>
              </div>
              <div className="p-8 lg:p-10 flex flex-col justify-center" style={{ background: "#F7F7F7" }}>
                <h3 className={clsx(serif, "font-semibold text-deep mb-4 leading-snug",
                  isAm ? "text-[1rem]" : "text-[1.2rem]")}>{c.posts[0].title}</h3>
                <p className={clsx(body, "text-deep/62 leading-relaxed mb-6",
                  isAm ? "text-[0.84rem]" : "text-[0.88rem]")}>{c.posts[0].excerpt}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={clsx(body, "text-forest font-medium", isAm ? "text-[0.75rem]" : "text-[0.72rem]")}>{c.posts[0].author}</p>
                    <p className="font-sans text-deep/40 text-[0.65rem]">{c.posts[0].date}</p>
                  </div>
                  <button className={clsx("inline-flex items-center gap-1.5 text-forest font-semibold",
                    "group-hover:gap-2.5 transition-all duration-200",
                    isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.1em]")}>
                    {c.readMore}<ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Grid of remaining posts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {c.posts.slice(1).map((post, i) => (
              <Reveal key={i} delay={i * 0.07} direction="up">
                <div className="group flex flex-col h-full p-7 rounded-2xl border border-transparent
                  hover:border-forest/25 hover:shadow-[0_4px_24px_rgba(27,27,27,.08)] transition-all duration-300"
                  style={{ background: "#F7F7F7" }}>
                  <div className="flex items-start justify-between mb-5">
                    <span className="text-2xl opacity-60">{POST_ICONS[i + 1]}</span>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[0.55rem] font-bold uppercase tracking-[0.08em] text-white"
                      style={{ background: CAT_COLORS[post.cat] || "#1B1B1B" }}>
                      {post.cat}
                    </span>
                  </div>
                  <h3 className={clsx(serif, "font-semibold text-deep mb-3 leading-snug flex-1",
                    isAm ? "text-[0.9rem]" : "text-[0.98rem]")}>{post.title}</h3>
                  <p className={clsx(body, "text-deep/58 leading-relaxed mb-5",
                    isAm ? "text-[0.8rem]" : "text-[0.82rem]")}>{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-forest/10">
                    <p className="font-sans text-deep/40 text-[0.62rem]">{post.author} · {post.date}</p>
                    <button className="inline-flex items-center gap-1 text-forest group-hover:gap-2 transition-all">
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3} className="text-center mt-12">
            <button className={clsx("inline-flex items-center gap-2 px-8 py-3 rounded-full border border-forest/30 text-forest",
              "hover:bg-forest hover:text-mist hover:border-forest transition-all duration-200",
              isAm ? "font-ethiopic text-[0.82rem]" : "font-sans text-[0.72rem] uppercase tracking-[0.1em]")}>
              {c.viewAll}<ArrowRight size={16} />
            </button>
          </Reveal>
        </div>
      </section>

      {/* ── SPIRITUAL TEACHINGS ── */}
      <section className="py-24 px-8" style={{ background: "linear-gradient(180deg,#1B1B1B,#1B1B1B)" }}>
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-14">
            <h2 className={clsx(serif, "font-semibold text-mist text-[clamp(1.6rem,2.8vw,2.2rem)] mb-3")}>{c.teachingsTitle}</h2>
            <div className="w-12 h-[2px] bg-gradient-to-r from-gold to-transparent mx-auto rounded-full" />
          </Reveal>
          <div className="space-y-4">
            {c.teachings.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="flex items-center gap-4 p-6 rounded-xl border border-sage/12
                  hover:border-sage/30 hover:bg-sage/[0.04] transition-all duration-250 group cursor-pointer"
                  style={{ background: "rgba(11,43,38,0.4)" }}>
                  <div className="w-9 h-9 rounded-full bg-sage/10 flex items-center justify-center flex-shrink-0 group-hover:bg-sage/20 transition-colors">
                    <BookOpen size={15} className="text-sage" />
                  </div>
                  <p className={clsx(serif, "font-semibold text-mist flex-1 leading-snug",
                    isAm ? "text-[0.92rem]" : "text-[0.98rem]")}>{t.title}</p>
                  <ArrowRight size={16} className="text-sage/40 group-hover:text-sage group-hover:translate-x-1 transition-all flex-shrink-0" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
