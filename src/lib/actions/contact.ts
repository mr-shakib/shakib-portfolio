"use server";

import { headers } from "next/headers";
import { contactSchema, type ContactState } from "@/lib/validations/contact";
import { features } from "@/lib/env";
import { checkRateLimit, hashIp } from "@/lib/rate-limit";

/**
 * Contact submission. Validates with Zod, enforces honeypot + time-trap +
 * rate-limit spam protection, persists to the DB (when configured) and emails
 * the owner via Resend (when configured). Degrades gracefully if either
 * integration is absent so the form always gives the user clear feedback.
 */
export async function submitContact(
  _prev: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject"),
    message: formData.get("message"),
    company: formData.get("company") ?? "",
    elapsedMs: formData.get("elapsedMs") ?? undefined,
  };

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Please fix the highlighted fields.",
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, subject, message, company, elapsedMs } = parsed.data;

  // Honeypot + time trap — bots fill hidden fields and submit instantly.
  if (company && company.length > 0) {
    return { status: "success", message: "Thanks — your message has been sent." };
  }
  if (typeof elapsedMs === "number" && elapsedMs < 1200) {
    return { status: "success", message: "Thanks — your message has been sent." };
  }

  // Rate limit by hashed IP.
  const hdrs = await headers();
  const ip =
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ?? hdrs.get("x-real-ip") ?? "unknown";
  const ipHash = await hashIp(ip);
  const { success } = checkRateLimit(ipHash);
  if (!success) {
    return {
      status: "error",
      message: "Too many messages. Please try again in a minute.",
    };
  }

  try {
    if (features.database) {
      const { prisma } = await import("@/lib/prisma");
      await prisma.contactMessage.create({
        data: { name, email, subject, message, ipHash },
      });
    }

    if (features.email) {
      const { resend } = await import("@/lib/email/resend");
      const { ContactNotification } = await import(
        "@/lib/email/templates/ContactNotification"
      );
      const { env } = await import("@/lib/env");
      if (resend && env.CONTACT_TO_EMAIL && env.CONTACT_FROM_EMAIL) {
        await resend.emails.send({
          from: env.CONTACT_FROM_EMAIL,
          to: env.CONTACT_TO_EMAIL,
          replyTo: email,
          subject: `Portfolio · ${subject}`,
          react: ContactNotification({ name, email, subject, message }),
        });
      }
    }

    if (!features.database && !features.email) {
      // Nothing configured: log so local submissions are still observable.
      console.info("📨 Contact submission (no integrations configured):", {
        name,
        email,
        subject,
      });
    }

    return { status: "success", message: "Thanks — your message has been sent." };
  } catch (error) {
    console.error("Contact submission failed:", error);
    return {
      status: "error",
      message: "Something went wrong sending your message. Please email me directly.",
    };
  }
}
