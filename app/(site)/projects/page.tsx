import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected software projects by Shakib Howlader — full-stack platforms, mobile apps and AI tooling, shipped end-to-end.",
  path: "/projects",
});

export const revalidate = 3600;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <>
      <PageHeader
        eyebrow="Projects"
        title="Things I’ve designed, built and shipped."
        description="A selection of full-stack platforms, mobile apps and research tooling — each solving a concrete problem."
      />
      <div className="container-content pb-section">
        <ProjectsExplorer projects={projects} />
      </div>
    </>
  );
}
