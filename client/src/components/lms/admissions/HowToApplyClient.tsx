"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Clock, Upload, Send, Bell, BookOpen } from "lucide-react";
import LMSAuthShell from "@/components/lms/AuthShell";

const steps = [
  {
    step: "01",
    icon: BookOpen,
    title: "Explore Programs",
    duration: "~10 min",
    desc: "Visit the Admissions overview page and read through available programs — Diploma, Degree, Masters, or Short Courses. Choose the program that best aligns with your calling and educational background.",
    tips: ["Read each program description carefully", "Check duration and curriculum highlights", "Note the entry requirements for your level"],
  },
  {
    step: "02",
    icon: CheckCircle,
    title: "Review Requirements",
    duration: "~15 min",
    desc: "Visit the Requirements page and gather all documents listed for your chosen program. Having documents ready before starting the form prevents delays.",
    tips: ["Scan all documents clearly (PDF or high-res image)", "Prepare your personal statement in advance", "Secure two reference letters"],
  },
  {
    step: "03",
    icon: Upload,
    title: "Create Your LMS Account",
    duration: "~5 min",
    desc: "Register for an LMS account. Select your intended program level during registration — this links your profile to the correct admissions track.",
    tips: ["Use a permanent email address", "Choose a secure password (min. 8 characters)", "Select your degree type accurately"],
  },
  {
    step: "04",
    icon: Send,
    title: "Submit Your Application",
    duration: "~20 min",
    desc: "Once logged in, navigate to Admissions → Apply. Complete all form sections and upload the required documents. Review everything before submitting.",
    tips: ["Double-check all personal details", "Upload documents in the correct format", "Submit before the intake deadline"],
  },
  {
    step: "05",
    icon: Clock,
    title: "Await Review",
    duration: "5–7 business days",
    desc: "Our admissions committee reviews all applications within 5–7 business days. You will receive an email notification with your status and next steps.",
    tips: ["Check your email (including spam/junk folder)", "Log in to your LMS account to track status", "Contact the admissions office if no response after 7 days"],
  },
  {
    step: "06",
    icon: Bell,
    title: "Receive Decision & Enroll",
    duration: "~2 min",
    desc: "If approved, you will receive an acceptance letter and enrollment instructions. Log in and follow the steps to confirm your enrollment and access your courses.",
    tips: ["Complete enrollment within the deadline provided", "Review your course schedule", "Attend orientation if scheduled"],
  },
];

const intakeDates = [
  { semester: "Semester 1", start: "September 2026", deadline: "August 1, 2026" },
  { semester: "Semester 2", start: "February 2027", deadline: "January 5, 2027" },
];

export default function HowToApplyClient() {
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  const sideContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d6ff00] text-[#0f1e13] text-2xl font-bold mb-6 shadow-[0_10px_30px_rgba(214,255,0,.25)]">
          📝
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#a5ff63]/80 mb-2">Admissions</p>
        <h2 className="font-serif text-3xl font-bold text-white leading-tight mb-4">How to Apply</h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Follow our simple 6-step process to complete your application. Most applications
          are reviewed within 5–7 business days.
        </p>
      </div>
      <div className="space-y-2">
        {intakeDates.map((d) => (
          <div key={d.semester} className="rounded-2xl bg-white/10 px-4 py-3">
            <p className="text-xs font-semibold text-[#d6ff00]">{d.semester} — {d.start}</p>
            <p className="text-xs text-white/70 mt-0.5">Application deadline: {d.deadline}</p>
          </div>
        ))}
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-xs text-white/80">
          ✉️ Decisions emailed within 5–7 business days
        </div>
      </div>
    </div>
  );

  return (
    <LMSAuthShell landingPath={base} sideContent={sideContent}>
      <div className="space-y-7">
        {/* Back + Header */}
        <div>
          <Link
            href={`${base}/lms/admissions`}
            className="mb-3 inline-flex items-center gap-1.5 text-xs font-medium text-[#2e7d52] hover:underline"
          >
            <ArrowLeft size={13} /> Back to Admissions
          </Link>
          <p className="text-xs uppercase tracking-[0.25em] text-[#2e7d52] font-semibold mb-1">
            Step 2 of 4
          </p>
          <h1 className="font-serif text-3xl font-bold text-[var(--charcoal)] leading-tight">
            How to Apply
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            Follow each step in order. The entire application process typically takes less than one hour.
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.step} className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/55 p-5 backdrop-blur-sm">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 flex-shrink-0 flex-col items-center justify-center rounded-2xl bg-[#2e7d52]/12">
                    <Icon size={18} className="text-[#2e7d52]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-[0.65rem] font-bold text-[#2e7d52] uppercase tracking-widest">{s.step}</span>
                      <h3 className="text-sm font-bold text-[var(--charcoal)]">{s.title}</h3>
                      <span className="ml-auto rounded-full bg-[#d6ff00]/60 px-2 py-0.5 text-[0.6rem] font-semibold text-[#0f1e13]">
                        {s.duration}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--muted)] leading-relaxed mb-2">{s.desc}</p>
                    <ul className="space-y-1">
                      {s.tips.map((tip) => (
                        <li key={tip} className="flex items-center gap-1.5 text-xs text-[var(--charcoal)]/70">
                          <CheckCircle size={10} className="flex-shrink-0 text-[#2e7d52]" /> {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 pt-1">
          <Link
            href={`${base}/lms/admissions/tuition-fees`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e7d52] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,125,82,0.35)] transition-all hover:bg-[#245f41] active:scale-[0.98]"
          >
            Next: Tuition & Fees <ArrowRight size={16} />
          </Link>
          <Link
            href={`${base}/lms/admissions/requirements`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--charcoal)]/15 bg-white/60 px-6 py-3.5 text-sm font-semibold text-[var(--charcoal)] transition-all hover:border-[#2e7d52]/40 hover:bg-white/80"
          >
            <ArrowLeft size={15} /> Back: Requirements
          </Link>
        </div>
      </div>
    </LMSAuthShell>
  );
}
