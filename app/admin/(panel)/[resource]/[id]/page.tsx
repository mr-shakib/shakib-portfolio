import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isResourceName, resources } from "@/lib/admin/resources";
import { getRow } from "@/lib/admin/resource-db";
import { toFormValues } from "@/lib/admin/fields";
import { saveResource } from "@/lib/admin/actions";
import { SchemaForm } from "@/components/admin/form/SchemaForm";
import { DeleteResourceButton } from "@/components/admin/DeleteResourceButton";
import { AdminHeader, ButtonLink } from "@/components/admin/ui";

export const metadata: Metadata = { title: "Edit" };

export default async function EditResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ resource: string; id: string }>;
  searchParams: Promise<{ created?: string }>;
}) {
  const [{ resource, id }, { created }] = await Promise.all([params, searchParams]);
  if (!isResourceName(resource)) notFound();
  const def = resources[resource];
  const row = await getRow(resource, id);
  if (!row) notFound();

  const title = String(row.title ?? row.name ?? "Untitled");
  const publicPath = def.publicPath && row.status !== "DRAFT" ? def.publicPath(row) : null;

  return (
    <>
      <AdminHeader
        back={{ href: `/admin/${resource}`, label: def.label }}
        eyebrow={`Edit ${def.singular}`}
        title={title}
        actions={
          publicPath ? (
            <ButtonLink href={publicPath} variant="ghost" external>
              View on site ↗
            </ButtonLink>
          ) : undefined
        }
      />
      <SchemaForm
        fields={def.fields}
        initial={toFormValues(def.fields, row)}
        action={saveResource.bind(null, resource, id)}
        notice={created ? `Created. ${row.status === "DRAFT" ? "It’s a draft — set Status to Published to show it on the site." : "It’s live on the site."}` : undefined}
        secondary={<DeleteResourceButton resource={resource} id={id} label={def.singular} />}
      />
    </>
  );
}
