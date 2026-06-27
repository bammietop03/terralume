import Link from "next/link";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterCTA() {
  return (
    <section className="bg-navy-dark py-20 lg:py-24">
      <div className="mx-auto max-w-5xl px-6 lg:px-12">
        <div className="flex flex-col items-center gap-8 text-center">
          <p className="inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
            <span className="h-px w-8 bg-crimson" />
            Get Started
            <span className="h-px w-8 bg-crimson" />
          </p>

          <h2 className="font-display text-4xl font-bold text-white lg:text-5xl">
            Ready to move forward?{" "}
            <em className="italic text-crimson">We&apos;re ready too.</em>
          </h2>

          <p className="max-w-xl text-[17px] leading-relaxed text-white/60">
            Whether you&apos;re buying a property, solving an energy problem, or
            both — start with a short intake and let Terralume manage the rest.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/consultation">
                Start an intake
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-navy hover:bg-white/10 hover:text-white"
            >
              <Link href="/contact">
                <CalendarDays size={16} className="mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>

          <p className="text-[12px] uppercase tracking-widest text-white/30">
            CAC &amp; LASRERA Registered · Lagos, Nigeria
          </p>
        </div>
      </div>
    </section>
  );
}
