import Link from "next/link";
import type { Locale } from "@/context/LanguageContext";

type HomeFooterProps = {
  locale: Locale;
};

const content = {
  en: {
    title: "Hamere Wengel ZE Ethiopia",
    blurb: "A modern ministry platform for teaching, outreach, charity, and long-term community formation.",
    contactLabel: "Contact",
    navLabel: "Navigation",
    socialLabel: "Social",
    links: [
      { title: "Home", href: "/" },
      { title: "About", href: "/about" },
      { title: "Departments", href: "/departments" },
      { title: "Donate", href: "/donate" },
    ],
    socials: ["Facebook", "YouTube", "Telegram"],
    copyright: "© 2026 Hamere Wengel ZE Ethiopia. All rights reserved.",
  },
  am: {
    title: "ሐመረ ወንጌል ዘኢትዮጵያ",
    blurb: "ለትምህርት፣ ለወንጌል ስርጭት፣ ለርህራሄ አገልግሎት እና ለረጅም ጊዜ የማህበረሰብ እድገት የተሠራ ዘመናዊ የአገልግሎት መድረክ።",
    contactLabel: "አድራሻ",
    navLabel: "መዳረሻ",
    socialLabel: "ማህበራዊ",
    links: [
      { title: "መነሻ", href: "/" },
      { title: "ስለ እኛ", href: "/about" },
      { title: "ክፍሎች", href: "/departments" },
      { title: "ይለግሱ", href: "/donate" },
    ],
    socials: ["Facebook", "YouTube", "Telegram"],
    copyright: "© 2026 ሐመረ ወንጌል ዘኢትዮጵያ. መብቶች በሙሉ የተጠበቁ ናቸው።",
  },
} as const;

export default function Footer({ locale }: HomeFooterProps) {
  const normalizedLocale: Locale = locale === "am" ? "am" : "en";
  const base = `/${normalizedLocale}`;
  const copy = content[normalizedLocale];
  const isAmharic = normalizedLocale === "am";

  return (
    <footer className="relative overflow-hidden bg-[#09110b] px-4 pb-10 pt-12 sm:px-6 lg:px-12">
      <div className="relative mx-auto max-w-7xl rounded-[28px] border border-white/10 bg-white/[0.04] p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr]">
          <div>
            <p className={`text-2xl text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-serif font-semibold"}`}>{copy.title}</p>
            <p className={`mt-4 max-w-md text-sm leading-7 text-[#f7f7f7] ${isAmharic ? "font-ethiopic text-base" : "font-sans"}`}>
              {copy.blurb}
            </p>
          </div>

          <div>
            <p className={`text-sm text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.16em]"}`}>{copy.contactLabel}</p>
            <div className={`mt-4 space-y-3 text-[#f7f7f7] ${isAmharic ? "font-ethiopic text-base" : "font-sans text-sm"}`}>
              <a href="mailto:info@hamerewengel.org" className="block transition hover:text-[#d6ff00]">info@hamerewengel.org</a>
              <a href="tel:+251111234567" className="block transition hover:text-[#d6ff00]">+251 11 123 4567</a>
              <a href="https://www.google.com/maps/place/Addis+Ababa,+Ethiopia" target="_blank" rel="noopener noreferrer" className="block transition hover:text-[#d6ff00]">Addis Ababa, Ethiopia</a>
            </div>
          </div>

          <div>
            <p className={`text-sm text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.16em]"}`}>{copy.navLabel}</p>
            <div className="mt-4 flex flex-col gap-3">
              {copy.links.map((link) => (
                <Link
                  key={link.title}
                  href={link.href === "/" ? base : `${base}${link.href}`}
                  className={`text-[#f7f7f7] transition hover:text-[#d6ff00] ${isAmharic ? "font-ethiopic text-base" : "font-sans text-sm"}`}
                >
                  {link.title}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p className={`text-sm text-[#d6ff00] ${isAmharic ? "font-ethiopic" : "font-sans uppercase tracking-[0.16em]"}`}>{copy.socialLabel}</p>
            <div className="mt-4 flex flex-col gap-3">
              {copy.socials.map((social) => (
                <a key={social} href="#" className={`text-[#f7f7f7] transition hover:text-[#d6ff00] ${isAmharic ? "font-ethiopic text-base" : "font-sans text-sm"}`}>
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/12 pt-5">
          <p className={`text-[#f7f7f7] ${isAmharic ? "font-ethiopic text-sm" : "font-sans text-xs uppercase tracking-[0.12em]"}`}>
            {copy.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
}