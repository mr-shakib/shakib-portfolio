"use client";

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
  /** Base drift speed in % of one item-set per second. */
  baseVelocity?: number;
  className?: string;
  textClassName?: string;
}

/** Wrap a value into [min, max) — used to loop the track seamlessly. */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

/**
 * Infinite kinetic marquee. A constant baseline drift is *modulated* (never
 * hard-flipped) by smoothed scroll velocity, so the band glides and only eases
 * faster/slower with scroll — no snapping. Composited on the GPU.
 */
export function VelocityMarquee({
  items,
  baseVelocity = 2.4,
  className,
  textClassName,
}: VelocityMarqueeProps) {
  const reduced = useReducedMotion();

  // baseX is a percentage offset; wrapped to [-25, 0) since we render 4 copies
  // (one logical set = 25% of the track), guaranteeing a seamless loop.
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, {
    damping: 40,
    stiffness: 200,
    mass: 0.6,
  });
  // Bounded contribution: a fast scroll at most doubles speed / gently reverses.
  const velocityFactor = useTransform(smoothVelocity, [-1500, 0, 1500], [-1, 0, 1], {
    clamp: true,
  });

  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduced) return;
    // Clamp delta so a backgrounded tab returning doesn't produce a huge jump.
    const dt = Math.min(delta, 50) / 1000;
    const factor = 1 + velocityFactor.get();
    baseX.set(baseX.get() - baseVelocity * dt * factor);
  });

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

  const content = [...items, ...items, ...items, ...items];

  return (
    <div className={cn("overflow-hidden border-y border-border py-6", className)} aria-hidden>
      <motion.div
        style={{ x, willChange: "transform", backfaceVisibility: "hidden" }}
        className={cn("flex whitespace-nowrap", textClassName)}
      >
        {content.map((item, i) => (
          <span key={`${item}-${i}`} className="flex flex-shrink-0 items-center">
            <span>{item}</span>
            <span className="mx-6 inline-block h-1.5 w-1.5 rounded-full bg-accent align-middle" />
          </span>
        ))}
      </motion.div>
    </div>
  );
}
