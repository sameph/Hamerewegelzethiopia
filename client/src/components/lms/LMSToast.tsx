"use client";

import { useEffect, useState, useCallback } from "react";

type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
  id: number;
  type: ToastType;
  message: string;
}

const ICONS: Record<ToastType, string> = {
  success: "✓",
  error: "✗",
  info: "ℹ",
  warning: "⚠",
};

const COLORS: Record<ToastType, string> = {
  success: "border-[#a5ff63] bg-[#a5ff63]/10 text-[#a5ff63]",
  error: "border-red-500 bg-red-500/10 text-red-400",
  info: "border-blue-400 bg-blue-400/10 text-blue-300",
  warning: "border-yellow-400 bg-yellow-400/10 text-yellow-300",
};

let _id = 0;

export default function LMSToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    const handler = (e: Event) => {
      const { type, message } = (e as CustomEvent).detail as {
        type: ToastType;
        message: string;
      };
      const id = ++_id;
      setToasts((prev) => [...prev, { id, type, message }]);
      setTimeout(() => remove(id), 4000);
    };

    window.addEventListener("lms:toast", handler);
    return () => window.removeEventListener("lms:toast", handler);
  }, [remove]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-md animate-slide-in ${COLORS[t.type]}`}
          style={{ animation: "slideInToast 0.3s ease-out" }}
        >
          <span className="text-lg font-bold shrink-0">{ICONS[t.type]}</span>
          <p className="text-sm leading-snug flex-1">{t.message}</p>
          <button
            onClick={() => remove(t.id)}
            className="shrink-0 opacity-60 hover:opacity-100 transition"
          >
            ×
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(12px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)    scale(1);    }
        }
      `}</style>
    </div>
  );
}
