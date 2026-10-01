import { headers } from "next/headers";
import { features } from "@/lib/env";
import { getAdmin } from "@/lib/auth/session";
import { checkRateLimit, clientIp, hashIp } from "@/lib/rate-limit";
import { normalizeTrackedPath, recordView } from "@/lib/views";

const BOT_UA = /bot|crawl|spider|slurp|preview|headless|lighthouse|monitor|curl|wget|python|axios/i;
const done = () => new Response(null, { status: 204 });

/** Page-view beacon from ViewTracker. Always answers 204 so it never surfaces errors. */
export async function POST(request: Request) {
  if (!features.database) return done();

  const hdrs = await headers();
  const ua = hdrs.get("user-agent") ?? "";
  if (!ua || BOT_UA.test(ua)) return done();

  const body = await request.text();
  if (body.length > 500) return done();
  let payload: { path?: unknown; newVisit?: unknown };
  try {
    payload = JSON.parse(body);
  } catch {
    return done();
  }
  const path = normalizeTrackedPath(payload.path);
  if (!path) return done();

  if (!checkRateLimit(`views:${await hashIp(clientIp(hdrs))}`, { limit: 60 }).success) return done();

  // Your own browsing while signed in to /admin isn't counted.
  if (await getAdmin()) return done();

  try {
    await recordView(path, payload.newVisit === true);
  } catch (error) {
    console.error("Failed to record view:", error);
  }
  return done();
}
