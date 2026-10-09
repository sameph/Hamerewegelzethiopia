"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useLang } from "@/context/LanguageContext";
import clsx from "clsx";
import { DEPARTMENTS } from "@/data/departments";

const menuVariants = {
  hidden:  { opacity: 0, y: -10, clipPath: "inset(0 0 100% 0 round 10px)" },
  visible: { opacity: 1, y: 0,   clipPath: "inset(0 0 0% 0 round 10px)",
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.04, delayChildren: 0.06 } },
  exit:    { opacity: 0, y: -8,  clipPath: "inset(0 0 100% 0 round 10px)",
    transition: { duration: 0.2, ease: "easeIn" } },
};
const mobileMenuVariants = {
  hidden: { opacity: 0, y: -10, height: 0 },
  visible: {
    opacity: 1,
    y: 0,
    height: "auto",
    transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1], staggerChildren: 0.03, delayChildren: 0.03 },
  },
  exit: { opacity: 0, y: -8, height: 0, transition: { duration: 0.2, ease: "easeIn" } },
};
const colV = { hidden: { opacity: 0, y: 8 }, visible: { opacity: 1, y: 0, transition: { duration: 0.28 } } };
const itemV = { hidden: { opacity: 0, x: -5 }, visible: { opacity: 1, x: 0, transition: { duration: 0.2 } } };

type DesktopEntry = {
  href: string;
  icon: string;
  title: string;
  subtitle: string;
  links: Array<{ label: string; href: string }>;
};

function MegaItem({ href, icon, title, subtitle, mobile = false }: { href: string; icon: string; title: string; subtitle: string; mobile?: boolean }) {
  return (
    <motion.div variants={itemV}>
      <Link
        href={href}
        className={clsx(
          "group block",
          mobile
            ? "rounded-xl border border-[#1f4527]/12 bg-white/70 px-4 py-3 min-h-[56px]"
            : "rounded-xl border border-[#1f4527]/14 bg-white/72 p-4",
          "transition-all duration-300 hover:-translate-y-0.5 hover:border-[#84b942]/55 hover:bg-[#f7fbc8]/95"
        )}
      >
        <div className="mb-3 text-xl opacity-85 group-hover:opacity-100">{icon}</div>
        <p className="font-sans text-[0.82rem] font-semibold text-[#183a21] group-hover:text-[#4c8525]">{title}</p>
        <p className="mt-1 font-sans text-[0.68rem] text-[#183a21]/64">{subtitle}</p>
      </Link>
    </motion.div>
  );
}

