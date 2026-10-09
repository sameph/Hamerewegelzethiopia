"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  ArrowLeft,
  CheckCircle,
  Upload,
  Send,
  AlertCircle,
  FileText,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import LMSAuthShell from "@/components/lms/AuthShell";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "";

export default function ApplyClient() {
  const { user, login } = useAuth();
  const router = useRouter();
  const pathname = usePathname() || "";
  const locale = pathname.split("/")[1] || "en";
  const base = `/${locale}`;

  const [loading, setLoading] = useState(false);
  const [existingAdmission, setExistingAdmission] = useState<any>(null);
  const [form, setForm] = useState({
    fullName: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    program: user?.program || "Diploma Program",
    documents: [] as string[],
    notes: "",
  });
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/admissions/my`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && data.data) {
            setExistingAdmission(data.data);
          }
        });
    }
  }, [user]);

  const handleFileUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch(`${API_URL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setForm((prev) => ({
          ...prev,
          documents: [...prev.documents, data.data.url],
        }));
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API_URL}/admissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("lms_token")}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setMessage({
          type: "success",
          text: "Application submitted successfully! We will review it shortly.",
        });
        setExistingAdmission(data.data);
      } else {
        setMessage({
          type: "error",
          text: data.message || "Failed to submit application.",
        });
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An error occurred. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (existingAdmission) {
    return (
      <LMSAuthShell
        landingPath={base}
        sideContent={
          <div className="text-white p-8">
            Track your application status here.
          </div>
        }
      >
        <div className="space-y-8 animate-in fade-in duration-700">
          <div className="rounded-[2.5rem] border border-[var(--charcoal)]/10 bg-white/60 p-12 backdrop-blur-xl text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-[#d6ff00]/20 text-[#2e7d52] mb-6">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-bold text-[var(--charcoal)]">
              Application Received
            </h2>
            <p className="mt-4 text-[var(--muted)]">
              Status:{" "}
              <span className="font-bold text-[#2e7d52]">
                {existingAdmission.status}
              </span>
            </p>
            <p className="mt-2 text-sm text-[var(--muted)] max-w-md mx-auto">
              Thank you for applying to Hamere Wengel. Our admissions committee
              is currently reviewing your profile. Average response time is 5–7
              business days.
            </p>
            <div className="mt-10 flex flex-col gap-3">
              <Link
                href={`${base}/lms/dashboard/student`}
                className="rounded-2xl bg-[#2e7d52] py-4 text-sm font-bold text-white shadow-lg"
              >
                Go to Student Dashboard
              </Link>
              <Link
                href={`${base}/lms/admissions`}
                className="text-sm font-medium text-[#2e7d52] hover:underline"
              >
                Back to Admissions Home
              </Link>
            </div>
          </div>
        </div>
      </LMSAuthShell>
    );
  }

  return (
    <LMSAuthShell
      landingPath={base}
      sideContent={
        <div className="text-white p-8">
          Complete the form to start your theological journey.
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <Link
            href={`${base}/lms/admissions`}
            className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#2e7d52] hover:underline"
          >
            <ArrowLeft size={13} /> Back to Admissions
          </Link>
          <h1 className="text-3xl font-bold text-[var(--charcoal)]">
            Submit Application
          </h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Please fill in your details and upload the required documents.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Full Name
              </label>
              <input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 py-4 px-5 text-sm outline-none focus:border-[#2e7d52] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Email Address
              </label>
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 py-4 px-5 text-sm outline-none focus:border-[#2e7d52] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Phone Number
              </label>
              <input
                required
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 py-4 px-5 text-sm outline-none focus:border-[#2e7d52] transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
                Target Program
              </label>
              <select
                value={form.program}
                onChange={(e) => setForm({ ...form, program: e.target.value })}
                className="w-full rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 py-4 px-5 text-sm outline-none focus:border-[#2e7d52] transition-all appearance-none"
              >
                <option>Diploma Program</option>
                <option>Bachelor&apos;s Degree</option>
                <option>Master&apos;s Degree</option>
                <option>Short Courses</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Upload Documents (PDF/JPG)
            </label>
            <div className="space-y-4">
              <input
                type="file"
                id="doc-upload"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                }}
              />
              <label
                htmlFor="doc-upload"
                className="flex w-full items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-[#2e7d52]/20 py-8 text-sm font-bold text-[#2e7d52] hover:bg-[#2e7d52]/5 transition-all cursor-pointer"
              >
                <Upload size={20} /> Click to Upload Document
              </label>
              <div className="flex flex-wrap gap-3">
                {form.documents.map((doc, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-xl bg-[#2e7d52]/10 px-4 py-2 text-xs font-bold text-[#2e7d52]"
                  >
                    <FileText size={14} /> Doc {idx + 1}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">
              Personal Statement / Notes
            </label>
            <textarea
              rows={4}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full rounded-2xl border border-[var(--charcoal)]/10 bg-white/50 py-4 px-5 text-sm outline-none focus:border-[#2e7d52] transition-all resize-none"
              placeholder="Why would you like to join this program?"
            />
          </div>

          {message.text && (
            <div
              className={`flex items-center gap-3 rounded-2xl p-4 text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {message.type === "success" ? (
                <CheckCircle size={18} />
              ) : (
                <AlertCircle size={18} />
              )}
              {message.text}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#2e7d52] py-4 text-sm font-black text-white shadow-xl hover:bg-[#245f41] transition-all disabled:opacity-50"
          >
            {loading ? (
              "Submitting..."
            ) : (
              <>
                <Send size={18} /> Submit Application
              </>
            )}
          </button>
        </form>
      </div>
    </LMSAuthShell>
  );
}
