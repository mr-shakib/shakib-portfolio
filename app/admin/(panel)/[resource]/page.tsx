import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { isResourceName, resources } from "@/lib/admin/resources";
import { listRows } from "@/lib/admin/resource-db";
import { getViewsByPath } from "@/lib/views";
import { AdminHeader, Badge, ButtonLink, formatCount } from "@/components/admin/ui";

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const { resource } = await params;
  return { title: isResourceName(resource) ? resources[resource].label : "Not found" };
}

export default async function ResourceListPage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceName(resource)) notFound();
  const def = resources[resource];
  const publicPath = def.publicPath;

  const [rows, views] = await Promise.all([
    listRows(resource),
    publicPath ? getViewsByPath() : Promise.resolve(null),
  ]);

  return (
    <>
      <AdminHeader
        eyebrow="Content"
        title={def.label}
        description={def.description}
        actions={<ButtonLink href={`/admin/${resource}/new`}>+ New {def.singular}</ButtonLink>}
      />

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-10 text-center">
          <p className="text-foreground">No {def.label.toLowerCase()} yet.</p>
          <p className="mt-1 text-sm text-muted">
            Create one, or import the site’s original content from the dashboard.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-surface">
          {rows.map((row) => {
            const id = String(row.id);
            const title = String(row.title ?? row.name ?? "Untitled");
            const count = publicPath && views ? (views.get(publicPath(row)) ?? 0) : null;
            return (
              <li key={id}>
                <Link
                  href={`/admin/${resource}/${id}`}
                  className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.03]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="flex flex-wrap items-center gap-2">
                      <span className="truncate font-medium text-foreground group-hover:text-accent">{title}</span>
                      {row.status === "DRAFT" && <Badge tone="warn">Draft</Badge>}
                      {row.featured === true && <Badge tone="accent">Featured</Badge>}
                    </p>
                    <p className="mt-0.5 truncate text-sm text-muted">{def.subtitle(row)}</p>
                  </div>
                  {count !== null && (
                    <p className="shrink-0 text-right text-sm tabular-nums text-foreground">
                      {formatCount(count)}
                      <span className="block text-[10px] uppercase tracking-[0.15em] text-muted">views</span>
                    </p>
                  )}
                  <span aria-hidden className="text-muted group-hover:text-accent">→</span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
