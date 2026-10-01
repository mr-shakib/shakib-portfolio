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
import { Eyebrow } from "@/components/shared/Eyebrow";

import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedPublication } from "@/lib/data/publications";
import { getResearchAreas } from "@/lib/data/research";
import { getSkills } from "@/lib/data/skills";
import { getSection } from "@/lib/data/sections";

export default async function HomePage() {
  const [
    projects,
    publication,
    areas,
    skills,
    hero,
    marquees,
    about,
    stats,
    mission,
    lab,
    spotlight,
    wild,
    stack,
    journey,
    contactCta,
    profile,
  ] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPublication(),
    getResearchAreas(),
    getSkills(),
    getSection("hero"),
    getSection("marquees"),
    getSection("about"),
    getSection("stats"),
    getSection("mission"),
    getSection("lab"),
    getSection("spotlight"),
    getSection("wild"),
    getSection("stack"),
    getSection("journey"),
    getSection("contactCta"),
    getSection("profile"),
  ]);

  return (
    <>
      <HomeHero content={hero} />

      {/* Brand band — volt on black, the repeated identity strip */}
      {marquees.top.length > 0 && (
        <VelocityMarquee
          items={marquees.top}
          baseVelocity={1.6}
          className="border-y-0 bg-accent py-3"
          textClassName="font-display text-2xl uppercase text-background md:text-3xl"
        />
      )}

      <SignatureNote content={about} name={`${hero.firstName} ${hero.lastName}`} />
      <NumbersBand content={stats} />

      {/* Mission statement — words brighten as you scroll through them */}
      <section className="border-b border-border bg-transparent py-section">
        <div className="container-content">
          <RevealOnScroll>
            <Eyebrow number="03">{mission.eyebrow}</Eyebrow>
          </RevealOnScroll>
          <div className="mt-8 max-w-5xl">
            <WordFill
              text={mission.text}
              className="text-3xl font-semibold leading-[1.15] tracking-tight text-foreground md:text-5xl"
            />
          </div>
        </div>
      </section>

      <LabSection content={lab} areas={areas} />
      <PublicationSpotlight content={spotlight} publication={publication} />
      <WildSection content={wild} projects={projects} />
      <StackSection content={stack} skills={skills} />
      <HallOfFame content={journey} />

      {marquees.bottom.length > 0 && (
        <VelocityMarquee
          items={marquees.bottom}
          baseVelocity={-2}
          className="bg-accent py-3"
          textClassName="font-display text-2xl uppercase text-background md:text-3xl"
        />
      )}

      <ContactCta content={contactCta} profile={profile} />
    </>
  );
}
