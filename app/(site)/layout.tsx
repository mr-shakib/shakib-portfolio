import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import { Navbar } from "@/components/layout/Navbar";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { Footer } from "@/components/layout/Footer";
import { ScrollProgress } from "@/components/layout/ScrollProgress";
import { CustomCursor } from "@/components/layout/CustomCursor";
import { BackgroundScene } from "@/components/three/BackgroundScene";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <SmoothScrollProvider>
      <BackgroundScene />
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
