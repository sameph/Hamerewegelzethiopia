"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle, Star, AlertCircle } from "lucide-react";
import LMSAuthShell from "@/components/lms/AuthShell";

const scholarships = [
  {
    name: "Excellence Scholarship",
    badge: "Merit-Based",
    badgeColor: "#d6ff00",
    coverage: "50% tuition waiver",
    eligibility: [
      "GPA of 3.5 or above in previous academic program",
      "Strong academic reference letter",
      "Available for Degree and Masters programs",
    ],
    deadline: "August 1, 2026",
    slots: "10 awards per intake",
  },
  {
    name: "Ministry Leadership Award",
    badge: "Service-Based",
    badgeColor: "#a5ff63",
    coverage: "Full tuition for Year 1",
    eligibility: [
      "Minimum 3 years active pastoral or ministry service",
      "Letter of recommendation from senior church leader",
      "Commitment to return to ministry upon graduation",
    ],
    deadline: "August 1, 2026",
    slots: "5 awards per intake",
  },
  {
    name: "Women in Ministry Grant",
    badge: "Equity Grant",
    badgeColor: "#f9d4ff",
    coverage: "30% tuition reduction",
    eligibility: [
      "Female applicants only",
      "Enrolled in Diploma, Degree, or Masters program",
      "Demonstrated financial need (income declaration required)",
    ],
    deadline: "August 1, 2026",
    slots: "15 awards per intake",
  },
  {
    name: "Need-Based Financial Aid",
    badge: "Need-Based",
    badgeColor: "#c3f0ff",
    coverage: "20–40% tuition reduction",
    eligibility: [
      "Demonstrated financial hardship",
      "Household income declaration and supporting documents",
      "Open to all programs and all applicants",
    ],
    deadline: "Ongoing — apply anytime",
    slots: "Unlimited (subject to fund availability)",
  },
  {
    name: "Short Course Bursary",
    badge: "Short Course",
    badgeColor: "#ffe5a0",
    coverage: "Up to 50% course fee waiver",
    eligibility: [
      "Enrolled in a Short Course track",
      "First-time applicant to Hamere Wengel",
      "Brief written statement of intent required",
    ],
    deadline: "Rolling basis",
    slots: "Available each intake cycle",
  },
];

const applicationSteps = [
  "Complete the standard admission application form on your LMS account.",
  "On the scholarship section, select the scholarship(s) you wish to apply for.",
  "Upload all supporting documents (academic records, reference letters, income declaration).",
  "Submit a scholarship essay or statement (200–500 words) as specified per award.",
  "The scholarships committee meets within 14 days of the application deadline.",
  "Successful applicants are notified by email and via their LMS dashboard.",
];

const faq = [
  {
    q: "Can I apply for more than one scholarship?",
    a: "Yes. You may apply for multiple scholarships, but only one award will be granted per student per semester.",
  },
  {
    q: "Are scholarships renewable each year?",
    a: "Merit and service-based scholarships are renewable annually, subject to maintaining the required GPA and ministry involvement.",
  },
  {
    q: "Does a scholarship cover the application fee?",
    a: "No. The application fee must be paid before the application is reviewed. Scholarships apply only to tuition costs.",
  },
  {
    q: "What happens if I withdraw after receiving a scholarship?",
    a: "Scholarship recipients who withdraw within the first semester may be required to repay the awarded amount on a pro-rated basis.",
  },
];

