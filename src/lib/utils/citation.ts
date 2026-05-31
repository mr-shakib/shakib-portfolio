import { slugify } from "./slugify";

export interface CitationInput {
  title: string;
  authors: string[];
  venue: string;
  publishedDate: Date | string;
  doi?: string | null;
  url?: string | null;
}

function year(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return Number.isNaN(d.getTime()) ? "n.d." : String(d.getFullYear());
}

/** "Howlader, S., Doe, J." */
function formatAuthorsAPA(authors: string[]): string {
  return authors
    .map((a) => {
      const parts = a.trim().split(/\s+/);
      if (parts.length < 2) return a;
      const last = parts[parts.length - 1];
      const initials = parts
        .slice(0, -1)
        .map((p) => `${p[0]?.toUpperCase()}.`)
        .join(" ");
      return `${last}, ${initials}`;
    })
    .join(", ");
}

/** APA-style citation string. */
export function toApaCitation(input: CitationInput): string {
  const authors = formatAuthorsAPA(input.authors);
  const y = year(input.publishedDate);
  const doi = input.doi ? ` https://doi.org/${input.doi}` : "";
  return `${authors} (${y}). ${input.title}. ${input.venue}.${doi}`.replace(/\s+/g, " ").trim();
}

/** A clean BibTeX entry. */
export function toBibTeX(input: CitationInput): string {
  const firstAuthorLast = input.authors[0]?.trim().split(/\s+/).pop() ?? "anon";
  const y = year(input.publishedDate);
  const key = `${slugify(firstAuthorLast)}${y}${slugify(input.title).split("-")[0] ?? ""}`;
  const fields: Array<[string, string | null | undefined]> = [
    ["title", `{${input.title}}`],
    ["author", input.authors.join(" and ")],
    ["journal", input.venue],
    ["year", y],
    ["doi", input.doi ?? undefined],
    ["url", input.url ?? (input.doi ? `https://doi.org/${input.doi}` : undefined)],
  ];

  const body = fields
    .filter(([, v]) => Boolean(v))
    .map(([k, v]) => `  ${k} = {${v}}`)
    .join(",\n");

  return `@article{${key},\n${body}\n}`;
}
