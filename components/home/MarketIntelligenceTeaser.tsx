import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    category: "Market Report",
    date: "March 2026",
    title: "Lagos Prime Residential: Q1 2026 Price Tracker",
    excerpt:
      "Lekki Phase 1 asking prices up 11% YoY. Ikoyi seeing correction in high-end segment. Our quarterly data breakdown.",
    slug: "lagos-q1-2026-price-tracker",
  },
  {
    category: "Buyer Guide",
    date: "February 2026",
    title: "Title Verification in Nigeria: What Buyers Must Know",
    excerpt:
      "C of O, Deed of Assignment, Governor's Consent — which title documents actually protect you and what fraudulent versions look like.",
    slug: "title-verification-guide-nigeria",
  },
  {
    category: "Due Diligence",
    date: "January 2026",
    title: "7 Red Flags in a Lagos Property Listing",
    excerpt:
      "From suspiciously low prices to evasive landlords, our team has seen every trick. Here's how to spot a bad deal before you commit.",
    slug: "red-flags-lagos-property-listing",
  },
];

const categoryColors: Record<string, string> = {
  "Market Report": "text-navy bg-navy-light",
  "Buyer Guide": "text-crimson bg-crimson-light",
  "Due Diligence": "text-navy bg-navy-light",
};

export function MarketIntelligenceTeaser() {
  return (
    <section className="bg-surface py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        <div className="mb-16 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              Market intelligence
            </p>
            <h2 className="font-display text-4xl font-bold text-navy lg:text-5xl">
              The authoritative voice on Lagos property
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-on-surface-muted">
              Data-driven insights from the team on the ground.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link href="/market-intelligence">Read all insights</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/market-intelligence/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface-card transition-all hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="h-0.75 bg-linear-to-r from-crimson to-navy" />
              <div className="flex flex-1 flex-col gap-4 p-7 xl:p-8">
                <div className="flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${categoryColors[post.category] ?? "bg-surface-alt text-on-surface-muted"}`}
                  >
                    {post.category}
                  </span>
                  <span className="flex items-center gap-1.5 text-[12px] text-on-surface-muted">
                    <Calendar size={11} />
                    {post.date}
                  </span>
                </div>

                <h3 className="font-display text-[18px] font-semibold leading-snug text-navy transition-colors group-hover:text-crimson">
                  {post.title}
                </h3>

                <p className="flex-1 text-[14px] leading-relaxed text-on-surface-muted">
                  {post.excerpt}
                </p>

                <span className="inline-flex items-center gap-1.5 text-[13px] font-bold uppercase tracking-wide text-navy transition-all group-hover:gap-3 group-hover:text-crimson">
                  Read article <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
