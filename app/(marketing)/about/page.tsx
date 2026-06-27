import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Eye,
  Scale,
  MessageSquare,
  Clock,
  FileSearch,
  Users,
  TrendingUp,
  ExternalLink,
  ArrowRight,
} from "lucide-react";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "About Terralume — Real Estate & Clean Energy, Nigeria",
  description:
    "Terralume runs two divisions — Real Estate Acquisition & Intelligence, and Renewable Energy as a Service — united by one operating model: rigorous evaluation, honest delivery.",
  openGraph: {
    title: "About Terralume",
    description:
      "Vision: To become the top structured real estate and clean energy provider across Nigeria. One process, two divisions.",
    type: "website",
  },
};

const values = [
  {
    icon: ShieldCheck,
    title: "Buyer-only loyalty",
    description:
      "We have no commercial relationship with sellers, landlords, or developers. Our fee comes solely from the buyer — the only arrangement that makes genuine representation possible.",
  },
  {
    icon: Eye,
    title: "Radical transparency",
    description:
      "Fixed, published fees. No referral commissions. No hidden charges. Every aspect of our advisory engagement is documented and explained before you commit to a pound or naira.",
  },
  {
    icon: Scale,
    title: "Independent verification",
    description:
      "We verify every material fact independently — title documents, structural condition, vendor identity, pricing. We never accept a seller's representation as fact without corroboration.",
  },
  {
    icon: FileSearch,
    title: "Documented process",
    description:
      "Every stage of every transaction is documented in writing. You should be able to build a complete picture of your purchase from our records alone.",
  },
  {
    icon: MessageSquare,
    title: "Direct communication",
    description:
      "You have a named Project Manager who communicates with you directly and honestly — including when the news is not what you hoped to hear.",
  },
  {
    icon: Clock,
    title: "Timeline accountability",
    description:
      "We commit to timelines and we report against them. When delays occur — and in Lagos they sometimes will — we explain why and reset expectations immediately.",
  },
  {
    icon: Users,
    title: "Client education",
    description:
      "An informed client makes better decisions. We explain every stage, every document, and every decision point — not to overwhelm, but to protect.",
  },
  {
    icon: TrendingUp,
    title: "Market integrity",
    description:
      "Terralume's long-term value depends on the integrity of the Lagos property market improving. We report fraud, we support regulation, and we refuse to participate in transactions we cannot verify.",
  },
];

const compliance = [
  {
    label: "LASRERA Registration",
    value: "LASRERA/2024/BUY/00471",
    note: "Lagos State Real Estate Regulatory Authority — buyer advisory licence",
  },
  {
    label: "CAC Registration",
    value: "RC 1847392",
    note: "Corporate Affairs Commission — registered in Nigeria",
  },
  {
    label: "Professional Indemnity Insurance",
    value: "PI/2024–2025/TL/009",
    note: "₦500,000,000 coverage per claim via Leadway Assurance",
  },
];

