"use client";

import { useEffect, useState } from "react";
import { TrendingUp, Award, Users, CheckCircle, Download, FileBarChart } from "lucide-react";

export default function AnalyticsCards() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/auth/instructor/stats`, {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('lms_token')}` }
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch kpis:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const kpis = [
    { label: "Lessons", value: stats?.lessonCount || "0", trend: "+2", icon: TrendingUp, color: "text-mint", bg: "bg-mint/10" },
    { label: "Students", value: stats?.studentCount || "0", trend: "+1", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
    { label: "Submissions", value: stats?.submissionRate || "0%", trend: "Active", icon: CheckCircle, color: "text-orange-400", bg: "bg-orange-400/10" },
    { label: "Active Courses", value: stats?.courseCount || "0", trend: "Live", icon: Award, color: "text-purple-400", bg: "bg-purple-400/10" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between mb-8">
           <div>
              <h2 className="text-2xl font-bold text-white tracking-tight">Academic Analytics</h2>
              <p className="text-sm text-slate-400 mt-1">Real-time performance metrics across your active courses.</p>
           </div>
           <div className="flex p-1 rounded-xl bg-white/5 border border-white/10">
              <button className="px-4 py-1.5 rounded-lg bg-white/10 text-xs font-bold text-white">Weekly</button>
              <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-slate-300">Monthly</button>
           </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {kpis.map((item, idx) => (
            <div 
              key={item.label} 
              className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/[0.03] p-6 transition-all hover:bg-white/[0.05] hover:border-white/10"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="flex justify-between items-start">
                 <div className={`p-3 rounded-2xl ${item.bg} ${item.color}`}>
                    <item.icon size={20} />
                 </div>
                 <span className={`text-[10px] font-black ${item.trend.startsWith('+') ? 'text-mint' : 'text-red-400'}`}>
                    {item.trend}
                 </span>
              </div>
              <div className="mt-4">
                 <p className="text-xs font-bold uppercase tracking-widest text-slate-500">{item.label}</p>
                 <h3 className="mt-1 text-3xl font-black text-white">{item.value}</h3>
              </div>
              {/* Simple Sparkline simulation */}
              <div className="mt-4 flex items-end gap-1 h-6">
                 {Array.from({ length: 8 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`w-full rounded-t-sm transition-all duration-500 ${item.color.replace('text', 'bg').replace('400', '400/40')}`}
                      style={{ 
                        height: `${Math.random() * 100}%`, 
                        opacity: loading ? 0 : 1,
                        transitionDelay: `${i * 50}ms`
                      }}
                    />
                 ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
         <section className="lg:col-span-2 rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-8">Performance Distribution</h3>
            <div className="space-y-6">
               {[
                 { grade: "Grade A", percent: 35, color: "bg-mint" },
                 { grade: "Grade B", percent: 42, color: "bg-blue-400" },
                 { grade: "Grade C", percent: 18, color: "bg-orange-400" },
                 { grade: "Below D", percent: 5, color: "bg-red-400" },
               ].map((bar) => (
                 <div key={bar.grade} className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-slate-400 px-1">
                       <span>{bar.grade}</span>
                       <span>{bar.percent}%</span>
                    </div>
                    <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden">
                       <div 
                         className={`h-full rounded-full ${bar.color} transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(0,0,0,0.5)]`}
                         style={{ width: loading ? '0%' : `${bar.percent}%` }}
                       />
                    </div>
                 </div>
               ))}
            </div>
         </section>

         <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6">Generated Reports</h3>
            <div className="space-y-3 flex-1">
               {[
                 { name: "Final_Grades_S1.pdf", size: "2.4 MB", date: "2d ago" },
                 { name: "Attendance_June.csv", size: "1.1 MB", date: "1w ago" },
                 { name: "Midterm_Analysis.xlsx", size: "4.8 MB", date: "2w ago" },
               ].map((file) => (
                 <div key={file.name} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all group cursor-pointer">
                    <div className="p-2.5 rounded-xl bg-orange-400/10 text-orange-400">
                       <FileBarChart size={18} />
                    </div>
                    <div className="flex-1 overflow-hidden">
                       <p className="text-sm font-bold text-white truncate">{file.name}</p>
                       <p className="text-[10px] text-slate-500 mt-0.5">{file.size} • {file.date}</p>
                    </div>
                    <Download size={14} className="text-slate-600 group-hover:text-white" />
                 </div>
               ))}
            </div>
            <button className="mt-8 w-full py-4 rounded-2xl bg-mint text-[#08120f] text-sm font-black transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(214,255,0,0.2)]">
               Genereate New Report
            </button>
         </section>
      </div>
    </div>
  );
}
