import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type AboutTeaserProps = {
  locale: Locale;
};

const content = {
  en: {
    eyebrow: "About Hamere Wengel",
    title: "An organization story rooted in faith, service, and lasting community impact.",
    body:
      "Hamere Wongel Ze-Ethiopia is a spiritual association established based on a reformative calling, recognizing that God is the source of spiritual vision and mission. Guided by the Great Commission given by our Lord and Savior Jesus Christ (Matt. 28:19-20, Acts 1:8), the association is striving to widely disseminate the Gospel through which our people are saved from sin and eternal death.",
    bodyTwo:
      "Founded on June 24, 2006 (E.C.) in Addis Ababa, this association is legally recognized by the Ministry of Federal Affairs under registration number ፌ.ጉ.ሚ 00500. The primary vision of Hamere Wongel Ze-Ethiopia is 'to see the Ethiopian Mother Church renewed through the Word of the Gospel.' By a Gospel-renewed church, we mean seeing a living House of God that is protected from old and new alien teachings and practices, centering the Gospel in all its activities, and being fruitful for generations. To achieve this, over the past 11 years (2006–2018 E.C.), extensive activities have been carried out, including reaching many through the Gospel, training priests and leaders for the mission, and distributing the Holy Bible to our people.",
    cta: "Read Our Story",
    cardTitle: "Core Message",
    cardPoints: ["Faith that leads to real action", "Learning pathways that build leaders", "Compassionate service for lasting transformation"],
  },
  am: {
    eyebrow: "ስለ ሐመረ ወንጌል",
    title: "በእምነት፣ በሥልጠና እና በአገልግሎት ላይ የተመሠረተ እውነተኛ የአገልግሎት ታሪክ።",
    body:
      "መመሥረት (Establishment) ሐመረ ወንጌል ዘኢትዮጵያ፤ መንፈሳዊ ራእይንና ተልእኮን የሚሰጥ እግዚአብሔር መሆኑን በመረዳት፣ ተሐድሶአዊ ጥሪን መሠረት በማድረግ የተቋቋመ መንፈሳዊ ማኅበር ነው።",
    bodyTwo: `
      ማኅበሩ በጌታችን መድኃኒታችን ኢየሱስ ክርስቶስ የተሰጠውን ታላቅ ተልእኮ (ማቴ. 28:19-20፣ ሐዋ. 1:8) መመሪያ በማድረግ፣ ሕዝባችን ከኃጢአትና ከዘለዓለም ሞት የሚድንበትን የወንጌል ትምህርት በስፋት ለማድረስ እየተጋ ይገኛል። ሰኔ 24 ቀን 2006 ዓ.ም በአዲስ አበባ የተመሠረተው ይህ ማኅበር፣ በፌደራል ጉዳዮች ሚኒስቴር በምዝገባ ቁጥር ፌ.ጉ.ሚ 00500 ዕውቅና ተሰጥቶት በሕጋዊ መንገድ በማገልገል ላይ ይገኛል። የሐመረ ወንጌል ዘኢትዮጵያ ዋነኛ ራእይ "የኢትዮጵያ እናት ቤተ ክርስቲያን በቃለ ወንጌል ታድሳ ማየት" ሲሆን እኛ በቃለ ወንጌል የታደሰች ቤተ ክርስቲያን ስንል፤ ከአሮጌም ሆነ ከአዳዲስ ባዕዳን ትምህርቶችና ሥርዓቶች ተጠብቃ፣ በሁለንተናዊ እንቅስቃሴዋ ወንጌልን ማእከል ያደረገችና ለትውልድ የምታተርፍ ሕያው የእግዚአብሔር ቤት ሆና ማየትን ነው። ይህንንም ለማሳካት ባለፉት 11 ዓመታት (ከ2006 እስከ 2018 ዓ.ም) በርካታ ወገኖችን በወንጌል በመድረስ፣ ካህናትንና መሪዎችን ለተልእኮ በማሰልጠን እንዲሁም መጽሐፍ ቅዱስን ለሕዝባችን በማዳረስ ሰፋፊ ተግባራት ለማከናወን ተችሏል።
    `,
    cta: "ታሪካችንን ያንብቡ",
    cardTitle: "ሰዎች ለምን ይቀጥላሉ",
    cardPoints: ["የተመሠረተ መንፈሳዊ ትምህርት", "በማህበረሰብ ውስጥ የሚታይ ተፅእኖ", "ለረጅም ጊዜ እድገት የተገነቡ ፕሮግራሞች"],
  },
} as const;

export default function AboutTeaser({ locale }: AboutTeaserProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = content[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="bg-[#cedf93] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
        <div className="rounded-[28px] border border-[#121a11]/10 bg-[#f7f8ef] p-6 shadow-[0_14px_34px_rgba(23,35,18,0.08)] sm:p-8 lg:p-10">
          <p className={`text-[#000000] text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.2em]"}`}>
            {copy.eyebrow}
          </p>
          <h2 className={`mt-4 text-3xl text-[#121a11] sm:text-4xl lg:text-[3.2rem] ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-[1.1]"}`}>
            {normalizedLocale === "am" ? "የማህበረሰብ እድገትን በግልፅ አቅጣጫ እና በተግባር እንገነባለን" : "Little Discription"}
          </h2>
          <p className={`mt-6 max-w-3xl text-sm leading-7 text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans font-bold"}`}>
            {copy.body}
          </p>
          <p className={`mt-3 max-w-3xl text-sm leading-7 text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans font-bold"}`}>
            {copy.bodyTwo}
          </p>
          <div className="mt-8">
            <Link
              href={`${base}/about`}
              className={`inline-flex items-center justify-center rounded-full bg-[#121a11] px-6 py-3 text-xs text-[#f7f7f7] transition-all duration-300 hover:-translate-y-0.5 ${
                isAmharic ? "font-ethiopic text-base" : "font-sans uppercase tracking-[0.12em]"
              }`}
            >
              {copy.cta}
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-[#121a11]/12 bg-[#121a11] p-5 text-[#f7f7f7] shadow-[0_20px_36px_rgba(18,26,17,0.28)] sm:p-6">
          <div className="flex items-center justify-between border-b border-white/12 pb-4">
            <p className={`text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.14em]"}`}>
              {normalizedLocale === "am" ? "አፈጻጸም" : "Performance"}
            </p>
            <span className="rounded-full bg-[#d6ff00] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#121a11]">Live</span>
          </div>

          <div className="mt-5 rounded-2xl border border-white/12 bg-white/[0.04] p-4">
            <p className="font-serif text-4xl font-semibold text-[#d6ff00]">49%</p>
            <p className={`mt-1 text-xs text-[#f7f7f7] ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.14em]"}`}>
              {normalizedLocale === "am" ? "የተለካ የእድገት አቅጣጫ" : "Measured growth trend"}
            </p>
          </div>

          <p className={`mt-5 text-sm text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>{copy.cardTitle}</p>
          <ul className="mt-3 space-y-2 text-[#f7f7f7]">
            {copy.cardPoints.map((point) => (
              <li key={point} className={`rounded-xl border border-white/12 bg-white/[0.03] px-3 py-2 ${isAmharic ? "font-ethiopic text-sm" : "font-sans text-white"}`}>
                {point}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}