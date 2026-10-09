"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/context/AuthContext";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-[#f8fbf8]">
        {children}
      </div>
    </AuthProvider>
  );
}
