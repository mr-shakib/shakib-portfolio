"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { categoryLabels } from "@/components/projects/ProjectCover";
import type { ProjectDTO, ProjectCategory } from "@/lib/validations/content";
import { cn } from "@/lib/utils/cn";

const ORDER: ProjectCategory[] = ["WEB", "MOBILE", "AI_ML", "RESEARCH", "SYSTEM", "OTHER"];

export function ProjectsExplorer({ projects }: { projects: ProjectDTO[] }) {
  const [category, setCategory] = useState<ProjectCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");

  // Numbers follow the full list, so a project keeps its N° under any filter.
  const numberOf = useMemo(() => new Map(projects.map((p, i) => [p.id, i])), [projects]);

  // Only offer categories that have projects, with their counts.
  const categories = useMemo(() => {
    const counts = new Map<ProjectCategory, number>();
    for (const p of projects) counts.set(p.category, (counts.get(p.category) ?? 0) + 1);
    return ORDER.filter((c) => counts.has(c)).map((c) => ({ value: c, count: counts.get(c)! }));
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesCat = category === "ALL" || p.category === category;
      const matchesQuery =
        q.length === 0 ||
        p.title.toLowerCase().includes(q) ||
        p.summary.toLowerCase().includes(q) ||
        p.techStack.some((t) => t.toLowerCase().includes(q)) ||
        p.tags.some((t) => t.toLowerCase().includes(q));
      return matchesCat && matchesQuery;
    });
  }, [projects, category, query]);

  // The first project runs wide; so does the last when the two-column grid
  // would otherwise leave it alone on its row.
  const wide = (i: number) =>
    filtered.length > 1 &&
    (i === 0 || (i === filtered.length - 1 && (filtered.length - 1) % 2 === 1));

  const chip = (active: boolean) =>
    cn(
      "flex h-10 items-center gap-2 rounded-full border px-4 font-grotesk text-[11px] uppercase tracking-[0.2em] transition-colors duration-300",
      active
        ? "border-volt bg-volt text-ink"
        : "border-foreground/20 text-muted hover:border-foreground/60 hover:text-foreground",
    );

  return (
    <div className="flex flex-col gap-12 md:gap-16">
      <div className="flex flex-col gap-4 border-y border-border py-5 md:flex-row md:items-center md:justify-between">
        <div
          className="flex flex-wrap gap-2"
          role="tablist"
          aria-label="Filter projects by category"
        >
          <button
            role="tab"
            aria-selected={category === "ALL"}
            onClick={() => setCategory("ALL")}
            className={chip(category === "ALL")}
          >
            All <sup className="text-[9px] opacity-60">{projects.length}</sup>
          </button>
          {categories.map((c) => (
            <button
              key={c.value}
              role="tab"
              aria-selected={category === c.value}
              onClick={() => setCategory(c.value)}
              className={chip(category === c.value)}
            >
              {categoryLabels[c.value]} <sup className="text-[9px] opacity-60">{c.count}</sup>
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, stack or tag…"
          aria-label="Search projects"
          className="h-10 w-full rounded-full border border-foreground/20 bg-transparent px-5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none md:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center font-grotesk text-xs uppercase tracking-[0.25em] text-muted">
          No projects match — try another filter.
        </p>
      ) : (
        <motion.div layout className="grid gap-x-8 gap-y-16 md:grid-cols-2 md:gap-y-20">
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={cn(wide(i) && "md:col-span-2")}
              >
                <ProjectCard
                  project={project}
                  index={numberOf.get(project.id) ?? i}
                  feature={wide(i)}
                  reverse={i > 0}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
