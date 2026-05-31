import { siteConfig, socialLinks } from "@/config/site";
import type { ProjectDTO, PublicationDTO } from "@/lib/validations/content";

/** Schema.org Person — rendered once in the root layout. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: siteConfig.name,
    url: siteConfig.url,
    email: `mailto:${siteConfig.email}`,
    jobTitle: siteConfig.jobTitle,
    description: siteConfig.description,
    sameAs: socialLinks
      .filter((s) => s.href.startsWith("http"))
      .map((s) => s.href),
    knowsAbout: [
      "Machine Learning",
      "Computer Vision",
      "Artificial Intelligence",
      "Software Engineering",
      "Data Science",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function publicationJsonLd(pub: PublicationDTO) {
  return {
    "@context": "https://schema.org",
    "@type": pub.type === "DATASET" ? "Dataset" : "ScholarlyArticle",
    name: pub.title,
    headline: pub.title,
    author: pub.authors.map((name) => ({ "@type": "Person", name })),
    abstract: pub.abstract,
    description: pub.abstract,
    datePublished: pub.publishedDate.toISOString(),
    keywords: pub.keywords.join(", "),
    ...(pub.doi ? { identifier: `https://doi.org/${pub.doi}`, sameAs: `https://doi.org/${pub.doi}` } : {}),
    ...(pub.venue ? { publisher: { "@type": "Organization", name: pub.venue } } : {}),
    url: `${siteConfig.url}/publications/${pub.slug}`,
  };
}

export function projectJsonLd(project: ProjectDTO) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    keywords: project.tags.join(", "),
    url: `${siteConfig.url}/projects/${project.slug}`,
    ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
    author: { "@type": "Person", name: siteConfig.name },
  };
}

/** Serializable <script> payload helper. */
export function jsonLdScript(data: object) {
  return { __html: JSON.stringify(data) };
}
