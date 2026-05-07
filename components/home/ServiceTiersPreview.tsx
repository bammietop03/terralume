import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface DbTier {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
}

interface Props {
  tiers?: DbTier[];
}

// ─── Static enrichment (non-dynamic content per slug) ────────────────────────

type TierStatic = {
  tag: string;
  highlight: boolean;
  forWhoSummary: string;
  inclusions: string[];
  cta: string;
};

const TIER_STATIC: Record<string, TierStatic> = {
  starter: {
    tag: "Rental Advisory",
    highlight: false,
    forWhoSummary: "First-time renters & relocations",
    inclusions: [
      "Property search & shortlist",
      "Landlord background check",
      "Lease review & negotiation",
      "Move-in inspection report",
    ],
    cta: "Get started",
  },
  standard: {
    tag: "Purchase Advisory",
    highlight: true,
    forWhoSummary: "First-time buyers & upgraders",
    inclusions: [
      "Everything in Starter",
      "Title verification report",
      "Independent property valuation",
      "Price negotiation & legal support",
      "Completion management",
    ],
    cta: "Get started",
  },
  premium: {
    tag: "Investment Advisory",
    highlight: false,
    forWhoSummary: "HNW investors & diaspora buyers",
    inclusions: [
      "Everything in Standard",
      "Off-market deal access",
      "Yield & ROI analysis",
      "Portfolio strategy session",
      "Dedicated Project Manager",
      "Priority support & reporting",
    ],
    cta: "Talk to us",
  },
  corporate: {
    tag: "Corporate Relocation",
    highlight: false,
    forWhoSummary: "Multinationals & large employers",
    inclusions: [
      "Dedicated corporate account manager",
      "Unlimited briefs within contract",
      "Priority processing (48-hour SLA)",
      "Centralised HR reporting dashboard",
    ],
    cta: "Talk to us",
  },
  "diaspora-remote": {
    tag: "Remote End-to-End",
    highlight: false,
    forWhoSummary: "Overseas Nigerians buying in Lagos",
    inclusions: [
      "Full remote onboarding via video call",
      "Video walkthroughs for every property",
      "UK/US/UAE timezone-compatible support",
      "Fraud prevention & vendor verification",
    ],
    cta: "Get started",
  },
};

// ─── Fallback static tiers (shown when DB is unavailable) ────────────────────

const FALLBACK_TIERS: DbTier[] = [
  {
    id: "starter",
    name: "Starter",
    slug: "starter",
    description:
      "Expert guidance for renters and relocations — without the agent games.",
    price: 150_000,
    currency: "NGN",
  },
  {
    id: "standard",
    name: "Standard",
    slug: "standard",
    description:
      "Full buyer representation for property purchases up to ₦100 million.",
    price: 350_000,
    currency: "NGN",
  },
  {
    id: "premium",
    name: "Premium",
    slug: "premium",
    description:
      "Portfolio-grade acquisition support for HNW investors and repeat buyers.",
    price: 750_000,
    currency: "NGN",
  },
];

// ─── Helper ───────────────────────────────────────────────────────────────────

function formatPrice(price: number, currency: string) {
  if (currency === "NGN") return `₦${price.toLocaleString("en-NG")}`;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

// ─── Component ────────────────────────────────────────────────────────────────

export function ServiceTiersPreview({ tiers: dbTiers }: Props) {
  // Use the first 3 active tiers that have static enrichment; fall back to hardcoded
  const source = dbTiers && dbTiers.length > 0 ? dbTiers : FALLBACK_TIERS;
  const displayTiers = source
    .filter((t) => TIER_STATIC[t.slug])
    .slice(0, 3)
    .map((t) => ({ ...t, ...TIER_STATIC[t.slug]! }));

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
          {displayTiers.map((tier) => (
            <div
              key={tier.slug}
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

              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-crimson px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Tag — static */}
              <span
                className={cn(
                  "mb-4 text-[11px] font-semibold uppercase tracking-widest",
                  tier.highlight ? "text-white/45" : "text-on-surface-muted",
                )}
              >
                {tier.tag}
              </span>

              {/* Name — dynamic */}
              <h3
                className={cn(
                  "font-display text-3xl font-bold",
                  tier.highlight ? "text-white" : "text-navy",
                )}
              >
                {tier.name}
              </h3>

              {/* For who — static */}
              <p
                className={cn(
                  "mt-1.5 text-[14px]",
                  tier.highlight ? "text-white/55" : "text-on-surface-muted",
                )}
              >
                {tier.forWhoSummary}
              </p>

              {/* Price — dynamic */}
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
                  {formatPrice(tier.price, tier.currency)}
                </span>
              </div>

              {/* Inclusions preview — static */}
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

              {/* CTA — static */}
              <Button
                asChild
                variant={tier.highlight ? "default" : "secondary"}
                className="w-full"
              >
                <Link href="/consultation">
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
