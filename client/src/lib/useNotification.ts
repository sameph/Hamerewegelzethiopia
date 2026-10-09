"use client";

import { useCallback } from "react";

type NotifyFn = (message: string) => void;

interface UseNotificationReturn {
  success: NotifyFn;
  error: NotifyFn;
  info: NotifyFn;
  warning: NotifyFn;
}

/**
 * useNotification – lightweight notification hook.
 *
 * Currently renders a native browser `alert()` for simplicity.
 * Swap the implementation body for a real toast library (e.g. react-hot-toast,
 * sonner) at any time without touching the consumer components.
 */
export function useNotification(): UseNotificationReturn {
  const success = useCallback((message: string) => {
    // Try to dispatch a custom DOM event so any global toast listener can pick it up.
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lms:toast", { detail: { type: "success", message } })
      );
    }
    console.log("[✓ success]", message);
  }, []);

  const error = useCallback((message: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lms:toast", { detail: { type: "error", message } })
      );
    }
    console.error("[✗ error]", message);
  }, []);

  const info = useCallback((message: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lms:toast", { detail: { type: "info", message } })
      );
    }
    console.info("[ℹ info]", message);
  }, []);

  const warning = useCallback((message: string) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("lms:toast", { detail: { type: "warning", message } })
      );
    }
    console.warn("[⚠ warning]", message);
  }, []);

  return { success, error, info, warning };
}
