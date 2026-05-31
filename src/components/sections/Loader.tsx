"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, registerGsap } from "@/lib/animations/gsap";
import { useUIStore } from "@/store/useUIStore";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const STEPS = ["Initializing Experience", "Loading Research", "Loading Projects", "Welcome"];

/**
 * Cinematic startup sequence. Plays once per session; respects reduced motion by
 * skipping straight to the content.
 */
export function Loader() {
  const setLoaderComplete = useUIStore((s) => s.setLoaderComplete);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLSpanElement>(null);
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

      STEPS.forEach((step, i) => {
        tl.call(() => {
          if (labelRef.current) labelRef.current.textContent = step;
        })
          .fromTo(labelRef.current, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35 })
          .to(barRef.current, {
            scaleX: (i + 1) / STEPS.length,
            duration: 0.5,
            ease: "power2.inOut",
          })
          .to(labelRef.current, { opacity: 0, y: -12, duration: 0.3, delay: 0.25 });
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
      <span ref={labelRef} className="font-display text-2xl text-foreground md:text-4xl">
        {STEPS[0]}
      </span>
      <span className="block h-px w-48 overflow-hidden bg-border">
        <span ref={barRef} className="block h-full w-full origin-left scale-x-0 bg-accent" />
      </span>
    </div>
  );
}
