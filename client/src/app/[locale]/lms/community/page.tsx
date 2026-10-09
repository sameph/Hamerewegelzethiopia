"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LMSCommunityPage() {
  const router = useRouter();

  useEffect(() => {
    const auth = localStorage.getItem("lmsAuth");
    if (!auth) router.replace("/lms/login");
  }, [router]);

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 text-slate-100">
      <h1 className="text-3xl font-semibold text-emerald-200">Community</h1>
      <p className="mt-3 max-w-2xl text-slate-300">Connect with classmates, share study resources, and stay engaged with the wider learning community.</p>
    </main>
  );
}
