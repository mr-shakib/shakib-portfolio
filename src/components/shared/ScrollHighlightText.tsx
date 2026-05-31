"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { Section } from "@/components/shared/Section";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

interface ScrollHighlightTextProps {
  text: string;
  eyebrow?: string;
}

/**
 * Large statement whose words brighten one-by-one, scrubbed to scroll — the
 * "reading spotlight" effect used on premium agency sites. Smooth (scrub),
 * accessible (full text is real, just dimmed), and reduced-motion safe.
 */
export function ScrollHighlightText({ text, eyebrow }: ScrollHighlightTextProps) {
  const root = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const words = text.split(" ");

  useIsomorphicLayoutEffect(() => {
    if (reduced || !root.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const wordEls = root.current!.querySelectorAll(".hl-word");
      gsap.fromTo(
        wordEls,
        { opacity: 0.16 },
        {
          opacity: 1,
          ease: "none",
          stagger: 0.4,
          scrollTrigger: {
            trigger: root.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: true,
          },
        },
      );
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section>
      <div ref={root} className="mx-auto max-w-5xl">
        {eyebrow && (
          <span className="mb-8 flex items-center gap-3 text-sm uppercase tracking-[0.25em] text-accent">
            <span className="h-px w-10 bg-accent/60" aria-hidden />
            {eyebrow}
          </span>
        )}
        <p className="font-display text-[clamp(1.75rem,4.5vw,3.75rem)] font-medium leading-[1.15] tracking-tight text-foreground">
          {words.map((word, i) => (
            <span key={`${word}-${i}`} className="hl-word">
              {word}
              {i < words.length - 1 ? " " : ""}
            </span>
          ))}
        </p>
      </div>
    </Section>
  );
}
