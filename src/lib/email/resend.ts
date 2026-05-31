import "server-only";
import { Resend } from "resend";
import { env, features } from "@/lib/env";

/** Lazily instantiated Resend client; null when email isn't configured. */
export const resend = features.email && env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
