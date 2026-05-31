"use client";

import { useRef } from "react";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectDTO } from "@/lib/validations/content";
import { gsap, ScrollTrigger, registerGsap } from "@/lib/animations/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useIsDesktop } from "@/hooks/useMediaQuery";
import { useIsomorphicLayoutEffect } from "@/hooks/useIsomorphicLayoutEffect";

/**
 * Featured projects gallery. On desktop with motion enabled, the track scrolls
 * horizontally while pinned. Otherwise it degrades to a responsive grid.
 */
export function FeaturedProjectsSection({ projects }: { projects: ProjectDTO[] }) {
  const reduced = useReducedMotion();
  const isDesktop = useIsDesktop();
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const useHorizontal = isDesktop && !reduced && projects.length > 2;

  useIsomorphicLayoutEffect(() => {
    if (!useHorizontal || !root.current || !track.current) return;
    registerGsap();
    const ctx = gsap.context(() => {
      const el = track.current!;
      const distance = el.scrollWidth - window.innerWidth + 96;
      // Not enough overflow to justify pinning — leave as a static row.
      if (distance < 50) return;
      // Require more vertical scroll than horizontal travel so the gallery
      // moves slowly and cinematically rather than whipping past.
      const SCROLL_FACTOR = 2.2;
      gsap.to(el, {
        x: -distance,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: () => `+=${distance * SCROLL_FACTOR}`,
          pin: true,
          scrub: 1.2,
          invalidateOnRefresh: true,
        },
      });
      ScrollTrigger.refresh();
    }, root);
    return () => ctx.revert();
  }, [useHorizontal, projects.length]);

  return (
    <section id="projects" className="relative overflow-hidden py-section">
      <div className="container-content">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="Selected Work"
            title="Projects with real-world impact."
            description="Platforms and tools shipped end-to-end — from data model to interface."
          />
          <Button href="/projects" variant="outline" className="shrink-0">
            All projects →
          </Button>
        </div>
      </div>

      {useHorizontal ? (
        <div ref={root} className="mt-12">
          <div ref={track} className="flex gap-6 pl-gutter pr-gutter will-change-transform">
            {projects.map((project) => (
              <div key={project.id} className="w-[min(80vw,380px)] shrink-0">
                <ProjectCard project={project} className="h-full" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="container-content mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </section>
  );
}
