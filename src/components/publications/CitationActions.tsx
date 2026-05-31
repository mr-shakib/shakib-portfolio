"use client";

import type { PublicationDTO } from "@/lib/validations/content";
import { CopyButton } from "@/components/shared/CopyButton";
import { toApaCitation, toBibTeX } from "@/lib/utils/citation";

/** Copy-citation, copy-BibTeX and DOI redirect actions for a publication. */
export function CitationActions({ publication }: { publication: PublicationDTO }) {
  const citationInput = {
    title: publication.title,
    authors: publication.authors,
    venue: publication.venue,
    publishedDate: publication.publishedDate,
    doi: publication.doi,
    url: publication.url,
  };

  const apa = toApaCitation(citationInput);
  const bibtex = publication.bibtex ?? toBibTeX(citationInput);

  return (
    <div className="flex flex-wrap gap-3">
      <CopyButton value={apa} label="Copy citation" />
      <CopyButton value={bibtex} label="Copy BibTeX" />
      {publication.doi && (
        <a
          href={`https://doi.org/${publication.doi}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          View DOI ↗
        </a>
      )}
      {publication.datasetUrl && (
        <a
          href={publication.datasetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm text-muted transition-colors hover:border-accent hover:text-accent"
        >
          Dataset ↗
        </a>
      )}
    </div>
  );
}
