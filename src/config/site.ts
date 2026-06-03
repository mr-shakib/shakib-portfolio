/**
 * Single source of truth for site-wide metadata, navigation and social links.
 * Imported by SEO builders, the navbar, the footer and structured data.
 */

/**
 * Resolve the canonical site URL with sensible fallbacks so OG images, canonical
 * tags and the sitemap are correct out-of-the-box on Vercel:
 *   1. NEXT_PUBLIC_SITE_URL        — explicit, preferred (e.g. custom domain)
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stable production URL Vercel injects
 *   3. VERCEL_URL                   — per-deployment preview URL
 *   4. localhost                    — local dev
 */
function resolveSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL;
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL)
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

export const siteConfig = {
  name: "Shakib Howlader",
  shortName: "Shakib",
  title: "Shakib Howlader — Researcher, Developer & AI Enthusiast",
  tagline: "Researcher · Developer · AI Enthusiast · Problem Solver",
  description:
    "Computer Science engineer and researcher building at the intersection of machine learning, computer vision and software engineering. Publications, research and interactive projects.",
  url: resolveSiteUrl(),
  locale: "en_US",
  email: "contactshakibhere@gmail.com",
  jobTitle: "Computer Science Engineer & Researcher",
  keywords: [
    "Shakib Howlader",
    "Machine Learning",
    "Computer Vision",
    "AI Researcher",
    "Software Engineer",
    "Research Portfolio",
    "Deep Learning",
    "Next.js Developer",
  ],
} as const;

/**
 * Primary nav, serialized in the same order the home page actually scrolls:
 * Home → About → Research → Publications → Projects → Skills → Contact (+ Resume).
 *
 * `section` is the id of the matching block on the home page — used for
 * smooth-scroll + scroll-spy while on "/". `href` is the dedicated page used
 * from any other route (and as the canonical destination). When a link has no
 * dedicated page it just scrolls; when it has no home section it just navigates.
 */
export const navLinks = [
  { label: "Home", href: "/", section: "hero" },
  { label: "About", href: "/#about", section: "about" },
  { label: "Research", href: "/research", section: "research-areas" },
  { label: "Publications", href: "/publications", section: "featured-publication" },
  { label: "Projects", href: "/projects", section: "projects" },
  { label: "Skills", href: "/#skills", section: "skills" },
  { label: "Resume", href: "/resume", section: null },
  { label: "Contact", href: "/contact", section: "contact" },
] as const;

/** Anchor links for the one-page home experience. */
export const homeSections = [
  { id: "hero", label: "Intro" },
  { id: "about", label: "About" },
  { id: "stats", label: "Impact" },
  { id: "featured-publication", label: "Featured" },
  { id: "research-areas", label: "Research" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "achievements", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export const socialLinks = [
  { label: "GitHub", href: "https://github.com/", handle: "@mr-shakib" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", handle: "in/shakib-howlader" },
  { label: "Google Scholar", href: "https://scholar.google.com/", handle: "Shakib Howlader" },
  { label: "ORCID", href: "https://orcid.org/", handle: "0009-0009-5318-2999" },
  { label: "Email", href: "mailto:contactshakibhere@gmail.com", handle: siteConfig.email },
] as const;

export type NavLink = (typeof navLinks)[number];
export type SocialLink = (typeof socialLinks)[number];
