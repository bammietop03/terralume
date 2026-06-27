import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Zap, MapPin } from "lucide-react";

export function HeroSectionV2() {
  return (
    <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
      {/* Background image */}
      <Image
        src="/images/hero.png"
        alt="Lagos aerial cityscape"
        fill
        className="object-cover object-center scale-105"
        priority
        quality={90}
      />

      {/* Multi-layer dark overlay for premium feel */}
      {/* <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#060c18] via-[#060c18]/80 to-[#060c18]/30"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-[#060c18]/60 via-transparent to-[#060c18]/20"
      /> */}
      <div className="absolute inset-0 bg-linear-to-b from-navy-dark/70 via-navy-dark/60 to-navy-dark/90" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-dark/50 to-transparent" />
      {/* Subtle noise texture overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pb-24 pt-40 lg:px-12 lg:pb-32">
        {/* Eyebrow tag */}
        <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-5 py-2 backdrop-blur-sm">
          <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/75">
            Real Estate Intelligence &amp; Renewable Energy — Nigeria
          </span>
        </div>

        {/* Headline */}
        <h1 className="max-w-4xl font-display text-5xl font-bold leading-[1.06] text-white lg:text-[66px] xl:text-[76px]">
          Intelligent Real Estate.{" "}
          <span className="text-gold">Reliable Energy.</span>
          {/* <span className="text-gold [text-shadow:0_0_20px_rgba(255,255,255,0.5)]">
            Reliable Energy.
          </span> */}
          <br />
          <span className="text-white/85">One Integrated Strategy.</span>
        </h1>

        {/* Subheadline */}
        <p className="mt-7 max-w-2xl text-[18px] leading-relaxed text-white/60">
          Terralume combines data-driven property acquisition with clean energy
          infrastructure — helping investors and developers build
          high-performance assets across Nigeria.
        </p>
        <div className="hidden lg:block h-6 w-px bg-white/15" />
        <div className="flex items-center gap-2">
          <MapPin size={15} className="text-gold shrink-0" />
          <span className="text-[14px] text-white uppercase tracking-[0.12em]">
            Lagos &middot; Abuja &middot; Port Harcourt
          </span>
        </div>

        {/* Dual CTAs */}
        <div className="mt-12 flex flex-wrap gap-4">
          <Button
            asChild
            size="lg"
            className="bg-crimson hover:bg-crimson-dark text-white border border-white/20 gap-2 px-7 h-13 text-[15px]"
          >
            <Link href="#real-estate">
              <Building2 size={17} />
              Explore Real Estate
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-white hover:bg-white/85 text-navy border border-white/20 font-semibold gap-2 px-7 h-13 text-[15px]"
          >
            <Link href="#energy">
              <Zap size={17} />
              Explore Energy
              <ArrowRight size={15} className="ml-1" />
            </Link>
          </Button>
        </div>

        {/* Divider metrics bar */}
        <div className="mt-20 flex flex-wrap items-center gap-x-10 gap-y-5 border-t border-white/10 pt-9">
          <HeroMetric value="120+" label="Transactions" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="67" label="Active Clients" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="12%" label="Avg. ROI Range" />
          <div className="hidden sm:block h-6 w-px bg-white/15" />
          <HeroMetric value="4.5/5" label="Client Satisfaction" />
          <div className="hidden lg:block h-6 w-px bg-white/15" />
          <div className="flex items-center gap-2.5">
            <span className="h-1.5 w-1.5 rounded-full bg-white/40" />
            <span className="text-[12px] text-white/50 uppercase tracking-widest">
              CAC &amp; LASRERA Registered
            </span>
          </div>
          <div className="hidden lg:block h-6 w-px bg-white/15" />
          {/* <div className="flex items-center gap-2">
            <MapPin size={13} className="text-gold shrink-0" />
            <span className="text-[12px] text-white/50 uppercase tracking-[0.12em]">
              Lagos &middot; Abuja &middot; Port Harcourt
            </span>
          </div> */}
        </div>
      </div>
    </section>
  );
}

function HeroMetric({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-display text-3xl font-bold text-white leading-none">
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-widest text-white/45">
        {label}
      </span>
    </div>
  );
}
