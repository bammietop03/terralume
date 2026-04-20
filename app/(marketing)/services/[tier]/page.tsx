import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Users,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Metadata } from "next";
import { tiers, tierOrder, type TierSlug } from "@/lib/services-data";
import ComparisonTable from "@/components/services/ComparisonTable";
import { FooterCTA } from "@/components/home/FooterCTA";
import PageHero from "@/components/layout/PageHero";

interface Props {
  params: Promise<{ tier: string }>;
}

export function generateStaticParams() {
  return tierOrder.map((slug) => ({ tier: slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tier: slug } = await params;
  const tier = tiers.find((t) => t.slug === slug);
  if (!tier) return {};
  return {
    title: `${tier.name} — ${tier.tag} | Terralume`,
    description: tier.tagline,
  };
}

export default async function TierPage({ params }: Props) {
  const { tier: slug } = await params;
  const tier = tiers.find((t) => t.slug === (slug as TierSlug));
  if (!tier) notFound();

  const currentIndex = tierOrder.indexOf(tier.slug);
  const prevSlug = currentIndex > 0 ? tierOrder[currentIndex - 1] : null;
  const nextSlug =
    currentIndex < tierOrder.length - 1 ? tierOrder[currentIndex + 1] : null;
  const prevTier = prevSlug ? tiers.find((t) => t.slug === prevSlug) : null;
  const nextTier = nextSlug ? tiers.find((t) => t.slug === nextSlug) : null;

  return (
    <>
      <PageHero
        eyebrow={tier.tag}
        title={<>{tier.name} Package</>}
        description={tier.tagline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Services", href: "/services" },
          { label: tier.name },
        ]}
        minHeight="56vh"
        chips={
          <>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm">
              {tier.priceFrom}
              <span className="text-white/60">{tier.priceSuffix}</span>
            </span>
            <span className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[13px] font-semibold text-white backdrop-blur-sm">
              <Clock className="h-4 w-4 text-white/60" />
              {tier.timeline}
            </span>
          </>
        }
      />

      {/* ── Main content ─────────────────────────────────────── */}
      <section className="bg-surface py-20">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-3">
            {/* ── Left: sticky sidebar ── */}
            <aside className="lg:col-span-1">
              <div className="sticky top-28 space-y-4">
                {/* Price card */}
                <div className="rounded-2xl border border-divider bg-surface-card p-6">
                  <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    Advisory fee from
                  </p>
                  <p className="font-display text-3xl font-bold text-navy">
                    {tier.priceFrom}
                  </p>
                  <p className="mb-6 text-[13px] text-on-surface-muted">
                    {tier.priceSuffix}
                  </p>

                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-crimson px-5 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-crimson/90"
                  >
                    Start your enquiry
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-center text-[12px] text-on-surface-muted">
                    Free 30-minute consultation included
                  </p>
                </div>

                {/* Timeline */}
                <div className="rounded-2xl border border-divider bg-surface p-5">
                  <div className="flex items-center gap-2.5 text-[13px] text-on-surface">
                    <Clock className="h-4 w-4 shrink-0 text-crimson" />
                    <div>
                      <p className="font-semibold text-on-surface">
                        Typical timeline
                      </p>
                      <p className="text-on-surface-muted">{tier.timeline}</p>
                    </div>
                  </div>
                </div>

                {/* For who */}
                <div className="rounded-2xl border border-divider bg-surface p-5">
                  <div className="mb-3 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    <Users className="h-4 w-4" />
                    This package is for
                  </div>
                  <ul className="space-y-2">
                    {tier.forWho.map((w, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-[13px] text-on-surface"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                        {w}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </aside>

            {/* ── Right: details ── */}
            <div className="space-y-12 lg:col-span-2">
              {/* Inclusions */}
              <div>
                <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                  <span className="h-px w-8 bg-crimson" />
                  What's included
                </div>
                <h2 className="mb-6 font-display text-3xl font-bold text-navy">
                  Full Package Inclusions
                </h2>
                <ul className="space-y-3.5">
                  {tier.inclusions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-xl border border-divider bg-surface-card px-5 py-4 text-[14px] text-on-surface"
                    >
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-crimson" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Exclusions */}
              <div>
                <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-on-surface-muted">
                  <span className="h-px w-8 bg-divider" />
                  What's not included
                </div>
                <ul className="space-y-2.5">
                  {tier.exclusions.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-[14px] text-on-surface-muted"
                    >
                      <XCircle className="mt-0.5 h-5 w-5 shrink-0 opacity-40" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Comparison table */}
              <div>
                <div className="mb-6 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
                  <span className="h-px w-8 bg-crimson" />
                  How we compare
                </div>
                <h2 className="mb-6 font-display text-3xl font-bold text-navy">
                  Terralume vs. the alternatives
                </h2>
                <ComparisonTable comparison={tier.comparison} />
              </div>

              {/* Bottom CTA */}
              <div className="rounded-2xl bg-navy-dark p-8 text-center">
                <p className="mb-2 font-display text-2xl font-bold text-white">
                  Ready to get started?
                </p>
                <p className="mb-6 text-[15px] text-white/70">
                  Start with a free 30-minute consultation. No obligation.
                </p>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-lg bg-crimson px-7 py-3.5 text-[14px] font-semibold text-white transition-colors hover:bg-crimson/90"
                >
                  Start your enquiry
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Prev / Next navigation ───────────────────────────── */}
      {(prevTier || nextTier) && (
        <section className="border-t border-divider bg-surface-alt py-12">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="flex items-center justify-between gap-4">
              {prevTier ? (
                <Link
                  href={`/services/${prevTier.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-divider bg-surface px-6 py-4 transition-colors hover:border-navy/30 hover:bg-surface-card"
                >
                  <ArrowLeft className="h-4 w-4 text-on-surface-muted transition-transform group-hover:-translate-x-0.5" />
                  <span>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                      Previous
                    </p>
                    <p className="text-[14px] font-semibold text-navy">
                      {prevTier.name}
                    </p>
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nextTier && (
                <Link
                  href={`/services/${nextTier.slug}`}
                  className="group flex items-center gap-3 rounded-xl border border-divider bg-surface px-6 py-4 transition-colors hover:border-navy/30 hover:bg-surface-card"
                >
                  <span className="text-right">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                      Next
                    </p>
                    <p className="text-[14px] font-semibold text-navy">
                      {nextTier.name}
                    </p>
                  </span>
                  <ArrowRight className="h-4 w-4 text-on-surface-muted transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      <FooterCTA />
    </>
  );
}
