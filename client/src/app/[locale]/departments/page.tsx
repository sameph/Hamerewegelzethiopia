import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import Link from "next/link";
import { DEPARTMENTS } from "@/data/departments";
import type { Locale } from "@/context/LanguageContext";

export function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'am' }
  ];
}

export default async function DepartmentsPage({ params }: { params: Promise<{ locale: string }> | { locale: string } }) {
  const { locale } = await Promise.resolve(params) as { locale: Locale };
  const base = `/${locale}`;
  const departmentsHeroImage =
    "https://images.unsplash.com/photo-1519491050282-cf00c82424b4?q=80&w=1600&auto=format&fit=crop";
  const primaryButtonClass =
    "inline-flex items-center gap-2 rounded-full bg-[#d6ff00] px-7 py-3 text-sm font-semibold text-[#17351f] transition-colors hover:bg-[#a6ff4d]";

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen pb-16" style={{ background: "#1B1B1B" }}>
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${departmentsHeroImage}')` }} />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.84)_0%,rgba(7,12,9,0.58)_42%,rgba(7,12,9,0.82)_100%)]" />
            <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-28 text-center md:pb-16 md:pt-32">
              <p className="text-xs uppercase tracking-[0.28em] text-[#d6ff00]">Departments</p>
              <h1 className="mt-3 text-4xl font-bold text-[#FFFDEE] md:text-5xl">Hamere Wengel Departments</h1>
              <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-white md:text-base">
                Core ministry departments with dedicated pages, mission focus, and activity details.
              </p>
            </div>
          </section>

          <section className="mx-auto mt-10 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-3">
            {DEPARTMENTS.map((department) => (
              <article
                key={department.slug}
                className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 0 26px rgba(0, 208, 255, 0.1)",
                }}
              >
                <h2 className="mt-1 text-lg font-semibold text-[#FFFDEE]">{department.title}</h2>
                <p className="mt-1 text-sm text-[#9be9ff]">({department.amharic})</p>
                <p className="mt-3 text-sm leading-relaxed text-[#d9f1f7]/80">{department.description}</p>
                <Link
                  href={`${base}/departments/${department.slug}`}
                  className={`mt-5 ${primaryButtonClass}`}
                >
                  View Department
                </Link>
              </article>
            ))}
          </section>
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}