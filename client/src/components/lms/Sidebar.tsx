"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Home,
  BookOpen,
  Layers,
  MessageCircle,
  Calendar,
  Settings,
  User,
  LogOut,
  Menu,
  FileText,
  Award,
} from "lucide-react";
import TeacherSidebar from "@/components/lms/teacher/TeacherSidebar";

type RoleKey = "student" | "teacher";
type LocaleKey = "en" | "am";

function normalizeRole(role: string): "student" | "teacher" | "administrator" {
  const r = String(role || "").trim().toLowerCase();
  if (r === "super admin" || r === "super-admin" || r === "administrator" || r === "admin") return "administrator";
  if (r === "teacher" || r === "instructor") return "teacher";
  return "student";
}

const navItemsByRole: Record<RoleKey, Array<{ path: string; label: string; icon: any; exact?: boolean }>> = {
  student: [
    { path: "/lms/dashboard/student", label: "Home", icon: Home, exact: true },
    { path: "/lms/dashboard/student/profile", label: "Profile", icon: User },
    { path: "/lms/dashboard/student/courses", label: "Courses", icon: BookOpen },
    { path: "/lms/dashboard/student/assignments", label: "Assignments", icon: FileText },
    { path: "/lms/dashboard/student/classes", label: "Classes", icon: Layers },
    { path: "/lms/dashboard/student/messages", label: "Messages", icon: MessageCircle },
    { path: "/lms/dashboard/student/calendar", label: "Calendar", icon: Calendar },
    { path: "/lms/dashboard/student/certificates", label: "Certificates", icon: Award },
    { path: "/lms/dashboard/student/settings", label: "Settings", icon: Settings },
  ],
  teacher: [
    { path: "/lms/dashboard", label: "Home", icon: Home },
    { path: "/lms/courses", label: "Courses", icon: BookOpen },
    { path: "/lms/classes", label: "Classes", icon: Layers },
    { path: "/lms/messages", label: "Message", icon: MessageCircle },
    { path: "/lms/calendar", label: "Calendar", icon: Calendar },
    { path: "/lms/settings", label: "Settings", icon: Settings },
  ],
};
const Sidebar = memo(function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const router = useRouter();
  const activePath = pathname || "/en/lms/dashboard";
  const locale: LocaleKey = (() => {
    const segment = (pathname || "").split("/")[1];
    return segment === "am" ? "am" : "en";
  })();
  const base = `/${locale}`;

  const userRole = normalizeRole(user?.role || "") as RoleKey;
  if (userRole === "teacher") {
    return <TeacherSidebar isCollapsed={isCollapsed} onToggle={onToggle} />;
  }

  const items = navItemsByRole[userRole] || navItemsByRole.student;

  const handleLogout = () => {
    logout();
    router.push(`${base}/lms/login`);
  };

  return (
    <nav className={`flex h-full flex-col ${isCollapsed ? "w-20" : "w-64"} bg-[#08120f] border-r border-white/10 transition-all duration-300`}>
      <div className="flex items-center justify-between gap-2 px-4 py-4">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-[#d6ff00] text-[#0f1e13] shadow-[0_10px_30px_rgba(214,255,0,.18)]">
              SC
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#a5ff63]/80">Saint Cyril</p>
              <p className="text-sm font-semibold text-white">Student Hub</p>
            </div>
          </div>
        )}
        <button
          onClick={onToggle}
          className="rounded-2xl bg-white/5 p-2 text-[#f8fff4] hover:bg-white/10"
          aria-label="Toggle sidebar"
        >
          <Menu size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 py-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const href = `${base}${item.path}`;
            const active = item.exact
              ? activePath === href
              : activePath === href || activePath.startsWith(`${href}/`);
            return (
              <li key={item.path}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 rounded-[1.5rem] px-4 py-3 text-sm transition-all duration-200 ${
                    active
                      ? "bg-[#d6ff00] text-[#08120f] shadow-[0_20px_80px_rgba(214,255,0,.18)]"
                      : "text-[#e7f3e3] hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <item.icon size={18} />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-[#1d3a26] p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#d6ff00] px-3 py-3 text-sm font-semibold text-[#08120f] transition hover:bg-[#b3dd00]"
        >
          <LogOut size={16} />
          {!isCollapsed ? "Logout" : "Out"}
        </button>
      </div>
    </nav>
  );
});

export default Sidebar;
