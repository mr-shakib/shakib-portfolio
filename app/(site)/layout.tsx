import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ParticleField } from "@/components/shared/ParticleField";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      {/* Single fixed constellation field behind the page. The opaque cream
          hero, volt bands and olive footer cover it; the transparent dark
          sections below the hero reveal it as one continuous ambient layer. */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0">
        <ParticleField className="opacity-60" />
      </div>

      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <MobileMenu />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer />
    </SmoothScrollProvider>
  );
}
