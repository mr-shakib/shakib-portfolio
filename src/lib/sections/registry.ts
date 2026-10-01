import type { Field, ValuesOf } from "@/lib/admin/fields";
import { aboutTimeline, heroRoles, statsContent } from "@/content/stats";
import { researchMeta, researchStatement } from "@/content/research";
import { siteConfig, socialLinks } from "@/config/site";

/**
 * Every editable block of copy on the site. A section's `defaults` are what
 * the site shows until it's edited in /admin (and what "Reset to default"
 * restores). Adding a field here adds it to the admin form automatically;
 * the component that renders the section then reads it from its typed props.
 *
 * Text fields support *asterisks* to highlight words where the help says so.
 */

export type SectionGroup = "Home page" | "Site-wide" | "Research page" | "Resume page" | "Page headers";

function defineSection<const F extends readonly Field[]>(def: {
  label: string;
  group: SectionGroup;
  /** Where the section appears, for the admin's "View on site" link. */
  href: string;
  description: string;
  fields: F;
  defaults: ValuesOf<F>;
}) {
  return def;
}

const EMPHASIS_HELP = "Wrap words in *asterisks* to highlight them.";

const pageHeaderFields = [
  { kind: "text", name: "eyebrow", label: "Eyebrow", required: true },
  { kind: "text", name: "title", label: "Title", required: true },
  { kind: "textarea", name: "description", label: "Description", rows: 2 },
] as const;

