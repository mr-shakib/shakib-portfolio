import "server-only";
import { unstable_cache } from "next/cache";

/** Tag on every cached content read; admin saves call revalidateTag(CONTENT_TAG). */
export const CONTENT_TAG = "content";

/**
 * Safety net for database changes made outside the admin (seed script, psql):
 * those can't clear the tag, so cached reads also expire after this long.
 */
const MAX_AGE_SECONDS = 300;

/**
 * Cache a database read across requests until content changes. Results come
 * back JSON-serialized on cache hits (Dates become strings), so callers parse
 * them with the content schemas, which coerce dates.
 *
 * Development always reads live: the dev data cache persists in .next/cache
 * across restarts, which would otherwise hide seeds and migrations.
 */
export function cachedQuery<T>(key: string, query: () => Promise<T>): () => Promise<T> {
  if (process.env.NODE_ENV !== "production") return query;
  return unstable_cache(query, ["content", key], { tags: [CONTENT_TAG], revalidate: MAX_AGE_SECONDS });
}
