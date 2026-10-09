import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type ContentCommunityProps = {
  locale: Locale;
};

const content = {
  en: {
    eyebrow: "Content and Community",
    title: "Fresh stories, current programs, and clear ways to stay engaged.",
    postsLabel: "Latest Blog Posts",
    eventsLabel: "Events and Programs",
    communityLabel: "Community Engagement",
    posts: [
      {
        title: "Teaching that forms conviction and character",
        summary: "A look at how discipleship sessions are helping young leaders grow in faith and responsibility.",
        href: "/blog",
        meta: "Blog update",
      },
      {
        title: "How outreach programs are expanding local impact",
        summary: "Recent evangelism activities are reaching new neighborhoods through practical service and partnership.",
        href: "/blog",
        meta: "Ministry story",
      },
      {
        title: "What learners need from the next generation of ministry tools",
        summary: "A short reflection on improving learning pathways, mentorship, and digital resources.",
        href: "/blog",
        meta: "Platform insight",
      },
    ],
    events: [
      {
        name: "Weekly Discipleship and Prayer Night",
        description: "An open gathering for teaching, prayer, and spiritual encouragement.",
        date: "Every Friday",
      },
      {
        name: "Volunteer Training Track",
        description: "Structured sessions for ministry workers and community volunteers.",
        date: "May 25, 2026",
      },
      {
        name: "Family Outreach Weekend",
        description: "Community-centered activities for families, children, and local neighbors.",
        date: "June 8, 2026",
      },
    ],
    communityText:
      "Join upcoming programs, follow new teaching content, and find practical ways to support the people and places this ministry serves.",
    primaryCta: "Visit the Blog",
    secondaryCta: "Contact the Team",
  },
  am: {
    eyebrow: "ይዘት እና ማህበረሰብ",
    title: "አዲስ ታሪኮች፣ በአሁኑ ጊዜ የሚካሄዱ ፕሮግራሞች እና ለመሳተፍ ግልፅ መንገዶች።",
    postsLabel: "የቅርብ ጊዜ የብሎግ ፅሁፎች",
    eventsLabel: "ዝግጅቶች እና ፕሮግራሞች",
    communityLabel: "የማህበረሰብ ተሳትፎ",
    posts: [
      {
        title: "የእምነትን ጥልቀት እና ባህሪን የሚያበረታታ ትምህርት",
        summary: "የደቀ መዝሙርነት ክፍሎች ወጣቶችን በእምነትና በኃላፊነት ላይ እንዴት እያበቁ እንደሆነ ማብራሪያ።",
        href: "/blog",
        meta: "የብሎግ ማሻሻያ",
      },
      {
        title: "የወንጌል ስርጭት ፕሮግራሞች የአካባቢ ተፅእኖን እንዴት እያሰፉ ነው",
        summary: "በአገልግሎት እና በአጋርነት አዲስ አካባቢዎችን የሚደርስ የቅርብ ጊዜ የወንጌል ስርጭት ሪፖርት።",
        href: "/blog",
        meta: "የአገልግሎት ታሪክ",
      },
      {
        title: "ተማሪዎች ከሚቀጥለው ትውልድ የአገልግሎት መሳሪያዎች ምን ያስፈልጋቸዋል",
        summary: "የመማር መንገዶችን፣ ምክር ስርዓትን እና የዲጂታል ምንጮችን ለማሻሻል አጭር እይታ።",
        href: "/blog",
        meta: "የመድረክ እይታ",
      },
    ],
    events: [
      {
        name: "ሳምንታዊ የደቀ መዝሙርነት እና ጸሎት",
        description: "ለትምህርት፣ ለጸሎት እና ለመንፈሳዊ እርስ በርስ ድጋፍ ክፍት ስብሰባ።",
        date: "በየአርብ",
      },
      {
        name: "የበጎ ፈቃደኞች ሥልጠና",
        description: "ለአገልጋዮች እና ለበጎ ፈቃደኞች የተደራጀ የሥልጠና ፕሮግራም።",
        date: "ግንቦት 25 ቀን 2026",
      },
      {
        name: "የቤተሰብ የወንጌል ስርጭት ሳምንት",
        description: "ለቤተሰቦች፣ ለህፃናት እና ለአካባቢ ህብረት የተዘጋጁ ተግባራት።",
        date: "ሰኔ 8 ቀን 2026",
      },
    ],
    communityText:
      "በሚመጡ ፕሮግራሞች ይሳተፉ፣ አዲስ የትምህርት ይዘቶችን ይከታተሉ እና ይህ አገልግሎት የሚያገለግላቸውን ሰዎችና አካባቢዎች ለመደገፍ ተግባራዊ መንገዶችን ያግኙ።",
    primaryCta: "ብሎጉን ይጎብኙ",
    secondaryCta: "ቡድኑን ያግኙ",
  },
} as const;

export default function ContentCommunity({ locale }: ContentCommunityProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = content[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="bg-[#cedf93] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className={`text-black text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.2em]"}`}>
              {copy.postsLabel}
            </p>
            <h2 className={`mt-4 text-3xl text-[#121a11] sm:text-4xl lg:text-5xl ${isAmharic ? "font-ethiopic leading-[1.34]" : "font-serif font-semibold leading-tight"}`}>
              {normalizedLocale === "am" ? "አዳዲስ እይታዎች እና አቅጣጫዎች" : "Latest insights and trends"}
            </h2>
            <p className={`mt-5 max-w-md text-sm leading-7 text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans font-bold"}`}>
              {normalizedLocale === "am"
                ? "ማህበረሰብን የሚያነቃቁ ጽሁፎችን፣ የአገልግሎት ትምህርቶችን እና የዲጂታል ተሞክሮዎችን ይከታተሉ።"
                : "Where service activities meet clear thinking, these updates share what is working and where we are heading next."}
            </p>
          </div>

          <div className="space-y-3">
            {copy.posts.concat(copy.posts[0]).map((post, index) => (
              <Link
                key={`${post.title}-${index}`}
                href={`${base}${post.href}`}
                className="grid grid-cols-[110px_1fr] gap-4 rounded-2xl border border-[#121a11]/10 bg-[#e8efc8] p-3 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_24px_rgba(18,26,17,0.08)]"
              >
                <div className="rounded-xl bg-[radial-gradient(circle_at_30%_20%,rgba(214,255,0,0.45),transparent_45%),linear-gradient(140deg,rgba(18,26,17,0.92),rgba(36,58,31,0.88))]" />
                <div>
                  <p className="font-sans text-[10px] uppercase tracking-[0.18em] font-bold text-black">{post.meta}</p>
                  <h3 className={`mt-1 text-lg text-[#000000] ${isAmharic ? "font-ethiopic leading-[1.4]" : "font-serif font-bold leading-snug"}`}>
                    {post.title}
                  </h3>
                  <p className={`mt-2 text-sm leading-6 text-[#000000] ${isAmharic ? "font-ethiopic" : "font-sans font-bold"}`}>{post.summary}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}