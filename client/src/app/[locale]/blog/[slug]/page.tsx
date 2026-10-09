import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import type { Locale } from "@/context/LanguageContext";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "";
const locales = ["en", "am"] as const;
const fallbackSlugs = ["p1", "p2", "p3", "p4", "p5", "p6"];

export async function generateStaticParams() {
  const API_BASE_STATIC =
    process.env.NEXT_PUBLIC_API_URL || "";
  let slugs: string[] = fallbackSlugs;

  try {
    const res = await fetch(`${API_BASE_STATIC}/blogs`, {
      cache: "no-store",
    });
    if (res.ok) {
      const json = await res.json();
      if (json.success && Array.isArray(json.data) && json.data.length > 0) {
        slugs = json.data.map((b: { _id: string }) => b._id);
      }
    }
  } catch {
    // fall back to static slugs if API is down at build time
  }

  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const slug of slugs) {
      params.push({ locale, slug });
    }
  }
  return params;
}

export default async function BlogPostPage({
  params,
}: {
  params:
    | Promise<{ locale: string; slug: string }>
    | { locale: string; slug: string };
}) {
  const { locale, slug } = (await Promise.resolve(params)) as {
    locale: Locale;
    slug: string;
  };
  const t = await getTranslations({ locale, namespace: "blog" });

  let post: {
    title: string;
    category: string;
    date: string;
    readMin: string;
    excerpt: string;
    body: string[];
  } | null = null;

  try {
    const res = await fetch(`${API_BASE}/blogs/${slug}`, { cache: "no-store" });
    if (res.ok) {
      const json = await res.json();
      if (json.success && json.data) {
        const data = json.data;
        const bodyText =
          typeof data.content === "string" ? data.content.trim() : "";
        post = {
          title: data.title || "Untitled",
          category: data.category || "News",
          date: data.createdAt
            ? new Date(data.createdAt).toLocaleDateString(locale, {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            : "",
          readMin: data.readMin || "5",
          excerpt: data.excerpt || "",
          body: bodyText
            ? bodyText
                .split(/\n{2,}/)
                .map((paragraph: string) => paragraph.trim())
            : [data.excerpt || ""],
        };
      }
    }
  } catch (error) {
    console.error("Unable to fetch blog details:", error);
  }

  if (!post) {
    return notFound();
  }

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="pt-20">
          <section className="max-w-5xl mx-auto px-6 pb-20">
            <div className="mb-4 text-sm uppercase tracking-[0.18em] text-[#d6ff00]">
              Blog
            </div>
            <div className="mb-8 flex flex-wrap items-center gap-4">
              <span className="rounded-full bg-[#f1f8d8] px-4 py-2 text-sm font-semibold text-[#425014]">
                {post.category}
              </span>
              <span className="text-sm text-slate-500">{post.date}</span>
              <span className="text-sm text-slate-500">•</span>
              <span className="text-sm text-slate-500">
                {post.readMin} {t("min_read")}
              </span>
            </div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#101010] sm:text-5xl">
              {post.title}
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-slate-700">
              {post.excerpt}
            </p>

            <article className="mt-12 space-y-8 text-base leading-8 text-slate-700">
              {post.body.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </article>

            <div className="mt-12">
              <Link
                href={`/${locale}/blog`}
                className="inline-flex items-center gap-2 text-[#1b3d0c] font-semibold hover:text-[#4c7b1e]"
              >
                {locale === "am" ? "ወደ ብሎግ ተመለስ" : "Back to Blog"}
              </Link>
            </div>
          </section>
        </main>
      </LocaleFadeWrapper>
      <HomeFooter locale={locale} />
    </LanguageProvider>
  );
}
