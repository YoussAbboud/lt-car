import { SiteHeader } from "@/components/site-header";
import { HeroAndGrid } from "@/components/hero-and-grid";
import { DualCta, SiteFooter, ValueProps } from "@/components/landing-sections";

export default function LandingPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroAndGrid />
        <DualCta />
        <ValueProps />
      </main>
      <SiteFooter />
    </>
  );
}
