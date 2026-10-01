import { jsonLdScript } from "@/lib/seo/jsonld";

/** Renders a JSON-LD structured-data script (jsonLdScript escapes "<"). */
export function JsonLd({ data }: { data: object }) {
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(data)} />
  );
}
