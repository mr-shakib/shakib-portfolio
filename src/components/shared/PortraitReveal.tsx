"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { createLiquidTrail, type LiquidTrail } from "@/lib/animations/liquidTrail";
import { cn } from "@/lib/utils/cn";

interface PortraitRevealProps {
  src: string;
  /** Image shown through the liquid trail. Must share the base image's framing. */
  revealSrc?: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Extra classes for the base image (e.g. the cinematic grayscale). */
  imageClassName?: string;
  /**
   * A shared trail (e.g. spanning the whole hero) so the liquid flows in from
   * anywhere. Without one, the portrait tracks the pointer over itself only.
   */
  trail?: LiquidTrail | null;
  /** Play one discovery sweep across the face once this turns true. */
  hint?: boolean;
  /** Edge fade: `all` (foot + sides) or `sides` (for portraits that bleed off the bottom). */
  fade?: "all" | "sides";
}

/**
 * A portrait with a second, aligned image hidden underneath, revealed through
 * a liquid cursor trail: points chasing the pointer, merged into one gooey
 * ribbon by an SVG blur + alpha-threshold filter. The trail only exists while
 * the pointer moves (see liquidTrail.ts). Reduced motion shows the base image.
 */
export function PortraitReveal({
  src,
  revealSrc,
  alt,
  sizes,
  priority,
  className,
  imageClassName,
  trail: sharedTrail,
  hint,
  fade = "all",
}: PortraitRevealProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const circlesRef = useRef<(SVGCircleElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ownTrail, setOwnTrail] = useState<LiquidTrail | null>(null);
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const enabled = Boolean(revealSrc) && !reduced;
  const trail = sharedTrail ?? ownTrail;
  const fadeClass = fade === "sides" ? "portrait-fade-x" : "portrait-fade";

  // Track the untransformed size (parents scale/translate this on scroll).
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Standalone use: a trail scoped to the portrait itself.
  useEffect(() => {
    if (!enabled || sharedTrail !== undefined || !wrapRef.current) return;
    const t = createLiquidTrail(wrapRef.current);
    setOwnTrail(t);
    return () => t.destroy();
  }, [enabled, sharedTrail]);

  // Draw the trail into this portrait's coordinate space.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!enabled || !trail || !wrap) return;
    return trail.subscribe((points) => {
      const r = wrap.getBoundingClientRect();
      const sx = wrap.offsetWidth / r.width;
      const sy = wrap.offsetHeight / r.height;
      return () =>
        points.forEach((p, i) => {
          const c = circlesRef.current[i];
          if (!c) return;
          c.setAttribute("cx", ((p.x - r.left) * sx).toFixed(1));
          c.setAttribute("cy", ((p.y - r.top) * sy).toFixed(1));
          c.setAttribute("r", (p.r * sx).toFixed(1));
        });
    });
  }, [enabled, trail]);

  // One discovery sweep across the face, shortly after the intro.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!hint || !enabled || !trail || !wrap) return;
    const id = window.setTimeout(() => {
      trail.sweep((t) => {
        const r = wrap.getBoundingClientRect();
        return {
          x: r.left + r.width * (0.18 + 0.64 * t),
          y: r.top + r.height * (0.34 + 0.06 * Math.sin(t * Math.PI * 2)),
        };
      }, 1600);
    }, 2200);
    return () => window.clearTimeout(id);
  }, [hint, enabled, trail]);

  const count = trail?.count ?? 0;

  return (
    <div ref={wrapRef} className={cn("relative", className)}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className={cn(fadeClass, "object-cover object-top", imageClassName)}
      />
      {enabled && size.w > 0 && count > 0 && (
        <svg
          aria-hidden
          viewBox={`0 0 ${size.w} ${size.h}`}
          className={cn(fadeClass, "pointer-events-none absolute inset-0 h-full w-full")}
        >
          <defs>
            <filter id={`goo-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
              <feColorMatrix
                in="blur"
                mode="matrix"
                values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
                result="goo"
              />
              <feGaussianBlur in="goo" stdDeviation="1.5" />
            </filter>
            <mask
              id={`mask-${uid}`}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width={size.w}
              height={size.h}
            >
              <g filter={`url(#goo-${uid})`}>
                {Array.from({ length: count }, (_, i) => (
                  <circle
                    key={i}
                    ref={(el) => {
                      circlesRef.current[i] = el;
                    }}
                    r="0"
                    fill="white"
                  />
                ))}
              </g>
            </mask>
          </defs>
          <image
            href={revealSrc ?? undefined}
            x="0"
            y="0"
            width={size.w}
            height={size.h}
            preserveAspectRatio="xMidYMin slice"
            mask={`url(#mask-${uid})`}
          />
        </svg>
      )}
    </div>
  );
}
