"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SplitLine {
  text: string;
  /** Render this line as outlined (stroked) type. */
  outline?: boolean;
  className?: string;
}

interface SplitHeadingProps {
  lines: SplitLine[];
  className?: string;
  /** Class applied to every line (size, color). */
  lineClassName?: string;
  as?: "h1" | "h2" | "h3";
  charStagger?: number;
  delay?: number;
}

/**
 * Giant display heading where every character rises out of its own clip mask,
 * staggered across the line — triggered when the heading scrolls into view.
 */
export function SplitHeading({
  lines,
  className,
  lineClassName,
  as: Tag = "h2",
  charStagger = 0.025,
  delay = 0,
}: SplitHeadingProps) {
  const reduced = useReducedMotion();
  const label = lines.map((l) => l.text).join(" ");

  if (reduced) {
    return (
      <Tag className={cn("font-display uppercase", className)}>
        {lines.map((line) => (
          <span
            key={line.text}
            className={cn(
              "block",
              line.outline && "text-stroke-thick",
              lineClassName,
              line.className,
            )}
          >
            {line.text}
          </span>
        ))}
      </Tag>
    );
  }

  let charIndex = 0;

  return (
    <Tag className={cn("font-display uppercase", className)} aria-label={label}>
      {lines.map((line) => {
        const words = line.text.split(" ");
        return (
          <span
            key={line.text}
            aria-hidden
            className={cn(
              "block",
              line.outline && "text-stroke-thick",
              lineClassName,
              line.className,
            )}
          >
            {words.map((word, wi) => (
              <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
                {word.split("").map((char, ci) => {
                  const i = charIndex++;
                  return (
                    <span key={ci} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        className="inline-block will-change-transform"
                        initial={{ y: "112%" }}
                        whileInView={{ y: "0%" }}
                        viewport={{ once: true, margin: "-12%" }}
                        transition={{
                          duration: 0.9,
                          delay: delay + i * charStagger,
                          ease: [0.16, 1, 0.3, 1],
                        }}
                      >
                        {char}
                      </motion.span>
                    </span>
                  );
                })}
                {wi < words.length - 1 ? " " : ""}
              </span>
            ))}
          </span>
        );
      })}
    </Tag>
  );
}
