"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useVelocity,
  useTransform,
  useSpring,
  useMotionValue,
  useAnimationFrame,
} from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface VelocityMarqueeProps {
  items: string[];
  /** Base drift speed in px/s. */
  baseVelocity?: number;
  className?: string;
  textClassName?: string;
}

const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Infinite marquee whose speed and direction react to scroll velocity — the
 * signature "kinetic type" band. Scrolling fast flings the text; idle, it drifts.
 */
export function VelocityMarquee({
  items,
  baseVelocity = 18,
  className,
  textClassName,
}: VelocityMarqueeProps) {
  const reduced = useReducedMotion();
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  // Bounded so a fast scroll only gently nudges the marquee (never flings it).
  const velocityFactor = useTransform(smoothVelocity, [-2500, 0, 2500], [-1, 0, 1], {
    clamp: true,
  });
  const directionRef = useRef(1);

  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    let moveBy = directionRef.current * baseVelocity * (delta / 1000);
    const vf = velocityFactor.get();
    if (vf < 0) directionRef.current = -1;
    else if (vf > 0) directionRef.current = 1;
    moveBy += directionRef.current * moveBy * vf;
    baseX.set(baseX.get() + moveBy);
  });

  const content = [...items, ...items, ...items, ...items];

  if (reduced) {
    return (
      <div className={cn("overflow-hidden border-y border-border py-6", className)}>
        <div className={cn("flex gap-8 px-gutter", textClassName)}>
          {items.map((item) => (
            <span key={item} className="text-muted">
              {item}
            </span>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn("overflow-hidden border-y border-border py-6", className)}
      aria-hidden
    >
      <motion.div style={{ x }} className={cn("flex whitespace-nowrap", textClassName)}>
        {content.map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center">
            <span>{item}</span>
            <span className="mx-6 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
