import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    name: "Starter",
    tag: "Rental Advisory",
    forWho: "First-time renters & relocations",
    priceFrom: "₦150,000",
    inclusions: [
      "Property search & shortlist",
      "Landlord background check",
      "Lease review & negotiation",
      "Move-in inspection report",
    ],
    cta: "Get started",
    highlight: false,
  },
  {
    name: "Standard",
    tag: "Purchase Advisory",
    forWho: "First-time buyers & upgraders",
    priceFrom: "₦350,000",
    inclusions: [
      "Everything in Starter",
      "Title verification report",
      "Independent property valuation",
      "Price negotiation & legal support",
      "Completion management",
    ],
    cta: "Get started",
    highlight: true,
  },
  {
    name: "Premium",
    tag: "Investment Advisory",
    forWho: "HNW investors & diaspora buyers",
    priceFrom: "₦750,000",
    inclusions: [
      "Everything in Standard",
      "Off-market deal access",
      "Yield & ROI analysis",
      "Portfolio strategy session",
      "Dedicated Project Manager",
      "Priority support & reporting",
    ],
    cta: "Talk to us",
    highlight: false,
  },
];

export function ServiceTiersPreview() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              Services
            </p>
            <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
              Choose the right tier
            </h2>
            <p className="mt-4 text-[17px] text-on-surface-muted">
              Purpose-built packages for every type of buyer.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/services">See all services</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-all xl:p-10",
                tier.highlight
                  ? "border-navy bg-navy shadow-2xl md:scale-[1.02]"
                  : "border-divider bg-surface hover:shadow-lg hover:border-navy/20",
              )}
            >
              {tier.highlight && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -top-px h-0.5 rounded-t-2xl bg-linear-to-r from-crimson via-crimson/50 to-transparent"
                />
              )}

              {/* Most popular badge */}
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tag */}
              <span
                className={cn(
                  "mb-4 text-[11px] font-semibold uppercase tracking-widest",
                  tier.highlight ? "text-white/45" : "text-on-surface-muted",
                )}
              >
                {tier.tag}
              </span>

              {/* Tier name */}
              <h3
                className={cn(
                  "font-display text-3xl font-bold",
                  tier.highlight ? "text-white" : "text-navy",
                )}
              >
                {tier.name}
              </h3>
              <p
                className={cn(
                  "mt-1.5 text-[14px]",
                  tier.highlight ? "text-white/55" : "text-on-surface-muted",
                )}
              >
                {tier.forWho}
              </p>

              {/* Price */}
              <div
                className={cn(
                  "my-8 border-t border-b py-6",
                  tier.highlight ? "border-white/10" : "border-divider",
                )}
              >
                <span
                  className={cn(
                    "mb-1 block text-[11px] font-semibold uppercase tracking-widest",
                    tier.highlight ? "text-white/30" : "text-on-surface-muted",
                  )}
                >
                  Advisory fee from
                </span>
                <span
                  className={cn(
                    "font-display text-4xl font-bold",
                    tier.highlight ? "text-white" : "text-navy",
                  )}
                >
                  {tier.priceFrom}
                </span>
              </div>

              {/* Inclusions */}
              <ul className="mb-8 flex-1 space-y-3.5">
                {tier.inclusions.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[14px]">
                    <Check
                      size={15}
                      className={cn(
                        "mt-0.5 shrink-0",
                        tier.highlight ? "text-crimson" : "text-navy",
                      )}
                    />
                    <span
                      className={
                        tier.highlight ? "text-white/70" : "text-on-surface"
                      }
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Button
                asChild
                variant={tier.highlight ? "white" : "primary"}
                className="w-full"
              >
                <Link href="/get-started">
                  {tier.cta}
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
