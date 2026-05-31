"use client";

import { useMemo, useState } from "react";
import { PublicationCard } from "@/components/publications/PublicationCard";
import type { PublicationDTO } from "@/lib/validations/content";
import { cn } from "@/lib/utils/cn";

type SortKey = "newest" | "oldest";

export function PublicationsExplorer({ publications }: { publications: PublicationDTO[] }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = publications.filter((p) => {
      if (q.length === 0) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        p.abstract.toLowerCase().includes(q) ||
        p.authors.some((a) => a.toLowerCase().includes(q)) ||
        p.keywords.some((k) => k.toLowerCase().includes(q))
      );
    });
    return list.sort((a, b) =>
      sort === "newest"
        ? b.publishedDate.getTime() - a.publishedDate.getTime()
        : a.publishedDate.getTime() - b.publishedDate.getTime(),
    );
  }, [publications, query, sort]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title, author or keyword…"
          aria-label="Search publications"
          className="w-full rounded-full border border-border bg-surface px-5 py-2.5 text-sm text-foreground placeholder:text-muted/60 focus:border-accent focus:outline-none md:max-w-md"
        />
        <div className="flex gap-2">
          {(["newest", "oldest"] as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              aria-pressed={sort === s}
              className={cn(
                "rounded-full border px-4 py-2 text-sm capitalize transition-colors",
                sort === s
                  ? "border-accent bg-accent-soft text-accent"
                  : "border-border text-muted hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-muted">No publications match your search.</p>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filtered.map((pub) => (
            <PublicationCard key={pub.id} publication={pub} />
          ))}
        </div>
      )}
    </div>
  );
}
