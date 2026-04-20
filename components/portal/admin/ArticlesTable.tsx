"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  MoreHorizontal,
  Pencil,
  Trash2,
  PlusCircle,
  Eye,
  EyeOff,
  Loader2,
  Newspaper,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { deleteArticle, toggleArticlePublished } from "@/app/actions/articles";
import type { ArticleRow } from "@/app/actions/articles";
import type { ArticleCategory } from "@/app/generated/prisma/client";
import { toast } from "sonner";

// ─── Category meta ────────────────────────────────────────────────────────────

const CATEGORY_META: Record<
  ArticleCategory,
  { label: string; badgeClass: string }
> = {
  PRICE_DATA: {
    label: "Price Data",
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
  },
  LEGAL_GUIDES: {
    label: "Legal Guides",
    badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
  },
  AREA_ANALYSIS: {
    label: "Area Analysis",
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  FRAUD_WARNINGS: {
    label: "Fraud Warnings",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
  },
  HOW_TO_GUIDES: {
    label: "How-To Guides",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props {
  initialArticles: ArticleRow[];
}

export default function ArticlesTable({ initialArticles }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<ArticleCategory | "ALL">(
    "ALL",
  );
  const [publishedFilter, setPublishedFilter] = useState<
    "ALL" | "published" | "draft"
  >("ALL");

  const [deleteTarget, setDeleteTarget] = useState<ArticleRow | null>(null);

  // ── Filtering ──────────────────────────────────────────────────────────────

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return initialArticles.filter((a) => {
      const matchCat =
        categoryFilter === "ALL" || a.category === categoryFilter;
      const matchPub =
        publishedFilter === "ALL" ||
        (publishedFilter === "published" ? a.published : !a.published);
      const matchSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.slug.toLowerCase().includes(q) ||
        (a.author.fullName ?? a.author.preferredName ?? "").toLowerCase().includes(q);
      return matchCat && matchPub && matchSearch;
    });
  }, [initialArticles, search, categoryFilter, publishedFilter]);

  const hasFilters =
    !!search || categoryFilter !== "ALL" || publishedFilter !== "ALL";

  // ── Actions ────────────────────────────────────────────────────────────────

  function handleTogglePublished(article: ArticleRow) {
    startTransition(async () => {
      const result = await toggleArticlePublished(
        article.id,
        !article.published,
      );
      if (!result.ok) toast.error(result.error);
      else {
        toast.success(article.published ? "Article unpublished." : "Article published.");
        router.refresh();
      }
    });
  }

  function handleDeleteConfirm() {
    if (!deleteTarget) return;
    const id = deleteTarget.id;
    setDeleteTarget(null);
    startTransition(async () => {
      const result = await deleteArticle(id);
      if (!result.ok) toast.error(result.error);
      else {
        toast.success("Article deleted.");
        router.refresh();
      }
    });
  }

  function clearFilters() {
    setSearch("");
    setCategoryFilter("ALL");
    setPublishedFilter("ALL");
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
          />
          <Input
            placeholder="Search by title, slug or author"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9 text-sm bg-surface"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* Category filter */}
        <Select
          value={categoryFilter}
          onValueChange={(v) => setCategoryFilter(v as ArticleCategory | "ALL")}
        >
          <SelectTrigger className="h-9 w-full sm:w-44 text-sm bg-surface">
            <SelectValue placeholder="All categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All categories</SelectItem>
            {Object.entries(CATEGORY_META).map(([key, meta]) => (
              <SelectItem key={key} value={key}>
                {meta.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status filter */}
        <Select
          value={publishedFilter}
          onValueChange={(v) =>
            setPublishedFilter(v as "ALL" | "published" | "draft")
          }
        >
          <SelectTrigger className="h-9 w-full sm:w-36 text-sm bg-surface">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All statuses</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>

        {/* Add button */}
        <Link href="/admin-portal/market-intelligence/new">
          <Button
            size="sm"
            className="h-9 w-full sm:w-auto gap-2 bg-(--color-navy) hover:bg-(--color-navy-dark) text-white"
          >
            <PlusCircle size={15} />
            New article
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-navy-light)">
              <Newspaper size={22} className="text-(--color-navy)" />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {hasFilters ? "No results found" : "No articles yet"}
              </p>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {hasFilters
                  ? "Try adjusting your search or filters."
                  : 'Click "New article" to get started.'}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-alt border-b border-divider hover:bg-surface-alt">
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide pl-6">
                  Title
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden sm:table-cell">
                  Category
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden md:table-cell">
                  Author
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden lg:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                  Status
                </TableHead>
                <TableHead className="pr-6" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((article) => {
                const catMeta = CATEGORY_META[article.category];
                return (
                  <TableRow
                    key={article.id}
                    className="hover:bg-surface-alt transition-colors border-b border-divider last:border-0"
                  >
                    {/* Title + slug */}
                    <TableCell className="pl-6 py-3">
                      <p className="font-medium text-sm text-on-surface leading-snug line-clamp-1">
                        {article.title}
                      </p>
                      <p className="text-xs text-on-surface-muted mt-0.5 font-mono truncate max-w-xs">
                        {article.slug}
                      </p>
                    </TableCell>

                    {/* Category */}
                    <TableCell className="py-3 hidden sm:table-cell">
                      <Badge
                        variant="outline"
                        className={`text-xs font-medium ${catMeta.badgeClass}`}
                      >
                        {catMeta.label}
                      </Badge>
                    </TableCell>

                    {/* Author */}
                    <TableCell className="py-3 hidden md:table-cell">
                      <p className="text-sm text-on-surface">
                        {article.author.fullName ?? article.author.preferredName ?? "Unknown"}
                      </p>
                    </TableCell>

                    {/* Date */}
                    <TableCell className="text-sm text-on-surface-muted whitespace-nowrap py-3 hidden lg:table-cell">
                      {formatDate(article.publishedAt)}
                    </TableCell>

                    {/* Status */}
                    <TableCell className="py-3">
                      {article.published ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5">
                          <CheckCircle2 size={11} />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-0.5">
                          <XCircle size={11} />
                          Draft
                        </span>
                      )}
                    </TableCell>

                    {/* Actions */}
                    <TableCell
                      className="pr-6 py-3 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-on-surface-muted hover:text-on-surface"
                            disabled={isPending}
                          >
                            {isPending ? (
                              <Loader2 size={15} className="animate-spin" />
                            ) : (
                              <MoreHorizontal size={16} />
                            )}
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl"
                        >
                          <DropdownMenuItem asChild>
                            <Link
                              href={`/admin-portal/market-intelligence/${article.id}/edit`}
                              className="gap-2 cursor-pointer text-sm text-(--color-navy) focus:text-(--color-navy)"
                            >
                              <Pencil size={14} />
                              Edit article
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleTogglePublished(article)}
                            className="gap-2 cursor-pointer text-sm"
                          >
                            {article.published ? (
                              <>
                                <EyeOff size={14} />
                                Unpublish
                              </>
                            ) : (
                              <>
                                <Eye size={14} />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => setDeleteTarget(article)}
                            className="gap-2 cursor-pointer text-sm text-destructive focus:text-destructive"
                          >
                            <Trash2 size={14} />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Footer count */}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-on-surface-muted">
          Showing{" "}
          <span className="font-medium text-on-surface">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-medium text-on-surface">
            {initialArticles.length}
          </span>{" "}
          article{initialArticles.length !== 1 ? "s" : ""}
        </p>
        {hasFilters && filtered.length !== initialArticles.length && (
          <button
            onClick={clearFilters}
            className="text-xs text-(--color-navy) hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Delete confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete article?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleteTarget?.title}&rdquo; will be permanently deleted.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
