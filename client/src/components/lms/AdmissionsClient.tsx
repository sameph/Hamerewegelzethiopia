"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, CheckCircle, ArrowRight, Users, FileText, ClipboardList, HelpCircle, CreditCard, Award } from "lucide-react";
import LMSAuthShell from "@/components/lms/AuthShell";

const programs = [
  {
    icon: "🎓",
    level: "Diploma",
    title: "Diploma Program",
    duration: "2 Years",
    description: "Foundational theological studies with practical ministry training.",
    highlights: ["Biblical Studies", "Ministry Foundations", "Practical Training"],
  },
  {
    icon: "📖",
    level: "Degree",
    title: "Bachelor's Degree",
    duration: "4 Years",
    description: "Comprehensive undergraduate program in theology and church ministry.",
    highlights: ["Systematic Theology", "Church History", "Pastoral Care"],
  },
  {
    icon: "🏆",
    level: "Masters",
    title: "Master's Degree",
    duration: "2 Years",
    description: "Advanced graduate study for ministry leadership and academic depth.",
    highlights: ["Advanced Theology", "Research Methods", "Leadership Development"],
  },
  {
    icon: "💡",
    level: "Courses",
    title: "Short Courses",
    duration: "Flexible",
    description: "Targeted learning tracks for specific ministry skills and enrichment.",
    highlights: ["Flexible Schedule", "Certificate on Completion", "Online & In-Person"],
  },
];

const subPages = [
  {
    href: "admissions/requirements",
    icon: ClipboardList,
    label: "Requirements",
    desc: "Documents and eligibility criteria for each program.",
    step: "01",
  },
  {
    href: "admissions/how-to-apply",
    icon: HelpCircle,
    label: "How to Apply",
    desc: "Step-by-step application guide from start to enrollment.",
    step: "02",
  },
  {
    href: "admissions/tuition-fees",
    icon: CreditCard,
    label: "Tuition & Fees",
    desc: "Full fee schedule, payment plans, and policies.",
    step: "03",
  },
  {
    href: "admissions/scholarships",
    icon: Award,
    label: "Scholarships",
    desc: "Merit, service, equity, and need-based financial aid.",
    step: "04",
  },
];

export default function AdmissionsClient() {
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  const sideContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d6ff00] text-[#0f1e13] shadow-[0_10px_30px_rgba(214,255,0,.25)] text-2xl font-bold mb-6">
          A
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#a5ff63]/80 mb-2">Hamere Wengel</p>
        <h2 className="font-serif text-3xl font-bold text-white leading-tight mb-4">
          Admissions
        </h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Begin your journey toward theological excellence and ministry leadership.
          Our programs are designed to equip you with the knowledge, skills, and
          spiritual depth to serve effectively.
        </p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
          <Users size={18} className="text-[#d6ff00]" />
          <span className="text-sm text-white/90">Open to all qualified applicants</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
          <Clock size={18} className="text-[#d6ff00]" />
          <span className="text-sm text-white/90">Intake: September & February</span>
        </div>
        <div className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
          <FileText size={18} className="text-[#d6ff00]" />
          <span className="text-sm text-white/90">Applications reviewed within 7 days</span>
        </div>
      </div>
    </div>
  );

  return (
    <LMSAuthShell landingPath={base} sideContent={sideContent}>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-[#2e7d52] font-semibold mb-1">
            LMS Admissions Portal
          </p>
          <h1 className="font-serif text-3xl font-bold text-[var(--charcoal)] leading-tight">
            Welcome to Admissions
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            Explore our academic programs and begin your registration. Already have an account?{" "}
            <Link href={`${base}/lms/login`} className="font-semibold text-[#2e7d52] hover:underline">
              Sign in here
            </Link>
            .
          </p>
        </div>

        {/* Admissions Sub-Pages */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] font-semibold mb-3">
            Admissions Guide
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {subPages.map((page) => {
              const Icon = page.icon;
              return (
                <Link
                  key={page.href}
                  href={`${base}/lms/${page.href}`}
                  className="group rounded-2xl border border-[var(--charcoal)]/10 bg-white/60 p-4 backdrop-blur-sm hover:border-[#2e7d52]/50 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-[#2e7d52]/12 group-hover:bg-[#2e7d52]/20 transition-colors">
                      <Icon size={18} className="text-[#2e7d52]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-[var(--charcoal)]">{page.label}</h3>
                        <span className="text-[0.6rem] font-bold text-[#2e7d52] uppercase tracking-widest">{page.step}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-[var(--muted)] leading-relaxed">{page.desc}</p>
                    </div>
                    <ArrowRight size={14} className="mt-1 flex-shrink-0 text-[var(--muted)] group-hover:text-[#2e7d52] transition-colors" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Programs Grid */}
        <div>
          <h2 className="text-xs uppercase tracking-[0.2em] text-[var(--muted)] font-semibold mb-3">
            Our Programs
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {programs.map((prog) => (
              <div
                key={prog.level}
                className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/60 p-4 backdrop-blur-sm"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{prog.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <h3 className="font-semibold text-[var(--charcoal)] text-sm">{prog.title}</h3>
                      <span className="rounded-full bg-[#d6ff00]/70 px-2 py-0.5 text-[0.65rem] font-semibold text-[#0f1e13]">
                        {prog.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[var(--muted)] leading-relaxed">{prog.description}</p>
                    <ul className="mt-2 space-y-0.5">
                      {prog.highlights.map((h) => (
                        <li key={h} className="flex items-center gap-1.5 text-xs text-[var(--charcoal)]/70">
                          <CheckCircle size={11} className="text-[#2e7d52] flex-shrink-0" />
                          {h}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={`${base}/lms/admissions/apply`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e7d52] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,125,82,0.35)] transition-all hover:bg-[#245f41] hover:shadow-[0_12px_32px_rgba(46,125,82,0.45)] active:scale-[0.98]"
          >
            Start: Submit Application
            <ArrowRight size={16} />
          </Link>
          <Link
            href={`${base}/lms/register`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--charcoal)]/15 bg-white/60 px-6 py-3.5 text-sm font-semibold text-[var(--charcoal)] backdrop-blur-sm transition-all hover:border-[#2e7d52]/40 hover:bg-white/80"
          >
            Skip to Register Account
          </Link>
          <Link
            href={`${base}/lms/login`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--charcoal)]/10 bg-white/40 px-6 py-3 text-sm font-medium text-[var(--muted)] backdrop-blur-sm transition-all hover:text-[var(--charcoal)]"
          >
            Already enrolled? Sign In
          </Link>
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Need help?{" "}
          <Link href={`${base}/contact`} className="font-medium text-[#2e7d52] hover:underline">
            Contact Admissions Office
          </Link>
        </p>
      </div>
    </LMSAuthShell>
  );
}
