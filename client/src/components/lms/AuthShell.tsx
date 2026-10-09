"use client";

import Link from "next/link";
import { useEffect, type ReactNode } from "react";

interface AuthShellProps {
  landingPath: string;
  sideContent: ReactNode;
  children: ReactNode;
}

export default function LMSAuthShell({ landingPath, sideContent, children }: AuthShellProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("site-theme", "light");
    }

    document.body.classList.remove("theme-light", "theme-night");
    document.body.classList.add("theme-light", "lms-auth-page");

    return () => {
      document.body.classList.remove("lms-auth-page");
    };
  }, []);

  return (
    <main className="lms-auth-shell grid min-h-screen w-full grid-cols-1 gap-6 p-4 sm:p-6 md:grid-cols-2 lg:p-8">
      <section className="lms-auth-side relative hidden overflow-hidden rounded-[2rem] p-8 text-white shadow-[0_40px_120px_rgba(27,27,27,0.22)] md:flex md:flex-col md:justify-between">
        <div className="pointer-events-none absolute inset-0">
          <div className="lms-auth-orb lms-auth-orb-primary absolute -left-16 top-10 h-56 w-56 rounded-full blur-3xl" />
          <div className="lms-auth-orb lms-auth-orb-secondary absolute right-8 top-16 h-64 w-64 rounded-full blur-3xl" />
          <div className="lms-auth-side-glow absolute inset-x-0 bottom-0 h-40" />
        </div>
        <div className="lms-auth-grid absolute inset-0 opacity-60" />

        <div className="relative z-10 flex h-full flex-col justify-between">
          {sideContent}
        </div>
      </section>

      <section className="lms-auth-card relative flex min-h-[calc(100vh-4rem)] flex-col justify-center overflow-hidden p-6 sm:p-8">
        <div className="lms-auth-card-glow absolute inset-x-0 top-0 h-40" />
        <Link
          href={landingPath}
          className="lms-auth-home absolute right-5 top-5 z-20 px-4 py-2 text-sm font-semibold"
        >
          Hamere Wengel
        </Link>

        <div className="relative z-10 mx-auto w-full max-w-md">{children}</div>
      </section>
    </main>
  );
}
