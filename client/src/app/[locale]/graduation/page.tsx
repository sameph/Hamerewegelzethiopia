import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

export default async function GraduationPage({
  params,
}: {
  params: Promise<{ locale: string }> | { locale: string };
}) {
  const { locale } = (await Promise.resolve(params)) as { locale: Locale };

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="min-h-screen pt-24 pb-16" style={{ background: "#1B1B1B" }}>
          <section className="mx-auto max-w-5xl px-4 text-center">
            <p className="text-xs uppercase tracking-[0.28em] text-[#7AD4E8]">Education</p>
            <h1 className="mt-3 text-4xl font-bold text-[#FFFDEE] md:text-5xl">Graduation</h1>
            <p className="mx-auto mt-4 max-w-2xl text-[#d9f1f7]/85">
              Graduation pathways, completion requirements, and ceremony guidance for Hamere Wengel learners.
            </p>
          </section>

          <section className="mx-auto mt-10 grid max-w-5xl gap-5 px-4 md:grid-cols-3">
            {[
              {
                title: "Completion",
                text: "Finish required courses, assessments, and practical ministry components.",
              },
              {
                title: "Verification",
                text: "Academic records and department approval are reviewed before final clearance.",
              },
              {
                title: "Ceremony",
                text: "Graduates receive ceremony dates, attire guidance, and certificate instructions.",
              },
            ].map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/12 p-6"
                style={{ background: "rgba(255, 255, 255, 0.05)", backdropFilter: "blur(12px)" }}
              >
                <h2 className="text-lg font-semibold text-[#FFFDEE]">{item.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[#d9f1f7]/80">{item.text}</p>
              </article>
            ))}
          </section>
        </main>
        <HomeFooter locale={locale} />
      </LocaleFadeWrapper>
    </LanguageProvider>
  );
}

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'am' }];
}
