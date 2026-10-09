"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Clock, Tag } from "lucide-react";
import { Reveal } from "@/components/PageComponents";
import clsx from "clsx";

interface Post {
  slug: string;
  title: string;
  cat: string;
  date: string;
  readMin: string;
  excerpt: string;
  thumbnail?: string;
}
interface Content {
  heroTag: string;
  heroTitle: string;
  heroSub: string;
  newsTitle: string;
  articlesTitle: string;
  teachingsTitle: string;
  readMore: string;
  minRead: string;
  posts: Post[];
}

const CAT_COLORS: Record<string, { bg: string; text: string }> = {
  News:     { bg: "#D6FF00", text: "#1B1B1B" },
  ዜና:      { bg: "#D6FF00", text: "#1B1B1B" },
  Teaching: { bg: "#A6FF4D", text: "#1B1B1B" },
  ትምህርት:  { bg: "#A6FF4D", text: "#1B1B1B" },
  Article:  { bg: "#63d6ff", text: "#0a1f14" },
  ጽሑፍ:    { bg: "#63d6ff", text: "#0a1f14" },
};

const FALLBACK_THUMB =
  "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=800&auto=format&fit=crop";

function PostCard({
  post,
  locale,
  readMore,
  minRead,
  isAm,
  delay = 0,
}: {
  post: Post;
  locale: string;
  readMore: string;
  minRead: string;
  isAm: boolean;
  delay?: number;
}) {
  const color = CAT_COLORS[post.cat] ?? { bg: "#A6FF4D", text: "#1B1B1B" };
  const thumb = post.thumbnail || FALLBACK_THUMB;

  const excerptText = (() => {
    const text = (post.excerpt || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    if (text.length <= 110) return text;
    return `${text.slice(0, 110).trimEnd()}…`;
  })();

  return (
    <Reveal delay={delay}>
      <Link
        href={`/${locale}/blog/${post.slug}`}
        className="group block h-full rounded-2xl overflow-hidden border border-[rgba(166,255,77,.14)] bg-white shadow-[0_8px_32px_rgba(0,0,0,.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,.12)] hover:-translate-y-1 transition-all duration-300"
      >
        {/* Thumbnail */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
          <Image
            src={thumb}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            unoptimized={thumb.startsWith("http")}
          />
          {/* Category badge overlaid on image */}
          <span
            className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm"
            style={{ background: color.bg, color: color.text }}
          >
            {post.cat}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-col flex-1 p-5">
          {/* Date + read time */}
          <div className="flex items-center gap-3 mb-3">
            <span
              className="font-sans text-[0.62rem] text-slate-400"
            >
              {post.date}
            </span>
            <span className="w-1 h-1 rounded-full bg-slate-300 block" />
            <span className="flex items-center gap-1 font-sans text-[0.62rem] text-slate-400">
              <Clock size={11} />
              {post.readMin}&nbsp;{minRead}
            </span>
          </div>

          {/* Title */}
          <h3
            className={clsx(
              "font-bold leading-snug text-[#163325] group-hover:text-[#1e6b3b] transition-colors mb-2",
              isAm ? "font-ethiopic text-[1rem]" : "font-serif text-[1.05rem]"
            )}
          >
            {post.title}
          </h3>

          {/* Excerpt */}
          {excerptText && (
            <p
              className={clsx(
                "text-slate-500 leading-relaxed flex-1",
                isAm ? "font-ethiopic text-[0.8rem]" : "font-sans text-[0.82rem]"
              )}
            >
              {excerptText}
            </p>
          )}

          {/* Read more */}
          <div
            className={clsx(
              "mt-4 pt-4 border-t border-[rgba(166,255,77,.2)] flex items-center gap-1.5 font-semibold text-[#1e6b3b] group-hover:gap-2.5 transition-all",
              isAm
                ? "font-ethiopic text-[0.78rem]"
                : "font-sans text-[0.7rem] uppercase tracking-[.1em]"
            )}
          >
            {readMore}
            <ArrowRight size={13} />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

export default function BlogClient({
  locale,
  c,
}: {
  locale: string;
  c: Content;
}) {
  const isAm = locale === "am";
  const [activeTab, setActiveTab] = useState<
    "all" | "news" | "article" | "teaching"
  >("all");
  const heroImage =
    "https://images.unsplash.com/photo-1507692049790-de58290a4334?q=80&w=1600&auto=format&fit=crop";
  const heroCardImage =
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1400&auto=format&fit=crop";

  const tabs = [
    { key: "all", label: isAm ? "ሁሉም" : "All" },
    { key: "news", label: c.newsTitle },
    { key: "article", label: c.articlesTitle },
    { key: "teaching", label: c.teachingsTitle },
  ] as const;

  const filtered =
    activeTab === "all"
      ? c.posts
      : c.posts.filter((p) => {
          const cat = p.cat.toLowerCase();
          if (activeTab === "news") return cat === "news" || cat === "ዜና";
          if (activeTab === "article")
            return cat === "article" || cat === "ጽሑፍ";
          if (activeTab === "teaching")
            return cat === "teaching" || cat === "ትምህርት";
          return true;
        });

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(247,247,247,.94), rgba(227,239,38,.08))",
      }}
    >
      {/* ── HERO ── */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.82)_0%,rgba(7,12,9,0.52)_42%,rgba(7,12,9,0.78)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-[linear-gradient(180deg,transparent,rgba(8,13,10,0.68))]" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-10 pt-24 md:pt-28 pb-16 md:pb-20">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
            <Reveal>
              <p
                className={clsx(
                  "mb-4 text-[#d6ff00]",
                  isAm
                    ? "font-ethiopic text-[0.82rem]"
                    : "font-sans text-[0.72rem] uppercase tracking-[0.2em]"
                )}
              >
                Home • Blog
              </p>

              <h1
                className={clsx(
                  "font-bold leading-[1.15] text-white",
                  isAm
                    ? "font-ethiopic text-[clamp(1.5rem,4vw,2.8rem)]"
                    : "font-serif text-[clamp(1.8rem,4vw,3.3rem)]"
                )}
              >
                {c.heroTitle}
              </h1>

              <p
                className={clsx(
                  "mt-6 max-w-xl text-white",
                  isAm
                    ? "font-ethiopic text-[0.94rem] leading-[1.9]"
                    : "font-sans text-[0.95rem] leading-[1.9]"
                )}
              >
                {c.heroSub}
              </p>

              <Link
                href="#blog-content"
                className={clsx(
                  "mt-8 inline-flex items-center gap-2 text-white hover:text-[#d6ff00] hover:gap-3 transition-all",
                  isAm
                    ? "font-ethiopic text-[0.92rem]"
                    : "font-sans text-[0.78rem] uppercase tracking-[0.14em] font-semibold"
                )}
              >
                {isAm ? "ተጨማሪ ይመልከቱ" : "Learn More"}
                <ArrowRight size={14} />
              </Link>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="relative h-[300px] sm:h-[360px] lg:h-[400px]">
                <div className="absolute -right-4 -top-4 md:-right-6 md:-top-6 w-[55%] h-[92%] bg-[linear-gradient(180deg,#d6ff00_0%,#a6ff4d_45%,#79b93f_100%)]" />
                <div className="absolute inset-x-0 top-7 sm:top-10 h-[78%] home-glass-panel shadow-[0_24px_55px_rgba(39,69,20,0.25)] overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url('${heroCardImage}')` }}
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(255,255,255,0.16),rgba(15,27,20,0.2))]" />
                  <div className="absolute left-4 bottom-4 rounded-full px-3 py-1 text-[11px] tracking-[0.12em] uppercase bg-white/75 text-[#1e2012] font-semibold">
                    {c.heroTag}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── TAB BAR ── */}
      <div
        id="blog-content"
        style={{
          background:
            "linear-gradient(90deg, rgba(203,234,0,.2), rgba(227,239,38,.14))",
          padding: "1.8rem 2.5rem",
          borderBottom: "1px solid rgba(166,255,77,.14)",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            display: "flex",
            gap: ".6rem",
            flexWrap: "wrap",
          }}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={clsx(
                isAm
                  ? "font-ethiopic text-[.8rem]"
                  : "font-sans text-[.7rem] uppercase tracking-[.1em]"
              )}
              style={{
                padding: ".45rem 1.2rem",
                borderRadius: 50,
                cursor: "pointer",
                transition: "all .2s",
                border: `1px solid ${
                  activeTab === tab.key ? "#A6FF4D" : "rgba(166,255,77,.25)"
                }`,
                background:
                  activeTab === tab.key
                    ? "linear-gradient(90deg,#D6FF00,#A6FF4D)"
                    : "transparent",
                color: "#000000",
                fontWeight: "bold",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── POSTS GRID ── */}
      <section style={{ padding: "4rem 2.5rem 6rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div className="py-24 text-center text-slate-400 text-sm">
              No posts found in this category.
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
                gap: "1.5rem",
              }}
            >
              {filtered.map((post, i) => (
                <PostCard
                  key={i}
                  post={post}
                  locale={locale}
                  readMore={c.readMore}
                  minRead={c.minRead}
                  isAm={isAm}
                  delay={i * 0.06}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