export default function ScholarshipsClient() {
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  const sideContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d6ff00] text-[#0f1e13] text-2xl font-bold mb-6 shadow-[0_10px_30px_rgba(214,255,0,.25)]">
          🏅
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#a5ff63]/80 mb-2">Admissions</p>
        <h2 className="font-serif text-3xl font-bold text-white leading-tight mb-4">Scholarships</h2>
        <p className="text-white/70 text-sm leading-relaxed">
          We believe financial constraints should never prevent a calling from being fulfilled.
          Explore our scholarships and apply alongside your admission application.
        </p>
      </div>
      <div className="space-y-2">
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          🏆 5 scholarship types available
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          📅 Most deadlines: August 1, 2026
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          ✉️ Decisions within 14 days of deadline
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
            Step 4 of 4
          </p>
          <h1 className="font-serif text-3xl font-bold text-[var(--charcoal)] leading-tight">
            Scholarships & Financial Aid
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            Apply for one or more scholarships as part of your admission process. Awards are granted based
            on merit, service, equity, and financial need.
          </p>
        </div>

        {/* Scholarships */}
        <div className="space-y-4">
          {scholarships.map((s) => (
            <div key={s.name} className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/55 p-5 backdrop-blur-sm">
              <div className="mb-2 flex items-start justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  <Star size={14} className="text-[#2e7d52]" />
                  <h3 className="text-sm font-bold text-[var(--charcoal)]">{s.name}</h3>
                </div>
                <span
                  className="rounded-full px-2 py-0.5 text-[0.6rem] font-semibold text-[#0f1e13]"
                  style={{ background: s.badgeColor }}
                >
                  {s.badge}
                </span>
              </div>
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-xl bg-[#2e7d52]/10 px-3 py-1.5">
                <span className="text-xs font-bold text-[#2e7d52]">Coverage:</span>
                <span className="text-xs text-[#2e7d52]">{s.coverage}</span>
              </div>
              <ul className="mb-3 space-y-1.5">
                {s.eligibility.map((e) => (
                  <li key={e} className="flex items-start gap-2 text-xs text-[var(--charcoal)]/80">
                    <CheckCircle size={11} className="mt-0.5 flex-shrink-0 text-[#2e7d52]" /> {e}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 text-xs text-[var(--muted)]">
                <span>📅 Deadline: <span className="font-medium text-[var(--charcoal)]">{s.deadline}</span></span>
                <span>👥 Slots: <span className="font-medium text-[var(--charcoal)]">{s.slots}</span></span>
              </div>
            </div>
          ))}
        </div>

        {/* How to Apply for Scholarship */}
        <div className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-[var(--charcoal)]">
            How to Apply for a Scholarship
          </h3>
          <ol className="space-y-2">
            {applicationSteps.map((step, i) => (
              <li key={i} className="flex items-start gap-2.5 text-xs text-[var(--charcoal)]/80 leading-relaxed">
                <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#2e7d52]/15 text-[0.6rem] font-bold text-[#2e7d52]">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </div>

        {/* FAQ */}
        <div className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 p-5">
          <div className="mb-3 flex items-center gap-2">
            <AlertCircle size={14} className="text-[#2e7d52]" />
            <h3 className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--charcoal)]">
              Frequently Asked Questions
            </h3>
          </div>
          <div className="space-y-3">
            {faq.map((f) => (
              <div key={f.q}>
                <p className="text-xs font-semibold text-[var(--charcoal)] mb-0.5">{f.q}</p>
                <p className="text-xs text-[var(--muted)] leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Final CTA */}
        <div className="flex flex-col gap-3 pt-1">
          <Link
            href={`${base}/lms/register`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e7d52] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,125,82,0.35)] transition-all hover:bg-[#245f41] active:scale-[0.98]"
          >
            Apply Now — Register Account <ArrowRight size={16} />
          </Link>
          <Link
            href={`${base}/lms/admissions/tuition-fees`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--charcoal)]/15 bg-white/60 px-6 py-3.5 text-sm font-semibold text-[var(--charcoal)] transition-all hover:border-[#2e7d52]/40 hover:bg-white/80"
          >
            <ArrowLeft size={15} /> Back: Tuition & Fees
          </Link>
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Questions?{" "}
          <Link href={`${base}/contact`} className="font-medium text-[#2e7d52] hover:underline">
            Contact the Admissions Office
          </Link>
        </p>
      </div>
    </LMSAuthShell>
  );
}
