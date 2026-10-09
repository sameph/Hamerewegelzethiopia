"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function ResetPasswordForm({
  locale,
  token,
}: {
  locale: string;
  token: string;
}) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/resetpassword/${token}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => router.push(`/${locale}/lms/login`), 3000);
      } else {
        setError(data.message || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04090a] flex items-center justify-center p-6">
      {/* background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[500px] w-[500px] rounded-full bg-[#d6ff00]/8 blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-[#0ff0b3]/6 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md space-y-8">
        {/* logo */}
        <div className="text-center">
          <Link
            href={locale ? `/${locale}` : "/"}
            className="inline-flex items-center gap-2"
          >
            <Sparkles className="text-[#d6ff00]" size={20} />
            <span className="text-white font-black text-lg">
              Hamerewegelz Ethiopia
            </span>
          </Link>
        </div>

        {success ? (
          <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-10 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-[#a5ff63]/15 flex items-center justify-center">
              <CheckCircle2 className="text-[#a5ff63]" size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">
                Password Reset!
              </h2>
              <p className="mt-3 text-sm text-slate-400 leading-relaxed">
                Your password has been updated successfully. Redirecting to
                login...
              </p>
            </div>
            <Loader2
              className="animate-spin mx-auto text-[#d6ff00]"
              size={20}
            />
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-10 space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-black text-white tracking-tight">
                New Password
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={onSubmit} className="space-y-5">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Lock size={13} /> New Password
                </label>
                <div
                  className={`relative rounded-xl border transition-all duration-300 ${
                    focused === "password"
                      ? "border-[#d6ff00]/50 bg-white/[0.04] shadow-lg shadow-[#d6ff00]/5"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused(null)}
                    placeholder="Min 6 characters"
                    className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm text-white placeholder-slate-500 focus:outline-none"
                    required
                    minLength={6}
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

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                  <Lock size={13} /> Confirm Password
                </label>
                <div
                  className={`rounded-xl border transition-all duration-300 ${
                    focused === "confirm"
                      ? "border-[#d6ff00]/50 bg-white/[0.04] shadow-lg shadow-[#d6ff00]/5"
                      : "border-white/[0.08] bg-white/[0.02]"
                  }`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => setFocused("confirm")}
                    onBlur={() => setFocused(null)}
                    placeholder="Repeat your password"
                    className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>
              </div>

              {/* password strength */}
              {password.length > 0 && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          password.length >= i * 3
                            ? password.length >= 12
                              ? "bg-[#a5ff63]"
                              : password.length >= 8
                              ? "bg-[#d6ff00]"
                              : "bg-orange-400"
                            : "bg-white/10"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-500">
                    {password.length < 6
                      ? "Too short"
                      : password.length < 8
                      ? "Fair"
                      : password.length < 12
                      ? "Good"
                      : "Strong"}
                  </p>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                  <AlertCircle className="text-red-400 shrink-0" size={16} />
                  <p className="text-sm text-red-300">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !password || !confirmPassword}
                className="group w-full rounded-xl bg-[#d6ff00] py-3.5 text-sm font-black text-[#04090a] transition-all hover:bg-[#c4eb00] hover:shadow-xl hover:shadow-[#d6ff00]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Resetting...
                  </>
                ) : (
                  <>
                    Reset Password
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
