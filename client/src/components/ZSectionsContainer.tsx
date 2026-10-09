import { getTranslations } from "next-intl/server";
import ZSection, { type ZSectionData } from "./ZSection";

interface ZSectionsContainerProps {
  locale: string;
}

export default async function ZSectionsContainer({ locale }: ZSectionsContainerProps) {
  const t = await getTranslations({ locale, namespace: "zsections" });

  const sections: ZSectionData[] = [
    // ── Section 1: Sacred Heritage — Image LEFT, Text RIGHT ──
    {
      id: "heritage",
      index: 0,
      bg: "#F7F7F7",
      accentColor: "#1B1B1B",
      icon: "📜",
      imageLabel: "Ancient Manuscript / Church Art",
      imageGradient: "linear-gradient(135deg, #1B1B1B 0%, #1B1B1B 45%, #1B1B1B 100%)",
      tagKey:   "heritage.tag",
      titleKey: "heritage.title",
      bodyKey:  "heritage.body",
      linkKey:  "heritage.link",
      linkHref: "#mission",
      tag:      t("heritage.tag"),
      title:    t("heritage.title"),
      body:     t("heritage.body"),
      linkLabel: t("heritage.link"),
    },
    // ── Section 2: Digital Academy — Text LEFT, Image RIGHT ──
    {
      id: "academy",
      index: 1,
      bg: "#F7F7F7",
      accentColor: "#1B1B1B",
      icon: "💻",
      imageLabel: "LMS Dashboard Screenshot",
      imageGradient: "linear-gradient(135deg, #1B1B1B 0%, #1B1B1B 40%, #1B1B1B 80%, #00D084 100%)",
      tagKey:   "academy.tag",
      titleKey: "academy.title",
      bodyKey:  "academy.body",
      linkKey:  "academy.link",
      linkHref: "#library",
      tag:      t("academy.tag"),
      title:    t("academy.title"),
      body:     t("academy.body"),
      linkLabel: t("academy.link"),
    },
    // ── Section 3: Global Outreach — Image LEFT, Text RIGHT (zoom effect) ──
    {
      id: "outreach",
      index: 2,
      bg: "#F7F7F7",
      accentColor: "#1B1B1B",
      icon: "🗺",
      imageLabel: "Regional Branch / Diocese Map",
      imageGradient: "linear-gradient(135deg, #1B1B1B 0%, #1B1B1B 50%, #1B1B1B 100%)",
      zoomEffect: true,
      tagKey:   "outreach.tag",
      titleKey: "outreach.title",
      bodyKey:  "outreach.body",
      linkKey:  "outreach.link",
      linkHref: "#diocese",
      tag:      t("outreach.tag"),
      title:    t("outreach.title"),
      body:     t("outreach.body"),
      linkLabel: t("outreach.link"),
    },
  ];

  return (
    <>
      {sections.map((section) => (
        <ZSection key={section.id} data={section} locale={locale} />
      ))}
    </>
  );
}
