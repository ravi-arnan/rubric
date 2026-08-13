import { SiteHeader } from "@/components/site/SiteHeader";
import { FirstFold, HeroSection } from "@/components/site/HeroSection";
import { StatsRow } from "@/components/site/StatsRow";
import { AuditPanel } from "@/components/site/AuditPanel";
import { PlatformSection } from "@/components/site/PlatformSection";
import { CodeSection } from "@/components/site/CodeSection";
import { ProofSection } from "@/components/site/ProofSection";
import { CtaSection } from "@/components/site/CtaSection";
import { SiteFooter } from "@/components/site/SiteFooter";
import { Reveal } from "@/components/site/Reveal";

/** Landing page. */
export default function Home() {
  return (
    <div className="relative bg-bx-void">
      {/* Mounted once so every section below can stay a server component and opt into
          motion with plain data-rise / data-reveal attributes. */}
      <Reveal />
      <SiteHeader />
      <main>
        {/* FirstFold is load-bearing, not a wrapper for tidiness: the hero is `flex:auto`
            inside it, which is what makes hero + stats fill exactly 100svh together. */}
        <FirstFold>
          <HeroSection />
          <StatsRow />
        </FirstFold>
        {/* The product itself, directly under the fold. */}
        <AuditPanel />
        <PlatformSection />
        <CodeSection />
        <ProofSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </div>
  );
}
