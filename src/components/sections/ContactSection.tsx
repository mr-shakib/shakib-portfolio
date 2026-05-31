import { Section } from "@/components/shared/Section";
import { SectionHeading } from "@/components/shared/SectionHeading";
import { ContactForm } from "@/components/contact/ContactForm";
import { socialLinks, siteConfig } from "@/config/site";

export function ContactSection() {
  return (
    <Section id="contact" className="border-t border-border">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
        <div className="flex flex-col gap-8">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s build or research together."
            description="Open to research collaborations, MSc supervision, and engineering opportunities."
          />

          <div className="flex flex-col gap-3">
            <a
              href={`mailto:${siteConfig.email}`}
              className="font-display text-xl text-foreground hover:text-accent"
            >
              {siteConfig.email}
            </a>
            <div className="flex flex-wrap gap-4 pt-2">
              {socialLinks
                .filter((s) => s.href.startsWith("http"))
                .map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted transition-colors hover:text-accent"
                  >
                    {s.label} ↗
                  </a>
                ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-border bg-surface p-6 md:p-8">
          <ContactForm />
        </div>
      </div>
    </Section>
  );
}
