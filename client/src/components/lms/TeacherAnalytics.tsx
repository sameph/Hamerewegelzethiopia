"use client";

import { memo } from "react";
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
} from "recharts";

interface TeacherAnalyticsProps {
  studentPerformance: Array<{ name: string; score: number }>;
  engagementData: Array<{ month: string; engagement: number }>;
  courseDistribution: Array<{ name: string; value: number; color: string }>;
}

const TeacherAnalytics = memo(function TeacherAnalytics({
  studentPerformance,
  engagementData,
  courseDistribution,
}: TeacherAnalyticsProps) {
  return (
    <div className="space-y-6">
      {/* Student Performance Bar Chart */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-charcoal/20">
        <h3 className="text-lg font-semibold text-white mb-4">Student Performance</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={studentPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00D084" opacity={0.3} />
            <XAxis dataKey="name" stroke="#00D084" />
            <YAxis stroke="#00D084" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B1B1B",
                border: "1px solid #00D084",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="score" fill="#00D084" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Engagement Over Time Line Chart */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-charcoal/20">
        <h3 className="text-lg font-semibold text-white mb-4">Engagement Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#00D084" opacity={0.3} />
            <XAxis dataKey="month" stroke="#00D084" />
            <YAxis stroke="#00D084" />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B1B1B",
                border: "1px solid #00D084",
                borderRadius: "8px",
              }}
            />
            <Line
              type="monotone"
              dataKey="engagement"
              stroke="#00D084"
              strokeWidth={3}
              dot={{ fill: "#00D084", strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Course Distribution Pie Chart */}
      <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-charcoal/20">
        <h3 className="text-lg font-semibold text-white mb-4">Course Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={courseDistribution}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#00D084"
              dataKey="value"
            >
              {courseDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1B1B1B",
                border: "1px solid #00D084",
                borderRadius: "8px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
});

export default TeacherAnalytics;
