"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, UserCircle2, Menu } from "lucide-react";

export default function TeacherNavbar({
  title,
  onMobileMenuToggle,
}: {
  title: string;
  onMobileMenuToggle?: () => void;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();

  const locale = useMemo(() => {
    const segment = pathname.split("/")[1];
    return segment === "am" ? "am" : "en";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-white/5 bg-[#0d1f14]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="flex items-center gap-6">
          <button
            className="md:hidden rounded-xl p-2.5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
            onClick={onMobileMenuToggle}
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-white tracking-tight">{title}</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-0.5">Global Learning Environment</p>
          </div>
        </div>

        <div className="hidden lg:flex max-w-xl flex-1 items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] px-4 py-2.5 transition-all focus-within:border-mint/30 focus-within:bg-white/5">
          <Search size={16} className="text-slate-500" />
          <input
            className="w-full bg-transparent text-sm text-white placeholder:text-slate-600 focus:outline-none"
            placeholder="Search curricula, students, or submissions..."
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex gap-2">
             <Link
               href={`/${locale}/lms/dashboard/teacher/courses`}
               className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
             >
               Courses
             </Link>
             <Link
               href={`/${locale}/lms/dashboard/teacher/assignments`}
               className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 hover:bg-white/10 hover:border-white/20 transition-all"
             >
               Post Assignment
             </Link>
          </div>

          <div className="h-8 w-px bg-white/5 mx-2 hidden sm:block" />

          <button
            type="button"
            onClick={() => router.push(`/${locale}/lms/dashboard/teacher/messages`)}
            className="relative rounded-xl p-2.5 text-slate-400 hover:bg-white/10 hover:text-white transition-all"
            aria-label="notifications"
          >
            <Bell size={20} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-mint shadow-[0_0_10px_rgba(214,255,0,0.5)] border-2 border-[#0d1f14]" />
          </button>

          <button
            type="button"
            onClick={() => router.push(`/${locale}/lms/dashboard/teacher/profile`)}
            className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 pl-2 pr-4 py-1.5 transition-all hover:bg-white/10 hover:border-white/20"
          >
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-mint to-blue-500 flex items-center justify-center text-[#08120f] font-black text-xs">
               ID
            </div>
            <div className="text-left hidden sm:block">
               <p className="text-[10px] font-black text-white leading-none">Instructor</p>
               <p className="text-[10px] font-bold text-slate-500 leading-none mt-1 group-hover:text-mint transition-colors">Verified</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
