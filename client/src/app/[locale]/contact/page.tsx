import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import ContactClient from "@/components/ContactClient";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await Promise.resolve(params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "contact" });
  const c = {
    heroTag: t("hero_tag"), heroTitle: t("hero_title"), heroSub: t("hero_sub"),
    formTitle: t("form_title"), firstName: t("first_name"), lastName: t("last_name"),
    emailLabel: t("email_label"), phoneLabel: t("phone_label"),
    subject: t("subject"), message: t("message"),
    placeholder: t("placeholder"), submit: t("submit"),
    infoTitle: t("info_title"), address: t("address"),
    phone: t("phone"), email: t("email"), social: t("social"),
    mapTitle: t("map_title"), hoursTitle: t("hours_title"),
    hoursWeekday: t("hours_weekday"), hoursSaturday: t("hours_saturday"),
    hoursSunday: t("hours_sunday"),
  };
  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress /><Navbar />
      <LocaleFadeWrapper><main><ContactClient locale={locale} c={c} /></main><HomeFooter locale={locale} /></LocaleFadeWrapper>
    </LanguageProvider>
  );
}