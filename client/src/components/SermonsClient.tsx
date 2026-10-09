"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Reveal } from "@/components/PageComponents";
import clsx from "clsx";

interface Sermon {
  _id: string;
  title: string;
  spkr: string;
  series: string;
  category: string;
  type: "video" | "audio";
  youtubeUrl: string;
  youtubeId: string;
  dur: string;
  description: string;
  thumbnailUrl: string;
  language: string;
  date: string;
}
interface Content {
  heroTag: string;
  heroTitle: string;
  heroSub: string;
  videoTitle: string;
  audioTitle: string;
  featuredTitle: string;
  archiveTitle: string;
  archiveSub: string;
  archiveBtn: string;
  filters: string[];
  sermons: Sermon[];
  listen: string;
  watch: string;
  download: string;
  viewAll: string;
}

const CATEGORY_TABS = [
  { key: "all", en: "All", am: "ሁሉም" },
  { key: "worship", en: "Worship", am: "አምልኮ" },
  { key: "preaching", en: "Preaching", am: "ስብከት" },
  { key: "teaching", en: "Teaching", am: "ትምህርት" },
  { key: "song", en: "Song", am: "መዝሙር" },
  { key: "prayer", en: "Prayer", am: "ጸሎት" },
  { key: "testimony", en: "Testimony", am: "ምስክርነት" },
];

const GRID_PAGE_SIZE = 9;

type VideoMeta = { src: string; title: string; program: string };

