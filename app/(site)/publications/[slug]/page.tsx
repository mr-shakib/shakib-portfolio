import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPublications, getPublicationBySlug } from "@/lib/data/publications";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/JsonLd";
import { publicationJsonLd } from "@/lib/seo/jsonld";
import { CitationActions } from "@/components/publications/CitationActions";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils/format";

export const revalidate = 3600;

export async function generateStaticParams() {
  const publications = await getPublications();
  return publications.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);
  if (!pub) return buildMetadata({ title: "Publication not found", noIndex: true });
  return buildMetadata({
    title: pub.title,
    description: pub.abstract.slice(0, 160),
    path: `/publications/${pub.slug}`,
    type: "article",
  });
}

export default async function PublicationDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const pub = await getPublicationBySlug(slug);
  if (!pub) notFound();

  return (
    <article className="container-content max-w-prose pb-section pt-36">
      <JsonLd data={publicationJsonLd(pub)} />

      <Link href="/publications" className="text-sm text-muted hover:text-accent">
        ← All publications
      </Link>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Badge variant="accent">{pub.type}</Badge>
        <span className="text-sm text-muted">{pub.venue}</span>
        <span className="text-sm text-muted">· {formatDate(pub.publishedDate)}</span>
      </div>

      <h1 className="mt-4 font-display text-display-md leading-tight text-gradient">{pub.title}</h1>
      <p className="mt-4 text-muted">{pub.authors.join(", ")}</p>

      <div className="mt-8">
        <CitationActions publication={pub} />
      </div>

      <section className="mt-10">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Abstract</h2>
        <p className="mt-3 leading-relaxed text-muted">{pub.abstract}</p>
      </section>

      {pub.impact && (
        <section className="mt-8 rounded-2xl border border-accent/20 bg-accent-soft/30 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Impact</h2>
          <p className="mt-2 leading-relaxed text-muted">{pub.impact}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-accent">Keywords</h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {pub.keywords.map((k) => (
            <li key={k}>
              <Badge>{k}</Badge>
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
