"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Viewport fractions: blend in as a chapter's top rises 80% → 40%, out as its bottom rises 60% → 20%. */
const ENTER_FROM = 0.8;
const LEAVE_UNTIL = 0.2;
const RAMP = 0.4;

/**
 * A GSAP-pinned chapter is measured by its in-flow pin spacer: it spans the
 * whole pinned stretch, and unlike the pinned element it never jumps — fast
 * jumps can pin the element over the viewport for a few frames early.
 */
function flowBox(el: HTMLElement): HTMLElement {
  const parent = el.parentElement;
  return parent?.classList.contains("pin-spacer") ? parent : el;
}

/**
 * Blends the page into each light chapter (`[data-chapter]`) as it takes over
 * the viewport. Per scroll frame it only sets the opacity of a fixed cream
 * layer — a compositor-only change, so scrolling stays smooth. Text and UI
 * colors flip instantly, once, at the midpoint, via `data-tone` on <html>
 * (see globals.css). The layer sits above the ambient particles, so it also fades
 * them out over light chapters.
 *
 * Skipped under reduced motion: chapters then keep their static cream styling.
 */
export function ChapterTheme() {
  const layerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const layer = layerRef.current;
    const chapters = [...document.querySelectorAll<HTMLElement>("[data-chapter]")];
    if (!layer || reduced || chapters.length === 0) return;
    const root = document.documentElement;

    let frame = 0;
    let light = false;

    const update = () => {
      frame = 0;
      const vh = window.innerHeight;
      let mix = 0;
      for (const el of chapters) {
        const r = flowBox(el).getBoundingClientRect();
        const enter = (vh * ENTER_FROM - r.top) / (vh * RAMP);
        const leave = (r.bottom - vh * LEAVE_UNTIL) / (vh * RAMP);
        mix = Math.max(mix, Math.min(1, Math.max(0, Math.min(enter, leave))));
      }
      layer.style.opacity = mix.toFixed(3);

      // Only touch the DOM when the tone actually changes.
      const nextLight = mix >= 0.5;
      if (nextLight !== light) {
        light = nextLight;
        if (light) root.dataset.tone = "cream";
        else delete root.dataset.tone;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    root.classList.add("chapters-live");
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      root.classList.remove("chapters-live");
      delete root.dataset.tone;
      layer.style.opacity = "0";
    };
  }, [reduced, pathname]);

  return (
    <div
      ref={layerRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0 bg-cream opacity-0 will-change-[opacity]"
    />
  );
}
