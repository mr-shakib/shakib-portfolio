/**
 * Seeds the database from the canonical static content. Run with `npm run db:seed`.
 * Only fills tables that are still empty, so it's safe to re-run after content
 * has been edited in /admin. (Site sections need no seeding — they fall back to
 * their built-in defaults until edited.)
 */
import { PrismaClient } from "@prisma/client";
import { seedEmptyTables } from "../src/lib/admin/seed-content";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database…");
  const imported = await seedEmptyTables(prisma);
  const entries = Object.entries(imported);
  if (entries.length === 0) {
    console.log("  Nothing to do — every table already has content.");
  }
  for (const [table, count] of entries) console.log(`  ✓ ${count} ${table}`);
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
