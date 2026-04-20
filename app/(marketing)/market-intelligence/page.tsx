import type { Metadata } from "next";
import { BookOpen, TrendingUp, FileText } from "lucide-react";
import { CATEGORIES } from "@/lib/articles-data";
import type { Article, CategorySlug } from "@/lib/articles-data";
import { getPublishedArticles } from "@/app/actions/articles";
import type { ArticleRow } from "@/app/actions/articles";
import PageHero from "@/components/layout/PageHero";
import ArticleHub from "@/components/market-intelligence/ArticleHub";
import { FooterCTA } from "@/components/home/FooterCTA";

export const metadata: Metadata = {
  title: "Market Intelligence — Lagos Property Guides & Reports | Terralume",
  description:
    "Expert guides on Lagos property prices, how to buy property in Lagos, property due diligence, the best areas to buy, and how to avoid property fraud. Written by Terralume advisors.",
  keywords: [
    "Lagos property prices",
    "how to buy property in Lagos",
    "property due diligence Lagos",
    "best areas to buy in Lagos",
    "avoid property fraud Lagos",
    "buy property in Nigeria from UK",
    "Lagos real estate market 2025",
    "property investment Lagos",
  ],
  openGraph: {
    title: "Market Intelligence — Lagos Property Guides & Reports",
    description:
      "Expert articles, area guides, legal explainers, and fraud warnings for anyone buying or renting property in Lagos.",
    type: "website",
  },
};

function dbArticleToArticle(row: ArticleRow): Article {
  const category = row.category
    .toLowerCase()
    .replace(/_/g, "-") as CategorySlug;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    author: { name: row.authorName, role: row.authorRole },
    date: row.publishedAt.toISOString(),
    readTime: row.readTime,
    category,
    image: row.image,
    featured: row.featured,
  };
}

export default async function MarketIntelligencePage() {
  const rows = await getPublishedArticles();
  const articles = rows.map(dbArticleToArticle);

  const stats = [
    {
      icon: <BookOpen size={20} />,
      value: String(articles.length),
      label: "Published articles",
    },
    {
      icon: <FileText size={20} />,
      value: String(CATEGORIES.length),
      label: "Topic categories",
    },
    {
      icon: <TrendingUp size={20} />,
      value: "Weekly",
      label: "New content",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Market Intelligence"
        title={
          <>
            Research that works{" "}
            <em className="italic text-crimson">for buyers.</em>
          </>
        }
        description="Guides, price data, legal explainers, area analyses, and fraud warnings — everything you need to move through a Lagos property transaction with confidence."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Market Intelligence" },
        ]}
        minHeight="48vh"
      />

      {/* ── Stats strip ────────────────────────────────────── */}
      <section className="border-b border-divider bg-surface">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 divide-y divide-divider sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center justify-center gap-4 py-8 sm:py-10"
              >
                <span className="text-navy">{s.icon}</span>
                <div>
                  <span className="block font-display text-3xl font-bold leading-none text-navy">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-[12px] uppercase tracking-wider text-on-surface-muted">
                    {s.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Article hub (client component) ─────────────────── */}
      <ArticleHub articles={articles} />

      <FooterCTA />
    </>
  );
}
