"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LiquidTrail } from "@/lib/animations/liquidTrail";

/** Share of the trail's width taken by the darker core. */
const CORE = 0.6;

/**
 * The liquid trail drawn over an empty background as a soft grey smear — a
 * pale outer body with a darker core, the way the cursor stirs Lando Norris's
 * white hero — so the whole surface reacts, not just the portrait. Fills its
 * positioned parent; sits below the portrait, which shows its reveal instead.
 */
export function TrailSmear({
  trail,
  color = "#f5f5f0",
  coreColor = "#e9eae4",
}: {
  trail: LiquidTrail | null;
  color?: string;
  coreColor?: string;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const bodyRef = useRef<(SVGCircleElement | null)[]>([]);
  const coreRef = useRef<(SVGCircleElement | null)[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");

  // Rendered even before the trail exists, so this always finds the element.
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.clientWidth, h: el.clientHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const svg = svgRef.current;
    if (!trail || !svg) return;
    return trail.subscribe((points) => {
      const r = svg.getBoundingClientRect();
      // Parents may scale this layer (the hero recedes on scroll).
      const sx = r.width ? svg.clientWidth / r.width : 1;
      const sy = r.height ? svg.clientHeight / r.height : 1;
      return () =>
        points.forEach((p, i) => {
          const cx = ((p.x - r.left) * sx).toFixed(1);
          const cy = ((p.y - r.top) * sy).toFixed(1);
          for (const [circles, scale] of [
            [bodyRef.current, 1],
            [coreRef.current, CORE],
          ] as const) {
            const c = circles[i];
            if (!c) continue;
            c.setAttribute("cx", cx);
            c.setAttribute("cy", cy);
            c.setAttribute("r", (p.r * sx * scale).toFixed(1));
          }
        });
    });
  }, [trail]);

  const count = trail?.count ?? 0;
  const circles = (refs: React.MutableRefObject<(SVGCircleElement | null)[]>) =>
    Array.from({ length: count }, (_, i) => (
      <circle
        key={i}
        ref={(el) => {
          refs.current[i] = el;
        }}
        r="0"
      />
    ));

  return (
    <svg
      ref={svgRef}
      aria-hidden
      viewBox={`0 0 ${size.w || 1} ${size.h || 1}`}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      <defs>
        <filter id={`smear-${uid}`} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 24 -10"
            result="goo"
          />
          <feGaussianBlur in="goo" stdDeviation="2" />
        </filter>
      </defs>
      <g filter={`url(#smear-${uid})`} fill={color}>
        {circles(bodyRef)}
      </g>
      <g filter={`url(#smear-${uid})`} fill={coreColor}>
        {circles(coreRef)}
      </g>
    </svg>
  );
}
