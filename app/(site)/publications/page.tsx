import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublicationsExplorer } from "@/components/publications/PublicationsExplorer";
import { getPublications } from "@/lib/data/publications";
import { getSection } from "@/lib/data/sections";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Publications",
  description:
    "Peer-reviewed publications and datasets by Shakib Howlader, with abstracts, citations, BibTeX and DOIs.",
  path: "/publications",
});

export default async function PublicationsPage() {
  const [publications, headers] = await Promise.all([getPublications(), getSection("pageHeaders")]);

  return (
    <>
      <PageHeader {...headers.publications} />
      <div className="container-content pb-section">
        <PublicationsExplorer publications={publications} />
      </div>
    </>
  );
}
