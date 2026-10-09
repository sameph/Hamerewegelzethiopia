"use client";

import Link from "next/link";
import { useMemo, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  Home,
  User,
  BookOpen,
  Layers,
  Users,
  FileText,
  MessageCircle,
  Calendar,
  Award,
  BarChart3,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";

type LocaleKey = "en" | "am";

const teacherItems: Array<{ path: string; label: string; icon: any; exact?: boolean }> = [
  { path: "/lms/dashboard/teacher", label: "Dashboard", icon: Home, exact: true },
  { path: "/lms/dashboard/teacher/profile", label: "Profile", icon: User },
  { path: "/lms/dashboard/teacher/courses", label: "My Courses", icon: BookOpen },
  { path: "/lms/dashboard/teacher/classes", label: "Classes", icon: Layers },
  { path: "/lms/dashboard/teacher/students", label: "Students", icon: Users },
  { path: "/lms/dashboard/teacher/messages", label: "Messages", icon: MessageCircle },
  { path: "/lms/dashboard/teacher/calendar", label: "Calendar", icon: Calendar },
  { path: "/lms/dashboard/teacher/certificates", label: "Certificates", icon: Award },
  { path: "/lms/dashboard/teacher/analytics", label: "Analytics", icon: BarChart3 },
  { path: "/lms/dashboard/teacher/settings", label: "Settings", icon: Settings },
];

export default function TeacherSidebar({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { logout } = useAuth();

  const locale = useMemo<LocaleKey>(() => {
    const segment = pathname.split("/")[1];
    return segment === "am" ? "am" : "en";
  }, [pathname]);

  const base = `/${locale}`;

  const handleLogout = useCallback(() => {
    logout();
    router.push(`${base}/lms/login`);
  }, [base, logout, router]);

  return (
    <nav className={`flex h-full flex-col ${isCollapsed ? "w-20" : "w-72"} bg-[#0d1f14]/95 backdrop-blur-3xl text-white border-r border-white/5 transition-all duration-500 ease-in-out`}>
      <div className="flex items-center justify-between gap-2 px-6 py-8">
        {!isCollapsed && (
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-mint text-[#08120f] font-black italic text-xl shadow-[0_0_20px_rgba(214,255,0,0.3)]">
              SC
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] uppercase tracking-[0.4em] font-black text-mint/80 truncate">Saint Cyril</p>
              <p className="text-sm font-black text-white tracking-tight truncate">LMS Instructor</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-xl bg-white/5 p-2.5 text-white/70 hover:bg-white/10 hover:text-white transition-all active:scale-90"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 custom-scrollbar">
        <ul className="space-y-1.5">
          {teacherItems.map((item, idx) => {
            const href = `${base}${item.path}`;
            const active = item.exact
              ? pathname === href
              : pathname === href || pathname.startsWith(`${href}/`);

            return (
              <li key={item.path} className="animate-in fade-in slide-in-from-left-2 fill-mode-both" style={{ animationDelay: `${idx * 40}ms` }}>
                <Link
                  href={href}
                  className={`flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-bold transition-all duration-300 ${
                    active
                      ? "bg-mint text-[#08120f] shadow-[0_10px_30px_rgba(214,255,0,0.2)]"
                      : "text-slate-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon size={20} className={`${active ? 'text-[#08120f]' : 'text-slate-500'}`} />
                  {!isCollapsed && <span className="tracking-tight">{item.label}</span>}
                  {active && !isCollapsed && <div className="ml-auto h-1.5 w-1.5 rounded-full bg-[#08120f]" />}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="p-6">
        <button
          type="button"
          onClick={handleLogout}
          className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-white/5 px-4 py-4 text-sm font-black text-white transition-all hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20"
        >
          <LogOut size={18} className="transition-transform group-hover:-translate-x-1" />
          {!isCollapsed && <span className="uppercase tracking-widest text-[10px]">Sign Out</span>}
        </button>
      </div>
    </nav>
  );
}
