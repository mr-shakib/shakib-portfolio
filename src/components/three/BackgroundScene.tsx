"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useUIStore } from "@/store/useUIStore";

/**
 * Lazy, SSR-disabled loader for the WebGL canvas. It only mounts after first
 * paint and when motion is allowed — so it never blocks LCP and respects the
 * user's reduced-motion / lite-mode choice. A static gradient fills the space
 * otherwise (rendered by the layout), preventing layout shift.
 */
const SceneCanvas = dynamic(() => import("@/three/Canvas/SceneCanvas"), {
  ssr: false,
  loading: () => null,
});

export function BackgroundScene() {
  const reduced = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const setPointer = useUIStore((s) => s.setPointer);

  // Defer mounting until after the page is interactive.
  useEffect(() => {
    const id = window.requestIdleCallback
      ? window.requestIdleCallback(() => setMounted(true), { timeout: 1500 })
      : window.setTimeout(() => setMounted(true), 600);
    return () => {
      if (window.cancelIdleCallback && typeof id === "number") window.cancelIdleCallback(id);
      else clearTimeout(id as number);
    };
  }, []);

  // Track pointer globally for scene parallax (cheap; passive).
  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      setPointer((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced, setPointer]);

  // Feed scroll progress to the 3D camera rig for depth parallax.
  useEffect(() => {
    if (reduced) return;
    const setScrollProgress = useUIStore.getState().setScrollProgress;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setScrollProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  if (reduced || !mounted) {
    // Static fallback: a subtle radial glow, no WebGL.
    return (
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-radial-accent opacity-60"
      />
    );
  }

  return <SceneCanvas />;
}