function VideoCard({ meta, isAm }: { meta: VideoMeta; isAm: boolean }) {
  return (
    <div
      style={{
        borderRadius: 12,
        overflow: "hidden",
        background: "rgba(27,27,27,.62)",
        border: "1px solid rgba(214,255,0,.1)",
        transition: "all .3s",
        height: "100%",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform =
          "translateY(-3px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow =
          "0 10px 32px rgba(27,27,27,.35)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "none";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      <div
        style={{
          aspectRatio: "16/9",
          position: "relative",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <iframe
          src={meta.src}
          title={meta.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
        />
      </div>
      <div style={{ padding: ".9rem 1.1rem" }}>
        <h3
          className={clsx("font-serif font-semibold", isAm && "font-ethiopic")}
          style={{
            fontSize: ".85rem",
            color: "#F7F7F7",
            lineHeight: isAm ? 1.5 : 1.2,
            marginBottom: ".25rem",
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical" as const,
          }}
        >
          {meta.title}
        </h3>
        <p
          className={clsx(
            isAm ? "font-ethiopic text-[.65rem]" : "font-sans text-[.62rem]"
          )}
          style={{ color: "#D6FF00" }}
        >
          {meta.program}
        </p>
      </div>
    </div>
  );
}

function VideoPlaceholder({ isAm }: { isAm: boolean }) {
  return (
    <div
      style={{
        borderRadius: 12,
        border: "1.5px dashed rgba(27,27,27,.12)",
        background: "rgba(27,27,27,.02)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "16/9",
        gap: ".4rem",
      }}
    >
      <div style={{ fontSize: "1.6rem", opacity: 0.18 }}>📤</div>
      <p
        className="font-sans text-[.6rem]"
        style={{ color: "rgba(27,27,27,.22)" }}
      >
        {isAm ? "ቪዲዮ ያስገቡ" : "Upload video"}
      </p>
    </div>
  );
}

function AudioCard({
  sermon,
  download,
  isAm,
}: {
  sermon: Sermon;
  download: string;
  isAm: boolean;
}) {
  return (
    <Reveal>
      <div
        style={{
          background: "rgba(27,27,27,.6)",
          borderRadius: 12,
          border: "1px solid rgba(214,255,0,.1)",
          padding: "1.4rem 1.6rem",
          display: "flex",
          alignItems: "center",
          gap: "1.2rem",
          transition: "all .25s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(214,255,0,.28)";
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(7,102,83,.35)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.borderColor =
            "rgba(214,255,0,.1)";
          (e.currentTarget as HTMLDivElement).style.background =
            "rgba(27,27,27,.6)";
        }}
      >
        <button
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "linear-gradient(90deg,#A6FF4D,#D6FF00)",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "filter .2s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.filter = "brightness(1.04)")
          }
          onMouseLeave={(e) => (e.currentTarget.style.filter = "none")}
        >
          <span style={{ color: "#1B1B1B", fontSize: ".85rem", marginLeft: 2 }}>
            ▶
          </span>
        </button>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 3,
            flexShrink: 0,
          }}
        >
          {[10, 18, 12, 22, 15, 9, 20, 14, 8, 16].map((h, i) => (
            <div
              key={i}
              style={{
                width: 3,
                height: h,
                borderRadius: 2,
                background: "rgba(214,255,0,.35)",
              }}
            />
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            className={clsx(
              "font-serif font-semibold",
              isAm && "font-ethiopic"
            )}
            style={{
              fontSize: ".95rem",
              color: "#F7F7F7",
              lineHeight: isAm ? 1.5 : 1.2,
              marginBottom: ".25rem",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {sermon.title}
          </h3>
          <p
            className={clsx(
              isAm ? "font-ethiopic text-[.72rem]" : "font-sans text-[.7rem]"
            )}
            style={{ color: "#D6FF00" }}
          >
            {sermon.spkr}
          </p>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: ".4rem",
            flexShrink: 0,
          }}
        >
          <span
            className="font-sans"
            style={{ fontSize: ".62rem", color: "rgba(247,247,247,.42)" }}
          >
            {sermon.dur}
          </span>
          <button
            className={clsx(
              isAm
                ? "font-ethiopic text-[.68rem]"
                : "font-sans text-[.62rem] uppercase tracking-[.08em]"
            )}
            style={{
              color: "rgba(247,247,247,.58)",
              background: "transparent",
              border: "1px solid rgba(214,255,0,.18)",
              borderRadius: 6,
              padding: ".2rem .6rem",
              cursor: "pointer",
              transition: "all .2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#D6FF00";
              e.currentTarget.style.borderColor = "#D6FF00";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(247,247,247,.58)";
              e.currentTarget.style.borderColor = "rgba(214,255,0,.18)";
            }}
          >
            ↓ {download}
          </button>
        </div>
      </div>
    </Reveal>
  );
}

function EmptyCategory({ label, isAm }: { label: string; isAm: boolean }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "5rem 2rem",
        border: "1.5px dashed rgba(27,27,27,.18)",
        borderRadius: 20,
        background: "rgba(27,27,27,.03)",
      }}
    >
      <div style={{ fontSize: "3rem", marginBottom: "1.2rem", opacity: 0.3 }}>
        📤
      </div>
      <p
        className={clsx(
          isAm ? "font-ethiopic text-[.92rem]" : "font-sans text-[.9rem]"
        )}
        style={{ color: "rgba(27,27,27,.5)", marginBottom: ".5rem" }}
      >
        {isAm ? `${label} ይዘቶች በቅርብ ጊዜ ይጨምሩ` : `${label} content coming soon`}
      </p>
      <p
        className="font-sans text-[.72rem]"
        style={{ color: "rgba(27,27,27,.32)" }}
      >
        {isAm
          ? "ቪዲዮ ወይም ድምፅ ለመጨመር ወደ አስተዳዳሪ ፓነል ይሂዱ"
          : "Upload videos or audio from the admin panel"}
      </p>
    </div>
  );
}

export default function SermonsClient({
  locale,
  c,
}: {
  locale: string;
  c: Content;
}) {
  const isAm = locale === "am";
  const [activeCategory, setActiveCategory] = useState("all");
  const [videoPage, setVideoPage] = useState(0);
  const heroImage =
    "https://images.unsplash.com/photo-1438232992991-995b7058bbb3?q=80&w=1600&auto=format&fit=crop";
  const heroCardImage =
    "https://images.unsplash.com/photo-1504052434569-70ad5836ab65?q=80&w=1400&auto=format&fit=crop";

  // Reset page when switching category
  useEffect(() => {
    setVideoPage(0);
  }, [activeCategory]);

  const currentVideos = c.sermons
    .filter(
      (s) =>
        s.type === "video" &&
        (activeCategory === "all" || s.category === activeCategory)
    )
    .map((s) => ({
      src: s.youtubeId
        ? `https://www.youtube.com/embed/${s.youtubeId}`
        : s.youtubeUrl || "",
      title: s.title,
      program: s.spkr,
    }));
  const currentAudioSermons = c.sermons.filter(
    (s) =>
      s.type === "audio" &&
      (activeCategory === "all" || s.category === activeCategory)
  );
  const isEmpty =
    currentVideos.length === 0 && currentAudioSermons.length === 0;
  const activeTab =
    CATEGORY_TABS.find((t) => t.key === activeCategory) ?? CATEGORY_TABS[0];

  // Grid: everything after the featured video, paginated
  const gridSource = currentVideos.slice(1);
  const totalGridPages = Math.max(
    1,
    Math.ceil(gridSource.length / GRID_PAGE_SIZE)
  );
  const pageStart = videoPage * GRID_PAGE_SIZE;
  const pageVideos = gridSource.slice(pageStart, pageStart + GRID_PAGE_SIZE);
  // Always fill to 9 slots with nulls
  const gridSlots: (VideoMeta | null)[] = [
    ...pageVideos,
    ...Array(Math.max(0, GRID_PAGE_SIZE - pageVideos.length)).fill(null),
  ];

  return (
    <div
      style={{
        background:
          "linear-gradient(180deg, rgba(247,247,247,.94), rgba(227,239,38,.08))",
      }}
    >
      {/* Hero */}
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
                Home • Events
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
                href="#events-content"
                className={clsx(
                  "mt-8 inline-flex items-center gap-2 text-white hover:text-[#d6ff00] hover:gap-3 transition-all",
                  isAm
                    ? "font-ethiopic text-[0.92rem]"
                    : "font-sans text-[0.78rem] uppercase tracking-[0.14em] font-semibold"
                )}
              >
                {isAm ? "ተጨማሪ ይመልከቱ" : "Learn More"} <ArrowRight size={14} />
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

      {/* Category tabs */}
      <div
        id="events-content"
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
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={clsx(
                isAm
                  ? "font-ethiopic text-[.8rem]"
                  : "font-sans text-[.68rem] uppercase tracking-[.1em]"
              )}
              style={{
                padding: ".42rem 1.2rem",
                borderRadius: 50,
                cursor: "pointer",
                transition: "all .2s",
                fontWeight: "bold",
                border: `1px solid ${
                  activeCategory === tab.key ? "#A6FF4D" : "rgba(214,255,0,.22)"
                }`,
                background:
                  activeCategory === tab.key
                    ? "linear-gradient(90deg,#D6FF00,#A6FF4D)"
                    : "transparent",
                color: "#000000",
              }}
            >
              {isAm ? tab.am : tab.en}
            </button>
          ))}
        </div>
      </div>

      {/* Category content */}
      <section
        style={{
          background:
            "linear-gradient(180deg, rgba(247,247,247,.94), rgba(227,239,38,.08))",
          padding: "4rem 2.5rem 5rem",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          {isEmpty ? (
            <EmptyCategory
              label={isAm ? activeTab.am : activeTab.en}
              isAm={isAm}
            />
          ) : (
            <>
              {/* Featured video */}
              {currentVideos.length > 0 && (
                <>
                  <Reveal>
                    <h2
                      className={clsx(
                        "font-serif font-semibold mb-5",
                        isAm && "font-ethiopic"
                      )}
                      style={{
                        fontSize: "clamp(1.4rem,2.8vw,2rem)",
                        color: "#1B1B1B",
                      }}
                    >
                      {c.videoTitle}
                    </h2>
                  </Reveal>
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                      marginBottom: "2.5rem",
                      borderRadius: 24,
                      overflow: "hidden",
                      background: "#000",
                    }}
                  >
                    <iframe
                      src={currentVideos[0].src}
                      title={currentVideos[0].title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* 3×3 video grid */}
                  <div
                    style={{
                      marginBottom: ".6rem",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      flexWrap: "wrap",
                      gap: ".5rem",
                    }}
                  >
                    <p
                      className={clsx(
                        isAm
                          ? "font-ethiopic text-[.78rem]"
                          : "font-sans text-[.66rem] uppercase tracking-[.1em]"
                      )}
                      style={{ color: "rgba(27,27,27,.45)", fontWeight: 600 }}
                    >
                      {isAm ? "ሌሎች ቪዲዮዎች" : "More Videos"}
                      {gridSource.length > 0 && (
                        <span style={{ marginLeft: ".5rem", color: "#A6FF4D" }}>
                          ({gridSource.length})
                        </span>
                      )}
                    </p>
                    {totalGridPages > 1 && (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".4rem",
                        }}
                      >
                        <span
                          className="font-sans text-[.6rem]"
                          style={{ color: "rgba(27,27,27,.4)" }}
                        >
                          {isAm ? "ገጽ" : "Page"} {videoPage + 1} /{" "}
                          {totalGridPages}
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(3,1fr)",
                      gap: "1rem",
                      marginBottom: totalGridPages > 1 ? "1.2rem" : "0",
                    }}
                  >
                    {gridSlots.map((meta, i) =>
                      meta ? (
                        <VideoCard key={i} meta={meta} isAm={isAm} />
                      ) : (
                        <VideoPlaceholder key={i} isAm={isAm} />
                      )
                    )}
                  </div>

                  {/* Pagination */}
                  {totalGridPages > 1 && (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "1rem",
                        marginTop: "1.5rem",
                        marginBottom: "2rem",
                      }}
                    >
                      <button
                        onClick={() => setVideoPage((p) => Math.max(0, p - 1))}
                        disabled={videoPage === 0}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".4rem",
                          padding: ".5rem 1.1rem",
                          borderRadius: 50,
                          border: "1px solid rgba(27,27,27,.15)",
                          background:
                            videoPage === 0 ? "rgba(27,27,27,.04)" : "#fff",
                          cursor: videoPage === 0 ? "not-allowed" : "pointer",
                          color:
                            videoPage === 0 ? "rgba(27,27,27,.25)" : "#1B1B1B",
                          transition: "all .2s",
                          fontWeight: 600,
                          fontSize: ".75rem",
                        }}
                        onMouseEnter={(e) => {
                          if (videoPage > 0)
                            e.currentTarget.style.borderColor = "#A6FF4D";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(27,27,27,.15)";
                        }}
                      >
                        <ChevronLeft size={14} />
                        {isAm ? "ቀዳሚ" : "Prev"}
                      </button>

                      <div style={{ display: "flex", gap: ".3rem" }}>
                        {Array.from({ length: totalGridPages }, (_, i) => (
                          <button
                            key={i}
                            onClick={() => setVideoPage(i)}
                            style={{
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              border: "1px solid",
                              cursor: "pointer",
                              transition: "all .2s",
                              fontSize: ".7rem",
                              fontWeight: 700,
                              borderColor:
                                videoPage === i
                                  ? "#A6FF4D"
                                  : "rgba(27,27,27,.15)",
                              background:
                                videoPage === i
                                  ? "linear-gradient(90deg,#D6FF00,#A6FF4D)"
                                  : "transparent",
                              color:
                                videoPage === i
                                  ? "#1B1B1B"
                                  : "rgba(27,27,27,.45)",
                            }}
                          >
                            {i + 1}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          setVideoPage((p) =>
                            Math.min(totalGridPages - 1, p + 1)
                          )
                        }
                        disabled={videoPage === totalGridPages - 1}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: ".4rem",
                          padding: ".5rem 1.1rem",
                          borderRadius: 50,
                          border: "1px solid rgba(27,27,27,.15)",
                          background:
                            videoPage === totalGridPages - 1
                              ? "rgba(27,27,27,.04)"
                              : "#fff",
                          cursor:
                            videoPage === totalGridPages - 1
                              ? "not-allowed"
                              : "pointer",
                          color:
                            videoPage === totalGridPages - 1
                              ? "rgba(27,27,27,.25)"
                              : "#1B1B1B",
                          transition: "all .2s",
                          fontWeight: 600,
                          fontSize: ".75rem",
                        }}
                        onMouseEnter={(e) => {
                          if (videoPage < totalGridPages - 1)
                            e.currentTarget.style.borderColor = "#A6FF4D";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor =
                            "rgba(27,27,27,.15)";
                        }}
                      >
                        {isAm ? "ቀጣይ" : "Next"}
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Audio section */}
              {currentAudioSermons.length > 0 && (
                <div
                  style={{
                    borderTop:
                      currentVideos.length > 0
                        ? "1px solid rgba(166,255,77,.14)"
                        : "none",
                    paddingTop: currentVideos.length > 0 ? "3rem" : 0,
                    marginTop: currentVideos.length > 0 ? "1rem" : 0,
                  }}
                >
                  <Reveal>
                    <h2
                      className={clsx(
                        "font-serif font-semibold mb-6",
                        isAm && "font-ethiopic"
                      )}
                      style={{
                        fontSize: "clamp(1.4rem,2.8vw,2rem)",
                        color: "#1B1B1B",
                      }}
                    >
                      {c.audioTitle}
                    </h2>
                  </Reveal>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: ".8rem",
                    }}
                  >
                    {currentAudioSermons.map((s, i) => (
                      <AudioCard
                        key={i}
                        sermon={s}
                        download={c.download}
                        isAm={isAm}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* YouTube archive CTA */}
      <section
        style={{
          background:
            "linear-gradient(180deg, rgba(247,247,247,.94), rgba(227,239,38,.08))",
          padding: "5rem 2.5rem",
          textAlign: "center",
          borderTop: "1px solid rgba(166,255,77,.14)",
        }}
      >
        <Reveal>
          <div style={{ maxWidth: 600, margin: "0 auto" }}>
            <div
              style={{
                fontSize: "2.5rem",
                marginBottom: "1.2rem",
                opacity: 0.55,
              }}
            >
              ▶
            </div>
            <h2
              className={clsx(
                "font-serif font-semibold mb-4",
                isAm && "font-ethiopic"
              )}
              style={{ color: "#1B1B1B", fontSize: "clamp(1.5rem,3vw,2.2rem)" }}
            >
              {c.archiveTitle}
            </h2>
            <p
              className={clsx(
                "mb-8",
                isAm ? "font-ethiopic text-[.88rem]" : "font-sans text-[.94rem]"
              )}
              style={{ color: "rgba(51,51,51,.72)", lineHeight: 1.7 }}
            >
              {c.archiveSub}
            </p>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                isAm
                  ? "font-ethiopic text-[.88rem]"
                  : "font-sans text-[.78rem] uppercase tracking-[.12em]"
              )}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: ".6rem",
                padding: ".9rem 2.4rem",
                borderRadius: 50,
                background: "linear-gradient(90deg,#A6FF4D,#D6FF00)",
                color: "#1B1B1B",
                textDecoration: "none",
                fontWeight: 600,
                boxShadow: "0 4px 24px rgba(214,255,0,.28)",
                transition: "all .25s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.filter =
                  "brightness(1.04)";
                (e.currentTarget as HTMLAnchorElement).style.transform =
                  "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.filter = "none";
                (e.currentTarget as HTMLAnchorElement).style.transform = "none";
              }}
            >
              ▶ {c.archiveBtn}
            </a>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
