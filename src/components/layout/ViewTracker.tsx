"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const LAST_KEY = "sh-last-view";
const VISIT_KEY = "sh-visit";

/**
 * Sends one beacon per page view to /api/views. The first view of a browser
 * session is flagged as a new visit. A repeat of the same path within a few
 * seconds (reloads, React strict-mode double effects) isn't counted twice.
 */
export function ViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    try {
      const now = Date.now();
      const last = JSON.parse(sessionStorage.getItem(LAST_KEY) ?? "null") as
        | { path: string; at: number }
        | null;
      if (last && last.path === pathname && now - last.at < 10_000) return;

      const newVisit = !sessionStorage.getItem(VISIT_KEY);
      sessionStorage.setItem(VISIT_KEY, "1");
      sessionStorage.setItem(LAST_KEY, JSON.stringify({ path: pathname, at: now }));

      const body = JSON.stringify({ path: pathname, newVisit });
      const sent = navigator.sendBeacon?.("/api/views", new Blob([body], { type: "application/json" }));
      if (!sent) {
        void fetch("/api/views", { method: "POST", body, keepalive: true }).catch(() => {});
      }
    } catch {
      // Storage blocked or beacon unavailable — skip silently.
    }
  }, [pathname]);

  return null;
}
