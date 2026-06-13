"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring } from "framer-motion";
import type { ProjectDTO } from "@/lib/validations/content";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/**
 * Editorial project rows with a volt "view case" chip that chases the cursor
 * across whichever row is being hovered.
 */
export function WildRows({ projects }: { projects: ProjectDTO[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const cx = useMotionValue(0);
  const cy = useMotionValue(0);
  const chipX = useSpring(cx, { stiffness: 300, damping: 30, mass: 0.6 });
  const chipY = useSpring(cy, { stiffness: 300, damping: 30, mass: 0.6 });

  const handleMove = (e: React.MouseEvent) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    cx.set(e.clientX - rect.left);
    cy.set(e.clientY - rect.top);
  };

  return (
    <div
      ref={listRef}
      className="relative mt-16 border-t border-border"
      onMouseMove={reduced ? undefined : handleMove}
      onMouseLeave={() => setHovered(null)}
    >
      {/* Cursor-chasing chip */}
      {!reduced && (
        <AnimatePresence>
          {hovered && (
            <motion.div
              key="chip"
              initial={{ scale: 0, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 12 }}
              transition={{ type: "spring", stiffness: 350, damping: 22 }}
              style={{ x: chipX, y: chipY }}
              className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
              aria-hidden
            >
              <span className="-ml-12 -mt-12 flex h-24 w-24 items-center justify-center rounded-full bg-accent text-center font-grotesk text-[10px] uppercase leading-tight tracking-[0.2em] text-background">
                View
                <br />
                case →
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {projects.map((project, i) => (
        <RevealOnScroll key={project.id} y={48}>
          <Link
            href={`/projects/${project.slug}`}
            onMouseEnter={() => setHovered(project.id)}
            onMouseLeave={() => setHovered(null)}
            className="group relative block overflow-hidden border-b border-border transition-colors duration-300 hover:bg-surface"
          >
            <div className="container-content flex items-baseline gap-6 py-10 md:gap-12 md:py-14">
              <span className="text-stroke font-display text-4xl uppercase leading-none md:text-6xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline justify-between gap-4">
                  <h3 className="font-display text-4xl uppercase leading-none text-foreground transition-all duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent md:text-6xl lg:text-7xl">
                    {project.title}
                  </h3>
                  <span className="hidden font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted sm:block">
                    {project.category.replace("_", " / ")}
                  </span>
                </div>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
                  {project.summary}
                </p>
                <p className="mt-4 font-grotesk text-[10px] uppercase tracking-[0.25em] text-muted/70">
                  {project.techStack.slice(0, 4).join(" · ")}
                </p>
              </div>
            </div>
            {/* Volt underline that sweeps across on hover */}
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-accent transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
            />
          </Link>
        </RevealOnScroll>
      ))}
    </div>
  );
}
