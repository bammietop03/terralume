import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, CalendarDays } from "lucide-react";

export function BuildSmartCTA() {
  return (
    <section className="relative overflow-hidden py-36 lg:py-48">
      {/* Background image */}
      <Image
        src="/images/image1.jpg"
        alt="Premium Nigerian real estate"
        fill
        className="object-cover object-center"
        quality={85}
      />
      {/* Dark overlay — deep navy gradient */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#060c18] via-[#060c18]/85 to-[#060c18]/55"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-[#060c18]/70 via-transparent to-[#060c18]/40"
      />

      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center lg:px-12">
        {/* Eyebrow */}
        <p className="mb-7 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
          <span className="h-px w-10 bg-gold" />
          Partner with Terralume
          <span className="h-px w-10 bg-gold" />
        </p>

        {/* Headline */}
        <h2 className="font-display text-5xl font-bold leading-tight text-white lg:text-6xl xl:text-[68px]">
          Build Smarter <span className="italic text-gold">Assets</span>
        </h2>

        {/* Subtext */}
        <p className="mx-auto mt-7 max-w-xl text-[18px] leading-relaxed text-white/55">
          Partner with Terralume for intelligent real estate and reliable
          infrastructure — one integrated strategy for high-performance
          investments.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="bg-gold hover:bg-gold-dark text-white font-semibold gap-2.5 px-8 h-14 text-[16px]"
          >
            <Link href="/consultation">
              <CalendarDays size={18} />
              Book a Consultation
              <ArrowRight size={16} className="ml-0.5" />
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/25 text-navy-dark hover:bg-white/8 hover:text-white gap-2.5 px-8 h-14 text-[16px]"
          >
            <Link href="/about">Learn About Terralume</Link>
          </Button>
        </div>

        {/* Trust note */}
        <p className="mt-10 text-[12px] uppercase tracking-widest text-white/30">
          CAC &amp; LASRERA Registered · Lagos, Nigeria
        </p>
      </div>
    </section>
  );
}
