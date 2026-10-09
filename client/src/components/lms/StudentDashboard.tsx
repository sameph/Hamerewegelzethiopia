"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Calendar, Clock, BookOpen, Award, BarChart3, Video, User } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface StudentDashboardProps {
  userName: string;
}

interface DashboardStats {
  courseCount: number;
  completionRate: number;
  certificates: number;
  learningHours: string;
}

interface ScheduleItem {
  _id: string;
  title: string;
  type: string;
  startTime: string;
  endTime: string;
  meetingLink: string;
}

export default function StudentDashboard({ userName }: StudentDashboardProps) {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("lms_token");
        
        // Fetch Stats
        const statsRes = await fetch(`${API_URL}/auth/student/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch Today's Schedule
        const scheduleRes = await fetch(`${API_URL}/live-events/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scheduleData = await scheduleRes.json();
        if (scheduleData.success) setSchedule(scheduleData.data);

      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statItems = [
    { label: "Active Courses", value: stats?.courseCount || 0, icon: BookOpen, note: "Enrolled", color: "text-[#d6ff00]" },
    { label: "Learning Hours", value: stats?.learningHours || "0", icon: Clock, note: "Total spent", color: "text-blue-400" },
    { label: "Certificates", value: stats?.certificates || 0, icon: Award, note: "Completed", color: "text-emerald-400" },
    { label: "Completion Rate", value: `${stats?.completionRate || 0}%`, icon: BarChart3, note: "Average", color: "text-orange-400" },
  ];

  const chartPoints = [
    { day: "Mon", value: 38 },
    { day: "Tue", value: 52 },
    { day: "Wed", value: 68 },
    { day: "Thu", value: 82 },
    { day: "Fri", value: 70 },
    { day: "Sat", value: 46 },
    { day: "Sun", value: 58 },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <section className="rounded-[2.5rem] border border-white/10 bg-[#101714]/80 p-8 shadow-2xl shadow-[#0b1c12]/60 backdrop-blur-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#d6ff00]/80">Learning Path</p>
            <h1 className="mt-4 text-4xl font-black text-white sm:text-6xl tracking-tight">
              Welcome, <span className="text-[#d6ff00] uppercase font-bold italic">{userName}</span>
            </h1>
            <p className="mt-6 text-base text-slate-300 leading-relaxed max-w-xl">
              Your academic journey is in full swing. You have <span className="text-white font-bold">{schedule.length} sessions</span> scheduled for today.
            </p>
          </div>
          <div className="grid gap-4 grid-cols-2 lg:grid-cols-4 w-full xl:w-auto">
            {statItems.map((stat) => (
              <div key={stat.label} className="group flex flex-col justify-between rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-white/10">
                <div className={`p-2 rounded-xl bg-white/5 w-fit ${stat.color} mb-4`}>
                    <stat.icon size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-white">{loading ? "..." : stat.value}</p>
                  <p className="text-[10px] text-slate-400 mt-1 font-medium">{stat.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#d6ff00]/5 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/4" />
      </section>

      <div className="grid gap-8 xl:grid-cols-[1.7fr_1.3fr]">
        <div className="space-y-8">
            <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]">Performance</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Weekly Activity</h2>
                </div>
                <div className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-300">
                Jan 13 - Jan 19
                </div>
            </div>
            <div className="relative h-64 mb-8">
                <div className="absolute inset-0 flex items-end justify-between gap-4 px-4">
                    {chartPoints.map((point) => (
                        <div key={point.day} className="flex-1 flex flex-col items-center gap-4">
                            <div 
                                className="w-full max-w-[40px] rounded-2xl bg-gradient-to-t from-[#d6ff00]/20 to-[#d6ff00] transition-all duration-700 hover:scale-105"
                                style={{ height: `${point.value}%` }}
                            />
                            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">{point.day}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Focus</p>
                    <p className="text-lg font-bold text-white mt-1">Stewardship</p>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Efficiency</p>
                    <p className="text-lg font-bold text-white mt-1">88% Positive</p>
                </div>
                <div className="p-5 rounded-3xl bg-white/5 border border-white/5 hidden md:block">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Next Milestone</p>
                    <p className="text-lg font-bold text-white mt-1">Final Exam</p>
                </div>
            </div>
            </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-8">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-[#d6ff00]">Today&apos;s Schedule</p>
                <h3 className="mt-2 text-xl font-bold text-white">Live Sessions</h3>
              </div>
              <div className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-slate-300">
                 <Calendar size={18} />
              </div>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-slate-500 italic text-sm">Synchronizing schedule...</div>
              ) : schedule.length > 0 ? (
                schedule.map((item) => (
                    <div key={item._id} className="group relative overflow-hidden rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10 hover:border-white/10">
                        <div className="flex items-center justify-between gap-4 relative z-10">
                            <div>
                                <h4 className="text-sm font-bold text-white group-hover:text-[#d6ff00] transition-colors">{item.title}</h4>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 font-medium">
                                    <Clock size={12} className="text-[#d6ff00]" />
                                    {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <a 
                                href={item.meetingLink} target="_blank" rel="noopener noreferrer"
                                className="p-3 rounded-2xl bg-[#d6ff00] text-[#08120f] transition-transform hover:scale-110 active:scale-95"
                            >
                                <Video size={16} />
                            </a>
                        </div>
                        <div className="absolute top-0 left-0 w-1 h-full bg-[#d6ff00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                ))
              ) : (
                <div className="p-10 rounded-3xl border border-dashed border-white/5 text-center">
                    <p className="text-sm text-slate-500 font-medium">No live sessions for today</p>
                    <Link href="/lms/dashboard/student/calendar" className="text-[10px] font-bold text-[#d6ff00] uppercase tracking-widest mt-4 inline-block hover:underline">
                        View Full Calendar
                    </Link>
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/95 p-8 shadow-2xl backdrop-blur-xl">
             <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-white">Academic Status</h3>
                <Link href="/lms/dashboard/student/courses" className="text-xs font-bold text-[#d6ff00] hover:underline">Catalogue</Link>
             </div>
             <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                    <div className="flex justify-between text-xs font-bold mb-2">
                        <span className="text-slate-400 uppercase tracking-widest">Active Engagement</span>
                        <span className="text-[#d6ff00]">74%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-[#d6ff00] rounded-full" style={{ width: '74%' }} />
                    </div>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-medium mt-4">
                    Track your daily goals to maintain your scholarship eligibility and graduation track.
                </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}
