"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { registerGsap, gsap, ScrollTrigger } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Mounts Lenis once at the root and makes its RAF loop the single source of
 * truth for the frame clock, syncing GSAP ScrollTrigger to it. When reduced
 * motion is active, Lenis is skipped entirely and native scrolling is used.
 *
 * On route change it resets scroll to the top and refreshes ScrollTrigger —
 * because Lenis owns the scroll position, Next.js's default scroll-to-top on
 * navigation doesn't apply, which otherwise leaves new pages mid-scroll.
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

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
    lenisRef.current = lenis;

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
      lenisRef.current = null;
      window.removeEventListener("load", refresh);
      window.clearTimeout(refreshTimer);
    };
  }, [reducedMotion]);

  // Reset scroll position on route change.
  useEffect(() => {
    if (reducedMotion) {
      window.scrollTo(0, 0);
    } else if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Let the new page paint, then recompute scroll-driven animations.
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname, reducedMotion]);

  return <>{children}</>;
}
