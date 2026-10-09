"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  BarChart3,
  Users,
  BookOpen,
  Layout,
  Calendar,
  ArrowRight,
  Clock,
  Video,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface TeacherStats {
  courseCount: number;
  studentCount: number;
  lessonCount: number;
}

interface ScheduleItem {
  _id: string;
  title: string;
  type: string;
  startTime: string;
  meetingLink: string;
}

interface ActivityItem {
  user: string;
  action: string;
  time: string;
  color: string;
}

export default function TeacherDashboardModule({
  teacherName,
}: {
  teacherName: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname?.split("/")[1] || "en";
  const { user } = useAuth();
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        const token = localStorage.getItem("lms_token");

        // Fetch Stats
        const statsRes = await fetch(`${API_URL}/auth/instructor/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const statsData = await statsRes.json();
        if (statsData.success) setStats(statsData.data);

        // Fetch Schedule
        const scheduleRes = await fetch(`${API_URL}/live-events/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const scheduleData = await scheduleRes.json();
        if (scheduleData.success) setSchedule(scheduleData.data.slice(0, 5));

        // Fetch Activity
        const activityRes = await fetch(`${API_URL}/auth/instructor/activity`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const activityData = await activityRes.json();
        if (activityData.success) setActivities(activityData.data);
      } catch (err) {
        console.error("Failed to fetch teacher data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherData();
  }, []);

  const statCards = [
    {
      label: "Active Courses",
      value: stats?.courseCount || 0,
      icon: BookOpen,
      color: "text-[#d6ff00]",
      bg: "bg-[#d6ff00]/10",
    },
    {
      label: "Total Students",
      value: stats?.studentCount || 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      label: "Lessons Published",
      value: stats?.lessonCount || 0,
      icon: Layout,
      color: "text-orange-400",
      bg: "bg-orange-400/10",
    },
    {
      label: "Completion Rate",
      value: "84%",
      icon: BarChart3,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero Welcome */}
      <section className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#0d1f14] to-[#112d1b] p-8 md:p-12 shadow-2xl">
        <div className="relative z-10">
          <p className="text-xs uppercase tracking-[0.4em] font-black text-[#d6ff00]/60">
            Educator Platform
          </p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black text-white tracking-tighter">
            Welcome,{" "}
            <span className="text-[#d6ff00] uppercase font-bold italic">
              {teacherName}
            </span>
          </h1>
          <p className="mt-6 max-w-xl text-lg text-slate-300 leading-relaxed font-medium">
            Your academy is thriving. You have{" "}
            <span className="text-white font-bold">
              {schedule.length} live sessions
            </span>{" "}
            today with an estimated{" "}
            <span className="text-[#d6ff00] font-bold">
              128 active students
            </span>
            .
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <button 
              onClick={() => router.push(`/${locale}/lms/calendar`)}
              className="group flex items-center gap-3 rounded-2xl bg-[#d6ff00] px-8 py-4 text-sm font-black text-[#08120f] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(214,255,0,0.3)]">
              Schedule Event{" "}
              <Calendar
                size={18}
                className="group-hover:rotate-12 transition-transform"
              />
            </button>
            <button 
              onClick={() => router.push(`/${locale}/lms/courses`)}
              className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 px-8 py-4 text-sm font-bold text-white transition-all hover:bg-white/10">
              Manage Courses <ArrowRight size={18} />
            </button>
          </div>
        </div>
        <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#d6ff00]/5 blur-[120px] rounded-full" />
      </section>

      {/* Stats Grid */}
      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => (
          <div
            key={card.label}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[#111f16]/60 p-6 backdrop-blur-xl transition-all hover:border-[#d6ff00]/30 hover:bg-[#111f16]/80"
          >
            <div
              className={`inline-flex p-3 rounded-2xl ${card.bg} ${card.color} mb-4`}
            >
              <card.icon size={24} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">
              {card.label}
            </p>
            <div className="mt-3 flex items-end gap-2">
              <h3 className="text-3xl font-black text-white tracking-tighter">
                {loading ? "..." : card.value}
              </h3>
              <span className="mb-1 text-xs font-bold text-[#d6ff00]">
                Live
              </span>
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Schedule */}
          <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/40 p-8 shadow-xl">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-black text-white tracking-tight">
                Today&apos;s Focus
              </h3>
              <button className="text-xs font-bold text-[#d6ff00] hover:underline uppercase tracking-widest">
                Full Schedule
              </button>
            </div>
            <div className="space-y-4">
              {loading ? (
                <div className="p-8 text-center text-slate-500 italic text-sm">
                  Loading sessions...
                </div>
              ) : schedule.length > 0 ? (
                schedule.map((item) => (
                  <div
                    key={item._id}
                    className="group flex items-center justify-between gap-4 rounded-3xl border border-white/5 bg-white/5 p-5 transition-all hover:bg-white/10"
                  >
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1d3324] to-[#0d1f14] border border-white/10 text-[#d6ff00]">
                        <Video size={24} />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-white group-hover:text-[#d6ff00] transition-colors">
                          {item.title}
                        </h4>
                        <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1.5">
                            <Clock size={14} className="text-[#d6ff00]/60" />{" "}
                            {new Date(item.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                          <span>• {item.type}</span>
                        </div>
                      </div>
                    </div>
                    <a
                      href={item.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-white/5 px-6 py-3 text-xs font-bold text-white border border-white/10 hover:bg-[#d6ff00] hover:text-[#08120f] transition-all"
                    >
                      Start Session
                    </a>
                  </div>
                ))
              ) : (
                <div className="p-16 rounded-3xl border border-dashed border-white/10 text-center">
                  <p className="text-sm text-slate-500">
                    No sessions scheduled for today
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* Engagement Overview Placeholder */}
          <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/40 p-8 shadow-xl">
            <h3 className="text-2xl font-black text-white mb-6">
              Metrics Pulse
            </h3>
            <div className="h-64 rounded-3xl bg-white/5 border border-dashed border-white/10 flex items-center justify-center italic text-slate-500 text-sm">
              Interactive engagement analytics visualization system
            </div>
          </section>
        </div>

        {/* Sidebar/Activity Area */}
        <aside className="space-y-8">
          <section className="rounded-[2.5rem] border border-white/10 bg-[#111f16]/40 p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-8">Pulse Feed</h3>
            <div className="space-y-8">
              {loading ? (
                <div className="p-4 text-center text-slate-500 italic text-sm">
                  Syncing activities...
                </div>
              ) : activities.length > 0 ? (
                activities.map((act, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div
                      className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${act.color} shadow-[0_0_10px_${act.color}] group-hover:scale-150 transition-transform`}
                    />
                    <div>
                      <p className="text-sm font-bold text-white leading-tight">
                        <span className="text-[#d6ff00]">{act.user}</span>{" "}
                        {act.action}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">
                        {formatDistanceToNow(new Date(act.time), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-slate-600 text-sm italic">
                  No recent activity detected
                </div>
              )}
            </div>
            <button className="mt-10 w-full rounded-2xl bg-white/5 py-4 text-[10px] font-black uppercase tracking-widest text-[#d6ff00]/60 hover:bg-white/10 hover:text-[#d6ff00] transition-all border border-white/5">
              Full Activity Log
            </button>
          </section>

          <section className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#d6ff00] to-[#b8eb00] p-8 text-[#08120f] shadow-2xl">
            <div className="relative z-10">
              <h4 className="text-2xl font-black italic tracking-tighter uppercase leading-none">
                SCC <br />
                PRO SUITE
              </h4>
              <p className="mt-6 text-sm font-bold leading-relaxed">
                Unlock advanced predictive analytics and automated grading
                assistance.
              </p>
              <button className="mt-8 w-full rounded-2xl bg-[#08120f] px-6 py-4 text-xs font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95">
                Request Early Access
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 h-32 w-32 bg-white/30 blur-3xl rounded-full" />
          </section>
        </aside>
      </div>
    </div>
  );
}
