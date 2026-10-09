import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import AboutPageClient from "@/components/AboutPageClient";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale as Locale;
  const t = await getTranslations({ locale, namespace: "about" });
  const nav = await getTranslations({ locale, namespace: "nav" });

  const content = {
    historyTag:   t("history_tag"),
    historyTitle: t("history_title"),
    historyP1:    t("history_p1"),
    historyP2:    t("history_p2"),
    historyP3:    t("history_p3"),
    statsTitle:   t("stats_title"),
    stats: [
      { val: t("stat1_val"), label: t("stat1_label") },
      { val: t("stat2_val"), label: t("stat2_label") },
      { val: t("stat3_val"), label: t("stat3_label") },
      { val: t("stat4_val"), label: t("stat4_label") },
    ],
    pillarsTitle: t("pillars_title"),
    pillars: [
      { title: t("p1_title"), desc: t("p1_desc") },
      { title: t("p2_title"), desc: t("p2_desc") },
      { title: t("p3_title"), desc: t("p3_desc") },
      { title: t("p4_title"), desc: t("p4_desc") },
    ],
    mapTitle:   t("map_title"),
    mapSub:     t("map_sub"),
    ctaTitle:   t("cta_title"),
    ctaApply:   t("cta_apply"),
    ctaSupport: t("cta_support"),
    lmsLabel:   nav("lms"),
    legalitiesTitle: t("legalities_title"),
    legalitiesIntro: t("legalities_intro"),
    legalitiesB1: t("legalities_b1"),
    legalitiesB2: t("legalities_b2"),
    adminTitle: t("admin_title"),
    adminIntro: t("admin_intro"),
    adminHistoryTitle: t("admin_history_title"),
    adminHistoryText: t("admin_history_text"),
    adminVisionTitle: t("admin_vision_title"),
    adminVisionText: t("admin_vision_text"),
    adminMissionTitle: t("admin_mission_title"),
    adminMissionText: t("admin_mission_text"),
    adminSeedlingTitle: t("admin_seedling_title"),
    adminSeedlingText: t("admin_seedling_text"),
    adminName: t("admin_name"),
    adminPerson: t("admin_person"),
    adminRole: t("admin_role"),
    adminLocation: t("admin_location"),
    adminEmail: t("admin_email"),
    adminPhone: t("admin_phone"),
  };

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <AboutPageClient locale={locale} content={content} />
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}
