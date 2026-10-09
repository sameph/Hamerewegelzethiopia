"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  GraduationCap,
  BookOpen,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  Lock,
  Mail,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

function normalizeRoleKey(
  role: string
): "student" | "teacher" | "administrator" {
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

const roles = [
  {
    key: "Student",
    label: "Student",
    icon: GraduationCap,
    desc: "Access courses & learn",
  },
  {
    key: "Teacher",
    label: "Teacher",
    icon: BookOpen,
    desc: "Manage your classes",
  },
  {
    key: "Super Admin",
    label: "Admin",
    icon: Shield,
    desc: "Full platform access",
  },
];

export default function LMSLoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "";

  const [role, setRole] = useState("Student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  const canSubmit = useMemo(
    () => email.trim().length > 0 && password.trim().length > 0,
    [email, password]
  );

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    if (!canSubmit) {
      setError("Please enter email and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        const roleKey = normalizeRoleKey(data.data?.role || role);
        login(data.data || { email, role: roleKey }, data.token);
        if (roleKey === "administrator") {
          router.push(`/${locale}/admin/dashboard`);
        } else {
          router.push(`/${locale}/lms/dashboard/${roleKey}`);
        }
      } else {
        setError(data.message || "Invalid email or password");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04090a]">
      {/* ── Animated background ── */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#d6ff00]/8 blur-[120px] animate-pulse" />
        <div
          className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-[#0ff0b3]/6 blur-[100px]"
          style={{ animationDuration: "4s", animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-[#63d6ff]/5 blur-[100px]"
          style={{ animationDuration: "5s", animationDelay: "2s" }}
        />
        {/* grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        {/* ── LEFT PANEL: Brand + Features ── */}
        <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 xl:p-16">
          {/* logo */}
          <div>
            <Link
              href={locale ? `/${locale}` : "/"}
              className="flex items-center gap-3 group"
            >
              <div className="h-10 w-10 rounded-xl bg-[#d6ff00]/15 flex items-center justify-center group-hover:bg-[#d6ff00]/25 transition-colors">
                <Sparkles className="text-[#d6ff00]" size={20} />
              </div>
              <span className="text-white font-black text-lg tracking-tight">
                Hamerewegelz Ethiopia
              </span>
            </Link>
          </div>

          {/* hero text */}
          <div className="max-w-lg space-y-8">
            <div>
              <p className="text-[#d6ff00] text-xs font-black uppercase tracking-[0.35em] mb-4">
                Learning Management System
              </p>
              <h1 className="text-5xl xl:text-6xl font-black text-white leading-[1.1] tracking-tight">
                Unlock Your
                <br />
                <span className="bg-gradient-to-r from-[#d6ff00] via-[#a5ff63] to-[#0ff0b3] bg-clip-text text-transparent">
                  Learning Journey
                </span>
              </h1>
              <p className="mt-6 text-slate-400 text-base xl:text-lg leading-relaxed max-w-md">
                Access world-class theological education and grow your knowledge
                through our interactive platform.
              </p>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: "📚",
                  title: "Rich Courses",
                  desc: "Video lessons & materials",
                },
                {
                  icon: "🎓",
                  title: "Certifications",
                  desc: "Verified credentials",
                },
                {
                  icon: "📊",
                  title: "Track Progress",
                  desc: "Real-time analytics",
                },
                {
                  icon: "🌐",
                  title: "Learn Anywhere",
                  desc: "Access on any device",
                },
              ].map((f) => (
                <div
                  key={f.title}
                  className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 hover:border-[#d6ff00]/20 hover:bg-[#d6ff00]/[0.03] transition-all duration-300"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <p className="mt-2 text-sm font-bold text-white">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* bottom */}
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} Hamerewegelz Ethiopia. All rights
            reserved.
          </p>
        </div>

        {/* ── RIGHT PANEL: Login Form ── */}
        <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[480px] space-y-8">
            {/* mobile logo */}
            <div className="lg:hidden text-center mb-4">
              <Link
                href={locale ? `/${locale}` : "/"}
                className="inline-flex items-center gap-2"
              >
                <Sparkles className="text-[#d6ff00]" size={20} />
                <span className="text-white font-black text-lg">
                  Hamerewegelz
                </span>
              </Link>
            </div>

            {/* heading */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="mt-2 text-slate-400 text-sm">
                Sign in to continue your learning journey
              </p>
            </div>

            {/* Role selector */}
            <div className="grid grid-cols-3 gap-2">
              {roles.map(({ key, label, icon: Icon, desc }) => {
                const active = role === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`relative flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-300 ${
                      active
                        ? "border-[#d6ff00]/40 bg-[#d6ff00]/10 shadow-lg shadow-[#d6ff00]/5"
                        : "border-white/[0.06] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center transition-colors ${
                        active
                          ? "bg-[#d6ff00]/20 text-[#d6ff00]"
                          : "bg-white/5 text-slate-400"
                      }`}
                    >
                      <Icon size={18} />
                    </div>
                    <span
                      className={`text-xs font-bold ${
                        active ? "text-[#d6ff00]" : "text-slate-300"
                      }`}
                    >
                      {label}
                    </span>
                    <span
                      className={`text-[10px] ${
                        active ? "text-[#d6ff00]/60" : "text-slate-500"
                      }`}
                    >
                      {desc}
                    </span>
                    {active && (
                      <div className="absolute -top-px left-1/2 -translate-x-1/2 h-[2px] w-8 bg-[#d6ff00] rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Form */}
            <form onSubmit={onSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  <Mail size={13} /> Email Address
                </label>
                <div
                  className={`relative rounded-xl border transition-all duration-300 ${
                    focused === "email"
                      ? "border-[#d6ff00]/50 bg-white/[0.04] shadow-lg shadow-[#d6ff00]/5"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused(null)}
                    placeholder="your@email.com"
                    className="w-full bg-transparent px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400"
                >
                  <Lock size={13} /> Password
                </label>
                <div
                  className={`relative rounded-xl border transition-all duration-300 ${
                    focused === "password"
                      ? "border-[#d6ff00]/50 bg-white/[0.04] shadow-lg shadow-[#d6ff00]/5"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="••••••••"
                    className="w-full bg-transparent px-4 py-3 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#d6ff00] transition-colors"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <div className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit || loading}
                className="group relative w-full overflow-hidden rounded-xl bg-[#d6ff00] py-3.5 text-sm font-black text-[#04090a] transition-all hover:bg-[#c4eb00] hover:shadow-xl hover:shadow-[#d6ff00]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            {/* Footer links */}
            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
              <Link
                href={`/${locale}/lms/forgot-password`}
                className="text-xs text-slate-400 hover:text-[#d6ff00] transition-colors"
              >
                Forgot password?
              </Link>
              <Link
                href={`/${locale}/lms/register`}
                className="text-xs font-bold text-[#d6ff00] hover:text-[#a5ff63] transition-colors"
              >
                New here? Create account →
              </Link>
            </div>

            {/* trust badges */}
            <div className="pt-4 border-t border-white/[0.04] flex items-center justify-center gap-6 text-[10px] text-slate-600 uppercase tracking-widest">
              <span className="flex items-center gap-1">
                <Lock size={10} /> Secure
              </span>
              <span>•</span>
              <span>SSL Encrypted</span>
              <span>•</span>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
