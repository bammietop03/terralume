import Link from "next/link";
import { Factory, Home, Zap, Network, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Factory,
    number: "01",
    title: "Commercial Energy Management",
    description:
      "For office complexes, retail centres, and commercial developments — we assess energy demand, design solar-hybrid systems, and manage ongoing performance. Tenants get stable power; owners get premium positioning.",
    highlights: [
      "Load analysis & system sizing",
      "Grid-tie and off-grid hybrid options",
      "Performance monitoring & maintenance",
    ],
    accent: "gold",
  },
  {
    icon: Home,
    number: "02",
    title: "Estate Energy Systems",
    description:
      "We deliver end-to-end power infrastructure for residential estates — from shared solar installations to individual unit solutions — eliminating generator dependency and reducing service charges.",
    highlights: [
      "Shared solar infrastructure design",
      "Battery storage systems",
      "Estate-wide cost reduction",
    ],
    accent: "navy",
  },
  {
    icon: Zap,
    number: "03",
    title: "Energy Upgrade",
    description:
      "For properties already built but running on diesel or unreliable grid supply — we audit, design, and implement clean energy upgrades that reduce costs and increase asset value.",
    highlights: [
      "Energy audit & baseline reporting",
      "Solar retrofit design",
      "ROI-focused upgrade planning",
    ],
    accent: "gold",
  },
  {
    icon: Network,
    number: "04",
    title: "Mini Grid Development",
    description:
      "For developers and investors building in underserved corridors, we design and deploy independent mini grids — creating self-sufficient energy communities that serve as both infrastructure and revenue streams.",
    highlights: [
      "Site feasibility & licensing",
      "Grid design & construction",
      "Revenue model structuring",
    ],
    accent: "navy",
  },
];

export function EnergyDetailSection() {
  return (
    <section
      id="energy-detail"
      className="bg-surface py-28 lg:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Division 02
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
              Energy Infrastructure,{" "}
              <em className="italic text-gold">Delivered as a Service</em>
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:ml-auto lg:max-w-sm">
            <p className="text-[17px] leading-relaxed text-on-surface-muted">
              Clean energy infrastructure without the capital burden. We handle
              design, deployment, and ongoing management — you own
              better-performing assets.
            </p>
            <div>
              <Button asChild variant="default" size="sm">
                <Link href="/energy">
                  Explore energy solutions
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Key differentiators bar */}
        <div className="mb-12 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "No upfront cost model available",
              detail: "Subscription-based access to clean energy systems",
            },
            {
              label: "Cost savings vs diesel",
              detail: "Typically 40–65% reduction in energy expenditure",
            },
            {
              label: "Managed service",
              detail: "We monitor, maintain, and optimise — ongoing",
            },
          ].map((d) => (
            <div
              key={d.label}
              className="flex items-start gap-3 rounded-xl border border-navy/20 bg-navy-light px-5 py-4"
            >
              <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-navy">
                <Check size={11} className="text-white" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-navy">{d.label}</p>
                <p className="mt-0.5 text-[12px] text-on-surface-muted">
                  {d.detail}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {services.map((s) => {
            const Icon = s.icon;
            const isgold = s.accent === "gold";
            return (
              <div
                key={s.number}
                className="flex flex-col overflow-hidden rounded-3xl border border-divider bg-surface-card"
              >
                {/* Card header */}
                <div className="relative overflow-hidden bg-navy px-7 py-6">
                  <div
                    aria-hidden
                    className={`absolute inset-x-0 top-0 h-0.5 ${isgold ? "bg-linear-to-r from-gold/60 via-gold/20 to-transparent" : "bg-linear-to-r from-gold/50 via-gold/15 to-transparent"}`}
                  />
                  <div
                    aria-hidden
                    className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl ${isgold ? "bg-gold/15" : "bg-gold/10"}`}
                  />
                  <div className="relative flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border ${isgold ? "border-gold/30 bg-gold/15" : "border-gold/30 bg-gold/15"}`}
                    >
                      <Icon
                        size={18}
                        className={isgold ? "text-gold" : "text-gold"}
                      />
                    </div>
                    <div>
                      <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                        {s.number}
                      </span>
                      <h3 className="font-display text-[18px] font-bold text-white leading-tight">
                        {s.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Card body */}
                <div className="flex flex-1 flex-col px-7 py-6">
                  <p className="mb-5 flex-1 text-[14px] leading-relaxed text-on-surface-muted">
                    {s.description}
                  </p>
                  <ul className="space-y-2.5">
                    {s.highlights.map((h) => (
                      <li key={h} className="flex items-center gap-2.5">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                        <span className="text-[13px] text-on-surface-muted">
                          {h}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
