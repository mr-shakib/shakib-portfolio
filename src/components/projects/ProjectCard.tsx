"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { ProjectDTO } from "@/lib/validations/content";
import { Badge } from "@/components/ui/Badge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

const categoryLabels: Record<ProjectDTO["category"], string> = {
  WEB: "Web",
  MOBILE: "Mobile",
  AI_ML: "AI / ML",
  RESEARCH: "Research",
  SYSTEM: "System",
  OTHER: "Other",
};

interface ProjectCardProps {
  project: ProjectDTO;
  className?: string;
}

/** Editorial project card: image/gradient cover with parallax zoom + 3D tilt. */
export function ProjectCard({ project, className }: ProjectCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-5, 5]), { stiffness: 200, damping: 20 });

  const onMove = (e: React.MouseEvent) => {
    if (reduced) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
      className={cn("group relative h-full", className)}
      data-cursor-hover
    >
      <Link
        href={`/projects/${project.slug}`}
        className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors duration-300 hover:border-accent/40"
      >
        {/* Cover — real image if provided, else a stable placeholder photo. */}
        <div className="relative aspect-[16/10] overflow-hidden bg-surface-elevated">
          <Image
            src={project.coverImage ?? `https://picsum.photos/seed/${project.slug}/800/500`}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover opacity-80 grayscale transition-all duration-700 ease-out-expo group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/30 to-transparent" />
          <div className="absolute left-4 top-4">
            <Badge variant="accent">{categoryLabels[project.category]}</Badge>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col gap-3 p-6">
          <h3 className="font-display text-2xl text-foreground transition-colors group-hover:text-accent">
            {project.title}
          </h3>
          <p className="flex-1 text-sm leading-relaxed text-muted">{project.summary}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted/70">
            {project.techStack.slice(0, 4).map((tech) => (
              <span key={tech}>{tech}</span>
            ))}
            {project.techStack.length > 4 && (
              <span className="text-accent">+{project.techStack.length - 4}</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
