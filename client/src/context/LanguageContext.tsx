"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useTransition,
  useRef,
  useEffect,
  type ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";

export type Locale = "en" | "am";
export type Lang = Locale;

const STORAGE_KEY = "hwz-lang";

interface LanguageContextValue {
  /** Current language code */
  lang: Lang;
  /** Alias for `lang` (legacy name used across the app) */
  locale: Lang;
  /** Toggle between available languages */
  toggleLang: () => void;
  /** Explicitly set language (useful for direct user selection) */
  setLang: (lang: Lang) => void;
  /** Indicates an in-flight transition/route change */
  isPending: boolean;
  /** Indicates the UI is currently showing a fade transition */
  isSwitching: boolean;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: "en",
  locale: "en",
  toggleLang: () => {},
  setLang: () => {},
  isPending: false,
  isSwitching: false,
});

function normalizeLocale(locale?: string | Lang): Lang {
  return locale === "am" ? "am" : "en";
}

export function LanguageProvider({
  children,
  initialLang,
  initialLocale,
}: {
  children: ReactNode;
  initialLang?: Lang | string;
  initialLocale?: Lang | string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const initial = normalizeLocale(initialLang ?? initialLocale ?? "en");
  const [lang, setLangState] = useState<Lang>(initial);
  const [isSwitching, setIsSwitching] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Preserve scroll position across language switches
  const scrollYRef = useRef(0);

  const navigate = useCallback(
    (next: Lang) => {
      const stripped = pathname.replace(/^\/(am|en)/, "") || "/";
      router.push(`/${next}${stripped}`);
    },
    [pathname, router]
  );

  const setLang = useCallback(
    (next: Lang) => {
      if (next === lang) return;

      window.localStorage?.setItem(STORAGE_KEY, next);
      setLangState(next);

      // Keep UI stable while the route updates
      scrollYRef.current = window.scrollY;
      setIsSwitching(true);

      setTimeout(() => {
        startTransition(() => {
          navigate(next);
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              window.scrollTo({ top: scrollYRef.current, behavior: "instant" });
              setIsSwitching(false);
            });
          });
        });
      }, 220);
    },
    [lang, navigate, startTransition]
  );

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "am" : "en");
  }, [lang, setLang]);

  // On first render, load saved language and sync the URL
  useEffect(() => {
    const stored = window.localStorage?.getItem(STORAGE_KEY) as Lang | null;
    if (stored && stored !== lang && (stored === "en" || stored === "am")) {
      setLang(stored);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <LanguageContext.Provider
      value={{
        lang,
        locale: lang,
        toggleLang,
        setLang,
        isPending,
        isSwitching,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}
