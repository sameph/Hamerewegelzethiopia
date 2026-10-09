"use client";

import { memo, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Globe2, Search, UserCircle2, Menu } from "lucide-react";
import TeacherNavbar from "@/components/lms/teacher/TeacherNavbar";
import { useAuth } from "@/context/AuthContext";

function normalizeRole(role: string): "student" | "teacher" | "administrator" {
  const r = String(role || "").trim().toLowerCase();
  if (r === "super admin" || r === "super-admin" || r === "administrator" || r === "admin") return "administrator";
  if (r === "teacher" || r === "instructor") return "teacher";
  return "student";
}

const TopNavbar = memo(function TopNavbar({ title, onMobileMenuToggle }: { title: string; onMobileMenuToggle?: () => void }) {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { user } = useAuth();

  const locale = useMemo(() => {
    const segment = pathname.split("/")[1];
    return segment === "am" ? "am" : "en";
  }, [pathname]);

  const userRole = normalizeRole(user?.role || "") as "student" | "teacher" | "administrator";

  const handleNotifications = () => {
    router.push(`/${locale}/lms/notifications`);
  };

  const handleLocaleToggle = () => {
    const nextLocale = locale === "en" ? "am" : "en";
    const segments = pathname.split("/");
    const rest = segments.slice(2).join("/");
    router.push(`/${nextLocale}/${rest || "lms/dashboard"}`);
  };

  const handleProfile = () => {
    router.push(`/${locale}/lms/dashboard/${userRole}/profile`);
  };

  if (userRole === "teacher") {
    return <TeacherNavbar title={title} onMobileMenuToggle={onMobileMenuToggle} />;
  }

  return (
    <header className="sticky top-0 z-20 border-b border-[#d2e4d5] bg-[#eef6ef] backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <button
            className="md:hidden rounded-lg p-2 text-charcoal hover:bg-primaryBg/50 hover:text-charcoal"
            onClick={onMobileMenuToggle}
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-charcoal">{title}</h1>
            <p className="text-xs text-bodyText/75">Search for courses or lessons</p>
          </div>
        </div>

        <div className="card-ui flex max-w-md flex-1 items-center gap-3 p-2">
          <Search size={16} className="text-charcoal" />
          <input
            className="w-full bg-transparent text-sm text-charcoal placeholder:text-bodyText/70 focus:outline-none"
            placeholder="Search courses..."
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNotifications}
            className="rounded-lg p-2 text-charcoal hover:bg-primaryBg/50 hover:text-charcoal"
            aria-label="notifications"
          >
            <Bell size={18} />
          </button>
          <button
            type="button"
            onClick={handleLocaleToggle}
            className="rounded-lg p-2 text-charcoal hover:bg-primaryBg/50 hover:text-charcoal"
            aria-label="language toggle"
          >
            <Globe2 size={18} />
          </button>
          <button
            type="button"
            onClick={handleProfile}
            className="card-ui flex items-center gap-1 px-2 py-1 text-sm text-charcoal"
            aria-label="open profile"
          >
            <UserCircle2 size={16} />
            <span className="hidden sm:inline">Student</span>
          </button>
        </div>
      </div>
    </header>
  );
});

export default TopNavbar;
