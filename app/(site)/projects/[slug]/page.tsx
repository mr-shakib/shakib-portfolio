import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getProjects, getProjectBySlug } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectJsonLd } from "@/lib/seo/jsonld";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export const revalidate = 3600;

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return buildMetadata({ title: "Project not found", noIndex: true });
  return buildMetadata({
    title: project.title,
    description: project.summary,
    path: `/projects/${project.slug}`,
    type: "article",
  });
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article>
      <JsonLd data={projectJsonLd(project)} />

      <header className="container-content pb-12 pt-36">
        <Link href="/projects" className="text-sm text-muted hover:text-accent">
          ← All projects
        </Link>
        <div className="mt-6 flex flex-wrap gap-3">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
        <h1 className="mt-4 max-w-4xl font-display text-display-lg leading-tight text-gradient">
          {project.title}
        </h1>
        <p className="mt-6 max-w-prose text-lg leading-relaxed text-muted">{project.summary}</p>

        <div className="mt-8 flex flex-wrap gap-4">
          {project.demoUrl && (
            <Button href={project.demoUrl}>Live demo ↗</Button>
          )}
          {project.githubUrl && (
            <Button href={project.githubUrl} variant="outline">
              Source code ↗
            </Button>
          )}
        </div>
      </header>

      <div className="container-content grid gap-12 pb-section lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-10">
          <section>
            <h2 className="font-display text-heading text-foreground">Overview</h2>
            <p className="mt-4 leading-relaxed text-muted">{project.description}</p>
          </section>

          {project.features.length > 0 && (
            <section>
              <h2 className="font-display text-heading text-foreground">Key features</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {project.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 text-sm text-muted"
                  >
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {project.challenges && (
            <section>
              <h2 className="font-display text-heading text-foreground">Challenges</h2>
              <p className="mt-4 leading-relaxed text-muted">{project.challenges}</p>
            </section>
          )}

          {project.results && (
            <section>
              <h2 className="font-display text-heading text-foreground">Results</h2>
              <p className="mt-4 leading-relaxed text-muted">{project.results}</p>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              Tech stack
            </h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((t) => (
                <li key={t}>
                  <Badge>{t}</Badge>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  );
}
