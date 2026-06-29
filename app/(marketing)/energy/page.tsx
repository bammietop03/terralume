import type { Metadata } from "next";
import Link from "next/link";
import {
  Sun,
  Battery,
  Zap,
  Network,
  ArrowRight,
  CheckCircle2,
  Home,
  Building2,
  Briefcase,
  Factory,
  ClipboardList,
  DollarSign,
  Wifi,
  ShoppingCart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Renewable Energy Acquisition Service (EaaS) — Terralume",
  description:
    "Reliable power, sized for how you actually live and work. Terralume consults first, then matches the right vetted solution — residential, estate, or commercial scale.",
  openGraph: {
    title: "Renewable Energy Acquisition Service — Terralume",
    description:
      "You don't need to be buying a property to work with Terralume on energy. We consult first, understand your actual needs, then pull the right solution.",
    type: "website",
  },
};

/* ─── Data ───────────────────────────────────────────────── */

const solutionCategories = [
  {
    icon: Sun,
    number: "01",
    name: "Solar PV",
    description:
      "Generation sized to your consumption profile — residential, estate, or commercial scale.",
    accent: "gold",
  },
  {
    icon: Battery,
    number: "02",
    name: "Battery & Storage",
    description:
      "Including large-format lithium storage systems for estate- and commercial-scale deployments.",
    accent: "navy",
  },
  {
    icon: Zap,
    number: "03",
    name: "Hybrid Systems",
    description:
      "Grid, solar, and storage working together for maximum reliability and efficiency.",
    accent: "gold",
  },
  {
    icon: Network,
    number: "04",
    name: "Mini-Grid-Ready",
    description:
      "For estates and multi-unit developments requiring shared infrastructure at scale.",
    accent: "navy",
  },
];

const consultationChecks = [
  {
    icon: ClipboardList,
    label: "Consumption pattern",
    detail: "What you actually use, and when.",
  },
  {
    icon: Wifi,
    label: "Grid reliability",
    detail: "How dependable your current power supply is.",
  },
  {
    icon: DollarSign,
    label: "Budget",
    detail: "What you're able to commit, and how.",
  },
  {
    icon: ShoppingCart,
    label: "Ownership preference",
    detail: "Lease, power purchase agreement (PPA), or outright purchase.",
  },
];

