"use client";

import { useEffect, useState } from "react";
import { usePreferencesStore } from "@/store/usePreferencesStore";

/**
 * True when motion should be minimized — either the OS `prefers-reduced-motion`
 * setting or the user's in-app "lite mode" toggle. This is the single gate that
 * disables scroll animations and swaps 3D for static fallbacks.
 */
export function useReducedMotion(): boolean {
  const liteMode = usePreferencesStore((s) => s.liteMode);
  const [systemReduced, setSystemReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setSystemReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return systemReduced || liteMode;
}
