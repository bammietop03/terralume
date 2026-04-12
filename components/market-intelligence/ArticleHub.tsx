"use client";

import { useState, useMemo } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Article, CATEGORIES, CategorySlug } from "@/lib/articles-data";
import ArticleCard from "./ArticleCard";

const POSTS_PER_PAGE = 12;

interface Props {
  articles: Article[];
}

export default function ArticleHub({ articles }: Props) {
  const [activeCategory, setActiveCategory] = useState<CategorySlug | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = articles;

    if (activeCategory !== "all") {
      result = result.filter((a) => a.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.author.name.toLowerCase().includes(q),
      );
    }

    return result;
  }, [articles, activeCategory, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * POSTS_PER_PAGE;
  const paginated = filtered.slice(startIdx, startIdx + POSTS_PER_PAGE);

  const isDefaultView =
    activeCategory === "all" && !searchQuery.trim() && safePage === 1;
  const featuredArticle = isDefaultView
    ? (paginated.find((a) => a.featured) ?? null)
    : null;
  const gridArticles =
    isDefaultView && featuredArticle
      ? paginated.filter((a) => a.slug !== featuredArticle.slug)
      : paginated;

  function handleCategoryChange(cat: CategorySlug | "all") {
    setActiveCategory(cat);
    setPage(1);
  }

  function handleSearchChange(val: string) {
    setSearchQuery(val);
    setPage(1);
  }

  function buildPageNumbers(): (number | "…")[] {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    if (safePage > 3) pages.push("…");
    for (
      let i = Math.max(2, safePage - 1);
      i <= Math.min(totalPages - 1, safePage + 1);
      i++
    ) {
      pages.push(i);
    }
    if (safePage < totalPages - 2) pages.push("…");
    pages.push(totalPages);
    return pages;
  }

  return (
    <div className="bg-surface-alt">
      {/* ── Filter + search bar ────────────────────────────── */}
      <div className="sticky top-17 z-20 border-b border-divider bg-surface/95 backdrop-blur-sm">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between">
            {/* Category pills */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleCategoryChange("all")}
                className={`rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                  activeCategory === "all"
                    ? "bg-navy text-white"
                    : "border border-divider bg-surface text-on-surface-muted hover:border-navy/30 hover:text-navy"
                }`}
              >
                All
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`rounded-full px-4 py-1.5 text-[12px] font-semibold uppercase tracking-widest transition-colors ${
                    activeCategory === cat.slug
                      ? "bg-navy text-white"
                      : "border border-divider bg-surface text-on-surface-muted hover:border-navy/30 hover:text-navy"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative shrink-0 sm:w-60">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-muted" />
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full rounded-lg border border-divider bg-surface py-2 pl-9 pr-9 text-[13px] text-on-surface placeholder:text-on-surface-muted/60 focus:border-navy/40 focus:outline-none focus:ring-2 focus:ring-navy/10"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────── */}
      <div className="container mx-auto max-w-6xl px-6 py-14">
        {/* Results count */}
        <p className="mb-8 text-[13px] text-on-surface-muted">
          {filtered.length === 0
            ? "No articles found"
            : `${filtered.length} article${filtered.length !== 1 ? "s" : ""}${
                activeCategory !== "all" || searchQuery
                  ? " matching your selection"
                  : ""
              }`}
        </p>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-24 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface-card">
              <Search className="h-7 w-7 text-on-surface-muted" />
            </div>
            <p className="font-display text-2xl font-bold text-navy">
              No articles found
            </p>
            <p className="max-w-sm text-[15px] text-on-surface-muted">
              Try a different search term or browse all categories.
            </p>
            <button
              onClick={() => {
                handleCategoryChange("all");
                handleSearchChange("");
              }}
              className="mt-2 rounded-lg border border-divider bg-surface px-5 py-2.5 text-[13px] font-semibold text-navy hover:border-navy/30"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Featured article */}
        {featuredArticle && (
          <div className="mb-10">
            <ArticleCard article={featuredArticle} variant="featured" />
          </div>
        )}

        {/* Grid */}
        {gridArticles.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {gridArticles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-14 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-divider bg-surface text-on-surface-muted transition-colors hover:border-navy/30 hover:text-navy disabled:pointer-events-none disabled:opacity-30"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            {buildPageNumbers().map((p, i) =>
              p === "…" ? (
                <span
                  key={`ellipsis-${i}`}
                  className="flex h-9 w-9 items-center justify-center text-[13px] text-on-surface-muted"
                >
                  …
                </span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-[13px] font-semibold transition-colors ${
                    safePage === p
                      ? "bg-navy text-white"
                      : "border border-divider bg-surface text-on-surface-muted hover:border-navy/30 hover:text-navy"
                  }`}
                >
                  {p}
                </button>
              ),
            )}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-divider bg-surface text-on-surface-muted transition-colors hover:border-navy/30 hover:text-navy disabled:pointer-events-none disabled:opacity-30"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
