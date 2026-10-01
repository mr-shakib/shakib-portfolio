import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSection } from "@/lib/data/sections";

export const metadata: Metadata = buildMetadata({
  title: "Resume",
  description: "Download Shakib Howlader's CV — academic, industry and ATS-friendly versions.",
  path: "/resume",
});

export default async function ResumePage() {
  const { variants, ...header } = await getSection("resumePage");

  return (
    <>
      <PageHeader {...header} />

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {variants.map((v, i) => (
            <Card key={`${v.title}-${i}`} interactive className="flex flex-col gap-4">
              <h2 className="font-display text-2xl text-foreground">{v.title}</h2>
              <p className="flex-1 text-sm leading-relaxed text-muted">{v.description}</p>
              {v.file && (
                <div className="flex gap-3">
                  <Button href={v.file} size="sm" download>
                    Download PDF ↓
                  </Button>
                  <Button href={v.file} size="sm" variant="ghost" target="_blank">
                    Preview
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>

      </Section>
    </>
  );
}
