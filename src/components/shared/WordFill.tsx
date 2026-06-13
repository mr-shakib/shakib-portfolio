"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { cn } from "@/lib/utils/cn";

interface WordFillProps {
  text: string;
  className?: string;
  /** Opacity of unread words. */
  baseOpacity?: number;
  as?: "p" | "blockquote" | "h2";
}

/**
 * Composable reading-spotlight: words brighten one by one, scrubbed to scroll.
 * Unstyled — bring your own typography via className.
 */
export function WordFill({ text, className, baseOpacity = 0.15, as: Tag = "p" }: WordFillProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useIsomorphicLayoutEffect(() => {
    if (reduced || !root.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        root.current!.querySelectorAll(".wf-word"),
        { opacity: baseOpacity },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: root.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: true,
          },
        },
      );
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [reduced, baseOpacity]);

  return (
    <div ref={root}>
      <Tag className={cn(className)}>
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="wf-word">
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        ))}
      </Tag>
    </div>
  );
}
