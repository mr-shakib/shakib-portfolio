"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * Frame for a case study's cover: it grows from inset to full width as it
 * rises into view, while the cover inside settles from a slight zoom.
 */
export function CoverStage({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 0.25"] });
  const scale = useTransform(scrollYProgress, [0, 1], [0.86, 1]);
  const zoom = useTransform(scrollYProgress, [0, 1], [1.14, 1]);

  return (
    <motion.div
      ref={ref}
      style={reduced ? undefined : { scale }}
      className={cn(
        "relative aspect-[16/10] overflow-hidden rounded-[1.5rem] md:rounded-[2.5rem]",
        className,
      )}
    >
      <motion.div style={reduced ? undefined : { scale: zoom }} className="absolute inset-0">
        {children}
      </motion.div>
    </motion.div>
  );
}
