"use client";

import { useLang } from "@/context/LanguageContext";

export default function LanguageToggle() {
  const { lang, toggleLang } = useLang();

  const label = lang === "am" ? "E" : "አ";
  const ariaLabel = lang === "am" ? "Switch to English" : "ወደ አማርኛ ቀይር";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={ariaLabel}
      className="px-3 py-1.5 rounded-full border border-sage/25 bg-sage/10 text-mist hover:bg-sage/20 transition-colors"
    >
      {label}
    </button>
  );
}
