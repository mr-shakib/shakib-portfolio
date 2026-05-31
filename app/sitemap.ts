import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProjects } from "@/lib/data/projects";
import { getPublications } from "@/lib/data/publications";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${base}/research`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/publications`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${base}/resume`, lastModified: now, changeFrequency: "yearly", priority: 0.7 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
  ];

  const [projects, publications] = await Promise.all([getProjects(), getPublications()]);

  const projectRoutes: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${base}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.7,
  }));

  const publicationRoutes: MetadataRoute.Sitemap = publications.map((p) => ({
    url: `${base}/publications/${p.slug}`,
    lastModified: p.publishedDate,
    changeFrequency: "yearly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...projectRoutes, ...publicationRoutes];
}
