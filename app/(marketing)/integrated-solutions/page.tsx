import type { Metadata } from "next";
import Link from "next/link";
import {
  Building2,
  Zap,
  ArrowRight,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  MessageSquare,
  Sun,
  CheckCircle2,
  MoveRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Integrated Solutions — Terralume",
  description:
    "One process that covers both decisions a property owner has to make. Real estate and energy evaluated with the same rigour, by the same team, from one intake form.",
  openGraph: {
    title: "Integrated Solutions — Terralume",
    description:
      "Not two services stapled together — one process that happens to cover both decisions a property owner actually has to make.",
    type: "website",
  },
};

/* ─── Data ───────────────────────────────────────────────── */

const steps = [
  {
    phase: "Real Estate",
    icon: ClipboardList,
    number: "01",
    label: "Intake",
    detail:
      "A single intake form. Purpose, location, budget, timeline, financing status — everything our team needs to start work.",
    accent: "crimson",
  },
  {
    phase: "Real Estate",
    icon: ShieldCheck,
    number: "02",
    label: "Four-Pillar Evaluation",
    detail:
      "Every candidate property is run through title, financial implication, economic implication, and exit strategy — before it reaches you.",
    accent: "navy",
  },
  {
    phase: "Real Estate",
    icon: BarChart3,
    number: "03",
    label: "Curated Shortlist",
    detail:
      "You receive a shortlist of verified properties, each annotated against all four pillars. No guesswork, no unverified listings.",
    accent: "crimson",
  },
  {
    phase: "Integration Point",
    icon: MessageSquare,
    number: "04",
    label: "The Question We Ask",
    detail:
      "At shortlist stage, we ask every real estate client: do you want us to assess this property for an energy solution too?",
    accent: "pivot",
  },
  {
    phase: "Energy",
    icon: Sun,
    number: "05",
    label: "Energy Consultation",
    detail:
      "Our energy consultants size a solar-and-storage system against the property's actual layout and the client's expected usage — not a generic package.",
    accent: "navy",
  },
  {
    phase: "Energy",
    icon: Zap,
    number: "06",
    label: "Integrated Delivery",
    detail:
      "The acquisition completes. The client receives a property with its power solution already proposed, costed, and ready to deploy.",
    accent: "crimson",
  },
];

