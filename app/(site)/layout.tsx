import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { ViewTracker } from "@/components/layout/ViewTracker";
import { ParticleField } from "@/components/shared/ParticleField";
import { Loader } from "@/components/sections/Loader";
import { getSection } from "@/lib/data/sections";

/**
 * Pages render per request so edits made in /admin show up immediately. The
 * database reads themselves are cached (src/lib/data/cache.ts) and cleared on
 * every admin save, so this stays cheap — and the build never needs a database.
 */
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [hero, footer, profile] = await Promise.all([
    getSection("hero"),
    getSection("footer"),
    getSection("profile"),
  ]);

  return (
    <SmoothScrollProvider>
      {/* Single fixed constellation field behind the page. The opaque cream
          hero, volt bands and olive footer cover it; the transparent dark
          sections below the hero reveal it as one continuous ambient layer.
          Radially masked so particles stay dense at the viewport edges and
          thin out behind the central reading column. */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 [mask-image:radial-gradient(120%_120%_at_50%_50%,transparent_30%,black_78%)]"
      >
        <ParticleField className="opacity-40" />
      </div>

      {/* Lives outside <main> so its overlay stacks above the navbar; it only plays on the home page. */}
      <Loader name={`${hero.firstName} ${hero.lastName}`} />
      <ViewTracker />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <MobileMenu />
      <main id="main" className="relative z-10">
        {children}
      </main>
      <Footer content={footer} profile={profile} />
    </SmoothScrollProvider>
  );
}
