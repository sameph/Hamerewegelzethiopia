"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import LMSAuthShell from "@/components/lms/AuthShell";

export default function LMSForgotPasswordPage() {
  const router = useRouter();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "";
  const landingPath = locale ? `/${locale}` : "/";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setStatus("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/forgotpassword`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: normalizedEmail }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setError(
          data?.message || "Unable to send reset link. Please try again."
        );
        return;
      }

      setStatus(
        data?.message || "Check your inbox for the password reset link."
      );
      setTimeout(() => router.push(`/${locale}/lms/login`), 2200);
    } catch (err) {
      setError(
        "Unable to send reset link. Please check your connection and try again."
      );
    }
  }

  return (
    <LMSAuthShell
      landingPath={landingPath}
      sideContent={
        <>
          <div className="space-y-6">
            <div className="max-w-xl space-y-3">
              <p className="lms-auth-kicker text-sm uppercase tracking-[0.35em]">
                Account recovery
              </p>
              <h1 className="lms-auth-title text-4xl font-semibold sm:text-5xl">
                Reset access with confidence
              </h1>
              <p className="lms-auth-copy max-w-xl text-sm leading-7 sm:text-base">
                Request a fresh sign-in link for your LMS account and return to
                your courses, messages, and dashboard.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="lms-auth-feature rounded-3xl p-5">
                <span className="lms-auth-feature-badge inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold">
                  1
                </span>
                <p className="lms-auth-feature-title mt-4 text-sm font-semibold">
                  Enter your email
                </p>
                <p className="lms-auth-copy mt-2 text-sm">
                  Use the same address you registered with in the LMS.
                </p>
              </div>
              <div className="lms-auth-feature rounded-3xl p-5">
                <span className="lms-auth-feature-badge inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold">
                  2
                </span>
                <p className="lms-auth-feature-title mt-4 text-sm font-semibold">
                  Return to sign in
                </p>
                <p className="lms-auth-copy mt-2 text-sm">
                  After the mock reset step, you will be redirected back to the
                  login screen.
                </p>
              </div>
            </div>
          </div>

          <div className="lms-auth-panel mt-10 rounded-[2rem] p-6 backdrop-blur-xl">
            <p className="lms-auth-panel-title text-sm font-semibold uppercase tracking-[0.24em]">
              Secure workflow
            </p>
            <p className="lms-auth-panel-copy mt-3 text-sm leading-6">
              This demo route keeps the same LMS auth context so light and night
              mode remain visually consistent through recovery.
            </p>
          </div>
        </>
      }
    >
      <div className="mb-8 space-y-3 text-center sm:text-left">
        <p className="lms-auth-kicker text-sm uppercase tracking-[0.35em]">
          Forgot password
        </p>
        <h1 className="lms-auth-title text-3xl font-bold sm:text-4xl">
          Request a reset link
        </h1>
        <p className="lms-auth-copy text-sm leading-6">
          Enter your email to receive a real password reset link from the LMS
          system.
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
          <label
            className="lms-auth-label text-sm font-semibold"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-lime px-4 py-3"
            placeholder="you@example.com"
          />
        </div>

        {error && (
          <p className="rounded-lg border border-rose-400/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">
            {error}
          </p>
        )}
        {status && (
          <p className="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-200">
            {status}
          </p>
        )}

        <button
          className="w-full rounded-3xl gradient-primary px-4 py-3 text-sm font-bold text-[var(--charcoal)] shadow-xl shadow-[var(--color-accent-bright)]/15 transition hover:brightness-105"
          type="submit"
        >
          Send Reset Link
        </button>
      </form>

      <p className="lms-auth-muted mt-5 text-center text-sm sm:text-left">
        Remembered your password?{" "}
        <Link
          href={`/${locale}/lms/login`}
          className="lms-auth-link font-semibold"
        >
          Login here
        </Link>
      </p>
    </LMSAuthShell>
  );
}
