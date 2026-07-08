import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  DollarSign,
  TrendingUp,
  LogOut,
  ArrowRight,
  CheckCircle2,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Real Estate Acquisition & Intelligence — Terralume",
  description:
    "Terralume evaluates every candidate property through a four-pillar framework — Title, Financial, Economic, and Exit Strategy — then manages the acquisition for you.",
  openGraph: {
    title: "Real Estate Acquisition & Intelligence — Terralume",
    description:
      "We don't show you listings. We evaluate, then acquire. A four-pillar framework applied to every property before it ever reaches your shortlist.",
    type: "website",
  },
};

/* ─── Data ───────────────────────────────────────────────── */

const pillars = [
  {
    icon: ShieldCheck,
    number: "01",
    name: "Title",
    question: "Is ownership clean and verifiable?",
    check:
      "We verify ownership history, registration status, and any encumbrances against the property, and confirm survey accuracy.",
    whyItMatters:
      "Title failure is the single largest source of contested property transactions in Nigeria. Clients deserve certainty before they commit.",
    youReceive:
      "A title-verification summary in plain language — not a stack of documents you're expected to interpret yourself.",
    accent: "gold",
  },
  {
    icon: DollarSign,
    number: "02",
    name: "Financial Implication",
    question: "What does this actually cost, beyond the asking price?",
    check:
      "We account for levies, legal fees, agency costs, and financing terms, and compare the true acquisition cost against your stated budget.",
    whyItMatters:
      "Asking price is rarely the real cost. The gap between the number on the listing and the total cost of ownership catches buyers off guard.",
    youReceive:
      "A financial-implication breakdown before you commit to anything.",
    accent: "navy",
  },
  {
    icon: TrendingUp,
    number: "03",
    name: "Economic Implication",
    question: "Does the area support the value you're paying for?",
    check:
      "We assess infrastructure access, growth trajectory, and comparable price and demand movement in the target area.",
    whyItMatters:
      "A property is only as good as the area around it — current value matters less than trajectory.",
    youReceive:
      "An economic-outlook note specific to that property and location.",
    accent: "gold",
  },
  {
    icon: LogOut,
    number: "04",
    name: "Exit Strategy",
    question:
      "How and when could you realistically liquidate or repurpose this?",
    check:
      "We model realistic exit scenarios — resale, rental income, repurposing — against your stated goals and timeline.",
    whyItMatters:
      "Every acquisition should have a way out. Building an exit plan in at the start rather than at the end protects the investment.",
    youReceive: "An exit-strategy projection before you decide.",
    accent: "navy",
  },
];

const audiences = [
  {
    label: "First-time buyers",
    description: "who want certainty",
  },
  {
    label: "Investors",
    description: "who want a defensible thesis",
  },
  {
    label: "Diaspora Nigerians",
    description: "who need a partner they can trust from a distance",
  },
  {
    label: "Developers",
    description: "who need acquisition done right the first time",
  },
];

