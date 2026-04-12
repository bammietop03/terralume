import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck } from "lucide-react";

export function FooterCTA() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-44">
      {/* Background image */}
      <Image
        src="/images/image1.jpg"
        alt="Lagos premium property"
        fill
        className="object-cover object-center"
        quality={85}
      />
      {/* Dark overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-[#060c18] via-[#060c18]/80 to-[#060c18]/50"
      />
      {/* Left vignette */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-r from-[#060c18]/60 via-transparent to-transparent"
      />

      <div className="relative z-10 mx-auto max-w-4xl px-6 text-center lg:px-12">
        <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
          <span className="h-px w-8 bg-crimson" />
          Ready to start?
          <span className="h-px w-8 bg-crimson" />
        </p>
        <h2 className="font-display text-5xl font-bold leading-tight text-white lg:text-6xl">
          Buy or rent in Lagos{" "}
          <span className="italic text-crimson">the right way.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-[17px] leading-relaxed text-white/60">
          Don&apos;t navigate the Lagos property market alone. Let Terralume put
          an expert buyer&apos;s agent in your corner from day one.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" variant="primary">
            <Link href="/get-started">
              Start Your Enquiry
              <ArrowRight size={16} />
            </Link>
          </Button>
        </div>

        {/* Trust signals */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-6 border-t border-white/10 pt-10">
          <div className="flex items-center gap-2 text-[13px] text-white/50">
            <ShieldCheck size={14} className="text-crimson" />
            LASRERA Registered
          </div>
          <div className="h-4 w-px bg-white/15" />
          <div className="flex items-center gap-2 text-[13px] text-white/50">
            <ShieldCheck size={14} className="text-crimson" />
            CAC Registered
          </div>
          <div className="h-4 w-px bg-white/15" />
          <span className="text-[13px] text-white/30">
            Initial consultation is free — no commitment required.
          </span>
        </div>
      </div>
    </section>
  );
}
