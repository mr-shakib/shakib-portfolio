import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getProjectBySlug, getProjects } from "@/lib/data/projects";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { projectJsonLd } from "@/lib/seo/jsonld";
import { SplitHeading } from "@/components/shared/SplitHeading";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";
import { CoverStage } from "@/components/projects/CoverStage";
import { NotchArrow, ProjectCover, categoryLabels } from "@/components/projects/ProjectCover";

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

const pad = (n: number) => String(n).padStart(2, "0");

/** A numbered row of the case study: label on the left, content on the right. */
function Chapter({ n, label, children }: { n: number; label: string; children: React.ReactNode }) {
  return (
    <RevealOnScroll>
      <section className="grid gap-5 border-t border-border py-10 md:grid-cols-12 md:gap-8 md:py-14">
        <h2 className="flex items-baseline gap-3 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted md:col-span-3">
          <span className="text-accent">{pad(n)}</span>
          {label}
        </h2>
        <div className="md:col-span-9">{children}</div>
      </section>
    </RevealOnScroll>
  );
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [project, all] = await Promise.all([getProjectBySlug(slug), getProjects()]);
  if (!project) notFound();

  const index = Math.max(
    0,
    all.findIndex((p) => p.id === project.id),
  );
  const next = all.length > 1 ? all[(index + 1) % all.length]! : null;
  const nextIndex = (index + 1) % all.length;

  let n = 0;

  return (
    <article>
      <JsonLd data={projectJsonLd(project)} />

      <header className="container-content pt-36 md:pt-44">
        <Link
          href="/projects"
          className="group inline-flex items-center gap-2 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted transition-colors hover:text-accent"
        >
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:-translate-x-1"
          >
            ←
          </span>
          All projects
        </Link>

        <div className="mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted">
          <span>
            N°{pad(index + 1)} — {categoryLabels[project.category]}
          </span>
          <span>{project.tags.join(" · ")}</span>
        </div>
        <SplitHeading
          as="h1"
          lines={[{ text: project.title }]}
          className="mt-4 break-words"
          lineClassName="text-display-xl leading-[0.88] text-foreground"
        />

        <div className="mt-10 grid gap-8 md:grid-cols-12 md:items-end">
          <p className="max-w-3xl text-lg leading-snug text-foreground/85 md:col-span-8 md:text-2xl">
            {project.summary}
          </p>
          <div className="flex flex-wrap gap-2.5 md:col-span-4 md:justify-end">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-xl bg-volt px-6 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-ink transition-transform duration-300 hover:-translate-y-0.5"
              >
                Live demo <span aria-hidden>↗</span>
              </a>
            )}
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center gap-2 rounded-xl border border-foreground/25 px-6 font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-foreground transition-colors duration-300 hover:border-foreground"
              >
                Source <span aria-hidden>↗</span>
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="container-content mt-14 md:mt-20">
        <CoverStage>
          <ProjectCover
            project={project}
            index={index}
            art
            priority
            sizes="(min-width: 1440px) 1300px, 92vw"
          />
        </CoverStage>
      </div>

      <div className="container-content pb-section pt-16 md:pt-24">
        <Chapter n={++n} label="Overview">
          <p className="max-w-4xl text-lg leading-relaxed text-foreground/85 md:text-2xl md:leading-snug">
            {project.description}
          </p>
        </Chapter>

        {project.features.length > 0 && (
          <Chapter n={++n} label="What it does">
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {project.features.map((feature, i) => (
                <li
                  key={feature}
                  className="flex gap-4 border-b border-border py-5 text-base leading-snug text-foreground/85"
                >
                  <span className="font-serif text-2xl leading-none text-accent">{i + 1}</span>
                  {feature}
                </li>
              ))}
            </ol>
          </Chapter>
        )}

        {project.challenges && (
          <Chapter n={++n} label="The challenge">
            <p className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">
              {project.challenges}
            </p>
          </Chapter>
        )}

        {project.results && (
          <Chapter n={++n} label="The outcome">
            <p className="max-w-3xl text-base leading-relaxed text-muted md:text-lg">
              {project.results}
            </p>
          </Chapter>
        )}

        <Chapter n={++n} label="Built with">
          <ul className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-foreground/20 px-4 py-2 font-grotesk text-[11px] uppercase tracking-[0.18em] text-foreground/85"
              >
                {tech}
              </li>
            ))}
          </ul>
        </Chapter>

        {project.screenshots.length > 0 && (
          <Chapter n={++n} label="Gallery">
            <div className="grid gap-4 sm:grid-cols-2">
              {project.screenshots.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface"
                >
                  <Image
                    src={src}
                    alt={`${project.title} — screenshot ${i + 1}`}
                    fill
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </Chapter>
        )}
      </div>

      {next && (
        <Link
          href={`/projects/${next.slug}`}
          data-cursor-hover
          className="group block border-t border-border"
        >
          <div className="container-content grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
            <div className="md:col-span-7">
              <p className="font-grotesk text-[11px] uppercase tracking-[0.25em] text-muted">
                Next project — N°{pad(nextIndex + 1)}
              </p>
              <p className="mt-4 font-display text-display-lg uppercase leading-[0.9] text-foreground transition-colors duration-300 group-hover:text-accent">
                {next.title}
              </p>
              <p className="mt-5 max-w-lg text-sm leading-relaxed text-muted md:text-base">
                {next.summary}
              </p>
            </div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-[1.5rem] md:col-span-5">
              <div className="absolute inset-0 transition-transform duration-[900ms] ease-out-expo group-hover:scale-[1.04]">
                <ProjectCover
                  project={next}
                  index={nextIndex}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  mono
                />
              </div>
              <NotchArrow />
            </div>
          </div>
        </Link>
      )}
    </article>
  );
}
