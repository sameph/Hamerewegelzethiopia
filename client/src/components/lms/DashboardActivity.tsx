"use client";

import { memo } from "react";

interface DashboardActivityProps {
  title: string;
  activities: string[];
}

const DashboardActivity = memo(function DashboardActivity({ title, activities }: DashboardActivityProps) {
  return (
    <div className="card-gradient-glass p-5 shadow-lg shadow-[#D6FF00]/10">
      <h2 className="text-xl font-semibold text-[#F7F7F7]">{title}</h2>
      <ul className="mt-3 space-y-2 text-sm text-[#F7F7F7]">
        {activities.map((activity, index) => (
          <li key={index}>• {activity}</li>
        ))}
      </ul>
    </div>
  );
});

export default DashboardActivity;