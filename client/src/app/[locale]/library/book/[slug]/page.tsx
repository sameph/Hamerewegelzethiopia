import Link from "next/link";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { LanguageProvider } from "@/context/LanguageContext";
import LocaleFadeWrapper from "@/components/LocaleFadeWrapper";
import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import HomeFooter from "@/components/home/Footer";
import BookDetailClient from "@/components/BookDetailClient";
import { getResourceBySlug } from "@/lib/libraryResources";
import type { Locale } from "@/context/LanguageContext";

const RESOURCE_SLUGS = [
  "fetha-negest",
  "kebra-nagast",
  "deggua-chants-collection",
  "ethiopian-journal-of-theology",
  "andemta-commentary",
  "introduction-to-geez-grammar",
  "ziema-liturgical-hymns",
  "theology-digital-mission",
  "comprehensive-geez-grammar",
  "ethiopian-church-history-vol-i",
  "theology-of-tabots",
  "geez-reading-crash-course",
];

const slugify = (value: string) =>
  value
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

async function fetchBookSlugs() {
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

  try {
    const response = await fetch(`${API_URL}/books`, { cache: "no-store" });
    const result = await response.json();
    if (response.ok && result?.success && Array.isArray(result.data)) {
      return result.data
        .map((book: any) => book.slug || book.title || "")
        .filter(Boolean)
        .map((slug: string) => slugify(slug));
    }
  } catch (error) {
    // Build-time book fetch failed, continue with local static slugs.
  }

  return [];
}

export async function generateStaticParams() {
  const bookSlugs = await fetchBookSlugs();
  const allSlugs = Array.from(new Set([...RESOURCE_SLUGS, ...bookSlugs]));

  return allSlugs.flatMap((slug) => [
    { locale: "en", slug },
    { locale: "am", slug },
  ]);
}

export default async function LibraryBookPage({
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
  const t = await getTranslations({ locale, namespace: "library" });
  const API_URL = process.env.NEXT_PUBLIC_API_URL || "";
  let resource = getResourceBySlug(slug);

  if (!resource) {
    try {
      const response = await fetch(`${API_URL}/books/slug/${slug}`);
      const bookResult = await response.json();
      if (response.ok && bookResult.success && bookResult.data) {
        const book = bookResult.data;
        resource = {
          icon: "📘",
          type: book.category || "Book",
          title: book.title,
          meta: book.author
            ? `${book.author} • ${book.category || ""}`.trim()
            : book.category || "",
          free: book.isFree,
          price: book.price ? `$${book.price}` : undefined,
          slug,
          description: book.description,
          thumbnail: book.thumbnail,
          pdfUrl: book.pdfUrl,
          author: book.author,
        };
      }
    } catch (err) {
      // ignore and redirect below if no resource found
    }
  }

  if (!resource) {
    redirect(`/${locale}/library`);
  }

  const backLabel = locale === "am" ? "ተመለስ" : "Back to Library";
  const readerLabel = locale === "am" ? "አሁን ይይዙ" : "Read Now";

  return (
    <LanguageProvider initialLocale={locale}>
      <ScrollProgress />
      <Navbar />
      <LocaleFadeWrapper>
        <main className="pt-20 pb-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Link
                href={`/${locale}/library`}
                className="inline-flex items-center gap-2 text-sm font-semibold text-forest hover:text-deep transition"
              >
                ← {backLabel}
              </Link>
            </div>

            <div className="rounded-3xl bg-[#111] border border-forest/15 p-8 shadow-[0_20px_80px_rgba(0,0,0,.25)]">
              <BookDetailClient
                resource={resource}
                locale={locale}
                labels={{
                  backLabel,
                  readerLabel,
                  previewLabel: locale === "am" ? "ቅድመ እይታ" : "Preview",
                  downloadLabel: locale === "am" ? "አውርድ" : "Download",
                  readerNote: t("reader_note"),
                }}
              />
            </div>
          </div>
        </main>
      </LocaleFadeWrapper>
      <HomeFooter locale={locale} />
    </LanguageProvider>
  );
}
