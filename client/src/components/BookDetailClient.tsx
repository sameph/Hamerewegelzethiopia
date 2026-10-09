"use client";

import Link from "next/link";
import clsx from "clsx";

interface Resource {
  icon?: string;
  type?: string;
  title: string;
  meta?: string;
  free?: boolean;
  price?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
  pdfUrl?: string;
  author?: string;
  category?: string;
}

interface Props {
  resource: Resource;
  locale: string;
  labels: {
    backLabel: string;
    readerLabel: string;
    previewLabel: string;
    downloadLabel: string;
    readerNote: string;
  };
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export default function BookDetailClient({ resource, locale, labels }: Props) {
  const isAm = locale === "am";
  const isFree =
    resource.free ?? (resource.price === undefined || resource.price === "0");
  const price = resource.price ?? (isFree ? (isAm ? "ነፃ" : "Free") : "Paid");

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_0.9fr]">
      <div className="space-y-8">
        <div className="rounded-3xl border border-white/10 bg-[#111]/90 p-8">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-3xl bg-[#d6ff00]/10 text-3xl">
              {resource.icon || "📘"}
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-[#d6ff00]">
                {resource.type || "Library Item"}
              </p>
              <h1 className="mt-3 text-3xl font-black text-white">
                {resource.title}
              </h1>
              {resource.author && (
                <p className="mt-2 text-sm text-slate-400">{resource.author}</p>
              )}
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold">
                {isFree ? (isAm ? "ነፃ" : "Free") : isAm ? "ዋጋ" : "Price"}
              </p>
              <p className="mt-2 text-xl font-bold text-[#d6ff00]">{price}</p>
            </div>
            <div className="rounded-3xl bg-white/5 p-5 text-sm text-slate-200">
              <p className="font-semibold">{isAm ? "ፅሁፍ" : "Details"}</p>
              <p className="mt-2 leading-6">
                {resource.meta || resource.description || ""}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 rounded-3xl border border-white/10 bg-[#111]/90 p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
            {labels.readerNote}
          </p>
          <p className="text-sm leading-7 text-slate-300">
            {resource.description ||
              "Explore the resource details and download or preview the item."}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={resource.pdfUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className={clsx(
                "inline-flex items-center justify-center rounded-2xl bg-[#d6ff00] px-5 py-3 text-sm font-semibold text-[#111] transition hover:bg-[#c4eb00]"
              )}
            >
              {labels.readerLabel}
            </a>
            <a
              href={resource.pdfUrl || "#"}
              target="_blank"
              rel="noreferrer"
              className={clsx(
                "inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#d6ff00] hover:text-[#d6ff00]"
              )}
            >
              {labels.downloadLabel}
            </a>
          </div>
        </div>
      </div>

      <aside className="space-y-6 rounded-3xl border border-white/10 bg-[#111]/90 p-8">
        {resource.thumbnail ? (
          <img
            src={resource.thumbnail}
            alt={resource.title}
            className="w-full rounded-3xl object-cover"
          />
        ) : (
          <div className="flex h-72 items-center justify-center rounded-3xl bg-white/5 text-6xl">
            📚
          </div>
        )}
        <div className="space-y-3">
          <Link
            href={`/${locale}/library/book/${
              resource.slug || slugify(resource.title)
            }`}
            className="block rounded-3xl bg-[#d6ff00]/10 px-4 py-3 text-sm font-semibold text-[#111] text-center"
          >
            {labels.backLabel}
          </Link>
          <div className="rounded-3xl bg-white/5 p-4 text-sm text-slate-300">
            <p className="font-semibold">{isAm ? "ዝርዝር" : "Resource Info"}</p>
            <p className="mt-2">{resource.category || "General"}</p>
            {resource.author && <p>{resource.author}</p>}
          </div>
        </div>
      </aside>
    </div>
  );
}
