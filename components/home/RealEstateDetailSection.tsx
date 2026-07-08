import Link from "next/link";
import {
  Search,
  BarChart3,
  MapPin,
  Lightbulb,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  {
    icon: Search,
    number: "01",
    title: "Acquisition",
    description:
      "We access off-market inventory unavailable through public listings — sourced through an established network of developers, estate managers, and institutional sellers.",
    outcome:
      "Properties sourced before they reach the market, at better terms.",
    accent: "gold",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Intelligence",
    description:
      "Every property undergoes independent due diligence: title verification (C of O, Deed of Assignment, Governor's Consent), survey confirmation, encumbrance checks, and structural assessments.",
    outcome:
      "Zero surprises after commitment. Full legal and physical clarity.",
    accent: "navy",
  },
  {
    icon: MapPin,
    number: "03",
    title: "Market Analysis",
    description:
      "Proprietary pricing data across Lekki, Ikoyi, Victoria Island, and emerging corridors gives clients a negotiation advantage. We don't rely on asking prices — we know market values.",
    outcome:
      "Evidence-based negotiation that consistently closes below asking.",
    accent: "gold",
  },
  {
    icon: Lightbulb,
    number: "04",
    title: "Strategic Advisory",
    description:
      "For investors, developers, and diaspora clients — we translate financial objectives into property briefs, evaluate ROI scenarios, and identify portfolio opportunities aligned with growth strategy.",
    outcome: "A property strategy, not just a property transaction.",
    accent: "navy",
  },
  {
    icon: TrendingUp,
    number: "05",
    title: "Exit Strategy",
    description:
      "From the moment of acquisition, we structure an exit plan — whether resale, rental yield optimisation, or development conversion — to maximise long-term asset performance.",
    outcome: "Assets acquired with a destination in mind, not just a price.",
    accent: "gold",
  },
];

export function RealEstateDetailSection() {
  return (
    <section
      id="real-estate-detail"
      className="bg-surface-alt py-28 lg:py-36 overflow-hidden"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Division 01
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
              Real Estate, Done{" "}
              <em className="italic text-gold">with Intelligence</em>
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:ml-auto lg:max-w-sm">
            <p className="text-[17px] leading-relaxed text-on-surface-muted">
              Our buyer-side approach covers the full acquisition lifecycle —
              from sourcing to settlement — with intelligence at every step.
            </p>
            <div>
              <Button asChild variant="default" size="sm">
                <Link href="/real-estate">
                  See how we evaluate
                  <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => {
            const Icon = s.icon;
            const isgold = s.accent === "gold";
            return (
              <div
                key={s.number}
                className="flex flex-col overflow-hidden rounded-3xl border border-divider bg-surface"
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
                  <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">
                    {s.description}
                  </p>
                  <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-navy-light px-4 py-2 self-start">
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-navy" />
                    <span className="text-[12px] font-medium text-navy">
                      {s.outcome}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
