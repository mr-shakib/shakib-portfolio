"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useUIStore } from "@/store/useUIStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STEPS = ["Research", "Engineering", "Shakib Howlader"];

/**
 * Cinematic startup sequence: wordmark steps, a volt progress bar, and a giant
 * percentage counter pinned to the corner. Plays once per session; respects
 * reduced motion by skipping straight to the content.
 */
export function Loader() {
  const setLoaderComplete = useUIStore((s) => s.setLoaderComplete);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
  const pctRef = useRef<HTMLSpanElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    // Only show on first load of the session.
    const seen = sessionStorage.getItem("loader-seen");
    if (reduced || seen) {
      setLoaderComplete(true);
      setHidden(true);
      return;
    }

    registerGsap();
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        onComplete: () => {
          sessionStorage.setItem("loader-seen", "1");
          setLoaderComplete(true);
          setHidden(true);
        },
      });

      // Giant percentage counter, eased across the whole step sequence.
      const progress = { value: 0 };
      tl.to(progress, {
        value: 100,
        duration: STEPS.length * 1.4,
        ease: "power2.inOut",
        onUpdate: () => {
          if (pctRef.current) pctRef.current.textContent = String(Math.round(progress.value));
        },
      });

      STEPS.forEach((step, i) => {
        tl.call(
          () => {
            if (labelRef.current) labelRef.current.textContent = step;
          },
          undefined,
          i * 1.4,
        )
          .fromTo(
            labelRef.current,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.35 },
            i * 1.4,
          )
          .to(
            barRef.current,
            { scaleX: (i + 1) / STEPS.length, duration: 0.5, ease: "power2.inOut" },
            i * 1.4 + 0.3,
          )
          .to(
            labelRef.current,
            { opacity: 0, y: -24, duration: 0.3 },
            i * 1.4 + (i === STEPS.length - 1 ? 1.05 : 0.95),
          );
      });

      tl.to(rootRef.current, { yPercent: -100, duration: 0.8, ease: "expo.inOut" });
    }, rootRef);

    return () => ctx.revert();
  }, [reduced, setLoaderComplete]);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[90] flex flex-col items-center justify-center gap-8 bg-background"
      aria-hidden
    >
      <span
        ref={labelRef}
        className="font-display text-4xl uppercase tracking-wide text-foreground md:text-6xl"
      >
        {STEPS[0]}
      </span>
      <span className="block h-1 w-56 overflow-hidden bg-border">
        <span ref={barRef} className="block h-full w-full origin-left scale-x-0 bg-accent" />
      </span>

      {/* Corner percentage */}
      <p className="absolute bottom-6 right-gutter font-display text-7xl uppercase leading-none text-foreground/20 md:text-9xl">
        <span ref={pctRef}>0</span>
        <span className="text-accent">%</span>
      </p>

      <p className="absolute bottom-8 left-gutter font-grotesk text-[10px] uppercase tracking-[0.35em] text-muted">
        Portfolio &rsquo;26 — Loading
      </p>
    </div>
  );
}
