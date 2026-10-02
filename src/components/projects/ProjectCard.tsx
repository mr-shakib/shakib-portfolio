import Link from "next/link";
import type { ProjectDTO } from "@/lib/validations/content";
import { NotchArrow, ProjectCover, categoryLabels } from "@/components/projects/ProjectCover";
import { cn } from "@/lib/utils/cn";

interface ProjectCardProps {
  project: ProjectDTO;
  /** Position in the list, for the N° label and the generated cover. */
  index: number;
  /** Wide layout: cover and text side by side on large screens. */
  feature?: boolean;
  /** With `feature`: put the cover on the right. */
  reverse?: boolean;
  className?: string;
}

/**
 * Project card: a big cover with a notched corner holding the arrow button,
 * then the number, title and stack underneath. Screenshots rest in monochrome
 * and bloom into color on hover (see ProjectCover `mono`).
 */
export function ProjectCard({ project, index, feature, reverse, className }: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor-hover
      className={cn(
        "group block focus-visible:outline-none",
        feature && "lg:grid lg:grid-cols-12 lg:items-end lg:gap-12",
        className,
      )}
    >
      <div
        className={cn(
          "relative aspect-[16/10] overflow-hidden rounded-[1.5rem] md:rounded-[1.75rem]",
          "ring-accent/0 ring-offset-4 ring-offset-background transition-shadow group-focus-visible:ring-2 group-focus-visible:ring-accent",
          feature && "lg:col-span-7",
          feature && reverse && "lg:order-2",
        )}
      >
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]">
          <ProjectCover
            project={project}
            index={index}
            priority={feature && !reverse}
            sizes={feature ? "(min-width: 1024px) 58vw, 100vw" : "(min-width: 768px) 50vw, 100vw"}
            mono
          />
        </div>
        <span className="absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 font-grotesk text-[10px] uppercase tracking-[0.22em] text-[#f5f5f3] backdrop-blur-md md:left-5 md:top-5">
          {categoryLabels[project.category]}
        </span>
        <NotchArrow />
      </div>

      <div className={cn("mt-6", feature && "lg:col-span-5 lg:mt-0 lg:pb-3")}>
        <div className="flex items-baseline justify-between gap-4 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted">
          <span>N°{String(index + 1).padStart(2, "0")}</span>
          <span className="truncate">{project.tags.slice(0, 2).join(" · ")}</span>
        </div>
        <h3
          className={cn(
            "mt-3 font-display uppercase leading-[0.9] text-foreground transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-accent",
            feature ? "text-[clamp(2.5rem,4.6vw,5rem)]" : "text-[clamp(2.25rem,4.2vw,3.75rem)]",
          )}
        >
          {project.title}
        </h3>
        <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted md:text-base">
          {project.summary}
        </p>
        <p className="mt-5 font-grotesk text-[10px] uppercase tracking-[0.25em] text-muted/70">
          {project.techStack.slice(0, 4).join(" · ")}
          {project.techStack.length > 4 && (
            <span className="text-accent"> +{project.techStack.length - 4}</span>
          )}
        </p>
      </div>
    </Link>
  );
}
