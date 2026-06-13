"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface ClipRevealProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Section-scale entrance: the block un-clips from an inset window to full
 * bleed while easing up to full scale, scrubbed to scroll. Fully revealed by
 * the time it reaches mid-viewport.
 */
export function ClipReveal({ children, className }: ClipRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 95%", "start 35%"],
  });

  const clipPath = useTransform(
    scrollYProgress,
    [0, 1],
    ["inset(6% 5% 8% 5%)", "inset(0% 0% 0% 0%)"],
  );
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1]);

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ clipPath, scale }} className={cn("will-change-transform")}>
        {children}
      </motion.div>
    </div>
  );
}
