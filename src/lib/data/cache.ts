import "server-only";
import { unstable_cache } from "next/cache";

/** Tag on every cached content read; admin saves call revalidateTag(CONTENT_TAG). */
export const CONTENT_TAG = "content";

/**
 * Cache a database read across requests until content changes. Results come
 * back JSON-serialized on cache hits (Dates become strings), so callers parse
 * them with the content schemas, which coerce dates.
 */
export function cachedQuery<T>(key: string, query: () => Promise<T>): () => Promise<T> {
  return unstable_cache(query, ["content", key], { tags: [CONTENT_TAG] });
}
