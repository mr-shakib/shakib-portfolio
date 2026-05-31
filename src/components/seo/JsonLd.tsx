import { jsonLdScript } from "@/lib/seo/jsonld";

/** Renders a JSON-LD structured-data script. Safe: data is app-controlled. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
  );
}
