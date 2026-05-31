import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { PublicationsExplorer } from "@/components/publications/PublicationsExplorer";
import { getPublications } from "@/lib/data/publications";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Publications",
  description:
    "Peer-reviewed publications and datasets by Shakib Howlader, with abstracts, citations, BibTeX and DOIs.",
  path: "/publications",
});

export const revalidate = 3600;

export default async function PublicationsPage() {
  const publications = await getPublications();

  return (
    <>
      <PageHeader
        eyebrow="Publications"
        title="Published research & datasets."
        description="Openly available contributions — each with a copyable citation, BibTeX export and resolvable DOI."
      />
      <div className="container-content pb-section">
        <PublicationsExplorer publications={publications} />
      </div>
    </>
  );
}