const distinctions = [
  {
    label: "One intake form",
    detail:
      "Your brief drives both the property evaluation and the energy assessment — you don't repeat yourself.",
  },
  {
    label: "One team",
    detail:
      "The same people who evaluated your property evaluate your energy options. No handoffs, no translation loss.",
  },
  {
    label: "One timeline",
    detail:
      "The energy proposal is scoped before acquisition closes — so you arrive at the property with a plan, not a question.",
  },
  {
    label: "Genuine opt-in",
    detail:
      "Energy is a real question at shortlist stage, not a default add-on. You choose whether it applies to your situation.",
  },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function IntegratedSolutionsPage() {
  return (
    <main className="flex flex-col flex-1">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <PageHero
        eyebrow="Integrated Solutions"
        title={
          <>
            Both decisions. <em className="italic text-gold">One process.</em>
          </>
        }
        description="What it looks like when both sides of Terralume work together — real estate and energy evaluated with the same rigour, by the same team, from one intake form."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Integrated Solutions" },
        ]}
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
              <Link href="/consultation">
                Start an energy assessment{" "}
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </>
        }
      />

      {/* ── The story ─────────────────────────────────────────── */}
      <section className="bg-white py-10 lg:py-14">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_2px_1fr] lg:items-start">
            {/* Left: narrative */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                A Real Example
              </p>
              <h2 className="font-display text-2xl font-bold text-black lg:text-3xl">
                Three-bedroom. Mid-budget. Six months.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-black/60">
                A client comes to us looking for a home in Lagos. We run every
                candidate property through our four-pillar evaluation and return
                a shortlist of three options — each one clean on title, sound
                financially, well-positioned economically, with a realistic exit
                path.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-black/60">
                At shortlist stage, we ask the question we ask every real estate
                client: do you want us to assess this property for an energy
                solution too?
              </p>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px self-stretch bg-black/10" />

            {/* Right: outcome */}
            <div>
              <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                The Outcome
              </p>
              <h2 className="font-display text-2xl font-bold text-black lg:text-3xl">
                A property. With power already solved.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-black/60">
                Before the acquisition closes, our energy consultants size a
                solar-and-storage system against the property&apos;s actual
                layout and the client&apos;s expected usage — not a generic
                package, a specific proposal for that specific home.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-black/60">
                By the time the acquisition completes, the client isn&apos;t
                just receiving a property. They&apos;re receiving a property
                with its power solution already proposed, costed, and ready to
                deploy.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Process flow ──────────────────────────────────────── */}
      <section className="bg-surface py-14 lg:py-17">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 max-w-2xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              How It Works
            </p>
            <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
              One process. Six stages.
            </h2>
            <p className="mt-4 text-[16px] text-on-surface-muted">
              The integration happens naturally inside a single workflow —
              evaluated with the same rigour, by the same team.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon;
              const isPivot = step.accent === "pivot";
              const isCrimson = step.accent === "crimson";

              if (isPivot) {
                return (
                  <div
                    key={step.number}
                    className="flex flex-col overflow-hidden rounded-3xl border-2 border-navy bg-navy sm:col-span-2 lg:col-span-1"
                  >
                    <div className="relative overflow-hidden px-7 py-6">
                      <div
                        aria-hidden
                        className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-crimson/20 blur-3xl"
                      />
                      <div className="relative flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-crimson/40 bg-crimson/20">
                          <Icon size={18} className="text-crimson" />
                        </div>
                        <div>
                          <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                            Stage {step.number}
                          </span>
                          <h3 className="font-display text-[18px] font-bold text-white leading-tight">
                            {step.label}
                          </h3>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col px-7 pb-7">
                      <p className="flex-1 text-[14px] leading-relaxed text-white/65">
                        {step.detail}
                      </p>
                      <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-crimson/20 px-4 py-2 self-start">
                        <MoveRight size={13} className="text-crimson" />
                        <span className="text-[12px] font-medium text-crimson">
                          Integration point
                        </span>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={step.number}
                  className="flex flex-col overflow-hidden rounded-3xl border border-divider bg-surface"
                >
                  {/* Card header */}
                  <div className="relative overflow-hidden bg-navy px-7 py-6">
                    <div
                      aria-hidden
                      className={`absolute inset-x-0 top-0 h-0.5 ${isCrimson ? "bg-linear-to-r from-crimson/60 via-crimson/20 to-transparent" : "bg-linear-to-r from-gold/50 via-gold/15 to-transparent"}`}
                    />
                    <div
                      aria-hidden
                      className={`pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full blur-3xl ${isCrimson ? "bg-crimson/15" : "bg-gold/10"}`}
                    />
                    <div className="relative flex items-center gap-3">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${isCrimson ? "border-crimson/30 bg-crimson/15" : "border-gold/30 bg-gold/15"}`}
                      >
                        <Icon
                          size={18}
                          className={isCrimson ? "text-crimson" : "text-gold"}
                        />
                      </div>
                      <div>
                        <span className="block text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45">
                          Stage {step.number}
                        </span>
                        <h3 className="font-display text-[18px] font-bold text-white leading-tight">
                          {step.label}
                        </h3>
                      </div>
                    </div>
                    <p className="relative mt-1.5 ml-13 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/35">
                      {step.phase}
                    </p>
                  </div>

                  {/* Card body */}
                  <div className="flex flex-1 flex-col px-7 py-6">
                    <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">
                      {step.detail}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── The proposition ───────────────────────────────────── */}
      <section className="bg-navy-light py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-6 lg:px-12">
          <div className="mb-16 grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-end">
            <div>
              <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-navy">
                <span className="h-px w-8 bg-navy" />
                What Makes This Different
              </p>
              <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
                Not two services stapled together.
              </h2>
            </div>
            <p className="text-[17px] leading-relaxed text-on-surface-muted">
              One process that happens to cover both decisions a property owner
              actually has to make — evaluated with the same rigour, by the same
              team, from one intake form.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {distinctions.map((d) => (
              <div
                key={d.label}
                className="flex items-start gap-5 rounded-2xl border border-divider bg-surface p-7"
              >
                <CheckCircle2
                  size={20}
                  className="mt-0.5 shrink-0 text-crimson"
                />
                <div>
                  <p className="font-semibold text-navy">{d.label}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-on-surface-muted">
                    {d.detail}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Dual CTA ──────────────────────────────────────────── */}
      <section className="bg-surface py-20 lg:py-24">
        <div className="mx-auto max-w-5xl px-6 lg:px-12">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* RE CTA */}
            <div className="overflow-hidden rounded-3xl border border-divider bg-surface-card">
              <div className="relative overflow-hidden bg-navy px-8 py-7">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-crimson/60 via-crimson/20 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-crimson/15 blur-3xl"
                />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-crimson/30 bg-crimson/15">
                    <Building2 size={18} className="text-crimson" />
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-white">
                    Start with Real Estate
                  </h3>
                </div>
              </div>
              <div className="px-8 py-7">
                <p className="text-[14px] leading-relaxed text-on-surface-muted">
                  Tell us about the property you&apos;re looking for. We handle
                  the evaluation, the shortlisting, and the acquisition — with
                  the option to add energy at the right moment.
                </p>
                <div className="mt-6">
                  <Button asChild variant="default" size="lg">
                    <Link href="/consultation">
                      Start a property intake
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>

            {/* Energy CTA */}
            <div className="overflow-hidden rounded-3xl border border-divider bg-surface-card">
              <div className="relative overflow-hidden bg-navy px-8 py-7">
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-0.5 bg-linear-to-r from-gold/50 via-gold/15 to-transparent"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-gold/10 blur-3xl"
                />
                <div className="relative flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-gold/30 bg-gold/15">
                    <Zap size={18} className="text-gold" />
                  </div>
                  <h3 className="font-display text-[20px] font-bold text-white">
                    Start with Energy
                  </h3>
                </div>
              </div>
              <div className="px-8 py-7">
                <p className="text-[14px] leading-relaxed text-on-surface-muted">
                  Already own or in the process of acquiring a property? Start
                  with an energy needs assessment. You don&apos;t need to be a
                  real estate client to engage this division.
                </p>
                <div className="mt-6">
                  <Button asChild variant="secondary" size="lg">
                    <Link href="/consultation">
                      Start an energy needs assessment
                      <ArrowRight size={16} className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </main>
  );
}
