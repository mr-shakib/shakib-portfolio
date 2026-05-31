"use client";

import { useRef } from "react";
import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ParallaxImage } from "@/components/shared/ParallaxImage";
import { aboutTimeline } from "@/content/stats";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/** Scroll-storytelling: the four-stage journey reveals progressively. */
export function AboutSection() {
  const reduced = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (reduced || !root.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>(".about-stage");
      items.forEach((item) => {
        gsap.fromTo(
          item,
          { opacity: 0.15, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            ease: "power3.out",
            scrollTrigger: { trigger: item, start: "top 75%", end: "top 45%", scrub: true },
          },
        );
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <Section id="about">
      <div ref={root} className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <SectionHeading
            eyebrow="About"
            title="From curiosity to contribution."
            description="A path that runs through engineering, research and building tools people actually use — heading toward graduate research."
          />
          <ParallaxImage
            src="https://picsum.photos/seed/shakib-portrait/800/1000"
            alt="Portrait"
            strength={0.3}
            overlay
            className="mt-10 hidden aspect-[4/5] rounded-2xl border border-border lg:block"
            imageClassName="grayscale"
            sizes="(min-width: 1024px) 40vw, 100vw"
          />
        </div>

        <ol className="flex flex-col gap-12 border-l border-border pl-8">
          {aboutTimeline.map((stage) => (
            <li key={stage.stage} className="about-stage relative">
              <span
                className="absolute -left-[2.6rem] top-1 flex h-5 w-5 items-center justify-center rounded-full border border-accent bg-background"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              <p className="text-sm uppercase tracking-widest text-accent">{stage.stage}</p>
              <h3 className="mt-2 font-display text-2xl text-foreground">{stage.title}</h3>
              <p className="mt-2 max-w-md leading-relaxed text-muted">{stage.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </Section>
  );
}
