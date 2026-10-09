"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

function normalizeRole(role: string) {
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

export default function DashboardRedirectClient() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "";
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("lmsAuth");
    if (!auth) {
      router.replace(`/${locale}/lms/login`);
      return;
    }

    try {
      const parsed = JSON.parse(auth);
      const role = normalizeRole(parsed?.user?.role || "");
      if (role === "administrator") {
        router.replace(`/${locale}/admin/dashboard`);
        return;
      }
      router.replace(`/${locale}/lms/dashboard/${role}`);
    } catch {
      router.replace(`/${locale}/lms/login`);
    }
  }, [locale, router]);

  return (
    <main className="mx-auto flex min-h-screen items-center justify-center text-white">
      {isLoading && (
        <p className="text-lg text-mint/80">
          Redirecting to your role dashboard...
        </p>
      )}
    </main>
  );
}
