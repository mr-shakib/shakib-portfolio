import { Loader } from "@/components/sections/Loader";
import { HomeHero } from "@/components/home/HomeHero";
import { SignatureNote } from "@/components/home/SignatureNote";
import { NumbersBand } from "@/components/home/NumbersBand";
import { LabSection } from "@/components/home/LabSection";
import { PublicationSpotlight } from "@/components/home/PublicationSpotlight";
import { WildSection } from "@/components/home/WildSection";
import { StackSection } from "@/components/home/StackSection";
import { HallOfFame } from "@/components/home/HallOfFame";
import { ContactCta } from "@/components/home/ContactCta";
import { VelocityMarquee } from "@/components/shared/VelocityMarquee";
import { WordFill } from "@/components/shared/WordFill";
import { RevealOnScroll } from "@/components/shared/RevealOnScroll";

import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedPublication } from "@/lib/data/publications";
import { getResearchAreas } from "@/lib/data/research";

export default async function HomePage() {
  const [projects, publication, areas] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPublication(),
    getResearchAreas(),
  ]);

  return (
    <>
      <Loader />

      <HomeHero />

      {/* Brand band — volt on black, the repeated identity strip */}
      <VelocityMarquee
        items={["Machine Learning — Since 2021", "Research × Engineering", "Dhaka → The World"]}
        className="border-y-0 bg-accent py-3"
        textClassName="font-display text-2xl uppercase text-background md:text-3xl"
      />

      <SignatureNote />
      <NumbersBand />

      {/* Mission statement — words brighten as you scroll through them */}
      <section className="border-b border-border bg-background py-section">
        <div className="container-content">
          <RevealOnScroll>
            <p className="font-grotesk text-[11px] uppercase tracking-[0.35em] text-accent">
              00 — Mission
            </p>
          </RevealOnScroll>
          <div className="mt-8 max-w-5xl">
            <WordFill
              text="I build intelligent systems that turn messy, real-world data into reliable decisions — and I publish the datasets and methods so others can build on them too."
              className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground md:text-5xl"
            />
          </div>
        </div>
      </section>

      <LabSection areas={areas} />
      <PublicationSpotlight publication={publication} />
      <WildSection projects={projects} />
      <StackSection />
      <HallOfFame />

      <VelocityMarquee
        items={["Open to collaboration", "MSc → PhD", "Let’s build something real"]}
        baseVelocity={-2}
        className="bg-accent py-3"
        textClassName="font-display text-2xl uppercase text-background md:text-3xl"
      />

      <ContactCta />
    </>
  );
}
