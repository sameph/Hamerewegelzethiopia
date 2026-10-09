import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

export default async function IntegrationPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = await Promise.resolve(params) as { locale: Locale };
  const t = await getTranslations({ locale, namespace: "integration" });
  const base = `/${locale}`;

  const cards = [
    {
      id: "library",
      title: t("card_library_title"),
      body: t("card_library_body"),
      href: `${base}/library`,
      icon: "📚",
    },
    {
      id: "lms",
      title: t("card_lms_title"),
      body: t("card_lms_body"),
      href: `${base}/lms/login`,
      icon: "💻",
    },
    {
      id: "graduation",
      title: t("card_grad_title"),
      body: t("card_grad_body"),
      href: `${base}/contact`,
      icon: "🎓",
    },
  ] as const;

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen bg-gradient-to-b from-[#F7F7F7]/30 via-[#F7F7F7]/40 to-white pt-24 pb-16">
          <div className="mx-auto max-w-4xl px-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#00D084]">{t("eyebrow")}</p>
            <h1 className="mt-3 font-serif text-4xl font-semibold text-[#1B1B1B] md:text-5xl">{t("title")}</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#00D084]/85">{t("subtitle")}</p>
          </div>

          <div className="mx-auto mt-14 grid max-w-5xl gap-6 px-4 md:grid-cols-3">
            {cards.map((c) => (
              <section
                key={c.id}
                id={c.id}
                className="flex flex-col rounded-2xl border border-white/40 bg-white/60 p-8 shadow-lg shadow-[#00D084]/10 backdrop-blur-md"
              >
                <div className="text-amber-500 text-4xl">{c.icon}</div>
                <h2 className="mt-4 font-serif text-xl font-semibold text-[#1B1B1B]">{c.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[#00D084]/85">{c.body}</p>
                <Link
                  href={c.href}
                  className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#d6ff00] px-4 py-3 text-sm font-bold text-[#17351f] shadow-lg transition hover:bg-[#a6ff4d]"
                >
                  {t("cta")}
                </Link>
              </section>
            ))}
          </div>
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }];
}
