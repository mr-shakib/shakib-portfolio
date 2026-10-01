import type { Metadata } from "next";
import { PageHeader } from "@/components/shared/PageHeader";
import { Section } from "@/components/shared/Section";
import { ContactForm } from "@/components/contact/ContactForm";
import { getSection } from "@/lib/data/sections";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Contact",
  description:
    "Get in touch with Shakib Howlader for research collaborations, MSc supervision or engineering opportunities.",
  path: "/contact",
});

export default async function ContactPage() {
  const [profile, headers] = await Promise.all([getSection("profile"), getSection("pageHeaders")]);

  return (
    <>
      <PageHeader {...headers.contact} />

      <Section>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="flex flex-col gap-6">
            <a
              href={`mailto:${profile.email}`}
              className="font-display text-2xl text-foreground hover:text-accent"
            >
              {profile.email}
            </a>
            <div className="flex flex-col gap-3">
              {profile.socials.map((s) => (
                <a
                  key={`${s.label}-${s.href}`}
                  href={s.href}
                  target={s.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-accent"
                >
                  {s.label}
                  {s.handle && (
                    <>
                      {" "}
                      — <span className="text-muted/70">{s.handle}</span>
                    </>
                  )}
                </a>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
            <ContactForm />
          </div>
        </div>
      </Section>
    </>
  );
}
