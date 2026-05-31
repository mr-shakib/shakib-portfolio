import { Loader } from "@/components/sections/Loader";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { FeaturedPublicationSection } from "@/components/sections/FeaturedPublicationSection";
import { ResearchAreasSection } from "@/components/sections/ResearchAreasSection";
import { FeaturedProjectsSection } from "@/components/sections/FeaturedProjectsSection";
import { SkillsSection } from "@/components/sections/SkillsSection";
import { AchievementsSection } from "@/components/sections/AchievementsSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { VelocityMarquee } from "@/components/shared/VelocityMarquee";
import { ParallaxBanner } from "@/components/shared/ParallaxBanner";
import { ScrollHighlightText } from "@/components/shared/ScrollHighlightText";
import { SectionShape } from "@/components/three/SectionShape";

import { getFeaturedProjects } from "@/lib/data/projects";
import { getFeaturedPublication } from "@/lib/data/publications";
import { getResearchAreas } from "@/lib/data/research";
import { getAchievements } from "@/lib/data/achievements";

export default async function HomePage() {
  const [projects, publication, areas, achievements] = await Promise.all([
    getFeaturedProjects(),
    getFeaturedPublication(),
    getResearchAreas(),
    getAchievements(),
  ]);

  return (
    <>
      <Loader />

      <div className="relative">
        <SectionShape shape="globe" />
        <HeroSection />
      </div>

      <VelocityMarquee
        items={[
          "Machine Learning",
          "Computer Vision",
          "Research",
          "Full-Stack Engineering",
          "Healthcare AI",
          "Agricultural AI",
        ]}
        className="bg-surface/40"
        textClassName="font-display text-4xl text-foreground/80 md:text-6xl"
      />

      <div className="relative">
        <SectionShape shape="figure" />
        <AboutSection />
      </div>

      <div className="relative">
        <SectionShape shape="bars" />
        <StatsSection />
      </div>

      <ScrollHighlightText
        eyebrow="Mission"
        text="I build intelligent systems that turn messy, real-world data into reliable decisions — and I publish the datasets and methods so others can build on them too."
      />

      <div className="relative">
        <SectionShape shape="leaf" />
        <FeaturedPublicationSection publication={publication} />
      </div>

      <div className="relative">
        <SectionShape shape="helix" />
        <ResearchAreasSection areas={areas} />
      </div>

      <div className="relative">
        <SectionShape shape="lattice" />
        <FeaturedProjectsSection projects={projects} />
      </div>

      <ParallaxBanner
        image="https://picsum.photos/seed/shakib-vision/1920/1080"
        eyebrow="Approach"
        headline="Research-grade rigor, product-grade craft."
        subtext="Every project is shipped end-to-end and every result is reproducible — the same standards whether it’s a paper or a platform."
      />

      <div className="relative">
        <SectionShape shape="atom" />
        <SkillsSection />
      </div>

      <VelocityMarquee
        items={["Let’s build something", "Let’s research together", "Open to collaboration"]}
        baseVelocity={2}
        className="border-y border-border"
        textClassName="font-display text-4xl text-gradient-accent md:text-6xl"
      />

      <div className="relative">
        <SectionShape shape="trend" />
        <AchievementsSection achievements={achievements} />
      </div>

      <div className="relative">
        <SectionShape shape="envelope" />
        <ContactSection />
      </div>
    </>
  );
}
