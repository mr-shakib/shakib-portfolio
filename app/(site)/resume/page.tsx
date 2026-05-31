import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Resume",
  description: "Download Shakib Howlader's CV — academic, industry and ATS-friendly versions.",
  path: "/resume",
});

const variants = [
  {
    title: "Academic CV",
    description:
      "Full academic curriculum vitae — publications, research, education and references. Best for supervisors and admissions.",
    file: "/cv/academic.pdf",
  },
  {
    title: "Industry CV",
    description:
      "Concise, impact-focused resume for engineering roles — projects, stack and outcomes.",
    file: "/cv/industry.pdf",
  },
  {
    title: "ATS Version",
    description:
      "Plain, single-column, parser-friendly format optimized for applicant tracking systems.",
    file: "/cv/ats.pdf",
  },
];

export default function ResumePage() {
  return (
    <>
      <PageHeader
        eyebrow="Resume"
        title="One profile, tailored three ways."
        description="Choose the version that fits your context. Each is kept in sync and exportable as PDF."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-3">
          {variants.map((v) => (
            <Card key={v.title} interactive className="flex flex-col gap-4">
              <h2 className="font-display text-2xl text-foreground">{v.title}</h2>
              <p className="flex-1 text-sm leading-relaxed text-muted">{v.description}</p>
              <div className="flex gap-3">
                <Button href={v.file} size="sm">
                  Download PDF ↓
                </Button>
                <Button href={v.file} size="sm" variant="ghost">
                  Preview
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          Note: place the PDF files in <code className="text-accent">/public/cv/</code>. Until then
          these links 404 gracefully.
        </p>
      </Section>
    </>
  );
}
