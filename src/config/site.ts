/**
 * Single source of truth for site-wide metadata, navigation and social links.
 * Imported by SEO builders, the navbar, the footer and structured data.
 */

export const siteConfig = {
  name: "Shakib Howlader",
  shortName: "Shakib",
  title: "Shakib Howlader — Researcher, Developer & AI Enthusiast",
  tagline: "Researcher · Developer · AI Enthusiast · Problem Solver",
  description:
    "Computer Science engineer and researcher building at the intersection of machine learning, computer vision and software engineering. Publications, research and interactive projects.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
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

export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Research", href: "/research" },
  { label: "Publications", href: "/publications" },
  { label: "Projects", href: "/projects" },
  { label: "Resume", href: "/resume" },
  { label: "Contact", href: "/contact" },
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
  { label: "GitHub", href: "https://github.com/", handle: "@shakib" },
  { label: "LinkedIn", href: "https://www.linkedin.com/", handle: "in/shakib" },
  { label: "Google Scholar", href: "https://scholar.google.com/", handle: "Shakib Howlader" },
  { label: "ORCID", href: "https://orcid.org/", handle: "0000-0000-0000-0000" },
  { label: "Email", href: "mailto:contactshakibhere@gmail.com", handle: siteConfig.email },
] as const;

export type NavLink = (typeof navLinks)[number];
export type SocialLink = (typeof socialLinks)[number];
