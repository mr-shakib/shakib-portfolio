import { z } from "zod";

/**
 * Validate environment variables once, at module load, so misconfiguration
 * fails fast and loudly instead of surfacing as cryptic runtime errors.
 *
 * Only server-side secrets live here. Anything prefixed with NEXT_PUBLIC_ is
 * inlined by Next at build time and exposed via `clientEnv`.
 */
const serverSchema = z.object({
  DATABASE_URL: z.string().url().optional(),
  DIRECT_URL: z.string().url().optional(),
  RESEND_API_KEY: z.string().min(1).optional(),
  CONTACT_TO_EMAIL: z.string().email().optional(),
  CONTACT_FROM_EMAIL: z.string().min(1).optional(),
  UPSTASH_REDIS_REST_URL: z.string().url().optional().or(z.literal("")),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_GA_ID: z.string().optional(),
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
