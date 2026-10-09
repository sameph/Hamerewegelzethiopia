import type { Locale } from "@/context/LanguageContext";

type ProcessSectionProps = {
  locale: Locale;
};

const steps = {
  en: {
    eyebrow: "collage",
    current: "1 / 5",
    title: "Saint Cyril College",
    body: "Qidus Qerlos College (ቅዱስ ቄርሎስ ኮሌጅ) provides structured ministry education through theology programs, leadership formation, and service-oriented courses designed for long-term community impact.",
    panels: ["About College"],
  },
  am: {
    eyebrow: "ዋጋ",
    current: "1 / 5",
    title: "ቅዱስ ቄርሎስ ኮሌጅ",
    body: "ቅዱስ ቄርሎስ ኮሌጅ በሥነ-መለኮት ፕሮግራሞች፣ በመሪነት ስልጠና እና በተግባራዊ አገልግሎት ኮርሶች የተደራጀ የአገልግሎት ትምህርት ይሰጣል።",
    panels: ["ስለ ኮሌጁ"],
  },
} as const;

export default function ProcessSection({ locale }: ProcessSectionProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const copy = steps[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <section className="bg-[#09110b] px-4 py-14 sm:px-6 sm:py-18 lg:px-12 lg:py-24">
      <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[30px] border border-white/10 lg:grid-cols-2">
        <div className="relative bg-[#071008] p-8 sm:p-10 lg:p-12">
          <p className={`text-[#d6ff00] text-xs ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.22em]"}`}>
            {copy.eyebrow}
          </p>
          <h2 className={`mt-6 text-4xl text-[#d6ff00] sm:text-5xl ${isAmharic ? "font-ethiopic leading-[1.3]" : "font-serif font-semibold leading-[1.04]"}`}>
            {copy.title}
          </h2>
          <p className={`mt-5 max-w-md text-sm leading-7 text-[#f7f7f7] ${isAmharic ? "font-ethiopic" : "font-sans"}`}>
            {copy.body}
          </p>
          <div className="mt-7 flex items-center gap-2">
            {copy.panels.map((item, index) => (
              <span
                key={item}
                className={`inline-flex rounded-full px-3 py-1 text-[10px] ${index === 0 ? "bg-[#d6ff00] text-[#121a11]" : "border border-white/35 text-[#f7f7f7]"} ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.14em]"}`}
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden p-6 sm:p-8">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(214,255,0,0.18),transparent_35%),linear-gradient(140deg,rgba(14,20,12,0.52),rgba(20,32,16,0.56),rgba(10,16,10,0.62))]" />
          <p className="absolute right-6 top-4 font-serif text-3xl text-[#d6ff00]/82">{copy.current}</p>
          <div className="absolute bottom-10 left-1/2 h-32 w-44 -translate-x-1/2 rounded-2xl border border-white/35 bg-[#f7f8ef]/10 shadow-[0_24px_30px_rgba(0,0,0,0.2)]" />
          <div className="absolute bottom-16 left-1/2 h-20 w-60 -translate-x-1/2 rounded-full border-2 border-[#d6ff00]" />
          <div className="absolute bottom-20 left-1/2 h-16 w-48 -translate-x-1/2 rounded-full border-2 border-white/75" />
          <div className="absolute bottom-24 left-1/2 h-12 w-36 -translate-x-1/2 rounded-full border-2 border-white/55" />
        </div>
      </div>
    </section>
  );
}
