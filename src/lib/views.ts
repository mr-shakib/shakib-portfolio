import "server-only";
import { prisma } from "@/lib/prisma";

/**
 * Page-view counting. Views roll up per (UTC day, path); `visitors` counts
 * views that started a new browser session. No cookies, IPs or user agents
 * are stored.
 */

/** Public pages that are counted. Anything else posted to /api/views is ignored. */
const TRACKED_PATH =
  /^\/(?:(?:projects|publications)(?:\/[a-z0-9]+(?:-[a-z0-9]+)*)?|research|resume|contact)?$/;

export function normalizeTrackedPath(raw: unknown): string | null {
  if (typeof raw !== "string" || raw.length > 200) return null;
  const path = raw.split(/[?#]/)[0]!.replace(/\/+$/, "") || "/";
  return TRACKED_PATH.test(path) ? path : null;
}

const isoDay = (d: Date) => d.toISOString().slice(0, 10);

export async function recordView(path: string, newVisit: boolean) {
  const day = isoDay(new Date());
  await prisma.$executeRaw`
    INSERT INTO page_views_daily (day, path, views, visitors)
    VALUES (${day}::date, ${path}, 1, ${newVisit ? 1 : 0})
    ON CONFLICT (day, path) DO UPDATE
      SET views = page_views_daily.views + 1,
          visitors = page_views_daily.visitors + EXCLUDED.visitors`;
}

export interface DailyViews {
  day: string;
  views: number;
  visitors: number;
}

export interface ViewStats {
  allTime: { views: number; visitors: number };
  range: { views: number; visitors: number };
  today: { views: number; visitors: number };
  /** One entry per day in the range, oldest first, zero-filled. */
  daily: DailyViews[];
  topPages: { path: string; views: number }[];
}

export async function getViewStats(days = 30): Promise<ViewStats> {
  const now = new Date();
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)));

  const [allTime, grouped, top] = await Promise.all([
    prisma.pageViewDaily.aggregate({ _sum: { views: true, visitors: true } }),
    prisma.pageViewDaily.groupBy({
      by: ["day"],
      where: { day: { gte: start } },
      _sum: { views: true, visitors: true },
    }),
    prisma.pageViewDaily.groupBy({
      by: ["path"],
      where: { day: { gte: start } },
      _sum: { views: true },
      orderBy: { _sum: { views: "desc" } },
      take: 10,
    }),
  ]);

  const byDay = new Map(grouped.map((g) => [isoDay(g.day), g._sum]));
  const daily: DailyViews[] = Array.from({ length: days }, (_, i) => {
    const day = isoDay(new Date(start.getTime() + i * 86_400_000));
    const sum = byDay.get(day);
    return { day, views: sum?.views ?? 0, visitors: sum?.visitors ?? 0 };
  });
  const total = (key: "views" | "visitors") => daily.reduce((n, d) => n + d[key], 0);
  const last = daily[daily.length - 1];

  return {
    allTime: { views: allTime._sum.views ?? 0, visitors: allTime._sum.visitors ?? 0 },
    range: { views: total("views"), visitors: total("visitors") },
    today: { views: last?.views ?? 0, visitors: last?.visitors ?? 0 },
    daily,
    topPages: top.map((t) => ({ path: t.path, views: t._sum.views ?? 0 })),
  };
}

/** All-time views per path, for the counts shown next to projects and publications. */
export async function getViewsByPath(): Promise<Map<string, number>> {
  const rows = await prisma.pageViewDaily.groupBy({ by: ["path"], _sum: { views: true } });
  return new Map(rows.map((r) => [r.path, r._sum.views ?? 0]));
}
