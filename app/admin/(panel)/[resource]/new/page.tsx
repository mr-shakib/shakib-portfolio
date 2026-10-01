import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isResourceName, resources } from "@/lib/admin/resources";
import { toFormValues } from "@/lib/admin/fields";
import { saveResource } from "@/lib/admin/actions";
import { SchemaForm } from "@/components/admin/form/SchemaForm";
import { AdminHeader } from "@/components/admin/ui";

export async function generateMetadata({ params }: { params: Promise<{ resource: string }> }): Promise<Metadata> {
  const { resource } = await params;
  return { title: isResourceName(resource) ? `New ${resources[resource].singular}` : "Not found" };
}

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  if (!isResourceName(resource)) notFound();
  const def = resources[resource];

  return (
    <>
      <AdminHeader back={{ href: `/admin/${resource}`, label: def.label }} title={`New ${def.singular}`} />
      <SchemaForm
        fields={def.fields}
        initial={toFormValues(def.fields, def.defaults)}
        action={saveResource.bind(null, resource, null)}
        submitLabel={`Create ${def.singular}`}
      />
    </>
  );
}
