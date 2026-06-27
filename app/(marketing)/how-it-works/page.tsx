import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Zap,
  LayoutDashboard,
  Phone,
  Wrench,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";

export const metadata: Metadata = {
  title: "How It Works — Terralume",
  description:
    "One process, two starting points — whether you begin with real estate or energy, Terralume manages the full journey from intake to delivery.",
};

const reSteps = [
  {
    n: "01",
    label: "Intake",
    detail: "Submit your brief — property type, budget, location, timeline.",
  },
  {
    n: "02",
    label: "Four-Pillar Evaluation",
    detail:
      "Acquisition, Intelligence, Market Analysis & Strategic Advisory applied to your brief.",
  },
  {
    n: "03",
    label: "Curated Shortlist",
    detail:
      "We present a verified, off-market shortlist matched to your criteria.",
  },
  {
    n: "04",
    label: "Optional Energy Add-on",
    detail:
      "Where relevant, we layer in an energy infrastructure assessment for the target asset.",
  },
  {
    n: "05",
    label: "Acquisition Managed",
    detail:
      "Negotiation, title verification, legal review and completion — end to end.",
  },
  {
    n: "06",
    label: "Delivered",
    detail:
      "Keys, documentation, and a post-acquisition report. Your file is closed — or handed to property management.",
  },
];

const energySteps = [
  {
    n: "01",
    label: "Needs Assessment",
    detail:
      "We audit your current energy situation — costs, load profile, grid dependency.",
  },
  {
    n: "02",
    label: "Consultation",
    detail:
      "A dedicated energy consultant reviews findings and outlines viable solutions.",
  },
  {
    n: "03",
    label: "Product Matching",
    detail:
      "Solutions matched from our product database: solar hybrid, mini grid, estate systems or upgrades.",
  },
  {
    n: "04",
    label: "Costed Proposal",
    detail:
      "A detailed proposal with system specs, capex, savings projections, and subscription options.",
  },
  {
    n: "05",
    label: "Deployment & Monitoring",
    detail:
      "Installation by our operations team, followed by ongoing performance monitoring.",
  },
];

