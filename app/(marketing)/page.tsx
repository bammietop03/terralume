import { HeroSectionV2 } from "@/components/home/HeroSectionV2";
import { BigIdeaSection } from "@/components/home/BigIdeaSection";
import { IntegratedModelSection } from "@/components/home/IntegratedModelSection";
import { RealEstateDetailSection } from "@/components/home/RealEstateDetailSection";
import { EnergyDetailSection } from "@/components/home/EnergyDetailSection";
import { LifecycleSection } from "@/components/home/LifecycleSection";
import { WhoWeServeSection } from "@/components/home/WhoWeServeSection";
import { ProofMetricsSection } from "@/components/home/ProofMetricsSection";
import { InsightsTeaserSection } from "@/components/home/InsightsTeaserSection";
import { BuildSmartCTA } from "@/components/home/BuildSmartCTA";
import { HeroSection } from "@/components/home/HeroSection";

export default function Home() {
  return (
    <main className="flex flex-col flex-1">
      {/* <HeroSection /> */}
      <HeroSectionV2 />
      <BigIdeaSection />
      <IntegratedModelSection />
      <RealEstateDetailSection />
      <EnergyDetailSection />
      <LifecycleSection />
      <WhoWeServeSection />
      <ProofMetricsSection />
      <InsightsTeaserSection />
      <BuildSmartCTA />
    </main>
  );
}
