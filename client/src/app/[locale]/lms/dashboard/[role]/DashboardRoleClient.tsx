"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import StudentDashboard from "@/components/lms/StudentDashboard";
import TeacherDashboardModule from "@/components/lms/teacher/TeacherDashboardModule";

type RoleKey = "student" | "teacher";

function normalizeRole(role: string): "student" | "teacher" | "administrator" {
  const r = String(role || "")
    .trim()
    .toLowerCase();
  if (
    r === "super admin" ||
    r === "super-admin" ||
    r === "administrator" ||
    r === "admin"
  )
    return "administrator";
  if (r === "teacher" || r === "instructor") return "teacher";
  return "student";
}

export default function DashboardRoleClient({ role }: { role: string }) {
  const router = useRouter();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "";

  const [user, setUser] = useState<{ name: string; role: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const routeRole = normalizeRole(role);

  useEffect(() => {
    const auth = localStorage.getItem("lmsAuth");
    if (!auth) {
      router.replace(`/${locale}/lms/login`);
      return;
    }

    try {
      const parsed = JSON.parse(auth);
      if (!parsed?.user?.email) {
        router.replace(`/${locale}/lms/login`);
        return;
      }

      const userRole = normalizeRole(parsed?.user?.role || "");
      if (userRole === "administrator") {
        router.replace(`/${locale}/admin/dashboard`);
        return;
      }

      if (routeRole !== userRole) {
        router.replace(`/${locale}/lms/dashboard/${userRole}`);
        return;
      }

      setUser(parsed.user);
      setLoading(false);
    } catch {
      router.replace(`/${locale}/lms/login`);
    }
  }, [locale, routeRole, router]);

  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-lg text-[#c0ddc8]">
        Loading dashboard...
      </div>
    );
  }

  if (routeRole === "teacher") {
    return (
      <div className="mx-auto w-full max-w-6xl">
        <TeacherDashboardModule teacherName={user?.name || "Pastor Samuel"} />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <StudentDashboard userName={user?.name || "Muhammad"} />
    </div>
  );
}
