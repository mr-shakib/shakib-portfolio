import "server-only";

/**
 * Lightweight rate limiter. Uses an in-memory sliding window that is adequate
 * for a single-instance deployment and dev. For multi-region serverless, set
 * UPSTASH_* env vars and swap in @upstash/ratelimit (left as a clear seam).
 */
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

const hits = new Map<string, number[]>();

export function checkRateLimit(identifier: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const timestamps = (hits.get(identifier) ?? []).filter((t) => now - t < WINDOW_MS);

  if (timestamps.length >= MAX_REQUESTS) {
    hits.set(identifier, timestamps);
    return { success: false, remaining: 0 };
  }

  timestamps.push(now);
  hits.set(identifier, timestamps);

  // Opportunistic cleanup to bound memory.
  if (hits.size > 5000) {
    for (const [key, ts] of hits) {
      if (ts.every((t) => now - t >= WINDOW_MS)) hits.delete(key);
    }
  }

  return { success: true, remaining: MAX_REQUESTS - timestamps.length };
}

/** Stable, non-reversible identifier for an IP (avoids storing raw IPs). */
export async function hashIp(ip: string): Promise<string> {
  const data = new TextEncoder().encode(ip + "::portfolio-salt");
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 32);
}
