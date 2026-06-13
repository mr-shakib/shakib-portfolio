"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { aboutTimeline } from "@/content/stats";

/**
 * Milestone hall of fame — a pinned horizontal gallery. The section locks to
 * the viewport and scroll is converted into a sideways glide through the
 * seasons of the journey, each fronted by a giant condensed year numeral.
 * Falls back to native horizontal swipe on touch/small screens and to a plain
 * row for reduced motion.
 */
export function HallOfFame() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    if (reduced || !sectionRef.current || !trackRef.current) return;
    registerGsap();

    const mm = gsap.matchMedia();
    // Pin only where there's room for the cinematic version.
    mm.add("(min-width: 1024px)", () => {
      const track = trackRef.current!;
      const getDistance = () => track.scrollWidth - window.innerWidth;

      const tween = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax the ghost year numerals against the glide for depth.
      const years = track.querySelectorAll<HTMLElement>(".fame-year");
      const inner = gsap.to(years, {
        xPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
        },
      });

      ScrollTrigger.refresh();
      return () => {
        tween.scrollTrigger?.kill();
        tween.kill();
        inner.scrollTrigger?.kill();
        inner.kill();
      };
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="achievements"
      className="overflow-hidden border-b border-border bg-surface/40"
    >
      <div className="flex min-h-svh flex-col justify-center py-16 lg:py-0">
        <div className="container-content">
          <RevealOnScroll>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
              03 — The journey
            </p>
          </RevealOnScroll>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <SplitHeading
              as="h2"
              lines={[
                { text: "Milestone", className: "text-foreground" },
                { text: "Hall of Fame", outline: true },
              ]}
              lineClassName="text-display-lg leading-[0.9]"
            />
            <RevealOnScroll delay={0.2}>
              <p className="hidden pb-2 font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted lg:block">
                Scroll to travel <span className="text-accent">→</span>
              </p>
            </RevealOnScroll>
          </div>
        </div>

        {/* The rail: pinned glide on desktop, native swipe below lg */}
        <div className="no-scrollbar mt-12 overflow-x-auto lg:overflow-visible">
          <div
            ref={trackRef}
            className="flex w-max gap-px border-y border-border bg-border pl-gutter pr-gutter will-change-transform"
          >
            {aboutTimeline.map((item) => {
              const yearLabel = item.stage.split("—")[0]?.trim() ?? item.stage;
              return (
                <article
                  key={item.title}
                  className="group relative flex h-[26rem] w-[20rem] shrink-0 flex-col justify-end overflow-hidden bg-surface p-7 transition-colors duration-500 hover:bg-background sm:w-[24rem] lg:h-[30rem] lg:w-[28rem]"
                >
                  {/* Grey→volt fade mask, swapping on hover */}
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-foreground/[0.04] to-transparent transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-accent/15 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <p
                    aria-hidden
                    className="fame-year pointer-events-none absolute -right-4 -top-6 font-display text-[9rem] uppercase leading-none text-foreground/[0.06] transition-colors duration-500 group-hover:text-accent/20 lg:text-[12rem]"
                  >
                    {yearLabel}
                  </p>
                  <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">
                    {item.role}
                  </p>
                  <h3 className="mt-3 font-display text-3xl uppercase leading-tight text-foreground lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{item.body}</p>
                  <p className="mt-6 border-t border-border pt-4 font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted">
                    {item.stage}
                  </p>
                </article>
              );
            })}

            {/* Closing volt card */}
            <article className="flex h-[26rem] w-[20rem] shrink-0 flex-col items-start justify-end bg-accent p-7 sm:w-[24rem] lg:h-[30rem] lg:w-[28rem]">
              <p aria-hidden className="font-display text-[9rem] uppercase leading-none text-background/15 lg:text-[12rem]">
                ???
              </p>
              <h3 className="mt-3 font-display text-3xl uppercase leading-tight text-background lg:text-4xl">
                The next chapter
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-background/75">
                MSc, PhD, and research that ships. The best milestones aren&rsquo;t on this
                wall yet.
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