const solutionsLibrary = [
  {
    icon: Home,
    segment: "Residential",
    description:
      "Power solutions sized for individual homes — solar PV and storage configurations that handle daily essentials through grid outages, without paying for capacity you'll never use.",
    accent: "gold",
  },
  {
    icon: Building2,
    segment: "Estate / Multi-unit",
    description:
      "Shared-infrastructure solutions for estates and multi-unit developments, including mini-grid-ready configurations and large-format storage — built for predictable, scalable power across multiple households.",
    accent: "navy",
  },
  {
    icon: Briefcase,
    segment: "Commercial / SME",
    description:
      "Energy continuity for businesses where downtime has a direct cost — hybrid systems and storage sized against your operating hours and load profile, with PPA-style models available so power becomes a predictable line item, not a capital risk.",
    accent: "gold",
  },
  {
    icon: Factory,
    segment: "Industrial",
    description:
      "High-capacity power systems for manufacturing, processing, and industrial operations — engineered for continuous uptime, peak load management, and integration with existing infrastructure. Designed to minimize production interruptions and reduce operational energy costs at scale.",
    accent: "navy",
  },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function EnergyPage() {
  return (
    <main className="flex flex-col flex-1">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Renewable Energy Acquisition Service"
        title={
          <>
            Reliable power, sized for how you{" "}
            <em className="italic text-gold">actually live and work.</em>
          </>
        }
        description="You don't need to be buying a property to work with Terralume on energy. This division stands on its own — we consult first, understand your actual needs, then pull the right solution from our vetted technology data."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Energy" }]}
        minHeight="56vh"
        imageSrc="/images/energy.jpg"
        actions={
          <>
            <Button asChild size="lg" variant="secondary">
              <Link href="/consultation">
                Start an energy assessment
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-navy-dark hover:bg-white/10 hover:text-white"
            >
              <Link href="#solutions-library">Explore solutions</Link>
            </Button>
          </>
        }
      />

      {/* ── Standalone notice ─────────────────────────────────── */}
      <section className="border-b border-divider bg-navy py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Independently Engageable
              </p>
              <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
                No property required.
              </h2>
            </div>
            <p className="text-[17px] leading-relaxed text-white/65">
              This division is independently engageable. You do not need to be
              buying or owning a property through Terralume to start an energy
              engagement — though the two are designed to work together when you
              want them to.
            </p>
          </div>
        </div>
      </section>

      {/* ── Solution Categories ───────────────────────────────── */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Solution Categories
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              The right technology for your actual needs.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Never a default oversized system, never a one-size-fits-all
              catalogue. Every solution is matched from our vetted technology
              data after we understand your situation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-divider sm:grid-cols-2 lg:grid-cols-4">
            {solutionCategories.map((cat) => {
              const Icon = cat.icon;
              const isNavy = cat.accent === "navy";
              return (
                <div key={cat.name} className="flex flex-col bg-surface p-8">
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${isNavy ? "bg-navy-light" : "bg-gold-light"}`}
                  >
                    <Icon
                      size={22}
                      className={isNavy ? "text-navy" : "text-gold"}
                    />
                  </div>
                  <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-on-surface-muted">
                    Category {cat.number}
                  </span>
                  <h3 className="font-display text-[20px] font-bold text-navy">
                    {cat.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-on-surface-muted">
                    {cat.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/consultation">
                Start an energy needs assessment
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Consultation ─────────────────────────────────────── */}
      <section className="bg-navy-light py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2 lg:items-start">
            {/* Left: copy */}
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                <span className="h-px w-8 bg-navy" />
                Energy Consultation
              </p>
              <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
                We ask before we propose.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-on-surface-muted">
                Before we recommend anything, we need to understand your
                situation. This isn&apos;t a sales form. It&apos;s the brief our
                consultants use to size a solution that fits — not the biggest
                system we can sell you.
              </p>
              <div className="mt-8">
                <Button asChild variant="default" size="lg">
                  <Link href="/consultation">
                    Start an energy needs assessment
                    <ArrowRight size={16} className="ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Right: checklist */}
            <div className="space-y-4">
              <p className="mb-6 text-[13px] font-semibold uppercase tracking-[0.15em] text-on-surface-muted">
                Our assessment covers
              </p>
              {consultationChecks.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className="flex items-start gap-5 rounded-2xl border border-divider bg-surface p-6"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold-light">
                      <Icon size={18} className="text-gold" />
                    </div>
                    <div>
                      <p className="font-semibold text-navy">{item.label}</p>
                      <p className="mt-1 text-[13px] text-on-surface-muted">
                        {item.detail}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ── Solutions Library ─────────────────────────────────── */}
      <section id="solutions-library" className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Solutions Library
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              A starting point for a conversation.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Every category below is a starting point — not a fixed product.
              Our supplier relationships and technology data let us match
              precisely to your situation.
            </p>
          </div>

          <div className="space-y-6">
            {solutionsLibrary.map((item) => {
              const Icon = item.icon;
              const isNavy = item.accent === "navy";
              return (
                <div
                  key={item.segment}
                  className="overflow-hidden rounded-3xl border border-divider"
                >
                  {/* Header */}
                  <div className="relative overflow-hidden bg-navy px-8 py-7">
                    <div
                      aria-hidden
                      className={`absolute inset-x-0 top-0 h-0.5 ${isNavy ? "bg-linear-to-r from-gold/60 via-gold/20 to-transparent" : "bg-linear-to-r from-gold/60 via-gold/20 to-transparent"}`}
                    />
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full blur-3xl ${isNavy ? "bg-gold/10" : "bg-gold/15"}`}
                    />
                    <div className="relative flex items-center gap-4">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${isNavy ? "border-gold/30 bg-gold/15" : "border-gold/30 bg-gold/15"}`}
                      >
                        <Icon
                          size={20}
                          className={isNavy ? "text-gold" : "text-gold"}
                        />
                      </div>
                      <h3 className="font-display text-[22px] font-bold text-white">
                        {item.segment}
                      </h3>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="bg-surface-card px-8 py-7">
                    <p className="text-[15px] leading-relaxed text-on-surface-muted">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom callout */}
          <div className="mt-12 rounded-2xl border border-navy/20 bg-navy-light px-8 py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-navy" />
                <p className="text-[15px] leading-relaxed text-navy">
                  <strong>
                    Every category above is a starting point for a conversation,
                    not a fixed product.
                  </strong>{" "}
                  Our supplier relationships and vetted technology data let us
                  match precisely to your situation.
                </p>
              </div>
              <Button asChild variant="default" size="lg" className="shrink-0">
                <Link href="/consultation">
                  Start an assessment
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* <FooterCTA /> */}
    </main>
  );
}
