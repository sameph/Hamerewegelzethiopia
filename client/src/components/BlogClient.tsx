"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/PageComponents";
import clsx from "clsx";

interface Post {
  slug: string;
  title: string;
  cat: string;
  date: string;
  readMin: string;
  excerpt: string;
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

const CAT_COLORS: Record<string, string> = {
  News: "#D6FF00",
  ዜና: "#D6FF00",
  Teaching: "#A6FF4D",
  ትምህርት: "#A6FF4D",
  Article: "#D6FF00",
  ጽሑፍ: "#D6FF00",
};

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
  const color = CAT_COLORS[post.cat] || "#A6FF4D";
  const excerptText = (() => {
    const text = (post.excerpt || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    if (!text) return "";
    if (text.length <= 120) return text;
    return `${text.slice(0, 120).trimEnd()}…`;
  })();

  return (
    <Reveal delay={delay}>
      <article
        style={{
          background:
            "linear-gradient(180deg, rgba(214,255,0,.14), rgba(166,255,77,.08))",
          borderRadius: 16,
          overflow: "hidden",
          border: "1.5px solid rgba(166,255,77,.14)",
          transition: "all .3s",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          boxShadow: "0 18px 40px rgba(27,27,27,.08)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(166,255,77,.32)";
          (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 12px 40px rgba(27,27,27,.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(166,255,77,.14)";
          (e.currentTarget as HTMLElement).style.transform = "none";
          (e.currentTarget as HTMLElement).style.boxShadow =
            "0 18px 40px rgba(27,27,27,.08)";
        }}
      >
        {/* Color band */}
        <div style={{ height: 4, background: color }} />
        <div
          style={{
            padding: "1.6rem",
            display: "flex",
            flexDirection: "column",
            flex: 1,
          }}
        >
          {/* Meta */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: ".6rem",
              marginBottom: ".9rem",
            }}
          >
            <span
              style={{
                fontSize: ".55rem",
                fontWeight: 700,
                letterSpacing: ".1em",
                textTransform: "uppercase",
                padding: ".18rem .55rem",
                borderRadius: 20,
                background: color,
                color: "#1B1B1B",
              }}
            >
              {post.cat}
            </span>
            <span
              className="font-sans"
              style={{ fontSize: ".62rem", color: "rgba(51,51,51,.55)" }}
            >
              {post.date}
            </span>
            <span
              className="font-sans"
              style={{
                fontSize: ".62rem",
                color: "rgba(51,51,51,.48)",
                marginLeft: "auto",
              }}
            >
              {post.readMin} {minRead}
            </span>
          </div>
          {/* Title */}
          <h3
            className={clsx(
              "font-serif font-semibold",
              isAm && "font-ethiopic"
            )}
            style={{
              fontSize: "1.08rem",
              color: "#1B1B1B",
              lineHeight: isAm ? 1.45 : 1.2,
              marginBottom: ".75rem",
              flex: 1,
            }}
          >
            {post.title}
          </h3>
          {/* Excerpt */}
          <p
            className={clsx(
              isAm ? "font-ethiopic text-[.8rem]" : "font-sans text-[.83rem]"
            )}
            style={{
              color: "rgba(51,51,51,.72)",
              lineHeight: 1.75,
              marginBottom: "1.2rem",
              display: "-webkit-box",
              WebkitLineClamp: 3,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {excerptText}
          </p>
          {/* Read more */}
          <Link
            href={`/${locale}/blog/${post.slug}`}
            className={clsx(
              isAm
                ? "font-ethiopic text-[.78rem]"
                : "font-sans text-[.7rem] uppercase tracking-[.1em]"
            )}
            style={{
              color: "#1B1B1B",
              display: "inline-flex",
              alignItems: "center",
              gap: ".4rem",
              paddingTop: ".8rem",
              borderTop: "1px solid rgba(166,255,77,.16)",
              transition: "gap .2s",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.gap = ".7rem")}
            onMouseLeave={(e) => (e.currentTarget.style.gap = ".4rem")}
          >
            {readMore}
            <ArrowRight size={14} />
          </Link>
        </div>
      </article>
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

      {/* Tab bar */}
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

      {/* Posts grid */}
      <section style={{ padding: "4rem 2.5rem 6rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))",
              gap: "1.4rem",
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
        </div>
      </section>
    </div>
  );
}
