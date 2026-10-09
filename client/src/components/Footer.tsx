"use client";

import Link from "next/link";
import { useLang } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import clsx from "clsx";

export default function Footer() {
  const { lang } = useLang();
  const t = translations[lang].footer;
  const isAm = lang === "am";
  const base = `/${lang}`;

  const col1 = [
    { key: "home",    path: "/" },
    { key: "about",   path: "/about" },
    { key: "departments", path: "/departments" },
    { key: "blog",    path: "/blog" },
  ] as const;

  const col2 = [
    { key: "sermons",  path: "/sermons" },
    { key: "library",  path: "/education/library/book" },
    { key: "contact",  path: "/contact" },
  ] as const;

  const col3 = [
    { key: "lms",    path: "/lms/login" },
    { key: "donate", path: "/donate" },
  ] as const;

  const lk = clsx(
    "transition-colors duration-200 text-softWhite/75 hover:text-primaryBg",
    isAm ? "font-ethiopic text-[0.76rem]" : "font-sans text-[0.7rem] uppercase tracking-[0.1em]"
  );

  return (
    <footer className="bg-charcoal border-t border-softWhite/10 pt-14 pb-8 px-10 text-softWhite">
      <div className="max-w-[1440px] mx-auto">

        {/* Top grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className={clsx("font-serif text-xl text-primaryBg mb-2", isAm && "font-ethiopic")}>
              {t.title}
            </p>
            <p className={clsx("text-softWhite/70 leading-relaxed max-w-[28ch]",
              isAm ? "font-ethiopic text-[0.78rem]" : "font-sans text-[0.72rem] italic")}>
              {t.motto}
            </p>
          </div>

          {/* Links col 1 */}
          <nav className="flex flex-col gap-3">
            {col1.map(({ key, path }) => (
              <Link key={key} href={path === "/" ? base : `${base}${path}`} className={lk}>
                {t.links[key as keyof typeof t.links]}
              </Link>
            ))}
          </nav>

          {/* Links col 2 */}
          <nav className="flex flex-col gap-3">
            {col2.map(({ key, path }) => (
              <Link key={key} href={`${base}${path}`} className={lk}>
                {t.links[key as keyof typeof t.links]}
              </Link>
            ))}
          </nav>

          {/* Links col 3 */}
          <nav className="flex flex-col gap-3">
            {col3.map(({ key, path }) => (
              <Link key={key} href={`${base}${path}`} className={lk}>
                {t.links[key as keyof typeof t.links]}
              </Link>
            ))}
            <a href="mailto:info@hamerewengel.org" className={lk}>info@hamerewengel.org</a>
            <a href="tel:+251111234567" className={lk}>+251 11 123 4567</a>
          </nav>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-softWhite/10 flex flex-wrap justify-between items-center gap-4">
          <p className={clsx("text-softWhite/60", isAm ? "font-ethiopic text-[0.72rem]" : "font-sans text-[0.68rem]")}>
            {t.copyright}
          </p>
          <div className="flex gap-4">
            {["Facebook","YouTube","Telegram"].map(s => (
              <a key={s} href="#" className="font-sans text-[0.62rem] uppercase tracking-[0.1em] text-softWhite/60 hover:text-primaryBg transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