export const sections = {
  hero: defineSection({
    label: "Hero",
    group: "Home page",
    href: "/",
    description: "The cream intro screen: giant name, rotating roles and floating stat chips.",
    fields: [
      { kind: "text", name: "subtitle", label: "Subtitle", help: "Small line under the header. A × is highlighted automatically." },
      { kind: "text", name: "greeting", label: "Greeting", help: "Handwritten line above the name." },
      { kind: "text", name: "firstName", label: "First name", required: true },
      { kind: "text", name: "lastName", label: "Last name", required: true, help: "Shown as an outline." },
      { kind: "text", name: "rolePrefix", label: "Role prefix", help: "Text before the rotating role." },
      { kind: "lines", name: "roles", label: "Rotating roles", help: "One per line." },
      {
        kind: "list",
        name: "chips",
        label: "Stat chips",
        itemLabel: "Chip",
        max: 3,
        help: "Up to three floating chips (desktop only). Order sets position: top-left, right, bottom-left.",
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "sub", label: "Sub-label" },
        ],
      },
    ],
    defaults: {
      subtitle: "AI Researcher × Engineer — Portfolio ’26",
      greeting: "Hi, I’m",
      firstName: "Shakib",
      lastName: "Howlader",
      rolePrefix: "I’m a",
      roles: [...heroRoles],
      chips: [
        { label: "Published 2025", sub: "Elsevier · Data in Brief" },
        { label: "3.92 CGPA", sub: "CSE · Daffodil Int’l" },
        { label: "5+ Projects Shipped", sub: "Adopted by a campus" },
      ],
    },
  }),

  marquees: defineSection({
    label: "Volt bands",
    group: "Home page",
    href: "/",
    description: "The two scrolling volt strips — one under the hero, one above the contact section.",
    fields: [
      { kind: "lines", name: "top", label: "Top band", help: "One phrase per line." },
      { kind: "lines", name: "bottom", label: "Bottom band", help: "One phrase per line." },
    ],
    defaults: {
      top: ["Machine Learning — Since 2021", "Research × Engineering", "Dhaka → The World"],
      bottom: ["Open to collaboration", "Trustworthy Multimodal AI", "Let’s build something real"],
    },
  }),

  about: defineSection({
    label: "A note from me",
    group: "Home page",
    href: "/#about",
    description: "Quote, short bio, signature and portrait (section 01).",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "quote", label: "Quote", rows: 3, required: true },
      { kind: "textarea", name: "bio", label: "Bio", rows: 4, help: EMPHASIS_HELP },
      { kind: "text", name: "signature", label: "Signature" },
      { kind: "file", name: "portrait", label: "Portrait", accept: "image" },
      { kind: "text", name: "caption", label: "Portrait caption" },
    ],
    defaults: {
      eyebrow: "A note from Shakib",
      quote:
        "“The bottleneck in applied AI is rarely the architecture — it’s the data. So I build both: open datasets the community can trust, and the software that puts them to work.”",
      bio: "Software engineer and AI researcher — Computer Science & Engineering graduate (3.92 CGPA, Daffodil International University) with a first-author publication in Elsevier’s *Data in Brief*. Now advancing research in trustworthy multimodal AI while building production software.",
      signature: "Shakib",
      portrait: "/images/portrait.jpg",
      caption: "SH — Portfolio ’26",
    },
  }),

  stats: defineSection({
    label: "Career numbers",
    group: "Home page",
    href: "/#stats",
    description: "The oversized animated numbers band (section 02).",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "eyebrowAccent", label: "Eyebrow accent", help: "Shown in volt after the eyebrow." },
      {
        kind: "list",
        name: "items",
        label: "Numbers",
        itemLabel: "Number",
        max: 10,
        fields: [
          { kind: "number", name: "value", label: "Value", step: 0.01 },
          { kind: "text", name: "suffix", label: "Suffix", help: "e.g. + or / 4.00" },
          { kind: "text", name: "label", label: "Label", required: true },
        ],
      },
    ],
    defaults: {
      eyebrow: "Career numbers",
      eyebrowAccent: "— so far",
      items: statsContent.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label })),
    },
  }),

  mission: defineSection({
    label: "Mission",
    group: "Home page",
    href: "/#stats",
    description: "The statement that brightens word by word as you scroll (section 03).",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "textarea", name: "text", label: "Statement", rows: 3, required: true },
    ],
    defaults: {
      eyebrow: "Mission",
      text: "I build intelligent systems that turn messy, real-world data into reliable decisions — and I publish the datasets and methods so others can build on them too.",
    },
  }),

  lab: defineSection({
    label: "In the Lab",
    group: "Home page",
    href: "/#research-areas",
    description: "Research intro (section 04). The cards come from Research → Areas.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "headingTop", label: "Heading — line 1" },
      { kind: "text", name: "headingBottom", label: "Heading — line 2 (outline)" },
      { kind: "textarea", name: "intro", label: "Intro", rows: 3 },
      { kind: "text", name: "buttonLabel", label: "Button label" },
    ],
    defaults: {
      eyebrow: "Research",
      headingTop: "In the",
      headingBottom: "Lab",
      intro:
        "Computer vision and machine learning for high-stakes, data-scarce domains. Robust models, honest evaluation, and datasets released in the open.",
      buttonLabel: "Full research statement",
    },
  }),

  spotlight: defineSection({
    label: "Featured publication",
    group: "Home page",
    href: "/#featured-publication",
    description:
      "The full-bleed volt panel (section 05). Shows the publication marked “Featured”; the facts on the right are set here.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "publisher", label: "Publisher", help: "Shown between venue and year." },
      {
        kind: "list",
        name: "facts",
        label: "Facts",
        itemLabel: "Fact",
        max: 4,
        fields: [
          { kind: "text", name: "value", label: "Value", required: true },
          { kind: "text", name: "label", label: "Label" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Featured publication — first author",
      publisher: "Elsevier",
      facts: [
        { value: "4,089", label: "Labelled images" },
        { value: "6", label: "Disease classes" },
        { value: "Open", label: "Access dataset" },
      ],
    },
  }),

  wild: defineSection({
    label: "Out in the Wild",
    group: "Home page",
    href: "/#projects",
    description: "Engineering intro (section 06). The rows are your projects marked “Featured”.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "headingTop", label: "Heading — line 1 (outline)" },
      { kind: "text", name: "headingBottom", label: "Heading — line 2" },
      { kind: "textarea", name: "intro", label: "Intro", rows: 3 },
      { kind: "text", name: "buttonLabel", label: "Button label" },
    ],
    defaults: {
      eyebrow: "Engineering",
      headingTop: "Out in",
      headingBottom: "the Wild",
      intro:
        "Research is half the story. These are shipped, production systems — platforms adopted by a university community and tools used daily.",
      buttonLabel: "All projects",
    },
  }),

  stack: defineSection({
    label: "The Stack",
    group: "Home page",
    href: "/#skills",
    description: "Scrolling skill bands (section 07). Each band shows the skills from the listed categories.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "heading", label: "Heading" },
      {
        kind: "list",
        name: "rows",
        label: "Bands",
        itemLabel: "Band",
        max: 6,
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          {
            kind: "tags",
            name: "categories",
            label: "Skill categories",
            help: "Must match the category names used under Skills.",
          },
        ],
      },
    ],
    defaults: {
      eyebrow: "Toolkit",
      heading: "The Stack",
      rows: [
        { label: "Mobile & Cross-Platform", categories: ["Mobile"] },
        { label: "AI & Machine Learning", categories: ["AI/ML"] },
        { label: "Web, Backend & Tools", categories: ["Web & Backend", "Tools & Platforms"] },
      ],
    },
  }),

  journey: defineSection({
    label: "Milestone Hall of Fame",
    group: "Home page",
    href: "/#achievements",
    description: "The pinned horizontal timeline (section 08).",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "headingTop", label: "Heading — line 1" },
      { kind: "text", name: "headingBottom", label: "Heading — line 2 (outline)" },
      {
        kind: "list",
        name: "items",
        label: "Milestones",
        itemLabel: "Milestone",
        max: 12,
        fields: [
          { kind: "text", name: "stage", label: "When", help: "e.g. 2021 — 2026. The part before — becomes the big year." },
          { kind: "text", name: "role", label: "Role" },
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "textarea", name: "body", label: "Body", rows: 3 },
        ],
      },
      { kind: "text", name: "closingTitle", label: "Closing card — title" },
      { kind: "textarea", name: "closingBody", label: "Closing card — body", rows: 2 },
    ],
    defaults: {
      eyebrow: "The journey",
      headingTop: "Milestone",
      headingBottom: "Hall of Fame",
      items: aboutTimeline.map((t) => ({ stage: t.stage, role: t.role, title: t.title, body: t.body })),
      closingTitle: "The next chapter",
      closingBody:
        "Trustworthy multimodal AI, and research that ships. The best milestones aren’t on this wall yet.",
    },
  }),

  contactCta: defineSection({
    label: "Let’s Build It",
    group: "Home page",
    href: "/#contact",
    description: "Closing call-to-action (section 09). Email and social links come from “Contact details”.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "headingTop", label: "Heading — line 1" },
      { kind: "text", name: "headingBottom", label: "Heading — line 2 (outline)" },
      { kind: "textarea", name: "blurb", label: "Blurb", rows: 2, help: "Followed by the contact-form link." },
      { kind: "text", name: "formLinkLabel", label: "Contact-form link label" },
    ],
    defaults: {
      eyebrow: "Contact",
      headingTop: "Let's",
      headingBottom: "Build It",
      blurb: "Open to research collaboration, graduate opportunities and engineering work — or",
      formLinkLabel: "use the contact form",
    },
  }),

  profile: defineSection({
    label: "Contact details",
    group: "Site-wide",
    href: "/contact",
    description: "Email, location and social links — used by the contact section, contact page and footer.",
    fields: [
      { kind: "text", name: "email", label: "Email", format: "email", required: true },
      { kind: "text", name: "location", label: "Location", help: "Shown in the footer next to the live clock." },
      { kind: "text", name: "availability", label: "Availability", help: "Footer status line." },
      {
        kind: "list",
        name: "socials",
        label: "Social links",
        itemLabel: "Link",
        max: 10,
        fields: [
          { kind: "text", name: "label", label: "Label", required: true, help: "A link labelled “Email” is hidden in the footer." },
          { kind: "text", name: "href", label: "URL", format: "link", required: true },
          { kind: "text", name: "handle", label: "Handle", help: "Shown on the contact page." },
        ],
      },
    ],
    defaults: {
      email: siteConfig.email,
      location: "Dhaka",
      availability: "Open to collaboration",
      socials: socialLinks.map((s) => ({ label: s.label, href: s.href, handle: s.handle })),
    },
  }),

  footer: defineSection({
    label: "Footer",
    group: "Site-wide",
    href: "/",
    description: "Closing statement, signature and brand blurb.",
    fields: [
      {
        kind: "text",
        name: "statement",
        label: "Statement",
        help: "Words wrapped in *asterisks* are set in the volt italic serif.",
      },
      { kind: "text", name: "signature", label: "Signature" },
      { kind: "textarea", name: "blurb", label: "Brand blurb", rows: 2 },
    ],
    defaults: {
      statement: "Always *chasing* the *signal*.",
      signature: "Shakib",
      blurb:
        "Machine-learning research and full-stack engineering. Open datasets, shipped software, and everything in between.",
    },
  }),

  researchPage: defineSection({
    label: "Research statement",
    group: "Research page",
    href: "/research",
    description: "Title, abstract and sidebar facts. Entries and areas are edited under Research.",
    fields: [
      { kind: "text", name: "eyebrow", label: "Eyebrow" },
      { kind: "text", name: "title", label: "Title", required: true },
      { kind: "textarea", name: "statement", label: "Abstract", rows: 6 },
      {
        kind: "list",
        name: "meta",
        label: "Sidebar facts",
        itemLabel: "Fact",
        max: 10,
        fields: [
          { kind: "text", name: "label", label: "Label", required: true },
          { kind: "text", name: "value", label: "Value" },
        ],
      },
      { kind: "textarea", name: "collaboration", label: "Collaboration call-out", rows: 2 },
      { kind: "text", name: "collaborationCta", label: "Call-out button label" },
    ],
    defaults: {
      eyebrow: "Research Profile",
      title: "Research statement & programme",
      statement: researchStatement,
      meta: researchMeta.map((m) => ({ ...m })),
      collaboration:
        "I am actively seeking MSc supervision and research collaborations in computer vision, agricultural AI and healthcare AI.",
      collaborationCta: "Get in touch →",
    },
  }),

  resumePage: defineSection({
    label: "Resume",
    group: "Resume page",
    href: "/resume",
    description: "Header and the downloadable CV versions. Upload PDFs here.",
    fields: [
      ...pageHeaderFields,
      {
        kind: "list",
        name: "variants",
        label: "CV versions",
        itemLabel: "Version",
        max: 6,
        fields: [
          { kind: "text", name: "title", label: "Title", required: true },
          { kind: "textarea", name: "description", label: "Description", rows: 2 },
          { kind: "file", name: "file", label: "PDF", accept: "pdf" },
        ],
      },
    ],
    defaults: {
      eyebrow: "Resume",
      title: "One profile, tailored three ways.",
      description:
        "Choose the version that fits your context. Each is kept in sync and exportable as PDF.",
      variants: [
        {
          title: "Academic CV",
          description:
            "Full academic curriculum vitae — publications, research, education and references. Best for supervisors and admissions.",
          file: "/cv/academic.pdf",
        },
        {
          title: "Industry CV",
          description:
            "Concise, impact-focused resume for engineering roles — projects, stack and outcomes.",
          file: "/cv/industry.pdf",
        },
        {
          title: "ATS Version",
          description:
            "Plain, single-column, parser-friendly format optimized for applicant tracking systems.",
          file: "/cv/ats.pdf",
        },
      ],
    },
  }),

  pageHeaders: defineSection({
    label: "Page headers",
    group: "Page headers",
    href: "/projects",
    description: "Headings at the top of the Projects, Publications and Contact pages.",
    fields: [
      { kind: "group", name: "projects", label: "Projects page", fields: pageHeaderFields },
      { kind: "group", name: "publications", label: "Publications page", fields: pageHeaderFields },
      { kind: "group", name: "contact", label: "Contact page", fields: pageHeaderFields },
    ],
    defaults: {
      projects: {
        eyebrow: "Projects",
        title: "Things I’ve designed, built and shipped.",
        description:
          "A selection of full-stack platforms, mobile apps and research tooling — each solving a concrete problem.",
      },
      publications: {
        eyebrow: "Publications",
        title: "Published research & datasets.",
        description:
          "Openly available contributions — each with a copyable citation, BibTeX export and resolvable DOI.",
      },
      contact: {
        eyebrow: "Contact",
        title: "Let’s start a conversation.",
        description:
          "Whether it’s research, graduate supervision or building something — I’d love to hear from you.",
      },
    },
  }),
};

export type SectionKey = keyof typeof sections;
export type SectionContent<K extends SectionKey> = ValuesOf<(typeof sections)[K]["fields"]>;

export const sectionGroups: SectionGroup[] = [
  "Home page",
  "Site-wide",
  "Research page",
  "Resume page",
  "Page headers",
];

export function isSectionKey(key: string): key is SectionKey {
  return Object.hasOwn(sections, key);
}
