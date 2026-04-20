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
  title: "About Terralume — Buyer-Side Real Estate Advisory, Lagos",
  description:
    "Terralume is Lagos's dedicated buyer-side real estate advisory firm. We work exclusively for property buyers and renters — never sellers, landlords, or developers.",
  openGraph: {
    title: "About Terralume",
    description:
      "Founded to solve a structural problem in the Lagos property market — we work exclusively for buyers.",
    type: "website",
  },
};

/* ─── Data ───────────────────────────────────────────────── */

const team = [
  {
    initials: "AO",
    name: "Amara Okonkwo",
    title: "Founder & Head of Advisory",
    background:
      "Former investment banker with 11 years of Lagos real estate transaction experience. Structured over ₦4.2 billion in residential and commercial acquisitions before founding Terralume.",
    mission:
      "Property in Lagos should be navigable by anyone with the right guide.",
  },
  {
    initials: "FH",
    name: "Fatima Al-Hassan",
    title: "Head of Legal & Due Diligence",
    background:
      "Qualified Nigerian solicitor with dual specialisation in property law and fraud litigation. Previously practised at a top-tier Lagos commercial law firm, advising on title disputes and Land Registry challenges.",
    mission: "Every buyer deserves to know exactly what they are signing.",
  },
  {
    initials: "CE",
    name: "Chidi Ezekwu",
    title: "Senior Project Manager",
    background:
      "Eight years managing residential and commercial property transactions across Lagos. Previously at a major Lagos developer where he observed first-hand the gap between buyer and seller representation.",
    mission:
      "A great process eliminates the anxiety that should never accompany buying a home.",
  },
  {
    initials: "NB",
    name: "Ngozi Balogun",
    title: "Project Manager — Diaspora Desk",
    background:
      "Based between Lagos and London, Ngozi leads the Terralume diaspora advisory programme. Former Deloitte analyst with deep knowledge of cross-border property transactions and FX structuring.",
    mission:
      "Being abroad should never mean being vulnerable in a Lagos property deal.",
  },
  {
    initials: "TK",
    name: "Taiwo Komolafe",
    title: "Market Intelligence Analyst",
    background:
      "Urban economist and data analyst specialising in Lagos residential market trends. Produces Terralume's quarterly market intelligence reports and area guides, drawing on registered transaction datasets and primary research.",
    mission:
      "Better data means better decisions — and fewer buyers getting burned.",
  },
];

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
            Built for the buyer.{" "}
            <em className="italic text-crimson">Only the buyer.</em>
          </>
        }
        description="Terralume exists because buyers in the Lagos property market have historically had no one working exclusively for them. We are changing that — one transaction at a time."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
        minHeight="50vh"
      />

      {/* ── Our story ─────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
            {/* Text */}
            <div>
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                <span className="h-px w-8 bg-crimson" />
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

      {/* ── The problem we solve ───────────────────────────── */}
      <section className="bg-surface-alt py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              The Problem
              <span className="h-px w-8 bg-crimson" />
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
                        ? "bg-crimson-light text-crimson"
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
          <div className="mb-12">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              The Team
            </div>
            <h2 className="font-display text-4xl font-bold text-navy">
              The people behind every transaction
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <div
                key={member.name}
                className="group flex flex-col rounded-2xl border border-divider bg-surface-card p-7 transition-shadow hover:shadow-md"
              >
                {/* Avatar */}
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-navy text-[16px] font-bold text-white">
                  {member.initials}
                </div>

                {/* Name + title */}
                <p className="mb-0.5 font-display text-[18px] font-bold text-navy">
                  {member.name}
                </p>
                <p className="mb-4 text-[12px] font-semibold uppercase tracking-widest text-crimson">
                  {member.title}
                </p>

                {/* Background */}
                <p className="mb-5 flex-1 text-[13px] leading-relaxed text-on-surface-muted">
                  {member.background}
                </p>

                {/* Personal mission */}
                <div className="border-t border-divider pt-4">
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-on-surface-muted">
                    Personal mission
                  </p>
                  <p className="text-[13px] italic leading-relaxed text-on-surface">
                    &ldquo;{member.mission}&rdquo;
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ────────────────────────────────────────── */}
      <section className="bg-surface-alt py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="mb-12 max-w-2xl">
            <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
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

                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-navy-light">
                    <Icon className="h-5 w-5 text-navy" />
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
              <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                <span className="h-px w-8 bg-crimson" />
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

      {/* ── Media kit ─────────────────────────────────────── */}
      <section className="border-y border-divider bg-surface-alt py-16">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              <div className="mb-3 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                <span className="h-px w-8 bg-crimson" />
                Press & Partnerships
              </div>
              <h2 className="mb-2 font-display text-2xl font-bold text-navy">
                Media kit & partnership enquiries
              </h2>
              <p className="max-w-lg text-[15px] text-on-surface-muted">
                For press coverage, podcast appearances, speaking engagements,
                or partnership discussions — download our media kit or reach out
                directly.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-3 sm:items-end">
              <a
                href="/terralume-media-kit.pdf"
                download
                className="flex items-center gap-2 rounded-lg bg-navy px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-navy-dark"
              >
                Download media kit
                <ExternalLink className="h-4 w-4" />
              </a>
              <Link
                href="/contact"
                className="flex items-center gap-2 rounded-lg border border-divider bg-surface px-6 py-3 text-[14px] font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-surface-card"
              >
                Partnership enquiry
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
