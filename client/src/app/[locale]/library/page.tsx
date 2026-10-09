import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import LibraryClient from "@/components/LibraryClient";
import type { Locale } from "@/context/LanguageContext";

export default async function LibraryPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await Promise.resolve(params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "library" });
  const c = {
    heroTag: t("hero_tag"), heroTitle: t("hero_title"), heroSub: t("hero_sub"),
    freeTitle: t("free_title"), paidTitle: t("paid_title"), readerTitle: t("reader_title"),
    searchPlaceholder: t("search_placeholder"),
    categories: [t("cat_all"), t("cat_manuscripts"), t("cat_books"), t("cat_audio"), t("cat_journals")],
    stats: [
      { val: t("stat1_val"), label: t("stat1_label") },
      { val: t("stat2_val"), label: t("stat2_label") },
      { val: t("stat3_val"), label: t("stat3_label") },
      { val: t("stat4_val"), label: t("stat4_label") },
    ],
    accessBtn: t("access_btn"), registerNote: t("register_note"),
    previewBtn: t("preview_btn"), downloadBtn: t("download_btn"),
    buyBtn: t("buy_btn"), readerNote: t("reader_note"),
    readMore: t("read_more"),
  };
  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress /><Navbar />
      <LocaleFadeWrapper><main className="min-h-screen" style={{ background: "#1B1B1B" }}><LibraryClient locale={locale} c={c} /></main><HomeFooter locale={locale} /></LocaleFadeWrapper>
    </LanguageProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }];
}