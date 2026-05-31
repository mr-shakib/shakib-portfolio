import Link from "next/link";
import type { PublicationDTO } from "@/lib/validations/content";
import { formatYear } from "@/lib/utils/format";
import { CitationActions } from "@/components/publications/CitationActions";

/**
 * A single publication rendered in academic reference style — [n] Authors,
 * "Title," Venue, Year, with DOI and citation/BibTeX actions.
 */
export function ReferenceItem({
  publication,
  index,
}: {
  publication: PublicationDTO;
  index: number;
}) {
  return (
    <li className="flex gap-4 border-b border-border pb-8 last:border-0">
      <span className="shrink-0 font-mono text-sm text-accent">[{index}]</span>
      <div className="flex flex-col gap-3">
        <p className="leading-relaxed text-muted">
          <span className="text-foreground">{publication.authors.join(", ")}</span>. “
          <Link
            href={`/publications/${publication.slug}`}
            className="font-medium text-foreground underline decoration-border decoration-1 underline-offset-4 transition-colors hover:decoration-accent"
          >
            {publication.title}
          </Link>
          .”{" "}
          <span className="italic">{publication.venue}</span>, {formatYear(publication.publishedDate)}.
        </p>

        <p className="line-clamp-2 max-w-prose text-sm leading-relaxed text-muted/70">
          {publication.abstract}
        </p>

        <div className="mt-1">
          <CitationActions publication={publication} />
        </div>
      </div>
    </li>
  );
}
