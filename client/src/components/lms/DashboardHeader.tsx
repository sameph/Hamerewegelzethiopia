"use client";

import Link from "next/link";
import { memo } from "react";

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  userName: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const DashboardHeader = memo(function DashboardHeader({
  title,
  subtitle,
  userName,
  primaryAction,
  secondaryAction,
}: DashboardHeaderProps) {
  return (
    <div className="card-gradient-glass flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold text-[#F7F7F7]">{title}</h1>
        <p className="text-sm text-[#F7F7F7]">
          {subtitle.replace("{name}", userName)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        {primaryAction && (
          <Link
            href={primaryAction.href}
            className="rounded-xl border border-white/20 bg-gradient-to-r from-[#F7F7F7]/20 to-[#00D084]/60 px-4 py-2 text-sm font-semibold text-[#F7F7F7] hover:brightness-110"
          >
            {primaryAction.label}
          </Link>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction.onClick}
            className="btn-primary-gradient px-4 py-2 text-sm font-bold"
          >
            {secondaryAction.label}
          </button>
        )}
      </div>
    </div>
  );
});

export default DashboardHeader;