"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckCircle, FileText, ArrowLeft, ArrowRight, AlertCircle } from "lucide-react";
import LMSAuthShell from "@/components/lms/AuthShell";

const documentsByProgram = [
  {
    program: "All Programs",
    required: true,
    docs: [
      "Valid National ID or Passport (clear copy, front and back)",
      "Recent passport-size photograph (white background, within 6 months)",
      "Personal statement of faith and ministry calling (min. 300 words)",
      "Two reference letters — one pastoral, one academic or professional",
      "Completed admission application form",
    ],
  },
  {
    program: "Diploma Program",
    required: true,
    docs: [
      "Grade 10 or Grade 12 completion certificate or equivalent",
      "Official school transcripts",
      "Statement of previous church involvement or ministry experience",
    ],
  },
  {
    program: "Bachelor's Degree",
    required: true,
    docs: [
      "Diploma certificate or equivalent (Grade 12 / TVET Level 4+)",
      "Official academic transcripts",
      "Medical fitness certificate",
    ],
  },
  {
    program: "Master's Degree",
    required: true,
    docs: [
      "Bachelor's degree certificate (theology or related field preferred)",
      "Official undergraduate transcripts",
      "Research proposal or academic writing sample (min. 500 words)",
      "Proof of ordination or pastoral appointment (if applicable)",
    ],
  },
  {
    program: "Short Courses",
    required: false,
    docs: [
      "Basic educational certificate or equivalent",
      "Brief personal bio describing your learning goals",
    ],
  },
];

const importantNotes = [
  "All documents must be submitted as clear PDF or high-resolution image scans.",
  "Foreign-language documents must be accompanied by a certified English or Amharic translation.",
  "Original documents may be requested for verification at enrollment.",
  "Incomplete applications will not be reviewed until all documents are received.",
  "Documents are kept confidential and used solely for admission purposes.",
];

export default function RequirementsClient() {
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  const sideContent = (
    <div className="flex h-full flex-col justify-between">
      <div>
        <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#d6ff00] text-[#0f1e13] text-2xl font-bold mb-6 shadow-[0_10px_30px_rgba(214,255,0,.25)]">
          📋
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-[#a5ff63]/80 mb-2">Admissions</p>
        <h2 className="font-serif text-3xl font-bold text-white leading-tight mb-4">Requirements</h2>
        <p className="text-white/70 text-sm leading-relaxed">
          Review all required documents before you begin your application. Having everything prepared
          in advance speeds up the review process.
        </p>
      </div>
      <div className="space-y-3">
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          📄 Submit documents as PDF or high-res images
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          🌐 Foreign docs need certified translation
        </div>
        <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/90">
          🔒 All information is kept strictly confidential
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
            Step 1 of 4
          </p>
          <h1 className="font-serif text-3xl font-bold text-[var(--charcoal)] leading-tight">
            Admission Requirements
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)] leading-relaxed">
            Each program has specific document requirements. Review the list for your chosen program below.
          </p>
        </div>

        {/* Documents by Program */}
        {documentsByProgram.map((group) => (
          <div key={group.program} className="rounded-2xl border border-[var(--charcoal)]/10 bg-white/55 p-5 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <span className="text-sm font-bold text-[var(--charcoal)]">{group.program}</span>
              {group.required && (
                <span className="rounded-full bg-[#d6ff00]/70 px-2 py-0.5 text-[0.6rem] font-semibold text-[#0f1e13]">
                  Required
                </span>
              )}
            </div>
            <ul className="space-y-2">
              {group.docs.map((doc) => (
                <li key={doc} className="flex items-start gap-2 text-sm text-[var(--charcoal)]/80">
                  <CheckCircle size={14} className="mt-0.5 flex-shrink-0 text-[#2e7d52]" />
                  {doc}
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Important Notes */}
        <div className="rounded-2xl border border-amber-200/60 bg-amber-50/70 p-5">
          <div className="mb-3 flex items-center gap-2 text-amber-700">
            <AlertCircle size={15} />
            <span className="text-xs font-semibold uppercase tracking-[0.15em]">Important Notes</span>
          </div>
          <ul className="space-y-1.5">
            {importantNotes.map((note) => (
              <li key={note} className="text-xs text-amber-800 leading-relaxed">• {note}</li>
            ))}
          </ul>
        </div>

        {/* Navigation */}
        <div className="flex flex-col gap-3 pt-1">
          <Link
            href={`${base}/lms/admissions/how-to-apply`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2e7d52] px-6 py-3.5 text-sm font-semibold text-white shadow-[0_8px_24px_rgba(46,125,82,0.35)] transition-all hover:bg-[#245f41] active:scale-[0.98]"
          >
            Next: How to Apply <ArrowRight size={16} />
          </Link>
          <Link
            href={`${base}/lms/admissions`}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[var(--charcoal)]/15 bg-white/60 px-6 py-3.5 text-sm font-semibold text-[var(--charcoal)] transition-all hover:border-[#2e7d52]/40 hover:bg-white/80"
          >
            Back to Admissions Overview
          </Link>
        </div>
      </div>
    </LMSAuthShell>
  );
}
