import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Clock, User, ArrowLeft, ArrowRight, CalendarDays } from "lucide-react";
import { CATEGORIES } from "@/lib/articles-data";
import type { Article, CategorySlug } from "@/lib/articles-data";
import { getPublishedArticles, getArticleBySlug } from "@/app/actions/articles";
import type { ArticleRow } from "@/app/actions/articles";
import ArticleBody from "@/components/market-intelligence/ArticleBody";
import ArticleCard from "@/components/market-intelligence/ArticleCard";
import { FooterCTA } from "@/components/home/FooterCTA";

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Terralume Advisory",
  PM: "Property Manager",
  CLIENT: "Team Member",
};

function dbArticleToArticle(row: ArticleRow): Article {
  const category = row.category
    .toLowerCase()
    .replace(/_/g, "-") as CategorySlug;
  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    author: {
      name: row.author.fullName ?? row.author.preferredName ?? "Terralume",
      role: ROLE_LABEL[row.author.role] ?? "Contributor",
    },
    date: row.publishedAt.toISOString(),
    readTime: row.readTime,
    category,
    image: row.image,
    featured: row.featured,
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const rows = await getPublishedArticles();
  return rows.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const row = await getArticleBySlug(slug);
  if (!row || !row.published) return {};
  return {
    title: `${row.title} | Terralume Market Intelligence`,
    description: row.excerpt,
    openGraph: {
      title: row.title,
      description: row.excerpt,
      type: "article",
      publishedTime: row.publishedAt.toISOString(),
      authors: [row.author.fullName ?? row.author.preferredName ?? "Terralume"],
      images: [{ url: row.image }],
    },
  };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;

  const [row, allRows] = await Promise.all([
    getArticleBySlug(slug),
    getPublishedArticles(),
  ]);

  if (!row || !row.published) notFound();

  const article = dbArticleToArticle(row);
  const allArticles = allRows.map(dbArticleToArticle);

  const category = CATEGORIES.find((c) => c.slug === article.category)!;
  const body =
    typeof row.body === "string" && row.body.trim() ? row.body : null;

  // Related articles — same category, excluding current
  const related = allArticles
    .filter((a) => a.category === article.category && a.slug !== article.slug)
    .slice(0, 3);

  // Prev / next in master list
  const currentIndex = allArticles.findIndex((a) => a.slug === article.slug);
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle =
    currentIndex < allArticles.length - 1
      ? allArticles[currentIndex + 1]
      : null;

  return (
    <>
      {/* ── Article header ───────────────────────────────────── */}
      <header className="bg-navy-dark pb-0 pt-28">
        <div className="container mx-auto max-w-5xl px-6 pt-8 pb-10">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-white/50">
            <Link href="/" className="transition-colors hover:text-white/80">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/market-intelligence"
              className="transition-colors hover:text-white/80"
            >
              Market Intelligence
            </Link>
            <span>/</span>
            <span className="line-clamp-1 max-w-55 text-white/80">
              {article.title}
            </span>
          </nav>

          {/* Category badge */}
          <div className="mb-5">
            <Link
              href={`/market-intelligence?category=${article.category}`}
              className={`inline-block rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-80 ${category.color} ${category.textColor}`}
            >
              {category.label}
            </Link>
          </div>

          {/* Title */}
          <h1 className="mb-6 font-display text-3xl font-bold leading-snug text-white lg:text-4xl xl:text-5xl">
            {article.title}
          </h1>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-white/60">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              <span className="font-medium text-white/80">
                {article.author.name}
              </span>
              <span className="text-white/40">·</span>
              {article.author.role}
            </span>
            <span className="flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatDate(article.date)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* ── Featured image ───────────────────────────────────── */}
      <div className="bg-navy-dark">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="relative aspect-21/9 overflow-hidden rounded-t-2xl">
            <Image
              fill
              src={article.image}
              alt={article.title}
              className="object-cover"
              priority
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────── */}
      <section className="bg-surface py-14">
        <div className="container mx-auto max-w-5xl px-6">
          <div className="grid gap-12 lg:grid-cols-[1fr_320px]">
            {/* Article content */}
            <article>
              {/* Lead excerpt */}
              <p className="mb-8 border-l-4 border-crimson pl-5 font-display text-[18px] italic leading-relaxed text-on-surface-muted">
                {article.excerpt}
              </p>

              {body ? (
                <ArticleBody body={body} />
              ) : (
                <div className="flex flex-col items-center gap-4 rounded-2xl border border-divider bg-surface-card py-16 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-light">
                    <Clock className="h-6 w-6 text-navy" />
                  </div>
                  <p className="font-display text-xl font-bold text-navy">
                    Full article publishing soon
                  </p>
                  <p className="max-w-sm text-[14px] text-on-surface-muted">
                    We&apos;re finalising this piece. Subscribe to be notified
                    when it goes live, or browse related articles below.
                  </p>
                  <Link
                    href="/market-intelligence"
                    className="mt-2 flex items-center gap-2 rounded-lg border border-divider bg-surface px-5 py-2.5 text-[13px] font-semibold text-navy hover:border-navy/30"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to all articles
                  </Link>
                </div>
              )}

              {/* Prev / next navigation */}
              {(prevArticle || nextArticle) && (
                <div className="mt-14 flex items-stretch justify-between gap-4 border-t border-divider pt-10">
                  {prevArticle ? (
                    <Link
                      href={`/market-intelligence/${prevArticle.slug}`}
                      className="group flex max-w-[46%] items-start gap-3 rounded-xl border border-divider bg-surface p-5 transition-colors hover:border-navy/30 hover:bg-surface-card"
                    >
                      <ArrowLeft className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-muted transition-transform group-hover:-translate-x-0.5" />
                      <span>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                          Previous
                        </p>
                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-navy">
                          {prevArticle.title}
                        </p>
                      </span>
                    </Link>
                  ) : (
                    <div />
                  )}

                  {nextArticle && (
                    <Link
                      href={`/market-intelligence/${nextArticle.slug}`}
                      className="group ml-auto flex max-w-[46%] items-start gap-3 rounded-xl border border-divider bg-surface p-5 text-right transition-colors hover:border-navy/30 hover:bg-surface-card"
                    >
                      <span>
                        <p className="mb-1 text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                          Next
                        </p>
                        <p className="line-clamp-2 text-[13px] font-semibold leading-snug text-navy">
                          {nextArticle.title}
                        </p>
                      </span>
                      <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-on-surface-muted transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  )}
                </div>
              )}
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-28 space-y-6">
                {/* Author card */}
                <div className="rounded-2xl border border-divider bg-surface-card p-6">
                  <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    Written by
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-[15px] font-bold text-white">
                      {article.author.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-on-surface">
                        {article.author.name}
                      </p>
                      <p className="text-[13px] text-on-surface-muted">
                        {article.author.role}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CTA card */}
                <div className="rounded-2xl bg-navy-dark p-6 text-center">
                  <p className="mb-2 font-display text-[17px] font-bold text-white">
                    Need expert guidance?
                  </p>
                  <p className="mb-5 text-[13px] leading-relaxed text-white/70">
                    Our advisors work exclusively for buyers — never the seller.
                  </p>
                  <Link
                    href="/contact"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-crimson px-4 py-3 text-[13px] font-semibold text-white transition-colors hover:bg-crimson/90"
                  >
                    Start your enquiry
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <p className="mt-3 text-[11px] text-white/50">
                    Free 30-min consultation
                  </p>
                </div>

                {/* Category badge */}
                <div className="rounded-xl border border-divider bg-surface p-5">
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
                    Category
                  </p>
                  <Link
                    href={`/market-intelligence?category=${article.category}`}
                    className={`inline-flex items-center rounded-full px-3 py-1.5 text-[12px] font-semibold uppercase tracking-widest transition-opacity hover:opacity-80 ${category.color} ${category.textColor}`}
                  >
                    {category.label}
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Related articles ─────────────────────────────────── */}
      {related.length > 0 && (
        <section className="border-t border-divider bg-surface-alt py-16">
          <div className="container mx-auto max-w-5xl px-6">
            <div className="mb-8 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-crimson">
              <span className="h-px w-8 bg-crimson" />
              More in {category.label}
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link
                href="/market-intelligence"
                className="inline-flex items-center gap-2 rounded-lg border border-divider bg-surface px-6 py-3 text-[13px] font-semibold text-navy transition-colors hover:border-navy/30 hover:bg-surface-card"
              >
                Browse all articles
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <FooterCTA />
    </>
  );
}
