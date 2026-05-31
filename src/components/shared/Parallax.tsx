"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils/cn";

interface ParallaxProps {
  children: React.ReactNode;
  /**
   * How far (in px) the element travels across its scroll range.
   * Positive = moves up as you scroll down (appears faster / nearer).
   * Negative = moves down (appears slower / further).
   */
  amount?: number;
  /** Optional horizontal drift in px. */
  amountX?: number;
  /** Subtle scale/opacity depth cue. */
  depth?: boolean;
  className?: string;
  as?: "div" | "span" | "section";
}

/**
 * Scroll-driven parallax. Drives a transform from `amount` → `-amount` across the
 * element's viewport traversal, scrubbed to the (Lenis-synced) scroll position.
 * Honors reduced motion by rendering statically.
 */
export function Parallax({
  children,
  amount = 80,
  amountX = 0,
  depth = false,
  className,
  as: Tag = "div",
}: ParallaxProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !ref.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { y: amount, x: amountX, ...(depth ? { scale: 1.08, opacity: 0.6 } : {}) },
        {
          y: -amount,
          x: -amountX,
          ...(depth ? { scale: 1, opacity: 1 } : {}),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      ScrollTrigger.refresh();
    }, ref);
    return () => ctx.revert();
  }, [reduced, amount, amountX, depth]);

  return (
    <Tag ref={ref as React.Ref<HTMLDivElement>} className={cn("will-change-transform", className)}>
      {children}
    </Tag>
  );
}
