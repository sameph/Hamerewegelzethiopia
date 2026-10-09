import Link from "next/link";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function EducationLmsPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = (await Promise.resolve(params)) as { locale: Locale };
  const base = `/${locale}`;

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen pt-24 pb-16" style={{ backgroundColor: "#1B1B1B" }}>
          <section className="mx-auto max-w-5xl px-4 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-[#FFFDEE]/75">Education</p>
            <h1 className="mt-3 text-4xl font-bold text-[#FFFDEE] md:text-5xl">LMS</h1>
            <p className="mx-auto mt-4 max-w-3xl text-[#FFFDEE]/80">
              Continue coursework, assignments, messaging, and certificates in the Learning Management System.
            </p>
          </section>

          <section className="mx-auto mt-10 max-w-5xl px-4">
            <div className="rounded-2xl border border-white/10 p-6" style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(12px)" }}>
              <p className="text-[#FFFDEE]/85">Sign in to your LMS dashboard to access classes and academic tools.</p>
              <Link href={`${base}/lms/login`} className="mt-4 inline-flex rounded-[10px] bg-[#d6ff00] px-4 py-2 font-semibold text-[#17351f] transition hover:scale-105 hover:bg-[#a6ff4d] hover:shadow-[0_0_20px_rgba(166,255,77,0.5)]">
                Open LMS
              </Link>
            </div>
          </section>
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}