const acquisitionSteps = [
  {
    n: "1",
    label: "Tell us what you need",
    detail:
      "A short intake covering purpose, location, budget, timeline, and financing status.",
  },
  {
    n: "2",
    label: "We evaluate candidates",
    detail:
      "Every property is run through the title, financial, economic, and exit-strategy framework before it ever reaches you.",
  },
  {
    n: "3",
    label: "You receive a curated shortlist",
    detail:
      "Annotated against all four pillars — no guesswork, no unverified listings.",
  },
  {
    n: "4",
    label: "You decide whether to add energy",
    detail: "A genuine option at this stage, not a default add-on.",
  },
  {
    n: "5",
    label: "We manage the acquisition",
    detail:
      "Using the same information you gave us at intake — your brief becomes our acquisition plan.",
  },
  {
    n: "6",
    label: "You receive your property",
    detail:
      "Standalone, or paired with a matched energy solution if you opted in.",
  },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function RealEstatePage() {
  return (
    <main className="flex flex-col flex-1">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Real Estate Acquisition & Intelligence"
        title={
          <>
            We don&apos;t show you listings.{" "}
            <em className="italic text-gold">We evaluate, then acquire.</em>
          </>
        }
        description="Most platforms hand you options and let you carry the risk. Terralume takes your goals, runs every candidate property through a four-pillar evaluation, and only brings you what clears the bar — then manages the acquisition for you."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Real Estate" }]}
        minHeight="56vh"
        actions={
          <>
            <Button asChild size="lg" variant="secondary">
              <Link href="/consultation">
                Start a property intake
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/30 text-navy-dark hover:bg-white/10 hover:text-white"
            >
              <Link href="#evaluation-framework">See how we evaluate</Link>
            </Button>
          </>
        }
      />

      {/* ── Intro strip ──────────────────────────────────────── */}
      <section className="border-b border-divider bg-navy py-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                The Terralume Difference
              </p>
              <h2 className="font-display text-3xl font-bold text-white lg:text-4xl">
                Your goals drive our evaluation.
              </h2>
            </div>
            <p className="text-[17px] leading-relaxed text-white/65">
              The same information you provide at intake becomes the lens
              through which we evaluate every candidate property — and the plan
              we execute when you give the instruction to proceed.
            </p>
          </div>
        </div>
      </section>

      {/* ── Four Pillars overview ─────────────────────────────── */}
      <section className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              The Four Pillars
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              Every property passes four checks.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Only properties that clear all four move forward to your shortlist
              — each one annotated against these same pillars, so you see
              exactly why it qualified.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-px bg-divider sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((pillar) => {
              const Icon = pillar.icon;
              const isNavy = pillar.accent === "navy";
              return (
                <div key={pillar.name} className="flex flex-col bg-surface p-8">
                  <div
                    className={`mb-5 flex h-12 w-12 items-center justify-center rounded-xl ${isNavy ? "bg-navy-light" : "bg-gold-light"}`}
                  >
                    <Icon
                      size={22}
                      className={isNavy ? "text-navy" : "text-gold"}
                    />
                  </div>
                  <span className="mb-1 text-[11px] font-semibold uppercase tracking-[0.15em] text-on-surface-muted">
                    Pillar {pillar.number}
                  </span>
                  <h3 className="font-display text-[20px] font-bold text-navy">
                    {pillar.name}
                  </h3>
                  <p className="mt-3 text-[14px] leading-relaxed text-on-surface-muted">
                    {pillar.question}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Who this is for ───────────────────────────────────── */}
      <section className="bg-navy-light py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-12 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                <span className="h-px w-8 bg-navy" />
                Who This Is For
              </p>
              <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
                Built for buyers who need certainty.
              </h2>
            </div>
            <Button asChild variant="default" size="lg">
              <Link href="/consultation">
                Start a property intake
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map((a) => (
              <div
                key={a.label}
                className="flex items-start gap-4 rounded-2xl border border-divider bg-surface p-6"
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold">
                  <Users size={12} className="text-white" />
                </span>
                <div>
                  <p className="font-semibold text-navy">{a.label}</p>
                  <p className="mt-1 text-[13px] text-on-surface-muted">
                    {a.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Evaluation Framework ──────────────────────────────── */}
      <section id="evaluation-framework" className="bg-surface py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              The Evaluation Framework
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              Four checks. One clear answer.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Is this property right for you?
            </p>
          </div>

          <div className="space-y-6">
            {pillars.map((pillar, i) => {
              const Icon = pillar.icon;
              const isNavy = pillar.accent === "navy";
              return (
                <div
                  key={pillar.name}
                  className="overflow-hidden rounded-3xl border border-divider bg-surface-card"
                >
                  {/* Header */}
                  <div
                    className={`relative overflow-hidden px-8 py-7 ${isNavy ? "bg-navy" : "bg-navy"}`}
                  >
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
                      <div>
                        <span className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50">
                          Pillar {pillar.number}
                        </span>
                        <h3 className="font-display text-[22px] font-bold text-white">
                          {pillar.name}
                        </h3>
                      </div>
                    </div>
                    <p className="relative mt-2 ml-15 text-[14px] text-white/60">
                      {pillar.question}
                    </p>
                  </div>

                  {/* Body */}
                  <div className="grid grid-cols-1 gap-0 divide-y divide-divider lg:grid-cols-3 lg:divide-x lg:divide-y-0">
                    {[
                      {
                        heading: "What we check",
                        body: pillar.check,
                        color: "navy",
                      },
                      {
                        heading: "Why it matters",
                        body: pillar.whyItMatters,
                        color: "gold",
                      },
                      {
                        heading: "What you receive",
                        body: pillar.youReceive,
                        color: "navy",
                      },
                    ].map((col) => (
                      <div key={col.heading} className="px-7 py-7">
                        <p
                          className={`mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] ${col.color === "gold" ? "text-gold" : "text-navy"}`}
                        >
                          {col.heading}
                        </p>
                        <p className="text-[14px] leading-relaxed text-on-surface-muted">
                          {col.body}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 rounded-2xl border border-navy/20 bg-navy-light px-8 py-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-start gap-4">
                <CheckCircle2 size={22} className="mt-0.5 shrink-0 text-navy" />
                <p className="text-[15px] leading-relaxed text-navy">
                  <strong>
                    Only properties that clear all four move forward
                  </strong>{" "}
                  to your shortlist — each one annotated against these same four
                  pillars, so you see exactly why it qualified.
                </p>
              </div>
              <Button asChild variant="default" size="lg" className="shrink-0">
                <Link href="/consultation">
                  Start a property intake
                  <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── How Acquisition Works ─────────────────────────────── */}
      <section className="bg-surface-alt py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              How Acquisition Works
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              From intake to keys — end to end.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              Six stages. One team. Your brief becomes our acquisition plan.
            </p>
          </div>

          <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Vertical rule on desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-1/2 hidden w-px -translate-x-1/2 bg-divider lg:block"
            />

            {acquisitionSteps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={step.n}
                  className={`flex gap-5 rounded-2xl border border-divider bg-surface p-7 ${isLeft ? "lg:mr-6" : "lg:ml-6"}`}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy">
                    <span className="text-[13px] font-bold text-white">
                      {step.n}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-navy">{step.label}</h3>
                    <p className="mt-1.5 text-[14px] leading-relaxed text-on-surface-muted">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12 flex justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/consultation">
                Start a property intake
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
