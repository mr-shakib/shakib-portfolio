/**
 * Seeds the database from the canonical static content. Run with `npm run db:seed`.
 * Idempotent: uses upserts keyed on slug/stable id so re-running is safe.
 */
import { PrismaClient } from "@prisma/client";
import { projectsContent } from "../src/content/projects";
import { publicationsContent } from "../src/content/publications";
import { researchAreasContent, researchEntriesContent } from "../src/content/research";
import { achievementsContent } from "../src/content/achievements";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");

  for (const p of projectsContent) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: {
        title: p.title,
        summary: p.summary,
        description: p.description,
        category: p.category,
        techStack: p.techStack,
        tags: p.tags,
        githubUrl: p.githubUrl ?? null,
        demoUrl: p.demoUrl ?? null,
        coverImage: p.coverImage ?? null,
        screenshots: p.screenshots,
        features: p.features,
        challenges: p.challenges ?? null,
        results: p.results ?? null,
        featured: p.featured,
        order: p.order,
      },
      create: {
        slug: p.slug,
        title: p.title,
        summary: p.summary,
        description: p.description,
        category: p.category,
        techStack: p.techStack,
        tags: p.tags,
        githubUrl: p.githubUrl ?? null,
        demoUrl: p.demoUrl ?? null,
        coverImage: p.coverImage ?? null,
        screenshots: p.screenshots,
        features: p.features,
        challenges: p.challenges ?? null,
        results: p.results ?? null,
        featured: p.featured,
        order: p.order,
      },
    });
  }
  console.log(`  ✓ ${projectsContent.length} projects`);

  for (const pub of publicationsContent) {
    await prisma.publication.upsert({
      where: { slug: pub.slug },
      update: {
        title: pub.title,
        authors: pub.authors,
        venue: pub.venue,
        type: pub.type,
        doi: pub.doi ?? null,
        url: pub.url ?? null,
        abstract: pub.abstract,
        keywords: pub.keywords,
        impact: pub.impact ?? null,
        datasetUrl: pub.datasetUrl ?? null,
        featured: pub.featured,
        publishedDate: pub.publishedDate,
      },
      create: {
        slug: pub.slug,
        title: pub.title,
        authors: pub.authors,
        venue: pub.venue,
        type: pub.type,
        doi: pub.doi ?? null,
        url: pub.url ?? null,
        abstract: pub.abstract,
        keywords: pub.keywords,
        impact: pub.impact ?? null,
        datasetUrl: pub.datasetUrl ?? null,
        featured: pub.featured,
        publishedDate: pub.publishedDate,
      },
    });
  }
  console.log(`  ✓ ${publicationsContent.length} publications`);

  for (const area of researchAreasContent) {
    await prisma.researchArea.upsert({
      where: { slug: area.slug },
      update: {
        title: area.title,
        description: area.description,
        icon: area.icon ?? null,
        order: area.order,
      },
      create: {
        slug: area.slug,
        title: area.title,
        description: area.description,
        icon: area.icon ?? null,
        order: area.order,
      },
    });
  }
  console.log(`  ✓ ${researchAreasContent.length} research areas`);

  for (const entry of researchEntriesContent) {
    await prisma.researchEntry.upsert({
      where: { id: entry.id },
      update: {
        type: entry.type,
        title: entry.title,
        body: entry.body,
        links: entry.links ?? undefined,
        icon: entry.icon ?? null,
        order: entry.order,
      },
      create: {
        id: entry.id,
        type: entry.type,
        title: entry.title,
        body: entry.body,
        links: entry.links ?? undefined,
        icon: entry.icon ?? null,
        order: entry.order,
      },
    });
  }
  console.log(`  ✓ ${researchEntriesContent.length} research entries`);

  for (const ach of achievementsContent) {
    await prisma.achievement.upsert({
      where: { id: ach.id },
      update: {
        title: ach.title,
        description: ach.description,
        type: ach.type,
        date: ach.date,
        link: ach.link ?? null,
        order: ach.order,
      },
      create: {
        id: ach.id,
        title: ach.title,
        description: ach.description,
        type: ach.type,
        date: ach.date,
        link: ach.link ?? null,
        order: ach.order,
      },
    });
  }
  console.log(`  ✓ ${achievementsContent.length} achievements`);

  console.log("✅ Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
