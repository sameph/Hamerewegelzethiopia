"use client";

import Link from "next/link";
import { useMemo, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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

export default function SuperAdminSelector() {
  const pathname = usePathname() || "";
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const locale = useMemo(() => {
    const segment = pathname.split("/")[1];
    return segment === "am" ? "am" : "en";
  }, [pathname]);

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace(`/${locale}/lms/login`);
      return;
    }

    const role = normalizeRole(user.role || "");
    if (role !== "administrator") {
      router.replace(`/${locale}/lms/dashboard/${role}`);
    }
  }, [user, isLoading, locale, router]);

  return (
    <main className="mx-auto max-w-5xl space-y-6 p-6 md:p-10">
      <section className="rounded-3xl border border-[#d5e3d8] bg-white p-6 shadow-sm">
        <p className="text-xs uppercase tracking-[0.25em] text-[#396247]">
          Super Admin
        </p>
        <h1 className="mt-2 text-3xl font-bold text-[#1a2a21]">
          Choose Dashboard
        </h1>
        <p className="mt-2 text-sm text-[#4f6157]">
          Select which platform you want to manage.
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Link
          href={`/${locale}/admin/hamere-wengel`}
          className="rounded-3xl border border-[#cddfd2] bg-[#f4faf5] p-6 transition hover:border-[#88b499] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#153b25]">
            Hamere Wengel Ethiopia Dashboard
          </h2>
          <p className="mt-2 text-sm text-[#466253]">
            Manage Website and Ministry Platform
          </p>
        </Link>

        <Link
          href={`/${locale}/admin/saint-cyril`}
          className="rounded-3xl border border-[#cddfd2] bg-[#f4faf5] p-6 transition hover:border-[#88b499] hover:shadow-md"
        >
          <h2 className="text-xl font-bold text-[#153b25]">
            Saint Cyril College Dashboard
          </h2>
          <p className="mt-2 text-sm text-[#466253]">
            Manage LMS, Students and Academic System
          </p>
        </Link>
      </div>
    </main>
  );
}
