"use client";

import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface SpinBadgeProps {
  /** Text repeated around the ring. Add trailing separator, e.g. "Portfolio '26 — ". */
  text: string;
  /** Center glyph. */
  center?: string;
  className?: string;
  /** Seconds per rotation. */
  duration?: number;
}

/**
 * Slow-spinning circular text badge — the rotating "sticker" moment. Spins
 * continuously and reverses direction on hover.
 */
export function SpinBadge({ text, center = "SH", className, duration = 16 }: SpinBadgeProps) {
  const id = useId();
  const pathId = `spin-badge-${id}`;

  return (
    <div
      className={cn(
        "group/badge relative h-28 w-28 select-none text-foreground lg:h-32 lg:w-32",
        className,
      )}
      aria-hidden
    >
      <svg
        viewBox="0 0 100 100"
        className="h-full w-full animate-spin-slow group-hover/badge:[animation-direction:reverse]"
        style={{ animationDuration: `${duration}s` }}
      >
        <defs>
          <path id={pathId} d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
        </defs>
        <text className="fill-current font-grotesk text-[8px] uppercase tracking-[0.22em]">
          <textPath href={`#${pathId}`}>{text}</textPath>
        </text>
      </svg>
      <span className="absolute inset-0 flex items-center justify-center font-display text-lg uppercase text-accent transition-transform duration-500 group-hover/badge:scale-125">
        {center}
      </span>
    </div>
  );
}
