"use client";

import { useEffect, useState } from "react";
import { Download, CheckCircle, Eye, QrCode, Loader2, Award } from "lucide-react";

export default function CertificatesClient() {
  const [loading, setLoading] = useState(true);
  const [progresses, setProgresses] = useState<any[]>([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/courses/my-progress`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setProgresses(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, []);

  const earnedCertificates = progresses
    .filter(p => p.percentComplete === 100)
    .map(p => ({
      id: p._id,
      name: "Certificate of Completion",
      course: p.course.title,
      completionDate: new Date(p.updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      certificateId: `SCC-${new Date().getFullYear()}-CERT-${p._id.substring(0, 4).toUpperCase()}`,
      verificationStatus: "Verified",
    }));

  const inProgress = progresses.filter(p => p.percentComplete < 100);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-mint" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Earned Certificates */}
      <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-4 italic tracking-tight uppercase">Earned Diplomas ({earnedCertificates.length})</h2>

        {earnedCertificates.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {earnedCertificates.map((cert) => (
              <div
                key={cert.id}
                className="rounded-2xl border border-[#d6ff00]/30 bg-gradient-to-br from-[#d6ff00]/10 to-[#a5ff63]/10 p-6 hover:border-[#d6ff00]/50 transition-all group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div>
                    <h3 className="font-black text-white text-sm uppercase tracking-tight">{cert.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 font-bold">{cert.course}</p>
                  </div>
                  <CheckCircle size={20} className="text-[#a5ff63]" />
                </div>

                <div className="space-y-1 mb-6 text-[10px] font-black uppercase tracking-widest">
                  <div>
                    <p className="text-slate-500">Graduation Date</p>
                    <p className="text-slate-200 mt-0.5">{cert.completionDate}</p>
                  </div>
                  <div className="mt-4">
                    <p className="text-slate-500">Credential ID</p>
                    <p className="text-slate-200 mt-0.5 font-mono text-[0.7rem]">{cert.certificateId}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 rounded-lg bg-[#d6ff00] px-3 py-2.5 text-[10px] font-black uppercase text-[#08120f] hover:scale-[1.02] transition-all flex items-center justify-center gap-1 shadow-lg shadow-mint/20">
                    <Download size={14} /> Download
                  </button>
                  <button className="flex-1 rounded-lg bg-white/5 px-3 py-2.5 text-[10px] font-black uppercase text-slate-300 hover:bg-white/10 transition-all flex items-center justify-center gap-1 border border-white/5">
                    <Eye size={14} /> Global View
                  </button>
                  <button className="rounded-lg bg-white/5 px-3 py-2.5 text-slate-300 hover:bg-white/10 transition-all border border-white/5">
                    <QrCode size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600">
               <Award size={32} />
            </div>
            <div>
               <p className="text-white font-bold">No certificates earned yet</p>
               <p className="text-xs text-slate-500 mt-1">Complete your courses to receive official scholarly recognition.</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Toward Certificates */}
      <div className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-6 shadow-xl backdrop-blur-xl">
        <h2 className="text-xl font-bold text-white mb-4 italic tracking-tight uppercase">Advancement Tracking</h2>

        {inProgress.length > 0 ? (
          <div className="space-y-4">
            {inProgress.map((progress) => (
              <div key={progress._id} className="rounded-2xl border border-white/10 bg-white/5 p-5 hover:bg-white/[0.08] transition-all">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-white">{progress.course.title}</h3>
                  <span className="text-xs font-black text-[#d6ff00] tracking-widest">{progress.percentComplete}%</span>
                </div>

                <div className="mb-4 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#d6ff00] to-[#a5ff63] shadow-[0_0_15px_rgba(214,255,0,0.5)] transition-all duration-1000"
                    style={{ width: `${progress.percentComplete}%` }}
                  />
                </div>

                <div className="grid gap-6 sm:grid-cols-2 text-[10px] font-black uppercase tracking-widest">
                  <div>
                    <p className="text-slate-500">Completed Sessions</p>
                    <p className="text-slate-300 mt-1">{progress.completedLessons.length} units archived</p>
                  </div>
                  <div>
                    <p className="text-slate-500">Status</p>
                    <p className="text-mint mt-1 italic">Vibrant Progress</p>
                  </div>
                </div>

                <button className="mt-6 w-full rounded-xl bg-white/5 border border-white/5 px-4 py-3 text-[10px] font-black uppercase text-white hover:bg-mint hover:text-[#08120f] transition-all">
                  Resume Academic Journey
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-10 text-center italic text-slate-500 text-sm">
            Enroll in courses to start your journey toward certification.
          </div>
        )}
      </div>

      {/* Certificate Verification */}
      <div className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-10 shadow-xl backdrop-blur-xl">
        <h2 className="text-xl font-black text-white mb-8 italic uppercase">Verification Gateway</h2>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] ml-1">
              Scholarly Credential ID
            </label>
            <input
              type="text"
              placeholder="SCC-2024-CERT-XXXX"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-slate-100 placeholder-slate-700 focus:border-mint transition-all"
            />
          </div>

          <button className="w-full rounded-2xl bg-mint px-6 py-5 text-sm font-black uppercase text-[#08120f] shadow-lg shadow-mint/10 hover:scale-[1.01] transition-all">
            Execute Verification
          </button>

          <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose">
            <p className="flex items-center gap-3"><CheckCircle size={14} className="text-mint" /> All credentials digitally signed</p>
            <p className="flex items-center gap-3 mt-2"><CheckCircle size={14} className="text-mint" /> Instant validation for scholarly review</p>
          </div>
        </div>
      </div>
    </div>
  );
}
