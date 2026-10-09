"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Reveal, StatChip } from "@/components/PageComponents";
import clsx from "clsx";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface Stat {
  val: string;
  label: string;
}

interface Content {
  heroTag: string;
  heroTitle: string;
  heroSub: string;
  freeTitle: string;
  paidTitle: string;
  readerTitle: string;
  searchPlaceholder: string;
  categories: string[];
  stats: Stat[];
  accessBtn: string;
  registerNote: string;
  previewBtn: string;
  downloadBtn: string;
  buyBtn: string;
  readerNote: string;
  readMore: string;
}

interface BookItem {
  _id: string;
  title: string;
  author?: string;
  description?: string;
  thumbnail?: string;
  pdfUrl?: string;
  category?: string;
  price?: number;
  isFree?: boolean;
  createdAt?: string;
}

const categoryKeys = ["all", "manuscript", "book", "audio", "journal"];
const iconMap: Record<string, string> = {
  manuscript: "📜",
  book: "📖",
  audio: "🎵",
  journal: "📋",
  default: "📘",
};

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

const matchesCategory = (book: BookItem, activeCat: number) => {
  if (activeCat === 0) return true;
  const category = (book.category || "").toLowerCase();
  const key = categoryKeys[activeCat];
  if (key === "manuscript") return category.includes("manuscript");
  if (key === "book") return category.includes("book");
  if (key === "audio") return category.includes("audio");
  if (key === "journal") return category.includes("journal");
  return category.includes(key);
};

