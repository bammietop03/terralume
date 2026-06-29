import Link from "next/link";
import { Building2, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const reSteps = [
  {
    label: "Intake",
    detail: "Submit your brief — property type, budget, location.",
  },
  {
    label: "Four-Pillar Evaluation",
    detail:
      "Title, Financial Implication, Economic Implication & Exit strategy.",
  },
  {
    label: "Curated Shortlist",
    detail: "Verified, off-market options matched to your criteria.",
  },
  {
    label: "Optional Energy Add-on",
    detail: "Energy infrastructure layered in where relevant.",
  },
  {
    label: "Acquisition Managed",
    detail: "Negotiation, title checks, legal review, completion.",
  },
  {
    label: "Delivered",
    detail: "Documentation, handover, and post-acquisition report.",
  },
];

const energySteps = [
  {
    label: "Needs Assessment",
    detail: "We audit current energy costs and load profile.",
  },
  {
    label: "Consultation",
    detail: "An energy consultant reviews findings with you.",
  },
  {
    label: "Product Matching",
    detail: "Solutions matched from our infrastructure database.",
  },
  {
    label: "Costed Proposal",
    detail: "Specs, savings projections, and subscription options.",
  },
  {
    label: "Deployment & Monitoring",
    detail: "Installation and ongoing performance management.",
  },
];

export function LifecycleSection() {
  return (
    <section className="bg-surface pb-28 lg:pb-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-8 bg-gold" />
            How We Work
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
            One Process.{" "}
            <span className="italic text-gold">Two Starting Points.</span>
          </h2>
          <p className="mt-5 text-[17px] leading-relaxed text-on-surface-muted">
            Whether you begin with a property brief or an energy challenge — one
            team manages your full journey from intake to delivery.
          </p>
        </div>

        {/* Two tracks */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {/* Real Estate Track */}
          <div className="rounded-2xl border border-divider overflow-hidden">
            <div className="relative bg-navy px-7 py-6">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/20 to-transparent"
              />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 border border-gold/25">
                  <Building2 size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                    Track A
                  </p>
                  <p className="font-display text-[17px] font-semibold text-white">
                    If you start with property
                  </p>
                </div>
              </div>
            </div>
            <ol className="divide-y divide-divider bg-surface-card">
              {reSteps.map((s, i) => (
                <li key={s.label} className="flex items-start gap-4 px-7 py-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-light text-[10px] font-bold text-navy">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-navy">
                      {s.label}
                    </p>
                    <p className="text-[13px] text-on-surface-muted">
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          {/* Energy Track */}
          <div className="rounded-2xl border border-divider overflow-hidden">
            <div className="relative bg-navy-dark px-7 py-6">
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/20 to-transparent"
              />
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/15 border border-gold/25">
                  <Zap size={16} className="text-gold" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-white/50">
                    Track B
                  </p>
                  <p className="font-display text-[17px] font-semibold text-white">
                    If you start with energy
                  </p>
                </div>
              </div>
            </div>
            <ol className="divide-y divide-divider bg-surface-card">
              {energySteps.map((s, i) => (
                <li key={s.label} className="flex items-start gap-4 px-7 py-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy-light text-[10px] font-bold text-navy">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-navy">
                      {s.label}
                    </p>
                    <p className="text-[13px] text-on-surface-muted">
                      {s.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Either way callout */}
        <div className="mt-8 flex flex-col items-center gap-5 rounded-2xl border border-navy/15 bg-navy-light px-8 py-8 text-center sm:flex-row sm:text-left sm:gap-8">
          <div className="flex-1">
            <p className="font-display text-[18px] font-semibold text-navy">
              Either way — your file lives in one dashboard, with one Terralume
              team behind it.
            </p>
            <p className="mt-2 text-[14px] text-on-surface-muted">
              Client Relations for first contact · Operations for evaluation
              &amp; acquisition · Finance &amp; Compliance for contracts
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 border-navy/25"
          >
            <Link href="/how-it-works">
              Full Process Detail
              <ArrowRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