const teams = [
  {
    icon: Phone,
    name: "Client Relations",
    role: "First contact",
    desc: "Your first point of contact. They handle intake, onboarding, and keep you informed at every stage.",
  },
  {
    icon: Wrench,
    name: "Operations",
    role: "Evaluation & Acquisition",
    desc: "Our field and advisory team. They run due diligence, source properties, manage energy deployments, and report findings.",
  },
  {
    icon: FileCheck,
    name: "Finance & Compliance",
    role: "Contracts & Financial Review",
    desc: "They handle all legal documentation, financial review, compliance checks, and ensure clean title transfer.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="flex flex-col flex-1">
      <PageHero
        eyebrow="The Terralume Process"
        title={
          <>
            One process.{" "}
            <em className="italic text-gold">Two starting points.</em>
          </>
        }
        description="Whether your journey begins with a property brief or an energy challenge — Terralume manages the full process from intake to delivery. One team, one dashboard."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "How It Works" }]}
        minHeight="52vh"
      />

      {/* ── Two Tracks ──────────────────────────────────────────── */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center max-w-2xl mx-auto">
            <p className="mb-4 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Both Paths
              <span className="h-px w-8 bg-gold" />
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              Choose your starting point
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Both tracks converge on the same outcome — a high-performance
              asset with reliable infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Real Estate Track */}
            <div className="relative overflow-hidden rounded-3xl border border-divider bg-surface-card">
              {/* Header */}
              <div className="relative overflow-hidden bg-navy px-8 py-8">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/20 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gold/15 blur-3xl"
                />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/25">
                    <Building2 size={18} className="text-gold" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                    Track A
                  </span>
                </div>
                <h3 className="font-display text-[22px] font-bold text-white">
                  If you start with property
                </h3>
                <p className="mt-2 text-[14px] text-white/55">
                  From your first brief to title transfer and beyond.
                </p>
              </div>

              {/* Steps */}
              <div className="px-8 py-8">
                <ol className="relative space-y-0">
                  {/* Vertical line */}
                  <div
                    aria-hidden
                    className="absolute left-3.75 top-4 bottom-4 w-px bg-linear-to-b from-gold/30 via-divider to-transparent"
                  />
                  {reSteps.map((s, i) => (
                    <li
                      key={s.n}
                      className="relative flex gap-5 pb-7 last:pb-0"
                    >
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-divider bg-surface z-10 mt-0.5">
                        <span className="text-[10px] font-bold text-navy">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-[15px] leading-snug">
                          {s.label}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-on-surface-muted">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Energy Track */}
            <div className="relative overflow-hidden rounded-3xl border border-divider bg-surface-card">
              {/* Header */}
              <div className="relative overflow-hidden bg-navy-dark px-8 py-8">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/20 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -left-12 -bottom-12 h-40 w-40 rounded-full bg-gold/10 blur-3xl"
                />
                <div className="relative flex items-center gap-3 mb-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15 border border-gold/25">
                    <Zap size={18} className="text-gold" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.15em] text-white/60">
                    Track B
                  </span>
                </div>
                <h3 className="font-display text-[22px] font-bold text-white">
                  If you start with energy
                </h3>
                <p className="mt-2 text-[14px] text-white/55">
                  From needs assessment to deployment and ongoing management.
                </p>
              </div>

              {/* Steps */}
              <div className="px-8 py-8">
                <ol className="relative space-y-0">
                  <div
                    aria-hidden
                    className="absolute left-3.75 top-4 bottom-4 w-px bg-linear-to-b from-gold/30 via-divider to-transparent"
                  />
                  {energySteps.map((s, i) => (
                    <li
                      key={s.n}
                      className="relative flex gap-5 pb-7 last:pb-0"
                    >
                      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-divider bg-surface z-10 mt-0.5">
                        <span className="text-[10px] font-bold text-navy">
                          {i + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-navy text-[15px] leading-snug">
                          {s.label}
                        </p>
                        <p className="mt-1 text-[13px] leading-relaxed text-on-surface-muted">
                          {s.detail}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Either Way ──────────────────────────────────────────── */}
      <section className="bg-navy-dark py-24 lg:py-32 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Either way
            </p>
            <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
              One dashboard. One team.{" "}
              <span className="italic text-gold">Behind every engagement.</span>
            </h2>
            <p className="mt-5 text-[16px] leading-relaxed text-white/55">
              Whichever track you take, your file lives in a single client
              dashboard — visible to you and managed by the same Terralume team
              throughout.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-14">
            {teams.map((t) => (
              <div
                key={t.name}
                className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/4 p-8"
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/30 via-gold/10 to-transparent"
                />
                <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-gold/15 border border-gold/20">
                  <t.icon size={20} className="text-gold" />
                </div>
                <p className="mb-1 font-display text-[18px] font-semibold text-white">
                  {t.name}
                </p>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gold/80">
                  {t.role}
                </p>
                <p className="text-[14px] leading-relaxed text-white/50">
                  {t.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Dashboard callout */}
          <div className="flex flex-col items-center gap-5 rounded-2xl border border-white/10 bg-white/4 px-8 py-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/15 border border-gold/20">
              <LayoutDashboard size={22} className="text-gold" />
            </div>
            <div>
              <p className="font-display text-[20px] font-semibold text-white">
                Your Client Dashboard
              </p>
              <p className="mt-2 text-[15px] text-white/50 max-w-lg mx-auto">
                Track progress, review documents, approve proposals, and
                communicate with your team — all from one place, from intake to
                completion.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────── */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
          <p className="mb-5 inline-flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            <span className="h-px w-8 bg-gold" />
            Get Started
            <span className="h-px w-8 bg-gold" />
          </p>
          <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[17px] leading-relaxed text-on-surface-muted">
            Talk to us. We&apos;ll ask a few questions and point you to the
            right track — no commitment needed.
          </p>
          <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button
              asChild
              size="lg"
              className="bg-navy hover:bg-navy-dark text-white gap-2 px-8 h-13"
            >
              <Link href="/consultation">
                Book a Consultation
                <ArrowRight size={15} />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="gap-2 px-8 h-13"
            >
              <Link href="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