export default function MegaMenu({ isOpen, locale, kind, onMouseEnter, onMouseLeave, mobile = false }: {
  isOpen: boolean;
  locale: string;
  kind: "education" | "departments";
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  mobile?: boolean;
}) {
  const { lang } = useLang();
  const base = `/${locale}`;
  const isEducation = kind === "education";
  const [activeIndex, setActiveIndex] = useState(0);

  const mobileDepartmentItems = DEPARTMENTS.map((department) => ({
    href: `${base}/departments/${department.slug}`,
    icon: department.icon,
    title: `${department.title} (${department.amharic})`,
    subtitle: lang === "am" ? "ዝርዝር ገጽ" : "Department page",
  }));

  const mobileEducationItems = [
    {
      href: `${base}/lms/admissions`,
      icon: "📋",
      title: lang === "am" ? "Admissions" : "Admissions",
      subtitle: lang === "am" ? "ምዝገባ እና መቀበያ" : "Registration & enrollment",
    },
    {
      href: `${base}/education/library/books`,
      icon: "📚",
      title: lang === "am" ? "Library" : "Library",
      subtitle: lang === "am" ? "ዲጂታል ምንጮች" : "Digital resources",
    },
    {
      href: `${base}/education/lms/login`,
      icon: "💻",
      title: lang === "am" ? "LMS" : "LMS",
      subtitle: lang === "am" ? "ኮርሶች እና ስራዎች" : "Courses and assignments",
    },
    {
      href: `${base}/education/graduation`,
      icon: "🎓",
      title: lang === "am" ? "Graduation" : "Graduation",
      subtitle: lang === "am" ? "ምረቃ መመሪያ" : "Graduation guidance",
    },
  ];

  const items = isEducation ? mobileEducationItems : mobileDepartmentItems;

  const desktopItems = useMemo<DesktopEntry[]>(() => {
    if (isEducation) {
      return [
        {
          href: `${base}/lms/admissions`,
          icon: "📋",
          title: lang === "am" ? "Admissions" : "Admissions",
          subtitle: lang === "am" ? "ምዝገባ እና መቀበያ" : "Registration & enrollment",
          links: [
            { label: lang === "am" ? "ምዝገባ ጀምር" : "Start Application", href: `${base}/lms/admissions` },
            { label: lang === "am" ? "ወደ ምዝገባ ሂድ" : "Register Account", href: `${base}/lms/register` },
          ],
        },
        {
          href: `${base}/education/library/books`,
          icon: "📚",
          title: lang === "am" ? "Library" : "Library",
          subtitle: lang === "am" ? "ዲጂታል ምንጮች" : "Digital resources",
          links: [
            { label: lang === "am" ? "የመጽሐፍት ፖርታል" : "Open Library Portal", href: `${base}/education/library/books` },
          ],
        },
        {
          href: `${base}/education/lms/login`,
          icon: "💻",
          title: lang === "am" ? "LMS" : "LMS",
          subtitle: lang === "am" ? "ኮርሶች እና ስራዎች" : "Courses and assignments",
          links: [
            { label: lang === "am" ? "ወደ LMS መግቢያ" : "Open LMS Portal", href: `${base}/education/lms/login` },
            { label: lang === "am" ? "የLMS አጠቃላይ ገጽ" : "LMS Overview", href: `${base}/education/lms` },
          ],
        },
        {
          href: `${base}/education/graduation`,
          icon: "🎓",
          title: lang === "am" ? "Graduation" : "Graduation",
          subtitle: lang === "am" ? "ምረቃ መመሪያ" : "Graduation guidance",
          links: [
            { label: lang === "am" ? "የምረቃ መመሪያ" : "Graduation Details", href: `${base}/education/graduation` },
            { label: lang === "am" ? "ትምህርት መነሻ" : "Back to Education", href: `${base}/education` },
          ],
        },
      ];
    }

    return DEPARTMENTS.map((department) => ({
      href: `${base}/departments/${department.slug}`,
      icon: department.icon,
      title: `${department.title}`,
      subtitle: `${department.amharic}`,
      links: [
        { label: lang === "am" ? "የክፍል ዝርዝር ገጽ" : "Open Department Page", href: `${base}/departments/${department.slug}` },
        { label: lang === "am" ? "ያግኙን" : "Contact Department", href: `${base}/contact` },
      ],
    }));
  }, [base, isEducation, lang]);

  useEffect(() => {
    setActiveIndex(0);
  }, [isEducation, isOpen]);

  const activeItem = desktopItems[Math.min(activeIndex, Math.max(desktopItems.length - 1, 0))];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="mega"
          role="region"
          aria-label={isEducation ? "Education menu" : "Departments menu"}
          variants={mobile ? mobileMenuVariants : menuVariants}
          initial="hidden" animate="visible" exit="exit"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className={clsx(
            mobile
              ? "relative left-0 right-0 -mx-4 w-[calc(100%+2rem)] overflow-hidden border-t border-white/30 bg-[rgba(255,255,255,0.42)] px-4 py-4 backdrop-blur-[18px]"
              : clsx(
                  "absolute top-[calc(100%+0.5rem)] z-50 w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-white/30 bg-[rgba(255,255,255,0.26)] shadow-[0_24px_52px_rgba(10,28,22,.24)] backdrop-blur-[18px]",
                  isEducation ? "left-1/2 -translate-x-1/2 max-w-[760px]" : "left-0 max-w-[860px]"
                )
          )}
        >
          {mobile ? (
            <motion.div variants={colV}>
              <div className="mb-2.5 border-b border-[#1f4527]/14 pb-2.5">
                <p className="font-sans text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#1a3d22] leading-none">
                  {isEducation ? (lang === "am" ? "Education" : "Education") : (lang === "am" ? "Departments" : "Departments")}
                </p>
                <p className="mt-1 font-sans text-[0.56rem] uppercase tracking-[0.12em] text-[#1a3d22]/62">
                  {isEducation ? (lang === "am" ? "ፈጣን አገናኞች" : "Quick links") : (lang === "am" ? "የክፍል ዝርዝሮች" : "Department listings")}
                </p>
              </div>
              <div className="mt-4 flex flex-col gap-3">
                {items.map((item) => (
                  <MegaItem
                    key={`${item.href}-${item.title}`}
                    href={item.href}
                    icon={item.icon}
                    title={item.title}
                    subtitle={item.subtitle}
                    mobile
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div variants={colV} className="grid grid-cols-12">
              <div className="col-span-4 border-r border-white/35 bg-[rgba(255,255,255,0.72)] p-2.5 backdrop-blur-[14px]">
                {desktopItems.map((item, index) => (
                  <button
                    key={`${item.href}-${item.title}`}
                    type="button"
                    onMouseEnter={() => setActiveIndex(index)}
                    className={clsx(
                      "mb-1.5 flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left transition",
                      index === activeIndex ? "bg-white/95 text-[#1f2a2f] shadow-sm" : "text-[#2c3940] hover:bg-white/70"
                    )}
                  >
                    <span className="font-sans text-[0.84rem] font-medium">{item.title}</span>
                    <span className="text-sm opacity-75">›</span>
                  </button>
                ))}
              </div>

              <div className="col-span-8 bg-[rgba(255,255,255,0.58)] p-6 text-[#243038] backdrop-blur-[14px]">
                {activeItem && (
                  <>
                    <p className="font-sans text-xs uppercase tracking-[0.16em] text-[#51606b]">
                      {isEducation ? (lang === "am" ? "ትምህርት ምናሌ" : "Education Menu") : (lang === "am" ? "የክፍሎች ምናሌ" : "Departments Menu")}
                    </p>
                    <h3 className="mt-3 font-serif text-3xl font-semibold text-[#1c2f3b]">{activeItem.title}</h3>
                    <p className="mt-2 max-w-xl font-sans text-sm text-[#3e4f5b]">{activeItem.subtitle}</p>

                    <div className={clsx("mt-6 gap-y-3", isEducation ? "grid grid-cols-1" : "grid grid-cols-2 gap-x-6")}>
                      {activeItem.links.map((link) => (
                        <Link
                          key={`${activeItem.href}-${link.href}-${link.label}`}
                          href={link.href}
                          className="font-sans text-sm text-[#1e313b] transition hover:text-[#5c7a32]"
                        >
                          {link.label}
                        </Link>
                      ))}
                    </div>

                    <Link
                      href={activeItem.href}
                      className="mt-8 inline-flex items-center rounded-full bg-[#d6ff00] px-5 py-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-[#17351f] transition hover:bg-[#a6ff4d]"
                    >
                      {lang === "am" ? "ክፈት" : "Open"}
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