export default function LibraryClient({ locale, c }: { locale: string; c: Content }) {
  const isAm = locale === "am";
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState(0);
  const [books, setBooks] = useState<BookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    const loadBooks = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_URL}/books`, {
          signal: controller.signal,
        });
        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Could not load library items.");
        }

        setBooks(result.data || []);
      } catch (error: any) {
        if (error.name === "AbortError") return;
        setFetchError(error.message || "Unable to load library.");
      } finally {
        setLoading(false);
      }
    };

    loadBooks();
    return () => controller.abort();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const normalizedQuery = query.trim().toLowerCase();
      const titleMatch = book.title.toLowerCase().includes(normalizedQuery);
      const authorMatch = book.author?.toLowerCase().includes(normalizedQuery);
      const descMatch = book.description?.toLowerCase().includes(normalizedQuery);
      return (
        matchesCategory(book, activeCat) &&
        (!normalizedQuery || titleMatch || authorMatch || descMatch)
      );
    });
  }, [books, query, activeCat]);

  const freeResources = filteredBooks.filter((book) => book.isFree ?? book.price === 0);
  const paidResources = filteredBooks.filter((book) => !(book.isFree ?? book.price === 0));

  const priceLabel = (book: BookItem) => {
    if (book.isFree ?? book.price === 0) {
      return isAm ? "ነፃ" : "Free";
    }
    return book.price ? `$${book.price.toFixed(2)}` : isAm ? "ከፍ" : "Paid";
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-14 text-slate-200">
        Loading library resources...
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-14 text-rose-300">
        {fetchError}
      </div>
    );
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1600&auto=format&fit=crop')` }} />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.84)_0%,rgba(7,12,9,0.58)_42%,rgba(7,12,9,0.82)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 md:pb-16 md:pt-32">
          <p className={clsx("text-[#d6ff00]", isAm ? "font-ethiopic text-[0.82rem]" : "text-xs uppercase tracking-[0.28em]")}>{c.heroTag}</p>
          <h1 className={clsx("mt-3 text-[#FFFDEE]", isAm ? "font-ethiopic text-4xl leading-[1.35]" : "text-4xl font-bold md:text-5xl")}>{c.heroTitle}</h1>
          <p className={clsx("mt-4 max-w-3xl text-white", isAm ? "font-ethiopic text-[0.95rem] leading-[1.85]" : "text-sm leading-relaxed md:text-base")}>{c.heroSub}</p>

          <div className="mt-10 max-w-[560px]" style={{ position: "relative" }}>
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 opacity-40 text-lg">🔍</span>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={c.searchPlaceholder}
              className={clsx("w-full rounded-2xl border border-white/10 bg-[#111]/80 px-4 py-4 text-sm text-white outline-none transition focus:border-[#d6ff00]/50", isAm ? "font-ethiopic" : "font-sans")}
              style={{ paddingLeft: "3rem" }}
            />
          </div>
        </div>
      </section>

      <div className="bg-[linear-gradient(180deg,rgba(247,247,247,.94),rgba(227,239,38,.08))] border-b border-white/10 px-4 py-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {c.stats.map((s, idx) => (
            <StatChip key={idx} val={s.val} label={s.label} />
          ))}
        </div>
      </div>

      <section className="bg-[linear-gradient(180deg,rgba(247,247,247,.94),rgba(227,239,38,.08))] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className={clsx("font-serif font-semibold mb-6", isAm && "font-ethiopic")} style={{ fontSize: "clamp(1.4rem,2.8vw,2rem)", color: "#1B1B1B" }}>{c.freeTitle}</h2>
          </Reveal>

          <Reveal>
            <div className="mb-8 flex flex-wrap gap-3">
              {c.categories.map((cat, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveCat(i)}
                  className={clsx(
                    "rounded-full border px-5 py-2 text-sm transition",
                    activeCat === i ? "border-[#A6FF4D] bg-[#D6FF0055] text-[#1B1B1B]" : "border-white/20 bg-transparent text-slate-700"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {freeResources.length > 0 ? freeResources.map((book, i) => (
              <Reveal key={book._id} delay={i * 0.04}>
                <article className="group rounded-3xl border border-white/10 bg-[#1b1b1b]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d6ff00]/20">
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#d6ff00]/10 text-2xl">{iconMap[(book.category || "").toLowerCase()] || iconMap.default}</div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#d6ff00]/90">{book.category || "Book"}</p>
                      <h3 className="mt-3 text-xl font-semibold text-white">{book.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{book.author || book.description || ""}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-2xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-200">{priceLabel(book)}</span>
                    <Link href={`/${locale}/library/book/${slugify(book.title)}`} className="rounded-2xl bg-[#d6ff00] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#111] transition hover:bg-[#c4eb00]">
                      {c.readMore}
                    </Link>
                  </div>
                </article>
              </Reveal>
            )) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-[#111]/90 p-8 text-slate-300">
                No free library items match your search.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,rgba(247,247,247,.94),rgba(227,239,38,.08))] px-4 py-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className={clsx("font-serif font-semibold mb-8", isAm && "font-ethiopic")} style={{ fontSize: "clamp(1.4rem,2.8vw,2rem)", color: "#1B1B1B" }}>{c.paidTitle}</h2>
          </Reveal>

          <div className="grid gap-6 lg:grid-cols-2">
            {paidResources.length > 0 ? paidResources.map((book, i) => (
              <Reveal key={book._id} delay={i * 0.05}>
                <article className="group rounded-3xl border border-white/10 bg-[#1b1b1b]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-[#d6ff00]/20">
                  <div className="flex items-start gap-4">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-[#d6ff00]/10 text-2xl">{iconMap[(book.category || "").toLowerCase()] || iconMap.default}</div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#d6ff00]/90">{book.category || "Book"}</p>
                      <h3 className="mt-3 text-xl font-semibold text-white">{book.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{book.author || book.description || ""}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-2xl bg-white/5 px-3 py-2 text-xs uppercase tracking-[0.14em] text-slate-200">{priceLabel(book)}</span>
                    <Link href={`/${locale}/library/book/${slugify(book.title)}`} className="rounded-2xl bg-[#f8f8f8] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[#111] transition hover:bg-[#e7f0c2]">
                      {c.readMore}
                    </Link>
                  </div>
                </article>
              </Reveal>
            )) : (
              <div className="col-span-full rounded-3xl border border-white/10 bg-[#111]/90 p-8 text-slate-300">
                No premium library items match your search.
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[linear-gradient(180deg,rgba(247,247,247,.94),rgba(227,239,38,.08))] px-4 py-16 border-t border-white/10">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <h2 className={clsx("font-serif font-semibold mb-6 text-center", isAm && "font-ethiopic")} style={{ fontSize: "clamp(1.4rem,2.8vw,2rem)", color: "#1B1B1B" }}>{c.readerTitle}</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-white/10 bg-[#1b1b1b]/90 p-10 text-center">
              <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-[#d6ff00]/10 text-4xl">📄</div>
              <p className={clsx("mx-auto max-w-2xl text-sm leading-7 text-slate-300", isAm && "font-ethiopic")}>{c.readerNote}</p>
              <button className="mt-8 rounded-full bg-[#d6ff00] px-8 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#c4eb00]">
                {c.previewBtn}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
