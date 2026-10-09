"use client";

import { useState, useEffect } from "react";
import { Search, BookOpen, Lock, FileText, ArrowRight, Book as BookIcon } from "lucide-react";
import clsx from "clsx";
import Reveal from "@/components/Reveal";
import PDFViewerModal from "@/components/lms/PDFViewerModal";

const RES_ICONS = ["📜","📖","🎵","📋","📜","📖"];
const RES_TYPES = ["Manuscript","Book","Audio","Journal","Manuscript","Book"];

interface BookData {
  _id: string;
  title: string;
  author?: string;
  description?: string;
  pdfUrl?: string;
  category?: string;
}

interface C {
  heroTag: string; heroTitle: string; heroP: string;
  stats: { val: string; label: string }[];
  freeTitle: string; freeDesc: string;
  paidTitle: string; paidDesc: string;
  pdfTitle: string;  pdfDesc: string;
  resources: { title: string; meta: string }[];
  searchPlaceholder: string; accessBtn: string; registerNote: string;
  catAll: string; catManuscripts: string; catBooks: string; catAudio: string; catJournals: string;
}

export default function LibraryClient({ locale, c }: { locale: string; c: C }) {
  const isAm = locale === "am";
  const [query, setQuery] = useState("");
  const [cat, setCat]     = useState(0);
  const [books, setBooks] = useState<BookData[]>([]);
  const [viewedPdf, setViewedPdf] = useState<{ url: string; name: string } | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
        const res = await fetch(`${API_URL}/books`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.data);
        }
      } catch (err) {
        console.error("Failed to load library books", err);
      }
    };
    fetchBooks();
  }, []);

  const serif = clsx("font-serif", isAm && "font-ethiopic");
  const body  = isAm ? "font-ethiopic" : "font-sans";
  const cats  = [c.catAll, c.catManuscripts, c.catBooks, c.catAudio, c.catJournals];

  const ACCESS_FEATURES = [
    { Icon: BookOpen, title: c.freeTitle, desc: c.freeDesc, bg: "#F7F7F7", border: "#1B1B1B" },
    { Icon: Lock,     title: c.paidTitle, desc: c.paidDesc, bg: "#F7F7F7", border: "#1B1B1B" },
    { Icon: FileText, title: c.pdfTitle,  desc: c.pdfDesc,  bg: "#F7F7F7", border: "#1B1B1B" },
  ];

  return (
    <>
      {/* ── HERO + SEARCH ── */}
      <section className="relative min-h-[60vh] flex items-end pb-16 px-8 overflow-hidden"
        style={{ background: "linear-gradient(135deg,#1B1B1B,#1B1B1B 40%,#1B1B1B 80%,#1B1B1B)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(rgba(0,208,132,.06) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="relative z-10 w-full max-w-3xl">
          <Reveal>
            <span className={clsx("inline-flex items-center gap-3 text-gold mb-5",
              isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.62rem] uppercase tracking-[0.28em]")}>
              <span className="block w-8 h-px bg-gold flex-shrink-0" />{c.heroTag}
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className={clsx("font-serif font-semibold text-white mb-4 leading-[1.08]",
              "text-[clamp(2.2rem,5vw,3.8rem)]", isAm && "font-ethiopic leading-[1.4]")}>{c.heroTitle}</h1>
          </Reveal>
          <Reveal delay={0.18}>
            <p className={clsx("text-mist/58 max-w-[50ch] leading-[1.85] mb-8",
              isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.96rem]")}>{c.heroP}</p>
          </Reveal>
          {/* Search */}
          <Reveal delay={0.28}>
            <div className="relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-sage/50 pointer-events-none" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder={c.searchPlaceholder}
                className={clsx("w-full pl-11 pr-5 py-4 rounded-xl outline-none transition-all",
                  "bg-white/8 border border-sage/20 focus:border-sage/55 focus:bg-white/10",
                  "text-mist placeholder:text-mist/35",
                  isAm ? "font-ethiopic text-[0.88rem]" : "font-sans text-[0.9rem]")} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS BAND ── */}
      <section style={{ background: "#1B1B1B", borderTop: "1px solid rgba(0,208,132,.08)", borderBottom: "1px solid rgba(0,208,132,.08)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4">
          {c.stats.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div className="py-8 px-4 text-center border-r border-sage/8 last:border-r-0">
                <div className="font-serif text-[2.4rem] font-semibold text-gold leading-none mb-2">{s.val}</div>
                <p className={clsx(body, "text-mist/42", isAm ? "text-[0.7rem]" : "text-[0.6rem] uppercase tracking-[0.16em]")}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── ACCESS FEATURES ── */}
      <section className="py-28 px-8" style={{ background: "#F7F7F7" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {ACCESS_FEATURES.map(({ Icon, title, desc }, i) => (
              <Reveal key={i} delay={i * 0.1} direction="up">
                <div className="group h-full p-8 rounded-2xl border-2 transition-all duration-300 hover:-translate-y-1"
                  style={{ background: ACCESS_FEATURES[i].bg, borderColor: `${ACCESS_FEATURES[i].border}20` }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = `${ACCESS_FEATURES[i].border}50`)}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = `${ACCESS_FEATURES[i].border}20`)}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors"
                    style={{ background: `${ACCESS_FEATURES[i].border}15` }}>
                    <Icon size={22} strokeWidth={1.6} style={{ color: ACCESS_FEATURES[i].border }} />
                  </div>
                  <h3 className={clsx(serif, "font-semibold text-deep mb-3", isAm ? "text-[0.98rem]" : "text-[1.1rem]")}>{title}</h3>
                  <div className="w-8 h-[1.5px] bg-gold/50 rounded-full mb-4" />
                  <p className={clsx(body, "text-deep/62 leading-relaxed", isAm ? "text-[0.82rem]" : "text-[0.84rem]")}>{desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Category filters */}
          <Reveal className="mb-8">
            <div className="flex gap-2 flex-wrap">
              {cats.map((cat_label, i) => (
                <button key={i} onClick={() => setCat(i)}
                  className={clsx("px-4 py-1.5 rounded-full border transition-all duration-200",
                    isAm ? "font-ethiopic text-[0.74rem]" : "font-sans text-[0.65rem] uppercase tracking-[0.1em]",
                    cat === i
                      ? "border-forest bg-forest/10 text-forest"
                      : "border-forest/20 text-deep/50 hover:border-forest/40 hover:text-deep/70")}>
                  {cat_label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Resource grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
            {books.length > 0 ? (
              books.filter(b => b.title.toLowerCase().includes(query.toLowerCase())).map((b, i) => (
                <Reveal key={b._id} delay={i * 0.06} direction="up">
                  <div 
                    onClick={() => {
                       if (b.pdfUrl) setViewedPdf({ url: b.pdfUrl, name: b.title });
                    }}
                    className="group flex items-start gap-4 p-6 rounded-xl border border-transparent
                    hover:border-forest/25 hover:shadow-[0_4px_20px_rgba(27,27,27,.08)] transition-all duration-250 cursor-pointer"
                    style={{ background: "#F7F7F7" }}
                  >
                    <span className="text-2xl opacity-65 flex-shrink-0 text-forest"><BookIcon /></span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-forest/10 text-forest border border-forest/15
                        font-sans text-[0.5rem] uppercase tracking-[0.08em]">
                        {b.category || "Book"}
                      </span>
                      <h4 className={clsx(serif, "font-semibold text-deep mb-1 leading-snug",
                        isAm ? "text-[0.88rem]" : "text-[0.92rem]")}>{b.title}</h4>
                      <p className="font-sans text-deep/45 text-[0.65rem]">{b.author || "Unknown Author"}</p>
                    </div>
                  </div>
                </Reveal>
              ))
            ) : (
              c.resources.filter(r => r.title.toLowerCase().includes(query.toLowerCase())).map((r, i) => (
                <Reveal key={i} delay={i * 0.06} direction="up">
                  <div className="group flex items-start gap-4 p-6 rounded-xl border border-transparent
                    hover:border-forest/25 hover:shadow-[0_4px_20px_rgba(27,27,27,.08)] transition-all duration-250 cursor-pointer"
                    style={{ background: "#F7F7F7" }}>
                    <span className="text-2xl opacity-65 flex-shrink-0">{RES_ICONS[i % RES_ICONS.length]}</span>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block mb-2 px-2.5 py-0.5 rounded-full bg-forest/10 text-forest border border-forest/15
                        font-sans text-[0.5rem] uppercase tracking-[0.08em]">
                        {RES_TYPES[i % RES_TYPES.length]}
                      </span>
                      <h4 className={clsx(serif, "font-semibold text-deep mb-1 leading-snug",
                        isAm ? "text-[0.88rem]" : "text-[0.92rem]")}>{r.title}</h4>
                      <p className="font-sans text-deep/45 text-[0.65rem]">{r.meta}</p>
                    </div>
                  </div>
                </Reveal>
              ))
            )}
          </div>

          <Reveal className="text-center">
            <button className={clsx("inline-flex items-center gap-2 px-8 py-3.5 rounded-full font-semibold",
              "bg-forest text-mist hover:bg-mid hover:-translate-y-0.5",
              "shadow-[0_4px_24px_rgba(27,27,27,.3)] transition-all duration-200",
              isAm ? "font-ethiopic text-[0.9rem]" : "font-sans text-[0.8rem] uppercase tracking-[0.1em]")}>
              {c.accessBtn}<ArrowRight size={15} />
            </button>
            <p className={clsx("mt-3", isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.65rem]", "text-deep/35")}>
              {c.registerNote}
            </p>
          </Reveal>
        </div>
      </section>
      {viewedPdf && (
        <PDFViewerModal 
          url={viewedPdf.url} 
          name={viewedPdf.name} 
          onClose={() => setViewedPdf(null)} 
        />
      )}
    </>
  );
}
