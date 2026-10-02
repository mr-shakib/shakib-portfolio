"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Eyebrow } from "@/components/shared/Eyebrow";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { SplitHeading } from "@/components/shared/SplitHeading";
import type { SectionContent } from "@/lib/sections/registry";
import { cn } from "@/lib/utils/cn";

/** Shared card frame: fixed size, content pinned to the foot. */
const CARD =
  "group relative flex h-[28rem] w-[20rem] shrink-0 snap-start flex-col justify-end overflow-hidden rounded-[1.5rem] p-7 sm:w-[24rem] lg:h-[30rem] lg:w-[28rem] lg:rounded-[1.75rem]";

/**
 * Milestone hall of fame — a pinned horizontal gallery. The section locks to
 * the viewport and scroll is converted into a sideways glide through the
 * seasons of the journey. A dark section (like Lando Norris's helmets hall):
 * raised cards, each fronted by a giant outlined volt year (filling solid on
 * hover), current roles flagged "Now", ending on a volt card.
 * Falls back to native horizontal swipe on touch/small screens and to a plain
 * row for reduced motion.
 */
export function HallOfFame({ content }: { content: SectionContent<"journey"> }) {
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
  }, [reduced, content.items.length]);

  return (
    <section ref={sectionRef} id="achievements" data-theme="dark" className="overflow-hidden">
      <div className="flex min-h-svh flex-col justify-center py-16 lg:py-0">
        <div className="container-content">
          <RevealOnScroll>
            <Eyebrow number="08">{content.eyebrow}</Eyebrow>
          </RevealOnScroll>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <SplitHeading
              as="h2"
              lines={[
                { text: content.headingTop, className: "text-foreground" },
                { text: content.headingBottom, serif: true },
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

        {/* The rail: pinned glide on desktop, snap-assisted swipe below lg.
            Raised cards on the dark section, ending on the volt card. */}
        <div className="no-scrollbar mt-12 snap-x snap-mandatory overflow-x-auto py-3 lg:snap-none lg:overflow-visible">
          <div
            ref={trackRef}
            className="flex w-max gap-4 pl-gutter pr-gutter will-change-transform lg:gap-6"
          >
            {content.items.map((item, i) => {
              const yearLabel = item.stage.split("—")[0]?.trim() ?? item.stage;
              const status = /present/i.test(item.stage)
                ? "now"
                : /next|future/i.test(item.stage)
                  ? "next"
                  : null;
              return (
                <article
                  key={`${item.title}-${i}`}
                  data-theme="dark"
                  className={cn(
                    CARD,
                    "border border-foreground/10 bg-surface transition-[transform,background-color,border-color] duration-500 ease-out-expo hover:-translate-y-2 hover:border-foreground/20 hover:bg-surface-elevated",
                  )}
                >
                  {/* Giant year: volt outline, filling solid on hover */}
                  <p
                    aria-hidden
                    className="fame-year pointer-events-none absolute -right-3 -top-7 font-display text-[8rem] uppercase leading-none text-transparent transition-colors duration-500 [-webkit-text-stroke:1.5px_rgb(198_241_53)] group-hover:text-volt lg:text-[12rem]"
                  >
                    {yearLabel}
                  </p>

                  <div className="absolute left-7 top-7 flex items-center gap-3">
                    <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-foreground/45">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {status === "now" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-volt px-2.5 py-1 font-grotesk text-[9px] font-bold uppercase tracking-[0.2em] text-ink">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ink/40" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-ink" />
                        </span>
                        Now
                      </span>
                    )}
                    {status === "next" && (
                      <span className="inline-flex items-center rounded-full border border-volt/60 px-2.5 py-1 font-grotesk text-[9px] font-bold uppercase tracking-[0.2em] text-volt">
                        Up next
                      </span>
                    )}
                  </div>

                  <p className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-accent">
                    {item.role}
                  </p>
                  <h3 className="mt-3 font-display text-3xl uppercase leading-tight text-foreground lg:text-4xl">
                    {item.title}
                  </h3>
                  <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground/65">
                    {item.body}
                  </p>
                  <p className="mt-6 border-t border-foreground/15 pt-4 font-grotesk text-[10px] uppercase tracking-[0.3em] text-foreground/55">
                    {item.stage}
                  </p>

                  {/* Volt bar sweeping along the foot on hover */}
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-volt transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  />
                </article>
              );
            })}

            {/* Closing volt card */}
            <article className={cn(CARD, "items-start bg-volt")}>
              <p
                aria-hidden
                className="pointer-events-none absolute -right-3 -top-7 font-display text-[8rem] uppercase leading-none text-ink/15 lg:text-[12rem]"
              >
                ???
              </p>
              <h3 className="font-display text-3xl uppercase leading-tight text-ink lg:text-4xl">
                {content.closingTitle}
              </h3>
              <p className="mt-4 max-w-md text-sm leading-relaxed text-ink/75">
                {content.closingBody}
              </p>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
