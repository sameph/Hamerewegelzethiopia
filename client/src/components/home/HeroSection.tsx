"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type HeroSectionProps = {
  locale: Locale;
};

export default function HeroSection({ locale }: HeroSectionProps) {
  const base = `/${locale}`;
  const isAmharic = locale === "am";
  const copy = locale === "am"
    ? {
        badge: "እምነት እና እርምጃ",
        headingA: "እንኳን ደህና መጡ",
        headingB: "ወደ ሐመረ ወንጌል ዘ-ኢትዮጵያ",
        subtext:
          "ሐመረ ወንጌል በትምህርት፣ በወንጌል ስርጭት እና በርህራሄ አገልግሎት ሰዎችን እና ቤተሰቦችን በተግባር የሚያገለግል መድረክ ነው።",
        event: {
          title: "የኮሌጅ አገልግሎት የመግቢያ ፕሮግራም",
          date: "ሰኔ 14, 2026",
          time: "10:00 ጥዋት",
          place: "አዲስ አበባ, ዋና ካምፓስ",
          targetIso: "2026-06-14T10:00:00+03:00",
        },
        counterHeadline: "በቅርቡ የሚመጣ ዋና ዝግጅት",
        counterSubheadline: "በቅርቡ አስደናቂ ነገር ይመጣል",
        countdownTitle: "መቁጠሪያ",
        countdownLabels: ["ቀን", "ሰዓት", "ደቂቃ", "ሰከንድ"],
        dateLabel: "ቀን",
        timeLabel: "ሰዓት",
        placeLabel: "ቦታ",
        ctas: [
          { title: "ተጨማሪ ይመልከቱ", href: `${base}/about`, primary: false },
        ],
      }
        : {
        badge: "KEEP FAITH IN ACTION",
        headingA: "Welcome to",
        headingB: "Hamere Wengel ZE Ethiopia",
        subtext:
          "The primary vision of Hamere Wongel Ze-Ethiopia is 'to see the Ethiopian Mother Church renewed through the Word of the Gospel.",
        event: {
          title: "College Service Orientation",
          date: "June 14, 2026",
          time: "10:00 AM",
          place: "Addis Ababa, Main Campus",
          targetIso: "2026-06-14T10:00:00+03:00",
        },
        counterHeadline: "Next Event Counter",
        counterSubheadline: "Stay tuned for something amazing",
        countdownTitle: "Countdown",
        countdownLabels: ["Days", "Hours", "Minutes", "Seconds"],
        dateLabel: "Date",
        timeLabel: "Time",
        placeLabel: "Place",
        ctas: [
          { title: "Learn More", href: `${base}/about`, primary: false },
        ],
      };

  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const countdown = useMemo(() => {
    if (now === null) {
      return ["--", "--", "--", "--"];
    }
    const target = new Date(copy.event.targetIso).getTime();
    const diff = Math.max(0, target - now);
    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [days, hours, minutes, seconds].map((value) => String(value).padStart(2, "0"));
  }, [copy.event.targetIso, now]);

  return (
    <section className="relative isolate flex min-h-[92vh] items-end overflow-hidden px-4 pb-16 pt-32 sm:px-6 lg:px-12">
      <div
        className="absolute inset-0 -z-20 bg-cover bg-center"
        style={{
          backgroundImage: "url('/assets/herosection.png')",
        }}
      />
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(110deg,rgba(7,12,9,0.9)_0%,rgba(7,12,9,0.42)_45%,rgba(7,12,9,0.78)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 -z-10 bg-[linear-gradient(180deg,transparent,rgba(8,13,10,0.94))]" />

      <div className="mx-auto w-full max-w-7xl">
        <div className="max-w-3xl">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full border border-[#a6ff4d]/40 bg-[#a6ff4d]/18 px-3 py-1 text-[11px] text-[#ecffd3] ${
                isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.16em]"
              }`}
            >
              {copy.badge}
            </span>
            <span className="rounded-full border border-white/20 bg-black/25 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.16em] text-white">
              Hamere Wengel
            </span>
          </div>

          <h1 className={`text-[#f7f7f7] text-4xl sm:text-5xl lg:text-7xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-[1.05]"}`}>
            {copy.headingA}
            <span className="block text-[#d6ff00]">{copy.headingB}</span>
          </h1>

          <p className={`mt-6 max-w-2xl text-[#f7f7f7] text-base leading-8 sm:text-lg ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
            {copy.subtext}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {copy.ctas.map((cta) => (
              <Link
                key={cta.title}
                href={cta.href}
                className={`${cta.primary ? "bg-[#d6ff00] text-[#111711]" : "bg-white/8 text-[#f7f7f7] border border-white/20"} inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:brightness-105 ${
                  isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.12em]"
                }`}
              >
                {cta.title}
              </Link>
            ))}
          </div>

          <div className="mt-8 max-w-2xl rounded-2xl border border-white/22 bg-[linear-gradient(160deg,rgba(15,27,20,0.74),rgba(19,34,25,0.5))] p-4 backdrop-blur-sm sm:p-5">
            <p className={`text-white ${isAmharic ? "font-ethiopic text-lg leading-[1.35]" : "font-sans text-2xl font-semibold leading-tight"}`}>
              {copy.counterSubheadline}
            </p>
            <p className={`mt-1 text-[#d6ff00] ${isAmharic ? "font-ethiopic text-sm" : "font-sans text-xs uppercase tracking-[0.14em]"}`}>
              {copy.counterHeadline}
            </p>
            <p className={`mt-2 text-white ${isAmharic ? "font-ethiopic text-sm" : "font-sans text-sm"}`}>
              {copy.event.title}
            </p>

            <div className="mt-4 grid grid-cols-2 overflow-hidden rounded-xl border border-white/12 sm:grid-cols-4">
              {countdown.map((value, index) => (
                <div
                  key={`${copy.countdownLabels[index]}-${index}`}
                  className="border-b border-r border-white/10 bg-white/10 p-3 text-center sm:border-b-0 [&:nth-child(2n)]:border-r-0 sm:[&:nth-child(2n)]:border-r sm:[&:last-child]:border-r-0"
                >
                  <p className="font-serif text-4xl leading-none text-[#d6ff00]">{value}</p>
                  <p className={`mt-2 text-[11px] text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans lowercase"}`}>
                    {copy.countdownLabels[index]}
                  </p>
                </div>
              ))}
            </div>

            <div className={`mt-3 flex flex-wrap gap-x-4 gap-y-1 text-white ${isAmharic ? "font-ethiopic text-xs" : "font-sans text-xs"}`}>
              <span>{copy.dateLabel}: {copy.event.date}</span>
              <span>{copy.timeLabel}: {copy.event.time}</span>
              <span>{copy.placeLabel}: {copy.event.place}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}