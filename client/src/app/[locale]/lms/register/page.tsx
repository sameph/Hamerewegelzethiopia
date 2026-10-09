"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import {
  Sparkles,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Mail,
  Lock,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

type DegreeType = "diploma" | "degree" | "masters" | "courses";

const steps = [
  { title: "Sign up your account", active: true },
  { title: "Set up your workspace" },
  { title: "Finish your profile" },
];

export default function LMSRegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "";

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const role = "student";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [degreeType, setDegreeType] = useState<DegreeType>("diploma");
  const [diplomaSchool, setDiplomaSchool] = useState("");
  const [diplomaYear, setDiplomaYear] = useState("");
  const [degreeMajor, setDegreeMajor] = useState("");
  const [degreeEntry, setDegreeEntry] = useState("");
  const [mastersField, setMastersField] = useState("");
  const [mastersInstitution, setMastersInstitution] = useState("");
  const [courseTrack, setCourseTrack] = useState("");
  const [courseIntake, setCourseIntake] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const baseOk = useMemo(
    () =>
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.trim().length >= 8,
    [firstName, lastName, email, password]
  );

  const validateProgramFields = () => {
    if (degreeType === "diploma") {
      if (!diplomaSchool.trim())
        return "Enter your school or previous institution.";
      if (!/^\d{4}$/.test(diplomaYear.trim()))
        return "Enter a valid graduation year (YYYY).";
    }
    if (degreeType === "degree") {
      if (!degreeMajor.trim())
        return "Enter your intended major / field of study.";
      if (!degreeEntry.trim()) return "Enter your entry level or year.";
    }
    if (degreeType === "masters") {
      if (!mastersField.trim()) return "Enter your prior degree field.";
      if (!mastersInstitution.trim()) return "Enter your prior institution.";
    }
    if (degreeType === "courses") {
      if (!courseTrack.trim()) return "Enter your course track.";
      if (!courseIntake.trim()) return "Enter your preferred intake.";
    }
    return null;
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!baseOk) {
      setError(
        "Please complete all required fields. Password must be at least 8 characters."
      );
      return;
    }

    const programErr = validateProgramFields();
    if (programErr) {
      setError(programErr);
      return;
    }

    setLoading(true);

    try {
      const username = `${firstName.trim()} ${lastName.trim()}`;
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: email.trim().toLowerCase(),
          password: password.trim(),
          role,
          program: degreeType,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.message || "Registration failed. Please try again.");
        return;
      }

      login(data.data, data.token);
      setMessage(
        "Account created successfully. Redirecting to your dashboard..."
      );
      setTimeout(() => router.push(`/${locale}/lms/dashboard/student`), 900);
    } catch (err) {
      console.error("Registration error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#04090a]">
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
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen">
        <div className="hidden lg:flex w-[45%] flex-col justify-between p-12 xl:p-16">
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

            <div className="mt-16 max-w-xl space-y-6">
              <p className="text-[#d6ff00] text-xs font-black uppercase tracking-[0.35em]">
                LMS Registration
              </p>
              <h1 className="text-5xl font-black text-white leading-[1.05]">
                Start your learning journey with a student account.
              </h1>
              <p className="text-slate-400 text-base leading-relaxed">
                Create your profile, enroll in courses, and access our digital
                library with one account.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#d6ff00]/10 text-sm font-semibold text-[#d6ff00]">
                  {index + 1}
                </span>
                <p className="mt-4 text-sm font-semibold text-white">
                  {step.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
          <div className="w-full max-w-[520px] space-y-8">
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

            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-black text-white tracking-tight">
                Create your account
              </h2>
              <p className="mt-2 text-slate-400 text-sm">
                Complete sign up to access courses, library materials, and
                student tools.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 rounded-3xl border border-white/10 bg-[#111]/90 p-6 shadow-xl shadow-[#d6ff00]/5"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                  >
                    First name
                  </label>
                  <input
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                  >
                    Last name
                  </label>
                  <input
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                    required
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                >
                  <Mail size={12} /> Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                >
                  <Lock size={12} /> Password
                </label>
                <div className="relative mt-2">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 pr-12 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-slate-400 hover:text-[#d6ff00]"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="degreeType"
                  className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                >
                  Program / degree type
                </label>
                <select
                  id="degreeType"
                  value={degreeType}
                  onChange={(e) => setDegreeType(e.target.value as DegreeType)}
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                >
                  <option value="diploma">Diploma</option>
                  <option value="degree">Degree (undergraduate)</option>
                  <option value="masters">Masters</option>
                  <option value="courses">Short courses</option>
                </select>
              </div>

              {degreeType === "diploma" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="dipSchool"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      School / prior institution
                    </label>
                    <input
                      id="dipSchool"
                      value={diplomaSchool}
                      onChange={(e) => setDiplomaSchool(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="Completed secondary or equivalent"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="dipYear"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Graduation year
                    </label>
                    <input
                      id="dipYear"
                      value={diplomaYear}
                      onChange={(e) => setDiplomaYear(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="YYYY"
                      inputMode="numeric"
                    />
                  </div>
                </div>
              )}

              {degreeType === "degree" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="major"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Intended major / field
                    </label>
                    <input
                      id="major"
                      value={degreeMajor}
                      onChange={(e) => setDegreeMajor(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="Theology, ministry studies..."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="entry"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Entry level / year
                    </label>
                    <input
                      id="entry"
                      value={degreeEntry}
                      onChange={(e) => setDegreeEntry(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="Year 1, transfer, etc."
                    />
                  </div>
                </div>
              )}

              {degreeType === "masters" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="msField"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Prior degree field
                    </label>
                    <input
                      id="msField"
                      value={mastersField}
                      onChange={(e) => setMastersField(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="B.A. Theology, B.Th., etc."
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="msInst"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Awarding institution
                    </label>
                    <input
                      id="msInst"
                      value={mastersInstitution}
                      onChange={(e) => setMastersInstitution(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="University or college name"
                    />
                  </div>
                </div>
              )}

              {degreeType === "courses" && (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="track"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Course / track
                    </label>
                    <input
                      id="track"
                      value={courseTrack}
                      onChange={(e) => setCourseTrack(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="Course name or code"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="intake"
                      className="text-xs font-bold uppercase tracking-[0.25em] text-slate-400"
                    >
                      Preferred intake
                    </label>
                    <input
                      id="intake"
                      value={courseIntake}
                      onChange={(e) => setCourseIntake(e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-white/10 bg-[#121212] px-4 py-3 text-sm text-white outline-none focus:border-[#d6ff00]/50"
                      placeholder="e.g. Spring 2026, Module A"
                    />
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                  {error}
                </div>
              )}
              {message && (
                <div className="rounded-3xl border border-emerald-400/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={!baseOk || loading}
                className="group relative w-full overflow-hidden rounded-3xl bg-[#d6ff00] py-3.5 text-sm font-black text-[#04090a] transition hover:bg-[#c4eb00] hover:shadow-xl hover:shadow-[#d6ff00]/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    Creating account...
                  </>
                ) : (
                  <>
                    Sign Up
                    <ArrowRight
                      size={16}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </>
                )}
              </button>
            </form>

            <div className="flex flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-400">Already have an account?</p>
              <Link
                href={`/${locale}/lms/login`}
                className="text-sm font-semibold text-[#d6ff00] hover:text-[#a5ff63]"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
