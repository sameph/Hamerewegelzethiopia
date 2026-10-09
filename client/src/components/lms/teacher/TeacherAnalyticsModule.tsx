"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotification } from "@/lib/useNotification";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";
import { TrendingUp, Users, BookOpen, Target } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

interface StatsCard {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
}

export default function TeacherAnalyticsPage() {
  const { user } = useAuth();
  const { error } = useNotification();
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalCourses: 0,
    averageEngagement: 0,
    completionRate: 0,
  });

  const token =
    typeof window !== "undefined" ? localStorage.getItem("lms_token") : null;

  useEffect(() => {
    if (user && user.role === "instructor") {
      fetchAnalyticsData();
    }
  }, [user]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const [studentsRes, coursesRes] = await Promise.all([
        fetch(`${API_URL}/users/my-students`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_URL}/courses?instructor=${user?._id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        if (data.success) {
          setStats((prev) => ({ ...prev, totalStudents: data.count || 0 }));
        }
      }

      if (coursesRes.ok) {
        const data = await coursesRes.json();
        if (data.success) {
          setStats((prev) => ({ ...prev, totalCourses: data.count || 0 }));
        }
      }
    } catch (err) {
      error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  const studentPerformanceData = [
    { name: "Student A", score: 85 },
    { name: "Student B", score: 72 },
    { name: "Student C", score: 90 },
    { name: "Student D", score: 68 },
    { name: "Student E", score: 88 },
  ];

  const engagementData = [
    { month: "Jan", engagement: 65, completion: 45 },
    { month: "Feb", engagement: 72, completion: 52 },
    { month: "Mar", engagement: 78, completion: 62 },
    { month: "Apr", engagement: 85, completion: 75 },
    { month: "May", engagement: 92, completion: 82 },
    { month: "Jun", engagement: 88, completion: 78 },
  ];

  const courseDistribution = [
    { name: "Theology", value: 4, color: "#a5ff63" },
    { name: "Biblical Studies", value: 3, color: "#00D084" },
    { name: "Church History", value: 2, color: "#0084D0" },
    { name: "Ministry", value: 1, color: "#D084B0" },
  ];

  const statsCards: StatsCard[] = [
    {
      icon: <Users className="w-6 h-6 text-[#a5ff63]" />,
      label: "Total Students",
      value: stats.totalStudents,
      change: "+12%",
      trend: "up",
    },
    {
      icon: <BookOpen className="w-6 h-6 text-[#a5ff63]" />,
      label: "Active Courses",
      value: stats.totalCourses,
      change: "+2",
      trend: "up",
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#a5ff63]" />,
      label: "Avg. Engagement",
      value: `${stats.averageEngagement || 85}%`,
      change: "+5%",
      trend: "up",
    },
    {
      icon: <Target className="w-6 h-6 text-[#a5ff63]" />,
      label: "Completion Rate",
      value: `${stats.completionRate || 78}%`,
      change: "+3%",
      trend: "up",
    },
  ];

  if (!user || user.role !== "instructor") {
    return (
      <div className="text-center text-slate-400">
        You do not have permission to view analytics
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Analytics Dashboard</h1>
        <p className="text-slate-400 mt-2">
          Monitor student performance and engagement
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="text-center text-slate-400">Loading analytics...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-white/20 bg-white/5 p-6 hover:bg-white/10 transition"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-[#a5ff63]/10">
                  {stat.icon}
                </div>
                {stat.trend && (
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "bg-green-500/20 text-green-400"
                        : "bg-red-500/20 text-red-400"
                    }`}
                  >
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-slate-300 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Student Performance Bar Chart */}
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Student Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={studentPerformanceData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff"
                opacity={0.1}
              />
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B1B1B",
                  border: "1px solid #a5ff63",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Bar dataKey="score" fill="#a5ff63" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Engagement Over Time */}
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Engagement & Completion
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={engagementData}>
              <defs>
                <linearGradient
                  id="colorEngagement"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#a5ff63" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#a5ff63" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#ffffff"
                opacity={0.1}
              />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B1B1B",
                  border: "1px solid #a5ff63",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="engagement"
                stroke="#a5ff63"
                fillOpacity={1}
                fill="url(#colorEngagement)"
              />
              <Line
                type="monotone"
                dataKey="completion"
                stroke="#00D084"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Course Distribution */}
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Course Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={courseDistribution}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#a5ff63"
                dataKey="value"
              >
                {courseDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1B1B1B",
                  border: "1px solid #a5ff63",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Stats */}
        <div className="rounded-2xl border border-white/20 bg-white/5 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">
                  Course Completion
                </span>
                <span className="text-sm font-semibold text-[#a5ff63]">
                  78%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#a5ff63] h-2 rounded-full"
                  style={{ width: "78%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">
                  Student Engagement
                </span>
                <span className="text-sm font-semibold text-[#a5ff63]">
                  88%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#a5ff63] h-2 rounded-full"
                  style={{ width: "88%" }}
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm text-slate-300">
                  Assessment Performance
                </span>
                <span className="text-sm font-semibold text-[#a5ff63]">
                  82%
                </span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-[#a5ff63] h-2 rounded-full"
                  style={{ width: "82%" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
