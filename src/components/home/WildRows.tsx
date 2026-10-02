"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import type { ProjectDTO } from "@/lib/validations/content";
import { ProjectCover, categoryLabels } from "@/components/projects/ProjectCover";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

/**
 * Editorial project rows. Where there's hover, a preview card trails the
 * cursor across the list: it holds every cover in a vertical reel that slides
 * to the hovered row's, and leans with the cursor's speed. Other screens get
 * each cover inline in its row instead.
 */
export function WildRows({ projects }: { projects: ProjectDTO[] }) {
  const listRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const x = useSpring(px, { stiffness: 170, damping: 22, mass: 0.6 });
  const y = useSpring(py, { stiffness: 170, damping: 22, mass: 0.6 });
  const lean = useTransform(useVelocity(x), [-1600, 1600], [-10, 10]);
  const rotate = useSpring(lean, { stiffness: 240, damping: 26 });
  const reel = useSpring(0, { stiffness: 150, damping: 22 });
  const reelY = useTransform(reel, (v) => `${v}%`);

  // Place the card at the pointer and pick the row under it. Also runs on
  // scroll, since rows slide under a resting cursor.
  const sync = () => {
    const list = listRef.current;
    const p = pointer.current;
    if (!list || !p) return;
    const r = list.getBoundingClientRect();
    const lx = p.x - r.left;
    const ly = p.y - r.top;
    const inside = lx >= 0 && ly >= 0 && lx <= r.width && ly <= r.height;
    const row = inside
      ? document.elementFromPoint(p.x, p.y)?.closest<HTMLElement>("[data-row]")
      : null;
    const next = row ? Number(row.dataset.row) : null;

    px.set(lx);
    py.set(ly);
    if (next === activeRef.current) return;
    if (next !== null) {
      // Appearing: start at the pointer on the right cover, no fly-in.
      if (activeRef.current === null) {
        x.jump(lx);
        y.jump(ly);
        reel.jump(-next * 100);
      } else reel.set(-next * 100);
    }
    activeRef.current = next;
    setActive(next);
  };

  useEffect(() => {
    if (reduced) return;
    let frame = 0;
    const onScroll = () => {
      if (pointer.current && !frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          sync();
        });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
    // sync only reads refs and stable motion values.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  const onPointerMove = (e: React.PointerEvent) => {
    if (e.pointerType === "touch") return;
    pointer.current = { x: e.clientX, y: e.clientY };
    sync();
  };
  const onPointerLeave = () => {
    pointer.current = null;
    activeRef.current = null;
    setActive(null);
  };

  const showing = active !== null;

  return (
    <div
      ref={listRef}
      className="relative mt-16 border-t border-border"
      onPointerMove={reduced ? undefined : onPointerMove}
      onPointerLeave={reduced ? undefined : onPointerLeave}
    >
      {!reduced && (
        <motion.div
          aria-hidden
          style={{ x, y, rotate }}
          // Hover-capable screens from tablet width up (inline covers elsewhere).
          className="pointer-events-none absolute left-0 top-0 z-30 hidden [@media(hover:hover)_and_(min-width:768px)]:block"
        >
          <motion.div
            initial={false}
            animate={{ scale: showing ? 1 : 0.5, opacity: showing ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="relative -ml-[11rem] -mt-[6.875rem] h-[13.75rem] w-[22rem] lg:-ml-[13.5rem] lg:-mt-[8.4375rem] lg:h-[16.875rem] lg:w-[27rem]"
          >
            <div className="relative h-full w-full overflow-hidden rounded-[1.25rem] shadow-[0_40px_90px_-30px_rgb(0_0_0/0.8)]">
              <motion.div style={{ y: reelY }} className="absolute inset-0">
                {projects.map((project, i) => (
                  <div
                    key={project.id}
                    className="absolute inset-x-0 h-full"
                    style={{ top: `${i * 100}%` }}
                  >
                    <ProjectCover project={project} index={i} sizes="27rem" />
                  </div>
                ))}
              </motion.div>
            </div>
            <span className="absolute -bottom-5 -right-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-full bg-volt text-center font-grotesk text-[9px] font-bold uppercase leading-tight tracking-[0.18em] text-ink">
              View
              <br />
              case
            </span>
          </motion.div>
        </motion.div>
      )}

      {projects.map((project, i) => (
        <RevealOnScroll key={project.id} y={48}>
          <Link
            href={`/projects/${project.slug}`}
            data-row={i}
            className={cn(
              "group relative block border-b border-border transition-opacity duration-500",
              showing && active !== i && "opacity-30",
            )}
          >
            <div className="container-content py-8 md:py-12">
              {/* Inline cover where there's no floating preview */}
              <div className="relative mb-7 aspect-[16/10] overflow-hidden rounded-2xl [@media(hover:hover)_and_(min-width:768px)]:hidden">
                <ProjectCover project={project} index={i} sizes="(min-width: 768px) 90vw, 100vw" />
              </div>

              <div className="flex items-baseline gap-5 md:gap-12">
                <span className="text-stroke-md font-display text-3xl uppercase leading-none md:text-6xl">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                    <h3 className="font-display text-4xl uppercase leading-none text-foreground transition-all duration-500 ease-out-expo group-hover:translate-x-3 group-hover:text-accent md:text-6xl lg:text-7xl">
                      {project.title}
                    </h3>
                    <span className="font-grotesk text-[10px] uppercase tracking-[0.3em] text-muted">
                      {categoryLabels[project.category]}
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