/* ─── Page ───────────────────────────────────────────────── */

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About Terralume"
        title={
          <>
            One operating model.{" "}
            <em className="italic text-gold">Two divisions.</em>
          </>
        }
        description="Terralume runs Real Estate Acquisition & Intelligence and Renewable Energy as a Service — united by one conviction: understand what a client actually needs, verify it rigorously, and deliver only what holds up."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        minHeight="50vh"
      />

      {/* ── Our story ─────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <div>
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Our Story
              </div>
              <h2 className="mb-6 font-display text-4xl font-bold text-navy lg:text-5xl">
                Why Terralume exists
              </h2>
              <div className="space-y-5 text-[16px] leading-relaxed text-on-surface-muted">
                <p>
                  The Lagos property market has a structural problem that has
                  existed for decades. When a buyer engages a traditional real
                  estate agent, that agent's commission comes from the seller —
                  typically 5–10% of the transaction value. The agent is
                  economically incentivised to complete the sale, not to protect
                  the buyer from a bad deal.
                </p>
                <p>
                  The result is predictable: buyers overpay, purchase properties
                  with unverified titles, sign contracts they don't understand,
                  and sometimes lose their entire investment to fraud. This is
                  not exceptional — it is the routine experience of thousands of
                  Lagos property buyers every year.
                </p>
                <p>
                  Terralume was founded on a single conviction: that buyers
                  deserve professional representation, paid for by them,
                  accountable to them alone. We charge a fixed advisory fee —
                  published publicly — and we take no commission from any
                  seller, landlord, or developer, under any circumstance.
                </p>
                <p>
                  Since 2022, we have advised over 180 clients across more than
                  ₦12 billion in protected transactions. Not one client has
                  suffered a title dispute or fraud loss on a Terralume-advised
                  purchase.
                </p>
              </div>
            </div>

            {/* Stats panel */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "180+", label: "Clients advised" },
                { value: "₦12B+", label: "In protected transactions" },
                { value: "0", label: "Title disputes post-completion" },
                { value: "4.9★", label: "Average client satisfaction" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col items-center justify-center rounded-2xl border border-divider bg-surface-card p-8 text-center"
                >
                  <span className="mb-2 font-display text-3xl font-bold text-navy lg:text-4xl">
                    {s.value}
                  </span>
                  <span className="text-[13px] leading-snug text-on-surface-muted">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Vision & Mission ─────────────────────────────── */}
      <section className="bg-navy py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Vision
              </p>
              <p className="font-display text-xl font-bold leading-snug text-white lg:text-2xl">
                To become the top structured real estate services and clean
                energy service provider across Nigeria.
              </p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-white/5 px-8 py-8">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Mission
              </p>
              <p className="font-display text-xl font-bold leading-snug text-white lg:text-2xl">
                To illuminate the lives of Nigerians with adequate housing and
                clean energy solutions for their homes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── One Operating Model ───────────────────────────── */}
      <section className="bg-surface-alt py-20 lg:py-24">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                <span className="h-px w-8 bg-gold" />
                One Operating Model, Not Two Businesses
              </div>
              <h2 className="font-display text-3xl font-bold text-navy lg:text-4xl">
                Two divisions. One process.
              </h2>
              <p className="mt-5 text-[16px] leading-relaxed text-on-surface-muted">
                Terralume runs two divisions — Real Estate Acquisition &amp;
                Intelligence, and Renewable Energy as a Service — but they share
                one process: understand what a client actually needs, verify it
                rigorously, and deliver only what holds up.
              </p>
              <p className="mt-4 text-[16px] leading-relaxed text-on-surface-muted">
                We built Terralume to close the gap between property and power —
                not to bundle two products for the sake of it.
              </p>
            </div>
            <div className="space-y-4">
              <div className="rounded-2xl border border-divider bg-surface p-7">
                <p className="mb-2 font-semibold text-navy">
                  A property without reliable power is an incomplete asset.
                </p>
                <p className="text-[14px] leading-relaxed text-on-surface-muted">
                  A clean title and a fair price mean little if the building
                  runs on a generator eight hours a day. Our real estate clients
                  can choose to add an energy assessment before acquisition
                  closes — because the two decisions belong together.
                </p>
              </div>
              <div className="rounded-2xl border border-divider bg-surface p-7">
                <p className="mb-2 font-semibold text-navy">
                  Power without a sound property strategy is a system with
                  nothing to protect.
                </p>
                <p className="text-[14px] leading-relaxed text-on-surface-muted">
                  Our energy division stands on its own — you don&apos;t need to
                  be a real estate client to engage it. But when both are in
                  scope, the integration happens inside one intake, one team,
                  and one timeline.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem we solve ───────────────────────────── */}
      <section className="bg-surface-alt py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              The Problem
              <span className="h-px w-8 bg-gold" />
            </div>
            <h2 className="mb-6 font-display text-4xl font-bold text-navy">
              Who works for the buyer in Lagos?
            </h2>
            <p className="text-[16px] leading-relaxed text-on-surface-muted">
              Traditional agents are paid by and loyal to the seller. Developers
              market to buyers but represent themselves. Solicitors advise on
              documents but rarely investigate the physical or commercial facts.
              Before Terralume, there was no professional whose sole job was to
              represent the buyer's interests from brief to completion.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-3">
            {[
              {
                party: "Traditional Agent",
                paid_by: "Seller (5–10% commission)",
                works_for: "Completing the sale",
                verdict: "Conflict of interest",
                bad: true,
              },
              {
                party: "Developer",
                paid_by: "Buyer (via sale proceeds)",
                works_for: "Maximising their margin",
                verdict: "Self-interest",
                bad: true,
              },
              {
                party: "Terralume",
                paid_by: "Buyer (fixed fee)",
                works_for: "Protecting the buyer",
                verdict: "No conflict",
                bad: false,
              },
            ].map((row) => (
              <div
                key={row.party}
                className={`rounded-2xl border p-6 ${
                  row.bad
                    ? "border-divider bg-surface"
                    : "border-navy bg-navy-dark text-white"
                }`}
              >
                <p
                  className={`mb-5 font-display text-xl font-bold ${row.bad ? "text-navy" : "text-white"}`}
                >
                  {row.party}
                </p>
                <div className="space-y-3 text-[13px]">
                  <div>
                    <p
                      className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wider ${row.bad ? "text-on-surface-muted" : "text-white/50"}`}
                    >
                      Paid by
                    </p>
                    <p
                      className={row.bad ? "text-on-surface" : "text-white/80"}
                    >
                      {row.paid_by}
                    </p>
                  </div>
                  <div>
                    <p
                      className={`mb-0.5 text-[10px] font-semibold uppercase tracking-wider ${row.bad ? "text-on-surface-muted" : "text-white/50"}`}
                    >
                      Works for
                    </p>
                    <p
                      className={row.bad ? "text-on-surface" : "text-white/80"}
                    >
                      {row.works_for}
                    </p>
                  </div>
                  <div
                    className={`mt-4 rounded-lg px-3 py-2 text-center text-[12px] font-semibold uppercase tracking-widest ${
                      row.bad
                        ? "bg-gold-light text-gold"
                        : "bg-white/10 text-white"
                    }`}
                  >
                    {row.verdict}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ──────────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Leadership
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-navy">
              Founder-led. Data-driven.
            </h2>
            <p className="text-[16px] leading-relaxed text-on-surface-muted">
              Terralume is founder-led, with strategy and business development
              built around structured, data-led decision-making — applying the
              same discipline real estate and energy investors expect from
              institutional partners to individual clients and estates across
              Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section className="bg-surface-alt py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
              <span className="h-px w-8 bg-gold" />
              Our Values
            </div>
            <h2 className="mb-4 font-display text-4xl font-bold text-navy">
              8 considerations that guide every engagement
            </h2>
            <p className="text-[16px] leading-relaxed text-on-surface-muted">
              These are not aspirational statements — they are the operating
              rules of every Terralume transaction.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="relative flex flex-col rounded-2xl border border-divider bg-surface p-6 transition-shadow hover:shadow-md"
                >
                  {/* Number watermark */}
                  <span className="absolute right-4 top-3 font-display text-6xl font-bold leading-none text-navy/5 select-none">
                    {i + 1}
                  </span>

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gold-light">
                    <Icon className="h-5 w-5 text-gold" />
                  </div>

                  <p className="mb-2 font-display text-[16px] font-bold text-navy">
                    {v.title}
                  </p>
                  <p className="text-[13px] leading-relaxed text-on-surface-muted">
                    {v.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Compliance ────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
            <div>
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                <span className="h-px w-8 bg-gold" />
                Compliance & Registration
              </div>
              <h2 className="mb-4 font-display text-4xl font-bold text-navy">
                Regulated, insured, and verifiable
              </h2>
              <p className="text-[16px] leading-relaxed text-on-surface-muted">
                Every advisory firm we recommend clients check before engaging
                is regulated. We hold ourselves to the same standard — and we
                make our registration details public so you can verify them
                independently.
              </p>
              <div className="mt-8 rounded-2xl border border-navy/20 bg-navy-light p-6">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-navy">
                  Regulatory Grounding
                </p>
                <p className="text-[14px] leading-relaxed text-on-surface-muted">
                  Our real estate evaluations and energy deployments are
                  informed by Nigeria&apos;s{" "}
                  <span className="font-semibold text-navy">
                    Electricity Act 2023
                  </span>{" "}
                  and the Nigerian Electricity Regulatory Commission&apos;s
                  Mini-Grid and Net Billing regulations, alongside standard real
                  estate practice and the data-protection obligations of the{" "}
                  <span className="font-semibold text-navy">
                    Nigeria Data Protection Act 2023
                  </span>
                  .
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {compliance.map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl border border-divider bg-surface-card p-6"
                >
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    {item.label}
                  </p>
                  <p className="mb-1 font-display text-xl font-bold text-navy">
                    {item.value}
                  </p>
                  <p className="text-[13px] text-on-surface-muted">
                    {item.note}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-divider bg-surface p-5">
                <p className="mb-1 text-[13px] text-on-surface-muted">
                  You can independently verify our LASRERA registration at{" "}
                  <span className="font-semibold text-navy">
                    lasrera.lagosstate.gov.ng
                  </span>{" "}
                  and our CAC number at{" "}
                  <span className="font-semibold text-navy">
                    search.cac.gov.ng
                  </span>
                  .
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
