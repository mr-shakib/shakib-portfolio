"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils/cn";

interface ParallaxImageProps {
  src: string;
  alt: string;
  /** 0–1: how strongly the image drifts within its frame. 0.2 ≈ tasteful, 0.4 ≈ dramatic. */
  strength?: number;
  className?: string;
  imageClassName?: string;
  priority?: boolean;
  sizes?: string;
  /** Overlay gradient/scrim on top of the image. */
  overlay?: boolean;
}

/**
 * Depth parallax done the premium way: the image is oversized inside an
 * overflow-hidden frame and drifts vertically as it crosses the viewport. The
 * frame never moves, so content never overlaps and it never feels "fast" — just
 * deep. Scrubbed to the Lenis-synced scroll for buttery motion.
 */
export function ParallaxImage({
  src,
  alt,
  strength = 0.25,
  className,
  imageClassName,
  priority = false,
  sizes = "100vw",
  overlay = false,
}: ParallaxImageProps) {
  const frame = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const travel = Math.min(Math.max(strength, 0), 0.5);
  // Oversize the inner so the drift never reveals an edge.
  const oversize = 1 + travel * 2;

  useIsomorphicLayoutEffect(() => {
    if (reduced || !frame.current || !inner.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inner.current,
        { yPercent: -travel * 100 },
        {
          yPercent: travel * 100,
          ease: "none",
          scrollTrigger: {
            trigger: frame.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
      ScrollTrigger.refresh();
    }, frame);
    return () => ctx.revert();
  }, [reduced, travel]);

  return (
    <div ref={frame} className={cn("relative overflow-hidden", className)}>
      <div
        ref={inner}
        className="absolute inset-0"
        style={{ height: `${oversize * 100}%`, top: `${-(travel) * 100}%` }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={cn("object-cover", imageClassName)}
        />
      </div>
      {overlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
      )}
    </div>
  );
}
