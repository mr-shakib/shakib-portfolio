import { z } from "zod";

/**
 * Validate environment variables once, at module load, so misconfiguration
 * fails fast and loudly instead of surfacing as cryptic runtime errors.
 *
 * Only server-side secrets live here. Anything prefixed with NEXT_PUBLIC_ is
 * inlined by Next at build time and exposed via `clientEnv`.
 */
/**
 * Treat empty strings as "unset". Hosting dashboards (incl. Vercel) often store
 * a blank value, which would otherwise fail `.url()`/`.min(1)` and crash the
 * build. Coercing "" → undefined makes every integration cleanly optional.
 */
const optionalString = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().optional(),
);
const optionalUrl = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().url().optional(),
);
const optionalEmail = z.preprocess(
  (v) => (v === "" ? undefined : v),
  z.string().email().optional(),
);

const serverSchema = z.object({
  DATABASE_URL: optionalUrl,
  DIRECT_URL: optionalUrl,
  RESEND_API_KEY: optionalString,
  CONTACT_TO_EMAIL: optionalEmail,
  CONTACT_FROM_EMAIL: optionalString,
  UPSTASH_REDIS_REST_URL: optionalUrl,
  UPSTASH_REDIS_REST_TOKEN: optionalString,
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    (v) => (v === "" || v == null ? undefined : v),
    z.string().url().default("http://localhost:3000"),
  ),
  NEXT_PUBLIC_GA_ID: optionalString,
});

const parsedServer = serverSchema.safeParse(process.env);
if (!parsedServer.success) {
  console.error(
    "❌ Invalid server environment variables:",
    parsedServer.error.flatten().fieldErrors,
  );
  throw new Error("Invalid server environment variables");
}

const parsedClient = clientSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
});
if (!parsedClient.success) {
  console.error(
    "❌ Invalid public environment variables:",
    parsedClient.error.flatten().fieldErrors,
  );
  throw new Error("Invalid public environment variables");
}

export const env = parsedServer.data;
export const clientEnv = parsedClient.data;

/** Feature flags derived from which integrations are configured. */
export const features = {
  database: Boolean(env.DATABASE_URL),
  email: Boolean(env.RESEND_API_KEY && env.CONTACT_TO_EMAIL),
  rateLimit: Boolean(env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN),
} as const;
