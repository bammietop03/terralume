import { HeroSection } from "@/components/home/HeroSection";
import { ProblemSolutionSection } from "@/components/home/ProblemSolutionSection";
import { HowItWorksPreview } from "@/components/home/HowItWorksPreview";
import { ServiceTiersPreview } from "@/components/home/ServiceTiersPreview";
import { SocialProofSection } from "@/components/home/SocialProofSection";
import { MarketIntelligenceTeaser } from "@/components/home/MarketIntelligenceTeaser";
import { FooterCTA } from "@/components/home/FooterCTA";
import { getPublicServiceTiers } from "@/app/actions/service-tiers";

export default async function Home() {
  const tiers = await getPublicServiceTiers().catch(() => []);

  return (
    <main className="flex flex-col flex-1">
      <HeroSection />
      <ProblemSolutionSection />
      <HowItWorksPreview />
      <ServiceTiersPreview tiers={tiers} />
      <SocialProofSection />
      <MarketIntelligenceTeaser />
      <FooterCTA />
    </main>
  );
}
