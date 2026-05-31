import Link from "next/link";
import type { PublicationDTO } from "@/lib/validations/content";
import { Badge } from "@/components/ui/Badge";
import { formatYear } from "@/lib/utils/format";

const typeLabels: Record<PublicationDTO["type"], string> = {
  JOURNAL: "Journal",
  CONFERENCE: "Conference",
  DATASET: "Dataset",
  PREPRINT: "Preprint",
};

export function PublicationCard({ publication }: { publication: PublicationDTO }) {
  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 hover:border-accent/40">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="accent">{typeLabels[publication.type]}</Badge>
        <span className="text-sm text-muted">{formatYear(publication.publishedDate)}</span>
        {publication.venue && <span className="text-sm text-muted">· {publication.venue}</span>}
      </div>

      <Link href={`/publications/${publication.slug}`}>
        <h3 className="font-display text-xl leading-snug text-foreground transition-colors group-hover:text-accent">
          {publication.title}
        </h3>
      </Link>

      <p className="text-sm text-muted">{publication.authors.join(", ")}</p>
      <p className="line-clamp-3 text-sm leading-relaxed text-muted/80">{publication.abstract}</p>

      <div className="flex flex-wrap gap-2 pt-1">
        {publication.keywords.slice(0, 5).map((k) => (
          <span key={k} className="text-xs text-muted/70">
            #{k.replace(/\s+/g, "")}
          </span>
        ))}
      </div>

      <Link
        href={`/publications/${publication.slug}`}
        className="mt-1 text-sm text-accent opacity-80 transition-opacity hover:opacity-100"
      >
        Read more →
      </Link>
    </article>
  );
}
