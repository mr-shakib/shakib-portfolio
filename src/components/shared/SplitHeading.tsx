"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils/cn";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface SplitLine {
  text: string;
  /** Render this line as outlined (stroked) type. */
  outline?: boolean;
  /** Render this line in the accent serif, optically matched to Anton's caps. */
  serif?: boolean;
  className?: string;
}

/**
 * Instrument Serif's capitals are ~1.18× shorter than Anton's at the same
 * size (measured), so serif lines scale up to share one cap height.
 */
// Always the brand volt — on light surfaces too, where other accent text turns black.
const SERIF_LINE = "font-serif text-[1.18em] leading-[0.95] tracking-[0.01em] text-volt";

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
 *
 * Visibility is observed on the heading, not on each character: a character
 * starts fully clipped by its own mask, so an observer on it never fires.
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
  const ref = useRef<HTMLHeadingElement>(null);
  const inView = useInView(ref, { once: true, margin: "-12%" });
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
            {line.serif ? <span className={SERIF_LINE}>{line.text}</span> : line.text}
          </span>
        ))}
      </Tag>
    );
  }

  let charIndex = 0;

  return (
    <Tag ref={ref} className={cn("font-display uppercase", className)} aria-label={label}>
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
            <span className={line.serif ? SERIF_LINE : undefined}>
              {words.map((word, wi) => (
                <span key={`${word}-${wi}`} className="inline-block whitespace-nowrap">
                  {word.split("").map((char, ci) => {
                    const i = charIndex++;
                    return (
                      <span key={ci} className="inline-block overflow-hidden align-bottom">
                        <motion.span
                          className="inline-block will-change-transform"
                          initial={{ y: "112%" }}
                          animate={inView ? { y: "0%" } : undefined}
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
          </span>
        );
      })}
    </Tag>
  );
}
