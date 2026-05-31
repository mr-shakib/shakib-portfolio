"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface AnimatedTextProps {
  text: string;
  className?: string;
  /** Animate per-word (default) or per-character. */
  mode?: "word" | "char";
  delay?: number;
  as?: "h1" | "h2" | "p" | "span";
}

/** Staggered reveal of words/characters using a clip-style mask. */
export function AnimatedText({
  text,
  className,
  mode = "word",
  delay = 0,
  as: Tag = "span",
}: AnimatedTextProps) {
  const reduced = useReducedMotion();
  const units = mode === "word" ? text.split(" ") : text.split("");

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag] as typeof motion.span;

  return (
    <MotionTag
      className={cn("inline-block", className)}
      initial="hidden"
      animate="visible"
      aria-label={text}
      transition={{ staggerChildren: 0.04, delayChildren: delay }}
    >
      {units.map((unit, i) => (
        <span key={`${unit}-${i}`} className="reveal-mask" aria-hidden>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              visible: { y: 0 },
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            {unit}
            {mode === "word" && i < units.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
