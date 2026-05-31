import { cn } from "@/lib/utils/cn";

interface ResearchSectionProps {
  id: string;
  index: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A numbered research section (§0N) with an academic-style header rule — the
 * recurring building block of the research paper layout.
 */
export function ResearchSection({ id, index, title, children, className }: ResearchSectionProps) {
  return (
    <section id={id} className={cn("scroll-mt-28 border-t border-border pt-10", className)}>
      <header className="mb-8 flex items-baseline gap-4">
        <span className="font-mono text-sm text-accent">{index}</span>
        <h2 className="font-display text-heading text-foreground">{title}</h2>
      </header>
      {children}
    </section>
  );
}
