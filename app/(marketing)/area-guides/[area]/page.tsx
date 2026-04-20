import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  areaGuides,
  RECOMMENDATION_CONFIG,
  type AreaGuide,
  type RatingLevel,
} from "@/lib/area-guides-data";

/* ── Static params ─────────────────────────────────────── */
export function generateStaticParams() {
  return areaGuides.map((a) => ({ area: a.slug }));
}

/* ── Metadata ──────────────────────────────────────────── */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ area: string }>;
}): Promise<Metadata> {
  const { area } = await params;
  const guide = areaGuides.find((a) => a.slug === area);
  if (!guide) return {};
  return {
    title: `${guide.name} Property Guide — Prices, Risks & Verdict | Terralume`,
    description: guide.summary,
  };
}

/* ── Sub-components ────────────────────────────────────── */

function RatingDots({
  score,
  max = 5,
  activeClass = "bg-navy",
}: {
  score: RatingLevel;
  max?: number;
  activeClass?: string;
}) {
  return (
    <span className="flex items-center gap-1">
      {Array.from({ length: max }).map((_, i) => (
        <span
          key={i}
          className={[
            "inline-block h-2.5 w-2.5 rounded-full",
            i < score ? activeClass : "border border-divider bg-surface-card",
          ].join(" ")}
        />
      ))}
    </span>
  );
}

