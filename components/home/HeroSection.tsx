import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Award, ArrowRight } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.png"
        alt="Lagos premium residential property"
        fill
        className="object-cover object-center"
        priority
        quality={90}
      />

      {/* Layered gradient overlay: solid dark at bottom, transparent at top */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#060c18] via-[#060c18]/75 to-[#060c18]/20"
      />
      {/* Subtle side vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-[#060c18]/40 via-transparent to-transparent"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-20 pt-36 lg:px-12 lg:pb-28">
        {/* Eyebrow */}
        <div className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-1.5 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-crimson animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/80">
            Buyer-Side Real Estate Advisory · Lagos, Nigeria
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[1.08] text-white lg:text-[64px] xl:text-[72px]">
          Your property investment.{" "}
          <span className="text-crimson italic">Protected.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-6 max-w-lg text-[17px] leading-relaxed text-white/65">
          The only real estate advisory firm in Lagos that works exclusively for
          buyers — never sellers.
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/consultation">
              Get a Free Consultation
              <ArrowRight size={16} />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href="#how-it-works">See How It Works</a>
          </Button>
        </div>

        {/* Trust bar */}
        <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-5 border-t border-white/12 pt-8">
          <TrustBadge
            icon={<ShieldCheck size={15} />}
            label="LASRERA Registered"
          />
          <TrustBadge icon={<Award size={15} />} label="CAC Registered" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <TrustMetric value="67+" label="Deals Completed" />
          <TrustMetric value="₦2.4B+" label="Client Savings" />
          <TrustMetric value="4.3 / 5" label="Client Rating" />
        </div>
      </div>
    </section>
  );
}

function TrustBadge({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 text-sm text-white/70">
      <span className="text-crimson">{icon}</span>
      {label}
    </div>
  );
}

function TrustMetric({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <span className="block font-display text-2xl font-bold text-white leading-none">
        {value}
      </span>
      <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-white/45">
        {label}
      </span>
    </div>
  );
}
