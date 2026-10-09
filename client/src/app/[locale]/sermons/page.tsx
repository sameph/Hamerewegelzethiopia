import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import SermonsClient from "@/components/SermonsClient";
import type { Locale } from "@/context/LanguageContext";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default async function SermonsPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = (await Promise.resolve(params)) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "sermons" });

  // Fallback sermon data (translation-driven) matching UI `Sermon` shape
  const fallbackSermons = ([1, 2, 3, 4, 5, 6] as const).map((i) => ({
    _id: `s${i}`,
    title: t(`s${i}_title` as any),
    spkr: t(`s${i}_spkr` as any),
    series: "",
    category: (i <= 2 ? "worship" : i <= 4 ? "preaching" : "teaching") as string,
    type: (i <= 3 ? "video" : "audio") as "video" | "audio",
    youtubeUrl: "",
    youtubeId: "",
    dur: t(`s${i}_dur` as any),
    description: "",
    thumbnailUrl: "",
    language: "am",
    date: "",
  }));

  let sermons: typeof fallbackSermons = fallbackSermons;

  try {
    const res = await fetch(`${API_BASE}/sermons`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        // Map server sermon shape to the UI Sermon type expected by SermonsClient
        sermons = json.data.map((item: any) => ({
          _id: item._id || item.id || "",
          title: item.title || item.name || "",
          spkr: item.speaker || item.spkr || "",
          series: item.series || "",
          category: item.category || "worship",
          type: item.type || "video",
          youtubeUrl: item.youtubeUrl || "",
          youtubeId: item.youtubeId || "",
          dur: item.duration || item.dur || "",
          description: item.description || "",
          thumbnailUrl: item.thumbnailUrl || "",
          language: item.language || "am",
          date: item.createdAt
            ? new Date(item.createdAt).toLocaleDateString()
            : item.date || "",
        }));
      }
    }
  } catch (error) {
    console.error("Unable to fetch sermons:", error);
  }

  const c = {
    heroTag: t("hero_tag"),
    heroTitle: t("hero_title"),
    heroSub: t("hero_sub"),
    videoTitle: t("video_title"),
    audioTitle: t("audio_title"),
    featuredTitle: t("featured_title"),
    archiveTitle: t("archive_title"),
    archiveSub: t("archive_sub"),
    archiveBtn: t("archive_btn"),
    filters: [
      t("filter_all"),
      t("filter_am"),
      t("filter_en"),
      t("filter_recent"),
    ],
    listen: t("listen"),
    watch: t("watch"),
    download: t("download"),
    viewAll: t("view_all"),
    sermons,
  };

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main>
          <SermonsClient locale={locale} c={c} />
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}
