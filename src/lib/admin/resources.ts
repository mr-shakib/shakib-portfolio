import type { Field, ValuesOf } from "@/lib/admin/fields";

/**
 * Collections managed from /admin. Field names match the Prisma columns, so a
 * validated form is written to the database as-is (see resource-db.ts).
 */

export type Row = Record<string, unknown>;

function defineResource<const F extends readonly Field[]>(def: {
  label: string;
  singular: string;
  description: string;
  fields: F;
  defaults: ValuesOf<F>;
  /** Secondary line in the admin list. */
  subtitle: (row: Row) => string;
  /** Public URL of an item, used for "View on site" and view counts. */
  publicPath?: (row: Row) => string;
}) {
  return def;
}

const STATUS = {
  kind: "select",
  name: "status",
  label: "Status",
  options: [
    { value: "PUBLISHED", label: "Published" },
    { value: "DRAFT", label: "Draft — hidden from the site" },
  ],
} as const;

const ORDER = {
  kind: "number",
  name: "order",
  label: "Order",
  int: true,
  help: "Lower numbers come first.",
} as const;

export const PROJECT_CATEGORIES = [
  { value: "WEB", label: "Web" },
  { value: "MOBILE", label: "Mobile" },
  { value: "AI_ML", label: "AI / ML" },
  { value: "RESEARCH", label: "Research" },
  { value: "SYSTEM", label: "System" },
  { value: "OTHER", label: "Other" },
] as const;

export const PUBLICATION_TYPES = [
  { value: "JOURNAL", label: "Journal" },
  { value: "CONFERENCE", label: "Conference" },
  { value: "DATASET", label: "Dataset" },
  { value: "PREPRINT", label: "Preprint" },
] as const;

export const RESEARCH_ENTRY_TYPES = [
  { value: "INTEREST", label: "Research interest" },
  { value: "CURRENT", label: "Current work" },
  { value: "DATASET", label: "Dataset" },
  { value: "PAST", label: "Past work" },
  { value: "FUTURE", label: "Future direction" },
  { value: "COLLABORATION", label: "Collaboration" },
] as const;

export const SKILL_CATEGORIES = ["Mobile", "AI/ML", "Web & Backend", "Tools & Platforms"] as const;

const labelOf = (options: readonly { value: string; label: string }[], value: unknown) =>
  options.find((o) => o.value === value)?.label ?? String(value);

