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
      <HomeHero content={hero} note={about} />

      {/* Brand band — volt on black, the repeated identity strip */}
      {marquees.top.length > 0 && (
        <div data-theme="dark" data-nav="volt">
          <VelocityMarquee
            items={marquees.top}
            baseVelocity={1.6}
            className="border-y-0 bg-accent py-3"
            textClassName="font-display text-2xl uppercase text-background md:text-3xl"
          />
        </div>
      )}

      <SignatureNote content={about} name={`${hero.firstName} ${hero.lastName}`} />
      <NumbersBand content={stats} />

      {/* Mission — a centered manifesto in mixed type: Anton caps with volt
          serif emphasis, brightening word by word as you scroll. */}
      <section className="py-section">
        <div className="container-content flex flex-col items-center text-center">
          <RevealOnScroll>
            <Eyebrow number="03">{mission.eyebrow}</Eyebrow>
          </RevealOnScroll>
          <div className="mt-10 max-w-6xl">
            <WordFill
              text={mission.text}
              baseOpacity={0.12}
              className="font-display text-[clamp(2.25rem,5.4vw,5.25rem)] uppercase leading-[1] text-foreground"
              emphasisClassName="font-serif text-[1.18em] leading-[0.8] text-accent"
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
        <div data-theme="dark" data-nav="volt">
          <VelocityMarquee
            items={marquees.bottom}
            baseVelocity={-2}
            className="bg-accent py-3"
            textClassName="font-display text-2xl uppercase text-background md:text-3xl"
          />
        </div>
      )}

      <ContactCta content={contactCta} profile={profile} />
    </>
  );
}
