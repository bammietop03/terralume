import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

const insights = [
  {
    category: "Market Report",
    categoryStyle: "text-navy bg-navy-light",
    date: "March 2026",
    title: "Lagos Prime Residential: Q1 2026 Price Tracker",
    excerpt:
      "Lekki Phase 1 asking prices up 11% YoY. Ikoyi seeing correction in high-end segment. Our quarterly data breakdown.",
    slug: "lagos-q1-2026-price-tracker",
    readTime: "6 min read",
  },
  {
    category: "Legal Guide",
    categoryStyle: "text-crimson bg-crimson-light",
    date: "February 2026",
    title: "Title Verification in Nigeria: What Buyers Must Know",
    excerpt:
      "C of O, Deed of Assignment, Governor's Consent — which title documents actually protect you and what fraudulent versions look like.",
    slug: "title-verification-guide-nigeria",
    readTime: "8 min read",
  },
  {
    category: "Investment Guide",
    categoryStyle: "text-navy bg-navy-light",
    date: "January 2026",
    title: "Why Energy Infrastructure Determines Asset Value",
    excerpt:
      "The silent factor in every Nigerian real estate investment — and how to evaluate and improve it before acquisition or development.",
    slug: "energy-infrastructure-asset-value",
    readTime: "5 min read",
  },
];

export function InsightsTeaserSection() {
  return (
    <section className="bg-surface-alt py-28 lg:py-36 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-12">
        {/* Header */}
        <div className="mb-16 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-5 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              Intelligence &amp; Insights
            </p>
            <h2 className="font-display text-4xl font-bold leading-tight text-navy lg:text-5xl">
              Market Intelligence{" "}
              <span className="italic text-crimson">&amp; Insights</span>
            </h2>
          </div>
          <Button
            asChild
            variant="outline"
            className="shrink-0 gap-2 self-start sm:self-auto"
          >
            <Link href="/market-intelligence">
              View All Insights
              <ArrowRight size={15} />
            </Link>
          </Button>
        </div>

        {/* Insight cards */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {insights.map((post, i) => (
            <Link
              key={post.slug}
              href={`/market-intelligence/${post.slug}`}
              className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface hover:shadow-md hover:border-navy/20 transition-all duration-300"
            >
              {/* Color accent top bar */}
              <div
                aria-hidden
                className={`h-0.5 ${i === 0 ? "bg-navy" : i === 1 ? "bg-crimson" : "bg-navy"}`}
              />

              <div className="flex flex-1 flex-col p-8">
                {/* Meta */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold ${post.categoryStyle}`}
                  >
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1.5 text-[12px] text-on-surface-muted/60">
                    <Calendar size={11} />
                    <span>{post.date}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 font-display text-[19px] font-semibold text-navy leading-snug group-hover:text-navy/80 transition-colors duration-200">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="mb-6 flex-1 text-[14px] leading-relaxed text-on-surface-muted">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-divider pt-5">
                  <span className="text-[12px] text-on-surface-muted/60">
                    {post.readTime}
                  </span>
                  <div className="flex items-center gap-1.5 text-[13px] font-medium text-navy group-hover:gap-2.5 transition-all duration-200">
                    Read
                    <ArrowRight size={13} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
