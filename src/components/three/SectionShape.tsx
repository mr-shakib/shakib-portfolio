"use client";

import { useEffect, useRef } from "react";
import { useUIStore } from "@/store/useUIStore";

/**
 * Invisible marker that tells the 3D background which meaningful shape to morph
 * into while this section is in view. Drop one inside any section:
 *   <SectionShape shape="leaf" />
 * It uses an IntersectionObserver centered on the viewport so the shape swaps as
 * the section crosses the middle of the screen.
 */
export function SectionShape({ shape }: { shape: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const setBgShape = useUIStore.getState().setBgShape;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setBgShape(shape);
        }
      },
      // A thin band across the vertical middle of the viewport.
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [shape]);

  return <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 -z-50" />;
}
