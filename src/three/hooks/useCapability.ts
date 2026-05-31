"use client";

import { useEffect, useState } from "react";

export type Tier = "high" | "low" | "none";

/**
 * Detects rendering capability once on mount: whether WebGL is available and a
 * coarse device tier (mobile / low-memory → "low"). Scenes use this to scale
 * particle counts and disable post-processing.
 */
export function useCapability(): { tier: Tier; ready: boolean } {
  const [tier, setTier] = useState<Tier>("high");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let detected: Tier = "high";
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl2") ??
        canvas.getContext("webgl") ??
        canvas.getContext("experimental-webgl");
      if (!gl) {
        detected = "none";
      } else {
        const isMobile = window.matchMedia("(max-width: 768px)").matches;
        const lowMemory =
          typeof navigator !== "undefined" &&
          "deviceMemory" in navigator &&
          (navigator as Navigator & { deviceMemory?: number }).deviceMemory !== undefined &&
          (navigator as Navigator & { deviceMemory?: number }).deviceMemory! <= 4;
        const fewCores =
          typeof navigator !== "undefined" && navigator.hardwareConcurrency <= 4;
        detected = isMobile || lowMemory || fewCores ? "low" : "high";
      }
    } catch {
      detected = "none";
    }
    setTier(detected);
    setReady(true);
  }, []);

  return { tier, ready };
}
