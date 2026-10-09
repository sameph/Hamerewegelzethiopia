"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLang } from "@/context/LanguageContext";
import { translations } from "@/i18n/translations";
import MegaMenu from "./MegaMenu";
import clsx from "clsx";
import LanguageToggle from "./LanguageToggle";

function Chevron({ open }: { open: boolean }) {
  return (
    <motion.svg
      animate={{ rotate: open ? 180 : 0 }}
      transition={{ duration: 0.22 }}
      className="w-2.5 h-2.5 ml-0.5 opacity-55"
      viewBox="0 0 10 6"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
    >
      <path d="M1 1l4 4 4-4" />
    </motion.svg>
  );
}

function NavLink({
  href,
  children,
  hasDropdown,
  isOpen,
  onHover,
  onLeave,
  isActive,
  theme,
}: {
  href: string;
  children: React.ReactNode;
  hasDropdown?: boolean;
  isOpen?: boolean;
  onHover?: () => void;
  onLeave?: () => void;
  isActive?: boolean;
  theme: "light" | "night";
}) {
  const { lang } = useLang();
  const linkClass =
    theme === "night"
      ? "text-softWhite/90 hover:text-softWhite hover:bg-softWhite/16"
      : "text-white hover:text-charcoal hover:bg-charcoal/10";

  return (
    <Link
      href={href}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      className={clsx(
        "relative flex items-center gap-1 px-3 py-2 rounded-md transition-colors duration-200",
        isActive ? "bg-primaryBg text-charcoal" : linkClass,
        lang === "am"
          ? "font-ethiopic text-[0.82rem] font-bold"
          : "font-sans text-[0.72rem] uppercase tracking-[0.09em] font-bold"
      )}
    >
      {children}
      {hasDropdown && <Chevron open={!!isOpen} />}
      {isActive && (
        <motion.span
          layoutId="nav-underline"
          className="absolute bottom-0 left-3 right-3 h-[1.5px] rounded-full bg-gradient-to-r from-primaryBg to-limeCTA"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}

export default function Navbar() {
  const { lang } = useLang();
  const t = translations[lang].nav;
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [educationOpen, setEducationOpen] = useState(false);
  const [departmentsOpen, setDepartmentsOpen] = useState(false);
  const [mobileEducationOpen, setMobileEducationOpen] = useState(false);
  const [mobileDepartmentsOpen, setMobileDepartmentsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "night">("light");
  const educationTimer = useRef<ReturnType<typeof setTimeout>>();
  const departmentsTimer = useRef<ReturnType<typeof setTimeout>>();
  const mobileDrawerRef = useRef<HTMLDivElement>(null);
  const mobileDepartmentsButtonRef = useRef<HTMLButtonElement>(null);
  const mobileEducationButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => {
      const heroSyncSection = document.querySelector(
        "section[data-hero-sync='true']"
      ) as HTMLElement | null;
      let isScrolled = window.scrollY > 50;

      if (heroSyncSection) {
        const navHeight = 84;
        const heroBottom = heroSyncSection.getBoundingClientRect().bottom;
        isScrolled = heroBottom <= navHeight;
      }

      setScrolled(isScrolled);
      setTheme(isScrolled ? "night" : "light");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("site-theme", "light");
    }
    document.body.classList.remove("theme-light", "theme-night");
    document.body.classList.add("theme-light");
  }, []);

  useEffect(() => {
    if (!mobileDrawerRef.current) return;

    if (mobileDepartmentsOpen) {
      mobileDepartmentsButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else if (mobileEducationOpen) {
      mobileEducationButtonRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    } else {
      mobileDrawerRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [mobileDepartmentsOpen, mobileEducationOpen]);

  const openEducation = () => {
    clearTimeout(educationTimer.current);
    setEducationOpen(true);
  };
  const closeEducation = () => {
    educationTimer.current = setTimeout(() => setEducationOpen(false), 130);
  };
  const openDepartments = () => {
    clearTimeout(departmentsTimer.current);
    setDepartmentsOpen(true);
  };
  const closeDepartments = () => {
    departmentsTimer.current = setTimeout(() => setDepartmentsOpen(false), 130);
  };

  const base = `/${lang}`;
  const h = (path: string) => (path === "/" ? base : `${base}${path}`);
  const is = (path: string) =>
    path === "/"
      ? pathname === base || pathname === base + "/"
      : pathname.startsWith(base + path);

  const mainLinks = [
    { key: "home", path: "/" },
    { key: "about", path: "/about" },
    { key: "sermons", path: "/sermons" },
    { key: "blog", path: "/blog" },
    { key: "contact", path: "/contact" },
  ];

  const mobileLinks = [...mainLinks, { key: "donate", path: "/donate" }];

  const navTextClass = scrolled
    ? "text-softWhite/90 font-bold hover:text-softWhite hover:bg-softWhite/16"
    : "text-white font-bold hover:text-softWhite hover:bg-softWhite/16";
  return (
    <nav
      className={clsx(
        "fixed top-0 inset-x-0 z-50 transition-all duration-400",
        scrolled
          ? "shadow-xl shadow-charcoal/10 bg-[#000000]"
          : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between px-8 lg:px-10 py-4 max-w-[1440px] mx-auto">
        {/* Logo */}
        <Link
          href={h("/")}
          className="flex flex-shrink-0 items-center"
          aria-label="Hamere Wengel ZE Ethiopia"
        >
          <Image
            src="/assets/logos.png"
            alt="Hamere Wengel ZE Ethiopia logo"
            width={52}
            height={52}
            priority
            className="h-12 w-12 rounded-full object-contain"
          />
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-0.5 list-none">
          {mainLinks.slice(0, 2).map(({ key, path }) => (
            <li key={key}>
              <NavLink
                href={h(path)}
                isActive={is(path)}
                theme={scrolled ? "night" : theme}
              >
                {t[key as keyof typeof t]}
              </NavLink>
            </li>
          ))}

          {/* Departments dropdown */}
          <li
            className="relative"
            onMouseEnter={openDepartments}
            onMouseLeave={closeDepartments}
          >
            <NavLink
              href={h("/departments")}
              hasDropdown
              isOpen={departmentsOpen}
              isActive={is("/departments")}
              theme={scrolled ? "night" : theme}
              onHover={openDepartments}
              onLeave={closeDepartments}
            >
              {t.departments}
            </NavLink>
            <MegaMenu
              isOpen={departmentsOpen}
              locale={lang}
              kind="departments"
              onMouseEnter={openDepartments}
              onMouseLeave={closeDepartments}
            />
          </li>

          {/* Education dropdown */}
          <li
            className="relative"
            onMouseEnter={openEducation}
            onMouseLeave={closeEducation}
          >
            <NavLink
              href={h("/education")}
              hasDropdown
              isOpen={educationOpen}
              isActive={is("/education")}
              theme={scrolled ? "night" : theme}
              onHover={openEducation}
              onLeave={closeEducation}
            >
              {t.education}
            </NavLink>
            <MegaMenu
              isOpen={educationOpen}
              locale={lang}
              kind="education"
              onMouseEnter={openEducation}
              onMouseLeave={closeEducation}
            />
          </li>

          {mainLinks.slice(2).map(({ key, path }) => (
            <li key={key}>
              <NavLink
                href={h(path)}
                isActive={is(path)}
                theme={scrolled ? "night" : theme}
              >
                {t[key as keyof typeof t]}
              </NavLink>
            </li>
          ))}

          <li>
            <Link
              href={h("/donate")}
              className={clsx(
                "crypto-btn-primary ml-1 inline-flex items-center px-4 py-2 font-semibold",
                lang === "am"
                  ? "font-ethiopic text-[0.78rem]"
                  : "font-sans text-[0.72rem] uppercase tracking-[0.1em]"
              )}
            >
              {t.donate}
            </Link>
          </li>
        </ul>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center">
            <LanguageToggle />
          </div>
          <button
            className={clsx(
              "lg:hidden ml-1 p-2 rounded-md transition-colors",
              navTextClass
            )}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ WebkitOverflowScrolling: "touch" }}
            className="lg:hidden nav-surface border-t border-charcoal/10 overflow-y-auto max-h-[calc(100vh-4rem)]"
          >
            <div
              ref={mobileDrawerRef}
              className="px-4 py-4 flex flex-col gap-1"
            >
              {mobileLinks.map(({ key, path }) => (
                <Link
                  key={key}
                  href={h(path)}
                  className={clsx(
                    "px-4 py-3 rounded-md transition-colors min-h-[52px]",
                    navTextClass,
                    lang === "am"
                      ? "font-ethiopic text-[0.88rem]"
                      : "font-sans text-[0.75rem] uppercase tracking-[0.1em]"
                  )}
                >
                  {t[key as keyof typeof t]}
                </Link>
              ))}

              <div className="px-4 py-2">
                <LanguageToggle />
              </div>

              <button
                type="button"
                ref={mobileDepartmentsButtonRef}
                onClick={() => setMobileDepartmentsOpen((prev) => !prev)}
                className={clsx(
                  "mt-1 flex min-h-[52px] items-center justify-between px-4 py-3 rounded-md transition-colors text-left",
                  navTextClass,
                  lang === "am"
                    ? "font-ethiopic text-[0.88rem]"
                    : "font-sans text-[0.75rem] uppercase tracking-[0.1em]"
                )}
              >
                <span>{t.departments}</span>
                <Chevron open={mobileDepartmentsOpen} />
              </button>
              <MegaMenu
                isOpen={mobileDepartmentsOpen}
                locale={lang}
                kind="departments"
                mobile
              />

              <button
                type="button"
                ref={mobileEducationButtonRef}
                onClick={() => setMobileEducationOpen((prev) => !prev)}
                className={clsx(
                  "mt-2 flex min-h-[52px] items-center justify-between px-4 py-3 rounded-md transition-colors text-left",
                  navTextClass,
                  lang === "am"
                    ? "font-ethiopic text-[0.88rem]"
                    : "font-sans text-[0.75rem] uppercase tracking-[0.1em]"
                )}
              >
                <span>{t.education}</span>
                <Chevron open={mobileEducationOpen} />
              </button>
              <MegaMenu
                isOpen={mobileEducationOpen}
                locale={lang}
                kind="education"
                mobile
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
