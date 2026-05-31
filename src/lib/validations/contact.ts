import { z } from "zod";

/** Contact form schema — shared by the client form (RHF) and the server action. */
export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your name")
    .max(80, "Name is too long"),
  email: z.string().trim().email("Please enter a valid email"),
  subject: z
    .string()
    .trim()
    .min(3, "Subject is too short")
    .max(120, "Subject is too long"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(4000, "Message is too long"),
  // Honeypot — must stay empty. Bots fill it in.
  company: z.string().max(0).optional().default(""),
  // Time trap — ms since form mount; instant submits are bots.
  elapsedMs: z.coerce.number().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<keyof ContactInput, string[]>>;
};
