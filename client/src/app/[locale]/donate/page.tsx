import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import DonateClient from "@/components/DonateClient";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function DonatePage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await Promise.resolve(params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "donate" });
  const c = {
    heroTag: t("hero_tag"), heroTitle: t("hero_title"), heroSub: t("hero_sub"),
    amountLabel: t("amount_label"), customLabel: t("custom_label"),
    freqs: [t("freq_once"), t("freq_monthly"), t("freq_annual")],
    intlTitle: t("intl_title"), localTitle: t("local_title"),
    causes: [1,2,3].map(i => ({
      title: t(`cause${i}_title` as any), desc: t(`cause${i}_desc` as any), amount: t(`cause${i}_amount` as any),
    })),
    methodsTitle: t("methods_title"), btnDonate: t("btn_donate"), secureNote: t("secure_note"),
    stripeLabel: t("stripe_label"), paypalLabel: t("paypal_label"),
    telebirrLabel: t("telebirr_label"), chapaLabel: t("chapa_label"),
  };
  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress /><Navbar />
      <LocaleFadeWrapper><main><DonateClient locale={locale} c={c} /></main><HomeFooter locale={locale} /></LocaleFadeWrapper>
    </LanguageProvider>
  );
}