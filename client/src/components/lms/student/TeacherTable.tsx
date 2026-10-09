"use client";

import { useEffect, useState } from "react";
import { User, MessageCircle, Mail, MapPin, GraduationCap } from "lucide-react";

interface Instructor {
  _id: string;
  username: string;
  email: string;
  department?: string;
  program?: string;
  profileImage?: string;
}

export default function TeacherTable() {
  const [instructors, setInstructors] = useState<Instructor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/users/my-instructors`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('lms_token')}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setInstructors(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch instructors:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructors();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="rounded-3xl border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Your Instructors</h2>
            <p className="text-sm text-slate-400 mt-1">Academic staff leading your enrolled courses.</p>
          </div>
          <div className="flex gap-2">
             <span className="rounded-xl bg-white/5 px-4 py-2 text-xs font-bold text-slate-300 border border-white/10">
                Total: {instructors.length}
             </span>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-64 rounded-3xl bg-white/5 animate-pulse"></div>
            ))}
          </div>
        ) : instructors.length === 0 ? (
          <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-12 text-center">
            <User className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-500 italic">No instructors found for your courses.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <div key={instructor._id} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 hover:bg-white/[0.04] transition-all duration-500">
                <div className="flex items-start gap-4">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-[#d6ff00]/20 to-blue-500/20 flex items-center justify-center border border-white/10 text-3xl shrink-0 group-hover:scale-110 transition-transform duration-500">
                    {instructor.profileImage || "👨‍🏫"}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#d6ff00] transition-colors truncate">{instructor.username}</h3>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                      <GraduationCap size={12} className="text-[#d6ff00]" />
                      {instructor.department || "Theology Faculty"}
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <Mail size={16} className="text-slate-500" />
                    <span className="truncate">{instructor.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <MapPin size={16} className="text-slate-500" />
                    <span>Main Campus</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5 flex gap-2">
                  <a 
                    href={`/lms/dashboard/student/messages?recipient=${instructor._id}`}
                    className="flex-1 rounded-xl bg-mint py-2.5 text-xs font-bold text-[#112014] hover:bg-[#c4eb00] transition-colors flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={14} />
                    Message
                  </a>
                  <button className="rounded-xl bg-white/5 px-4 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 border border-white/10 transition-all">
                    Profile
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
