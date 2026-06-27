import Link from "next/link";
import {
  Building2,
  Zap,
  Search,
  ShieldCheck,
  BarChart3,
  LogOut,
  Sun,
  Home,
  Factory,
  Network,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const reFeatures = [
  { icon: Search, label: "Off-market sourcing" },
  { icon: ShieldCheck, label: "Due diligence & title verification" },
  { icon: BarChart3, label: "Market intelligence" },
  { icon: LogOut, label: "Exit strategy" },
];

const energyFeatures = [
  { icon: Sun, label: "Solar hybrid systems (subscription)" },
  { icon: Home, label: "Estate energy infrastructure" },
  { icon: Factory, label: "Commercial energy solutions" },
  { icon: Network, label: "Mini grid development" },
];

export function IntegratedModelSection() {
  return (
    <section className="bg-surface pb-28 lg:pb-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-20 text-center max-w-3xl mx-auto">
          <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-8 bg-gold" />
            The Terralume Model
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
            Two Divisions.{" "}
            <span className="italic text-gold">One Outcome:</span> Better Assets
          </h2>
          <p className="mt-6 text-[17px] leading-relaxed text-on-surface-muted">
            Each division is a specialist capability. Together, they create the
            most complete investment partnership in Nigeria.
          </p>
        </div>

        {/* Two cards + connector */}
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[1fr_auto_1fr]">
          {/* Real Estate Card */}
          <div
            id="real-estate"
            className="relative overflow-hidden rounded-3xl bg-navy p-10 lg:p-12 flex flex-col group"
          >
            {/* Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gold/15 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/20 to-transparent rounded-t-3xl"
            />

            <div className="relative">
              {/* Division badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2">
                <Building2 size={15} className="text-white/70" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                  Division 01
                </span>
              </div>

              <h3 className="font-display text-[28px] font-bold text-white leading-tight mb-4 lg:text-[32px]">
                Real Estate Intelligence &amp; Acquisition
              </h3>
              <p className="text-[15px] leading-relaxed text-white/55 mb-10">
                We source, validate, and secure property assets on behalf of
                investors and developers — with full due diligence and market
                intelligence.
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-12">
                {reFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 border border-gold/20">
                      <f.icon size={14} className="text-gold" />
                    </div>
                    <span className="text-[14px] text-white/80">{f.label}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="outline"
                className="mt-auto border-gold/40 text-gold hover:bg-gold/10 hover:text-gold w-fit gap-2"
              >
                <Link href="/real-estate">
                  View Full Capability
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>

          {/* Connector */}
          <div className="relative hidden lg:flex flex-col items-center justify-center px-6 gap-3">
            <div className="h-16 w-px bg-linear-to-b from-navy to-on-surface-muted/30" />
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-divider bg-surface shadow-lg z-10">
              <div className="h-3 w-3 rounded-full bg-navy" />
            </div>
            <div className="h-16 w-px bg-linear-to-t from-navy-dark to-on-surface-muted/30" />
            <span className="absolute text-[10px] font-bold uppercase tracking-widest text-on-surface-muted rotate-90 whitespace-nowrap">
              Integrated
            </span>
          </div>
          {/* Mobile divider */}
          <div className="flex lg:hidden items-center gap-4 py-6">
            <div className="flex-1 h-px bg-divider" />
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-divider bg-surface">
              <div className="h-2.5 w-2.5 rounded-full bg-navy" />
            </div>
            <div className="flex-1 h-px bg-divider" />
          </div>

          {/* Energy Card */}
          <div
            id="energy"
            className="relative overflow-hidden rounded-3xl bg-navy-dark p-10 lg:p-12 flex flex-col group"
          >
            {/* Glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -left-20 -bottom-20 h-64 w-64 rounded-full bg-gold/10 blur-3xl"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/40 via-gold/15 to-transparent rounded-t-3xl"
            />

            <div className="relative">
              {/* Division badge */}
              <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/8 px-4 py-2">
                <Zap size={15} className="text-white/70" />
                <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/70">
                  Division 02
                </span>
              </div>

              <h3 className="font-display text-[28px] font-bold text-white leading-tight mb-4 lg:text-[32px]">
                Renewable Energy as a Service
              </h3>
              <p className="text-[15px] leading-relaxed text-white/55 mb-10">
                We design, deploy, and maintain clean energy infrastructure for
                estates, commercial buildings, and mini grids — with no upfront
                cost models.
              </p>

              {/* Features */}
              <ul className="space-y-4 mb-12">
                {energyFeatures.map((f) => (
                  <li key={f.label} className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/15 border border-gold/25">
                      <f.icon size={14} className="text-gold" />
                    </div>
                    <span className="text-[14px] text-white/80">{f.label}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant="outline"
                className="mt-auto border-gold/40 text-gold hover:bg-gold/10 hover:text-gold w-fit gap-2"
              >
                <Link href="/energy">
                  View Full Capability
                  <ArrowRight size={15} />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
