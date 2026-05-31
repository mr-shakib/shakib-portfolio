"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Mounts Lenis once at the root and makes its RAF loop the single source of
 * truth for the frame clock, syncing GSAP ScrollTrigger to it. When reduced
 * motion is active, Lenis is skipped entirely and native scrolling is used.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    registerGsap();

    if (reducedMotion) {
      ScrollTrigger.refresh();
      return;
    }

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // Recompute trigger positions once layout settles.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const refreshTimer = window.setTimeout(refresh, 300);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
    };
  }, [reducedMotion]);

  return <>{children}</>;
}
