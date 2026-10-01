import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { ProjectsExplorer } from "@/components/projects/ProjectsExplorer";
import { getProjects } from "@/lib/data/projects";
import { getSection } from "@/lib/data/sections";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Projects",
  description:
    "Selected software projects by Shakib Howlader — full-stack platforms, mobile apps and AI tooling, shipped end-to-end.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const [projects, headers] = await Promise.all([getProjects(), getSection("pageHeaders")]);

  return (
    <>
      <PageHeader {...headers.projects} />
      <div className="container-content pb-section">
        <ProjectsExplorer projects={projects} />
      </div>
    </>
  );
}
