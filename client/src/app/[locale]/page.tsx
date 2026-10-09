import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HeroSection from "@/components/home/HeroSection";
import AboutTeaser from "@/components/home/AboutTeaser";
import ServicesSection from "@/components/home/ServicesSection";
import SocialProof from "@/components/home/SocialProof";
import PartnersLogos from "@/components/home/PartnersLogos";
import ImportantMilestones from "@/components/home/ImportantMilestones";
import ProcessSection from "@/components/home/ProcessSection";
import PricingSection from "@/components/home/PricingSection";
import ContentCommunity from "@/components/home/ContentCommunity";
import FinalCtaSection from "@/components/home/FinalCtaSection";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams.locale as Locale;

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="home-crypto-bg min-h-screen overflow-hidden pt-0">
          <HeroSection locale={locale} />
          <ImportantMilestones locale={locale} />
          <PartnersLogos locale={locale} />
          <AboutTeaser locale={locale} />
          <ServicesSection locale={locale} />
          <ProcessSection locale={locale} />
          <SocialProof locale={locale} />
          <PricingSection locale={locale} />
          <ContentCommunity locale={locale} />
          <FinalCtaSection locale={locale} />
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}
