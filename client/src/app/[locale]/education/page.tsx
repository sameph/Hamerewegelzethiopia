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

export default async function EducationPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = (await Promise.resolve(params)) as { locale: Locale };
  const base = `/${locale}`;
  const isAm = locale === "am";
  const heroImage =
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1600&auto=format&fit=crop";

  const cards = [
    {
      title: isAm ? "ምዝገባ" : "Admissions",
      subtitle: isAm ? "ከLMS ምዝገባ በፊት ፕሮግራሞቻችንን ይወቁ" : "Explore programs and register before signing in to LMS",
      href: `${base}/lms/admissions`,
    },
    {
      title: isAm ? "ቤተ መጻሕፍት" : "Library",
      subtitle: isAm ? "ዲጂታል መጻሕፍት እና ምንጮች" : "Digital books and resources",
      href: `${base}/education/library/books`,
    },
    {
      title: "LMS",
      subtitle: isAm ? "ኮርሶች፣ ስራዎች እና ክትትል" : "Courses, assignments, and progress",
      href: `${base}/education/lms/login`,
    },
    {
      title: isAm ? "ምረቃ" : "Graduation",
      subtitle: isAm ? "የምረቃ መንገዶች እና መመሪያ" : "Graduation pathways and guidance",
      href: `${base}/education/graduation`,
    },
  ];

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen pb-16" style={{ background: "#1B1B1B" }}>
          <section className="relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${heroImage}')` }} />
            <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(7,12,9,0.84)_0%,rgba(7,12,9,0.58)_42%,rgba(7,12,9,0.82)_100%)]" />
            <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-28 md:pb-14 md:pt-32">
              <div
                className="rounded-3xl border border-white/12 p-8 backdrop-blur-xl md:p-10"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 0 35px rgba(0, 208, 255, 0.12)",
                }}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-white">{isAm ? "ትምህርት" : "Education"}</p>
                <h1 className="mt-3 text-4xl font-bold text-[#FFFDEE] md:text-5xl">{isAm ? "የሐመረ ወንጌል ትምህርት" : "Hamere Wengel Education"}</h1>
                <p className="mt-5 max-w-4xl leading-relaxed text-white">
                  {isAm
                    ? "ምዝገባ፣ ቤተ መጻሕፍት፣ LMS እና የምረቃ አገልግሎቶችን በአንድ ቦታ ያግኙ።"
                    : "Core education services with direct access to Admissions, Library, LMS, and Graduation guidance."}
                </p>
              </div>
            </div>
          </section>

          <section className="mx-auto mt-10 grid max-w-6xl gap-5 px-4 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((item) => (
              <article
                key={item.href}
                className="rounded-2xl border border-white/12 p-6 backdrop-blur-xl"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  boxShadow: "0 0 26px rgba(0, 208, 255, 0.1)",
                }}
              >
                <h2 className="mt-1 text-lg font-semibold text-[#FFFDEE]">{item.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[#d9f1f7]/80">{item.subtitle}</p>
                <Link
                  href={item.href}
                  className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#d6ff00] px-7 py-3 text-sm font-semibold text-[#17351f] transition-colors hover:bg-[#a6ff4d]"
                >
                  {isAm ? "ክፈት" : "Open"}
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
