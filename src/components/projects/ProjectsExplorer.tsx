"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { ProjectDTO, ProjectCategory } from "@/lib/validations/content";
import { cn } from "@/lib/utils/cn";

const categories: { value: ProjectCategory | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "WEB", label: "Web" },
  { value: "MOBILE", label: "Mobile" },
  { value: "AI_ML", label: "AI / ML" },
  { value: "RESEARCH", label: "Research" },
  { value: "SYSTEM", label: "System" },
];

export function ProjectsExplorer({ projects }: { projects: ProjectDTO[] }) {
  const [category, setCategory] = useState<ProjectCategory | "ALL">("ALL");
  const [query, setQuery] = useState("");

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by category">
          {categories.map((c) => (
            <button
              key={c.value}
              role="tab"
              aria-selected={category === c.value}
              onClick={() => setCategory(c.value)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                category === c.value
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search projects…"
          aria-label="Search projects"
          className="w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none md:w-64"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No projects match your filters.</p>
      ) : (
        <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.3 }}
              >
                <ProjectCard project={project} className="h-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
