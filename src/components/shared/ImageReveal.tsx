"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

interface ImageRevealProps {
  children: React.ReactNode;
  className?: string;
  /** Direction the clip wipe opens from. */
  from?: "bottom" | "left";
  delay?: number;
}

/**
 * Clip-path wipe reveal — content is masked then unveiled as it enters view,
 * with a subtle scale settle. The signature "editorial image reveal" motion.
 */
export function ImageReveal({ children, className, from = "bottom", delay = 0 }: ImageRevealProps) {
  const reduced = useReducedMotion();

  if (reduced) return <div className={className}>{children}</div>;

  const initialClip =
    from === "bottom" ? "inset(100% 0% 0% 0%)" : "inset(0% 100% 0% 0%)";

  return (
    <motion.div
      className={cn("overflow-hidden", className)}
      initial={{ clipPath: initialClip }}
      whileInView={{ clipPath: "inset(0% 0% 0% 0%)" }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
