import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { tiers } from "@/lib/services-data";
import { FooterCTA } from "@/components/home/FooterCTA";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "Services | Terralume",
  description:
    "Choose the right advisory package for your Lagos property journey — from rental guidance to high-value investment acquisition.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Advisory Packages"
        title={
          <>
            Transparent. Fixed. <br className="hidden sm:block" />
            <em className="italic text-crimson">Entirely on your side.</em>
          </>
        }
        description="Every package is structured around your interests as a buyer or renter — never the seller's. Choose the level that fits your transaction."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Services" }]}
        minHeight="52vh"
      />

      {/* ── Tier cards ───────────────────────────────────────── */}
      <section className="bg-surface-alt py-20">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.slug}
                className={`relative flex flex-col rounded-2xl border bg-surface transition-shadow hover:shadow-lg ${
                  tier.highlight
                    ? "border-navy shadow-md md:scale-[1.02]"
                    : "border-divider"
                }`}
              >
                {/* Top crimson accent */}
                {tier.highlight && (
                  <div className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-crimson" />
                )}

                {tier.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-crimson px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
                      Most popular
                    </span>
                  </div>
                )}

                <div className="flex flex-1 flex-col p-7">
                  {/* Tag */}
                  <div className="mb-5 flex items-center gap-2">
                    <span className="rounded-full bg-navy-light px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-navy">
                      {tier.tag}
                    </span>
                  </div>

                  <h2 className="mb-1 font-display text-2xl font-bold text-navy">
                    {tier.name}
                  </h2>
                  <p className="mb-6 text-[14px] leading-relaxed text-on-surface-muted">
                    {tier.tagline}
                  </p>

                  {/* Price */}
                  <div className="mb-6 border-b border-divider pb-6">
                    <p className="mb-0.5 text-[11px] uppercase tracking-widest text-on-surface-muted">
                      Advisory fee from
                    </p>
                    <p className="font-display text-3xl font-bold text-navy">
                      {tier.priceFrom}
                    </p>
                    <p className="text-[13px] text-on-surface-muted">
                      {tier.priceSuffix}
                    </p>
                  </div>

                  {/* Inclusions preview (first 4) */}
                  <ul className="mb-6 space-y-2.5 flex-1">
                    {tier.inclusions.slice(0, 4).map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2.5 text-[14px] text-on-surface"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-crimson" />
                        {item}
                      </li>
                    ))}
                    {tier.inclusions.length > 4 && (
                      <li className="text-[13px] text-on-surface-muted pl-6.5">
                        + {tier.inclusions.length - 4} more inclusions
                      </li>
                    )}
                  </ul>

                  {/* CTA */}
                  <div className="mt-auto flex flex-col gap-2">
                    <Link
                      href={`/services/${tier.slug}`}
                      className="flex items-center justify-center gap-2 rounded-lg bg-navy px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-navy-dark"
                    >
                      View full details
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/contact"
                      className="flex items-center justify-center gap-2 rounded-lg border border-divider px-5 py-3 text-[14px] font-semibold text-navy transition-colors hover:border-navy/40 hover:bg-surface-card"
                    >
                      Start your enquiry
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust strip ──────────────────────────────────────── */}
      <section className="border-y border-divider bg-surface py-12">
        <div className="container mx-auto max-w-4xl px-6 text-center">
          <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
            Why buyers choose Terralume
          </p>
          <div className="grid gap-8 sm:grid-cols-3">
            {[
              {
                stat: "100%",
                label: "Buyer-side only",
                sub: "We never represent a seller or landlord",
              },
              {
                stat: "Fixed fee",
                label: "No hidden commissions",
                sub: "You know the cost before we start",
              },
              {
                stat: "LASRERA",
                label: "Regulated & verified",
                sub: "Licensed by the Lagos State Real Estate Regulatory Authority",
              },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <p className="font-display text-3xl font-bold text-navy">
                  {item.stat}
                </p>
                <p className="text-[14px] font-semibold text-on-surface">
                  {item.label}
                </p>
                <p className="text-[13px] text-on-surface-muted">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
