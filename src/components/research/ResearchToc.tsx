"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";

export interface TocItem {
  id: string;
  index: string;
  label: string;
}

/**
 * Sticky, numbered table of contents with scroll-spy — mirrors how an academic
 * paper's section index behaves. Highlights the section currently in view and
 * smooth-scrolls on click.
 */
export function ResearchToc({ items }: { items: TocItem[] }) {
  const [active, setActive] = useState<string>(items[0]?.id ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );
    items.forEach((it) => {
      const el = document.getElementById(it.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Research sections" className="flex flex-col gap-1">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-muted/60">Contents</p>
      {items.map((it) => {
        const isActive = active === it.id;
        return (
          <a
            key={it.id}
            href={`#${it.id}`}
            className={cn(
              "group flex items-baseline gap-3 border-l py-2 pl-4 font-mono text-sm transition-colors",
              isActive
                ? "border-accent text-foreground"
                : "border-border text-muted hover:border-muted hover:text-foreground",
            )}
          >
            <span className={cn("text-xs", isActive ? "text-accent" : "text-muted/50")}>
              {it.index}
            </span>
            <span className="font-sans">{it.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