export const resources = {
  projects: defineResource({
    label: "Projects",
    singular: "project",
    description: "Featured projects appear in “Out in the Wild”; all published ones on /projects.",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "text", name: "slug", label: "Slug", format: "slug", required: true, help: "Page URL: /projects/<slug>" },
      { kind: "textarea", name: "summary", label: "Summary", rows: 2, required: true, help: "One or two sentences for cards and rows." },
      { kind: "textarea", name: "description", label: "Overview", rows: 6, required: true },
      { kind: "select", name: "category", label: "Category", options: PROJECT_CATEGORIES },
      { kind: "tags", name: "techStack", label: "Tech stack", help: "The first four appear on the home page." },
      { kind: "tags", name: "tags", label: "Tags" },
      { kind: "text", name: "githubUrl", label: "GitHub URL", format: "url", nullable: true },
      { kind: "text", name: "demoUrl", label: "Live demo URL", format: "url", nullable: true },
      { kind: "file", name: "coverImage", label: "Cover image", accept: "image", nullable: true },
      { kind: "lines", name: "features", label: "Key features", help: "One per line." },
      { kind: "textarea", name: "challenges", label: "Challenges", rows: 3, nullable: true },
      { kind: "textarea", name: "results", label: "Results", rows: 3, nullable: true },
      { kind: "boolean", name: "featured", label: "Featured on the home page" },
      ORDER,
      STATUS,
    ],
    defaults: {
      title: "",
      slug: "",
      summary: "",
      description: "",
      category: "WEB",
      techStack: [],
      tags: [],
      githubUrl: null,
      demoUrl: null,
      coverImage: null,
      features: [],
      challenges: null,
      results: null,
      featured: false,
      order: 0,
      status: "DRAFT",
    },
    subtitle: (row) => `${labelOf(PROJECT_CATEGORIES, row.category)} · /projects/${row.slug}`,
    publicPath: (row) => `/projects/${row.slug}`,
  }),

  publications: defineResource({
    label: "Publications",
    singular: "publication",
    description: "The featured publication fills the volt spotlight on the home page.",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "text", name: "slug", label: "Slug", format: "slug", required: true, help: "Page URL: /publications/<slug>" },
      { kind: "lines", name: "authors", label: "Authors", rows: 4, help: "One per line, in order." },
      { kind: "text", name: "venue", label: "Venue", required: true, help: "Journal or conference name." },
      { kind: "select", name: "type", label: "Type", options: PUBLICATION_TYPES },
      { kind: "date", name: "publishedDate", label: "Published" },
      { kind: "text", name: "doi", label: "DOI", nullable: true, placeholder: "10.1016/…" },
      { kind: "text", name: "url", label: "Paper URL", format: "url", nullable: true },
      { kind: "textarea", name: "abstract", label: "Abstract", rows: 6, required: true },
      { kind: "tags", name: "keywords", label: "Keywords" },
      { kind: "textarea", name: "impact", label: "Impact", rows: 3, nullable: true, help: "Shown in the home-page spotlight." },
      { kind: "text", name: "datasetUrl", label: "Dataset URL", format: "url", nullable: true },
      { kind: "number", name: "citationCount", label: "Citations", int: true, min: 0, nullable: true },
      { kind: "textarea", name: "bibtex", label: "BibTeX", rows: 5, nullable: true },
      { kind: "boolean", name: "featured", label: "Featured on the home page" },
      STATUS,
    ],
    defaults: {
      title: "",
      slug: "",
      authors: [],
      venue: "",
      type: "JOURNAL",
      publishedDate: new Date(),
      doi: null,
      url: null,
      abstract: "",
      keywords: [],
      impact: null,
      datasetUrl: null,
      citationCount: null,
      bibtex: null,
      featured: false,
      status: "DRAFT",
    },
    subtitle: (row) => {
      const d = row.publishedDate instanceof Date ? row.publishedDate.getFullYear() : "";
      return `${row.venue} · ${d}`;
    },
    publicPath: (row) => `/publications/${row.slug}`,
  }),

  "research-areas": defineResource({
    label: "Research areas",
    singular: "research area",
    description: "Cards in “In the Lab” and the areas list on /research.",
    fields: [
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "text", name: "slug", label: "Slug", format: "slug", required: true },
      { kind: "textarea", name: "description", label: "Description", rows: 3, required: true },
      { kind: "text", name: "icon", label: "Icon name", nullable: true, help: "Optional, e.g. brain or eye." },
      ORDER,
    ],
    defaults: { title: "", slug: "", description: "", icon: null, order: 0 },
    subtitle: (row) => `/${row.slug}`,
  }),

  "research-entries": defineResource({
    label: "Research entries",
    singular: "research entry",
    description: "The numbered sections of /research — interests, current work, datasets and more.",
    fields: [
      { kind: "select", name: "type", label: "Section", options: RESEARCH_ENTRY_TYPES },
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "textarea", name: "body", label: "Body", rows: 5, required: true },
      {
        kind: "list",
        name: "links",
        label: "Links",
        itemLabel: "Link",
        max: 6,
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "href", label: "URL", format: "link", required: true },
        ],
      },
      ORDER,
      STATUS,
    ],
    defaults: { type: "INTEREST", title: "", body: "", links: [], order: 0, status: "PUBLISHED" },
    subtitle: (row) => labelOf(RESEARCH_ENTRY_TYPES, row.type),
  }),

  skills: defineResource({
    label: "Skills",
    singular: "skill",
    description: "Wordmarks in “The Stack”. Bands pick skills by category (set in Sections → The Stack).",
    fields: [
      { kind: "text", name: "name", label: "Name", required: true },
      { kind: "text", name: "category", label: "Category", required: true, suggestions: SKILL_CATEGORIES },
      { kind: "number", name: "level", label: "Proficiency", int: true, min: 0, max: 100, help: "0–100." },
      { kind: "textarea", name: "description", label: "Description", rows: 3, nullable: true },
      ORDER,
    ],
    defaults: { name: "", category: "AI/ML", level: 80, description: null, order: 0 },
    subtitle: (row) => `${row.category} · ${row.level}%`,
  }),
};

export type ResourceName = keyof typeof resources;
export type ResourceValues<R extends ResourceName> = ValuesOf<(typeof resources)[R]["fields"]>;

export function isResourceName(name: string): name is ResourceName {
  return Object.hasOwn(resources, name);
}
