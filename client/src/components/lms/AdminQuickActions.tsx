"use client";

import { memo } from "react";

interface QuickAction {
  label: string;
  description: string;
  onClick: () => void;
  variant?: "primary" | "secondary";
}

interface AdminQuickActionsProps {
  actions: QuickAction[];
}

const AdminQuickActions = memo(function AdminQuickActions({ actions }: AdminQuickActionsProps) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-5 shadow-lg shadow-charcoal/20">
      <h2 className="text-xl font-semibold text-white">Quick Actions</h2>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={action.onClick}
            className={`rounded-xl border border-white/20 p-4 text-left transition-colors ${
              action.variant === "primary"
                ? "bg-[#1B1B1B]/80 hover:bg-[#1B1B1B] text-[#F7F7F7]"
                : "bg-[#1B1B1B]/60 hover:bg-[#1B1B1B] text-[#F7F7F7]"
            }`}
          >
            <h3 className="text-sm font-semibold">{action.label}</h3>
            <p className="text-xs text-[#00D084] mt-1">{action.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
});

export default AdminQuickActions;