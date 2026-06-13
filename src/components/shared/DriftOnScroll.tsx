"use client";

import { useRef } from "react";
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

/**
 * Scrubbed positional drift: as the element traverses the viewport it slides
 * from (+x, +y) to (-x, -y). Used for opposing-direction heading lines and
 * ghost backdrop elements.
 */
export function DriftOnScroll({ children, x = 0, y = 0, className }: DriftOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const xT = useTransform(scrollYProgress, [0, 1], [x, -x]);
  const yT = useTransform(scrollYProgress, [0, 1], [y, -y]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ x: xT, y: yT }} className={className}>
      {children}
    </motion.div>
  );
}
