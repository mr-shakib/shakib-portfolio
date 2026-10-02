"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface DriftOnScrollProps {
  children: React.ReactNode;
  /** Horizontal travel in px: the element drifts from +x to -x as it crosses the viewport. */
  x?: number;
  /** Vertical travel in px. */
  y?: number;
  className?: string;
}

/** Travel is authored for a 1440px viewport and scales down with it (min 25%). */
const DESIGN_WIDTH = 1440;

/**
 * Scrubbed positional drift: as the element traverses the viewport it slides
 * from (+x, +y) to (-x, -y). Used for opposing-direction heading lines and
 * ghost backdrop elements. Horizontal travel shrinks on narrow screens so
 * headings never drift past the page gutter.
 */
export function DriftOnScroll({ children, x = 0, y = 0, className }: DriftOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const widthScale = useRef(1);
  useEffect(() => {
    const update = () => {
      widthScale.current = Math.min(1, Math.max(0.25, window.innerWidth / DESIGN_WIDTH));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const xT = useTransform(scrollYProgress, (p) => x * (1 - 2 * p) * widthScale.current);
  const yT = useTransform(scrollYProgress, [0, 1], [y, -y]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ x: xT, y: yT }} className={className}>
      {children}
    </motion.div>
  );
}
