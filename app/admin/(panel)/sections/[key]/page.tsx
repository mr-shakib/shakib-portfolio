import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { isSectionKey, sections } from "@/lib/sections/registry";
import { toFormValues } from "@/lib/admin/fields";
import { saveSection } from "@/lib/admin/actions";
import { SchemaForm } from "@/components/admin/form/SchemaForm";
import { ResetSectionButton } from "@/components/admin/ResetSectionButton";
import { AdminHeader, ButtonLink } from "@/components/admin/ui";

export async function generateMetadata({ params }: { params: Promise<{ key: string }> }): Promise<Metadata> {
  const { key } = await params;
  return { title: isSectionKey(key) ? sections[key].label : "Section" };
}

export default async function EditSectionPage({ params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  if (!isSectionKey(key)) notFound();
  const def = sections[key];

  // Read straight from the database (not the site cache) so the form is always current.
  const stored = await prisma.siteSection.findUnique({ where: { key } });
  const data = { ...def.defaults, ...((stored?.data as Record<string, unknown> | null) ?? {}) };

  return (
    <>
      <AdminHeader
        back={{ href: "/admin/sections", label: "Sections" }}
        eyebrow={def.group}
        title={def.label}
        description={def.description}
        actions={
          <ButtonLink href={def.href} variant="ghost" external>
            View on site ↗
          </ButtonLink>
        }
      />
      <SchemaForm
        fields={def.fields}
        initial={toFormValues(def.fields, data)}
        action={saveSection.bind(null, key)}
        secondary={stored ? <ResetSectionButton sectionKey={key} /> : undefined}
      />
    </>
  );
}
