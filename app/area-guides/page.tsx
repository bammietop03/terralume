import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import PageHero from "@/components/layout/PageHero";
import { FooterCTA } from "@/components/home/FooterCTA";
import {
  areaGuides,
  RECOMMENDATION_CONFIG,
  type AreaGuide,
} from "@/lib/area-guides-data";

export const metadata: Metadata = {
  title: "Lagos Area Guides — Know Where You're Buying | Terralume",
  description:
    "Independent, data-driven guides to Lagos's major residential areas. Price ranges, infrastructure ratings, flood risk, omo-onile risk, and Terralume's verdict — for every major area.",
};

const ZONE_LABELS: Record<AreaGuide["zone"], string> = {
  island: "Lagos Island Corridor",
  mainland: "Lagos Mainland",
  "peri-urban": "Peri-Urban Growth Zone",
};

const ZONE_ORDER: AreaGuide["zone"][] = ["island", "peri-urban", "mainland"];

const aresByZone = ZONE_ORDER.map((zone) => ({
  zone,
  label: ZONE_LABELS[zone],
  areas: areaGuides.filter((a) => a.zone === zone),
}));

function InfraIcon({ score }: { score: number }) {
  return (
    <span className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={
            i < score
              ? "inline-block h-2 w-2 rounded-full bg-navy"
              : "inline-block h-2 w-2 rounded-full bg-surface-card border border-divider"
          }
        />
      ))}
    </span>
  );
}

function AreaCard({ area }: { area: AreaGuide }) {
  const rec = RECOMMENDATION_CONFIG[area.recommendation];
  const avgInfra = Math.round(
    (area.infrastructure.roads +
      area.infrastructure.power +
      area.infrastructure.water +
      area.infrastructure.internet +
      area.infrastructure.security) /
      5,
  );

  return (
    <Link
      href={`/area-guides/${area.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-divider bg-white transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video w-full overflow-hidden bg-navy-light">
        <Image
          src={area.image}
          alt={area.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-navy-dark/60 to-transparent" />

        {/* Recommendation badge */}
        <span
          className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${rec.color} ${rec.textColor}`}
        >
          {rec.label}
        </span>

        {/* Zone badge */}
        <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-on-surface">
          {ZONE_LABELS[area.zone]}
        </span>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div>
          <h3 className="font-display text-xl font-semibold text-on-surface">
            {area.name}
          </h3>
          <p className="mt-1 text-sm italic text-on-surface-muted">
            {area.tagline}
          </p>
        </div>

        {/* Price snapshot */}
        {area.buyPrices[0] && (
          <div className="rounded-xl bg-surface-alt px-4 py-3">
            <p className="text-xs font-medium uppercase tracking-wide text-on-surface-muted">
              Buy from
            </p>
            <p className="mt-0.5 text-sm font-semibold text-on-surface">
              {area.buyPrices[0].low}{" "}
              <span className="font-normal text-on-surface-muted">
                {area.buyPrices[0].unit}
              </span>
            </p>
          </div>
        )}

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-xs text-on-surface-muted">Avg. Infrastructure</p>
            <div className="mt-1">
              <InfraIcon score={avgInfra} />
            </div>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted">Flood Risk</p>
            <p className="mt-0.5 font-medium text-on-surface">
              {area.floodRisk.label}
            </p>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted">Title Security</p>
            <div className="mt-1">
              <InfraIcon score={area.titleSecurity} />
            </div>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted">Omo-onile Risk</p>
            <p className="mt-0.5 font-medium text-on-surface">
              {area.omoOnileRisk.label}
            </p>
          </div>
        </div>

        {/* CTA arrow */}
        <div className="mt-auto flex items-center gap-1 text-sm font-medium text-navy transition-gap group-hover:gap-2">
          Read full guide
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-1"
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
        </div>
      </div>
    </Link>
  );
}

export default function AreaGuidesPage() {
  return (
    <>
      <PageHero
        eyebrow="Area Intelligence"
        title={
          <>
            Lagos Area Guides —<br />
            <span className="text-crimson">Know before you buy.</span>
          </>
        }
        description="Independent, data-driven guides to Lagos's major residential areas. Every guide covers price ranges, infrastructure, flood risk, omo-onile risk, title security, and Terralume's honest verdict."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Area Guides" }]}
      />

      {/* Intro strip */}
      <section className="bg-surface-alt py-16">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-on-surface-muted">
            Where you buy matters as much as what you buy. Location determines
            your title risk, flood exposure, infrastructure quality, rental
            yield, and resale liquidity. These guides are written by Terralume
            advisors who work in these markets every day — not sourced from
            developer marketing material.
          </p>
        </div>
      </section>

      {/* Zone sections */}
      {aresByZone.map(({ zone, label, areas }) => (
        <section key={zone} className="bg-surface py-16">
          <div className="mx-auto max-w-7xl px-6">
            {/* Section header */}
            <div className="mb-10 flex items-end justify-between border-b border-divider pb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-crimson">
                  {zone === "island"
                    ? "Zone 1"
                    : zone === "peri-urban"
                      ? "Zone 2"
                      : "Zone 3"}
                </p>
                <h2 className="mt-1 font-display text-2xl font-bold text-on-surface">
                  {label}
                </h2>
              </div>
              <p className="hidden text-sm text-on-surface-muted sm:block">
                {areas.length} area{areas.length !== 1 ? "s" : ""} covered
              </p>
            </div>

            {/* Cards grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {areas.map((area) => (
                <AreaCard key={area.slug} area={area} />
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Disclaimer */}
      <section className="bg-surface-alt py-10">
        <div className="mx-auto max-w-4xl px-6">
          <p className="text-center text-xs leading-relaxed text-on-surface-muted">
            All price ranges are indicative based on current market analysis and
            may vary by specific location, property condition, and market
            movement. Ratings reflect Terralume's advisory team assessment as at
            the date of publication and are updated periodically. This
            information does not constitute legal or financial advice. Always
            conduct independent due diligence with qualified professionals
            before any property transaction.
          </p>
        </div>
      </section>

      <FooterCTA />
    </>
  );
}
