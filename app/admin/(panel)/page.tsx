import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getViewStats } from "@/lib/views";
import { ViewsChart } from "@/components/admin/ViewsChart";
import { ImportContentButton } from "@/components/admin/ImportContentButton";
import { AdminHeader, Panel, formatCount } from "@/components/admin/ui";
import { cn } from "@/lib/utils/cn";

export const metadata: Metadata = { title: "Dashboard" };

const RANGES = [7, 30, 90] as const;
const BAR = "#7c9e12";

const pageName = (path: string) => (path === "/" ? "Home" : path);
const when = new Intl.DateTimeFormat("en", { day: "numeric", month: "short" });

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const { range: rawRange } = await searchParams;
  const range = RANGES.find((r) => String(r) === rawRange) ?? 30;

  const [stats, counts, unread, latest] = await Promise.all([
    getViewStats(range),
    Promise.all([
      prisma.project.count(),
      prisma.publication.count(),
      prisma.researchArea.count(),
      prisma.researchEntry.count(),
      prisma.skill.count(),
      prisma.siteSection.count(),
    ]),
    prisma.contactMessage.count({ where: { status: "UNREAD" } }),
    prisma.contactMessage.findMany({
      where: { status: { not: "ARCHIVED" } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);
  const [projects, publications, areas, entries, skills, editedSections] = counts;
  const hasEmptyCollection = [projects, publications, areas, entries, skills].some((c) => c === 0);
  const topMax = Math.max(1, ...stats.topPages.map((p) => p.views));

  return (
    <>
      <AdminHeader eyebrow="Overview" title="Dashboard" />

      {hasEmptyCollection && (
        <Panel className="mb-6 border-volt/30 bg-volt/[0.06]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="font-medium text-foreground">Some content tables are empty</p>
              <p className="mt-1 text-sm text-muted">
                Import the site’s original projects, publications, research and skills. Only empty tables are
                filled — nothing you’ve edited is touched.
              </p>
            </div>
            <ImportContentButton />
          </div>
        </Panel>
      )}

      {/* Range filter scopes every number and chart below it. */}
      <nav aria-label="Date range" className="mb-4 inline-flex rounded-lg border border-white/10 p-1">
        {RANGES.map((r) => (
          <Link
            key={r}
            href={r === 30 ? "/admin" : `/admin?range=${r}`}
            aria-current={r === range ? "true" : undefined}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs transition-colors",
              r === range ? "bg-white/10 font-semibold text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            Last {r} days
          </Link>
        ))}
      </nav>

      <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <Panel>
          <p className="text-sm text-muted">Page views</p>
          <p className="mt-2 text-5xl font-semibold tracking-tight text-foreground">
            {formatCount(stats.range.views)}
          </p>
          <p className="mt-1 text-xs text-muted">Last {range} days</p>
        </Panel>
        <Tile label="New visits" value={stats.range.visitors} note={`Last ${range} days`} />
        <Tile label="Views today" value={stats.today.views} note="Since 00:00 UTC" />
        <Tile label="All-time views" value={stats.allTime.views} note={`${formatCount(stats.allTime.visitors)} ${stats.allTime.visitors === 1 ? "visit" : "visits"}`} />
      </div>

      <Panel className="mt-4">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 className="font-medium text-foreground">Daily page views</h2>
          <p className="text-xs text-muted">Your own visits while signed in aren’t counted</p>
        </div>
        <ViewsChart data={stats.daily} />
      </Panel>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel>
          <h2 className="mb-4 font-medium text-foreground">Top pages · last {range} days</h2>
          {stats.topPages.length === 0 ? (
            <p className="text-sm text-muted">No views yet.</p>
          ) : (
            <ol className="flex flex-col gap-3">
              {stats.topPages.map((p) => (
                <li key={p.path}>
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
                    <a href={p.path} target="_blank" rel="noreferrer" className="truncate text-white/90 hover:text-accent">
                      {pageName(p.path)}
                    </a>
                    <span className="tabular-nums text-foreground">{formatCount(p.views)}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/[0.05]">
                    <div className="h-full rounded-full" style={{ width: `${(p.views / topMax) * 100}%`, background: BAR }} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </Panel>

        <Panel>
          <div className="mb-4 flex items-baseline justify-between gap-4">
            <h2 className="font-medium text-foreground">
              Messages{unread > 0 && <span className="ml-2 text-sm text-accent">{unread} unread</span>}
            </h2>
            <Link href="/admin/messages" className="text-xs text-muted hover:text-accent">
              Open inbox →
            </Link>
          </div>
          {latest.length === 0 ? (
            <p className="text-sm text-muted">No messages yet. Contact-form submissions land here.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-white/10">
              {latest.map((m) => (
                <li key={m.id} className="py-2.5 first:pt-0">
                  <Link href={`/admin/messages#${m.id}`} className="group block">
                    <p className="flex items-center gap-2 text-sm">
                      {m.status === "UNREAD" && <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-label="Unread" />}
                      <span className="truncate font-medium text-foreground group-hover:text-accent">{m.subject}</span>
                      <span className="ml-auto shrink-0 text-xs text-muted">{when.format(m.createdAt)}</span>
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted">{m.name}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>

      <Panel className="mt-4">
        <h2 className="mb-4 font-medium text-foreground">Content</h2>
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            { label: "Sections edited", value: editedSections, href: "/admin/sections" },
            { label: "Projects", value: projects, href: "/admin/projects" },
            { label: "Publications", value: publications, href: "/admin/publications" },
            { label: "Research areas", value: areas, href: "/admin/research-areas" },
            { label: "Research entries", value: entries, href: "/admin/research-entries" },
            { label: "Skills", value: skills, href: "/admin/skills" },
          ].map((c) => (
            <Link key={c.label} href={c.href} className="group rounded-lg p-2 -m-2 hover:bg-white/[0.03]">
              <dt className="text-xs text-muted group-hover:text-foreground">{c.label}</dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">{c.value}</dd>
            </Link>
          ))}
        </dl>
      </Panel>
    </>
  );
}

function Tile({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <Panel>
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">{formatCount(value)}</p>
      <p className="mt-1 text-xs text-muted">{note}</p>
    </Panel>
  );
}