function InfraCard({ area }: { area: AreaGuide }) {
  const rows: { label: string; score: RatingLevel }[] = [
    { label: "Roads", score: area.infrastructure.roads },
    { label: "Power supply", score: area.infrastructure.power },
    { label: "Water supply", score: area.infrastructure.water },
    { label: "Internet / fibre", score: area.infrastructure.internet },
    { label: "Security presence", score: area.infrastructure.security },
  ];

  return (
    <div className="rounded-2xl border border-divider bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-on-surface">
        Infrastructure
      </h3>
      <ul className="divide-y divide-divider">
        {rows.map(({ label, score }) => (
          <li key={label} className="flex items-center justify-between py-3">
            <span className="text-sm text-on-surface-muted">{label}</span>
            <RatingDots score={score} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function RiskCard({ area }: { area: AreaGuide }) {
  const riskColor = (score: RatingLevel) => {
    if (score <= 1) return "bg-emerald-100 text-emerald-700";
    if (score <= 2) return "bg-lime-100 text-lime-700";
    if (score <= 3) return "bg-amber-100 text-amber-700";
    if (score <= 4) return "bg-orange-100 text-orange-700";
    return "bg-crimson-light text-crimson";
  };

  return (
    <div className="rounded-2xl border border-divider bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-on-surface">
        Risk Assessment
      </h3>
      <div className="space-y-4">
        {/* Flood risk */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface">
              Flood Risk
            </span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${riskColor(area.floodRisk.score)}`}
            >
              {area.floodRisk.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-muted">
            {area.floodRisk.detail}
          </p>
        </div>

        <div className="h-px bg-divider" />

        {/* Omo-onile risk */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-on-surface">
              Omo-onile Risk
            </span>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${riskColor(area.omoOnileRisk.score)}`}
            >
              {area.omoOnileRisk.label}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-on-surface-muted">
            {area.omoOnileRisk.detail}
          </p>
        </div>
      </div>
    </div>
  );
}

function TitleCard({ area }: { area: AreaGuide }) {
  return (
    <div className="rounded-2xl border border-divider bg-white p-6">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-lg font-semibold text-on-surface">
          Title Security
        </h3>
        <RatingDots score={area.titleSecurity} activeClass="bg-crimson" />
      </div>
      <p className="text-xs leading-relaxed text-on-surface-muted">
        {area.titleNote}
      </p>
    </div>
  );
}

function ProximityCard({ area }: { area: AreaGuide }) {
  return (
    <div className="rounded-2xl border border-divider bg-white p-6">
      <h3 className="mb-4 font-display text-lg font-semibold text-on-surface">
        Proximity
      </h3>
      <ul className="divide-y divide-divider">
        {area.proximityMinutes.map(({ to, minutes, note }) => (
          <li key={to} className="py-3">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm text-on-surface-muted">{to}</span>
              <span className="shrink-0 text-sm font-semibold text-on-surface">
                {minutes}
              </span>
            </div>
            {note && (
              <p className="mt-0.5 text-xs text-on-surface-muted">{note}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecommendationBanner({ area }: { area: AreaGuide }) {
  const rec = RECOMMENDATION_CONFIG[area.recommendation];
  return (
    <div className={`rounded-2xl border p-6 ${rec.color} border-current/20`}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-muted">
            Terralume Verdict
          </p>
          <p
            className={`mt-1 font-display text-2xl font-bold ${rec.textColor}`}
          >
            {rec.label}
          </p>
        </div>
        <div className="flex-1">
          <p className="text-sm leading-relaxed text-on-surface">
            {area.recommendationRationale}
          </p>
        </div>
      </div>
    </div>
  );
}

function PriceTable({ area }: { area: AreaGuide }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-divider">
      {/* Buy */}
      <div className="border-b border-divider bg-navy-light px-6 py-4">
        <h3 className="font-display text-base font-semibold text-navy">
          Purchase Prices
        </h3>
      </div>
      <div className="divide-y divide-divider bg-white">
        {area.buyPrices.map((p) => (
          <div
            key={p.label}
            className="flex flex-col gap-0.5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-on-surface">{p.label}</span>
            <span className="text-sm font-semibold text-on-surface">
              {p.low} – {p.high}{" "}
              <span className="font-normal text-on-surface-muted">
                {p.unit}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Rent */}
      <div className="border-b border-t border-divider bg-surface-card px-6 py-4">
        <h3 className="font-display text-base font-semibold text-on-surface">
          Rental Prices
        </h3>
      </div>
      <div className="divide-y divide-divider bg-white">
        {area.rentPrices.map((p) => (
          <div
            key={p.label}
            className="flex flex-col gap-0.5 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <span className="text-sm text-on-surface">{p.label}</span>
            <span className="text-sm font-semibold text-on-surface">
              {p.low} – {p.high}{" "}
              <span className="font-normal text-on-surface-muted">
                {p.unit}
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────── */
export default async function AreaGuidePage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  const { area: areaSlug } = await params;
  const guide = areaGuides.find((a) => a.slug === areaSlug);
  if (!guide) notFound();

  const currentIndex = areaGuides.indexOf(guide);
  const prevGuide = currentIndex > 0 ? areaGuides[currentIndex - 1] : null;
  const nextGuide =
    currentIndex < areaGuides.length - 1 ? areaGuides[currentIndex + 1] : null;

  return (
    <>
      <PageHero
        eyebrow={`${guide.zone === "island" ? "Lagos Island Corridor" : guide.zone === "peri-urban" ? "Peri-Urban Growth Zone" : "Lagos Mainland"} · Area Guide`}
        title={guide.name}
        description={guide.tagline}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Area Guides", href: "/area-guides" },
          { label: guide.name },
        ]}
        imageSrc={guide.image}
      />

      {/* Featured image banner */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72 lg:h-96">
        <Image
          src={guide.image}
          alt={`${guide.name} Lagos`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-b from-navy-dark/30 to-navy-dark/10" />
      </div>

      {/* Main content */}
      <div className="bg-surface py-16">
        <div className="mx-auto max-w-7xl px-6">
          {/* Lead summary */}
          <div className="mx-auto mb-14 max-w-3xl">
            <p className="text-lg leading-relaxed text-on-surface-muted">
              {guide.summary}
            </p>
          </div>

          {/* Recommendation banner */}
          <div className="mb-14">
            <RecommendationBanner area={guide} />
          </div>

          {/* Main grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            {/* ── Left column (2/3 width) */}
            <div className="space-y-10 lg:col-span-2">
              {/* Price tables */}
              <section>
                <h2 className="mb-5 font-display text-xl font-bold text-on-surface">
                  Price Ranges
                </h2>
                <PriceTable area={guide} />
                <p className="mt-2 text-xs text-on-surface-muted">
                  Indicative ranges based on current market analysis. All
                  figures in Nigerian Naira (₦) unless stated otherwise.
                </p>
              </section>

              {/* Property types */}
              <section>
                <h2 className="mb-5 font-display text-xl font-bold text-on-surface">
                  Property Types Available
                </h2>
                <div className="space-y-3">
                  {guide.propertyTypes.map((pt) => (
                    <div
                      key={pt.type}
                      className="rounded-xl border border-divider bg-white p-5"
                    >
                      <p className="font-semibold text-on-surface">{pt.type}</p>
                      <p className="mt-1 text-sm text-on-surface-muted">
                        {pt.notes}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Pros and cons */}
              <section>
                <h2 className="mb-5 font-display text-xl font-bold text-on-surface">
                  Strengths &amp; Considerations
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Pros */}
                  <div className="rounded-2xl border border-divider bg-emerald-50 p-6">
                    <h3 className="mb-4 font-semibold text-emerald-800">
                      Strengths
                    </h3>
                    <ul className="space-y-2.5">
                      {guide.pros.map((p) => (
                        <li
                          key={p}
                          className="flex items-start gap-2.5 text-sm text-emerald-900"
                        >
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Cons */}
                  <div className="rounded-2xl border border-divider bg-crimson-light p-6">
                    <h3 className="mb-4 font-semibold text-crimson">
                      Considerations
                    </h3>
                    <ul className="space-y-2.5">
                      {guide.cons.map((c) => (
                        <li
                          key={c}
                          className="flex items-start gap-2.5 text-sm text-crimson"
                        >
                          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                          {c}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* Best for */}
              <section>
                <h2 className="mb-5 font-display text-xl font-bold text-on-surface">
                  Best Suited For
                </h2>
                <div className="flex flex-wrap gap-3">
                  {guide.bestFor.map((b) => (
                    <span
                      key={b}
                      className="rounded-full border border-divider bg-navy-light px-4 py-2 text-sm font-medium text-navy"
                    >
                      {b}
                    </span>
                  ))}
                </div>
              </section>

              {/* Nearby facilities */}
              <section>
                <h2 className="mb-5 font-display text-xl font-bold text-on-surface">
                  Nearby Facilities
                </h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {guide.nearbyFacilities.map((f) => (
                    <div
                      key={f.category}
                      className="rounded-xl border border-divider bg-white p-5"
                    >
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
                        {f.category}
                      </p>
                      <ul className="space-y-1">
                        {f.examples.map((ex) => (
                          <li key={ex} className="text-sm text-on-surface">
                            {ex}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </section>

              {/* Terralume activity note */}
              <section className="rounded-2xl border border-divider bg-surface-alt p-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-crimson">
                  Terralume Activity
                </p>
                <p className="text-sm leading-relaxed text-on-surface-muted">
                  {guide.terralumesActivity}
                </p>
              </section>
            </div>

            {/* ── Right column (sidebar) */}
            <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
              <InfraCard area={guide} />
              <RiskCard area={guide} />
              <TitleCard area={guide} />
              <ProximityCard area={guide} />

              {/* CTA card */}
              <div className="rounded-2xl bg-navy p-6 text-white">
                <h3 className="font-display text-lg font-semibold">
                  Buying in {guide.shortName}?
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Get independent advisory support from a team that operates
                  here every day.
                </p>
                <Link
                  href="/contact"
                  className="mt-5 block rounded-xl bg-crimson px-5 py-3 text-center text-sm font-semibold text-white transition-opacity hover:opacity-90"
                >
                  Start your advisory
                </Link>
                <Link
                  href="/services"
                  className="mt-2 block rounded-xl border border-white/20 px-5 py-3 text-center text-sm font-medium text-white transition-colors hover:bg-white/10"
                >
                  View service packages
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-surface-alt py-8">
        <div className="mx-auto max-w-5xl px-6">
          <p className="text-center text-xs leading-relaxed text-on-surface-muted">
            All information in this area guide is indicative only and based on
            current market analysis. Ratings and price ranges are periodically
            updated. This guide does not constitute legal or financial advice.
            Always conduct independent due diligence with qualified solicitors,
            surveyors, and financial advisors before any property transaction.
          </p>
        </div>
      </div>

      {/* Prev / Next navigation */}
      <div className="bg-surface py-10">
        <div className="mx-auto max-w-5xl px-6">
          <div className="flex items-center justify-between gap-4">
            {prevGuide ? (
              <Link
                href={`/area-guides/${prevGuide.slug}`}
                className="group flex max-w-sm items-center gap-3 rounded-xl border border-divider p-4 text-sm transition-shadow hover:shadow-md"
              >
                <svg
                  className="h-5 w-5 shrink-0 text-on-surface-muted transition-transform group-hover:-translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span>
                  <span className="block text-xs text-on-surface-muted">
                    Previous area
                  </span>
                  <span className="mt-0.5 block font-semibold text-on-surface">
                    {prevGuide.name}
                  </span>
                </span>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/area-guides"
              className="text-sm font-medium text-navy hover:underline"
            >
              All area guides
            </Link>

            {nextGuide ? (
              <Link
                href={`/area-guides/${nextGuide.slug}`}
                className="group flex max-w-sm items-center gap-3 rounded-xl border border-divider p-4 text-sm transition-shadow hover:shadow-md"
              >
                <span className="text-right">
                  <span className="block text-xs text-on-surface-muted">
                    Next area
                  </span>
                  <span className="mt-0.5 block font-semibold text-on-surface">
                    {nextGuide.name}
                  </span>
                </span>
                <svg
                  className="h-5 w-5 shrink-0 text-on-surface-muted transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>

      <FooterCTA />
    </>
  );
}
