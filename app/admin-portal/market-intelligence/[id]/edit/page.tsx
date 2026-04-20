import { redirect, notFound } from "next/navigation";
import { requireRole } from "@/app/actions/auth";
import { getArticles } from "@/app/actions/articles";
import ArticleForm from "@/components/portal/admin/ArticleForm";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Edit Article — Terralume Admin Portal",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditArticlePage({ params }: Props) {
  const user = await requireRole("ADMIN").catch(() => null);
  if (!user) redirect("/admin-login");

  const { id } = await params;
  const articles = await getArticles();
  const article = articles.find((a) => a.id === id);
  if (!article) notFound();

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin-portal/market-intelligence"
          className="inline-flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors mb-4"
        >
          <ArrowLeft size={14} />
          Back to Market Intelligence
        </Link>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Content
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Edit article
        </h1>
        <p className="text-sm text-on-surface-muted mt-1 font-mono">
          {article.slug}
        </p>
      </div>

      <ArticleForm article={article} displayAuthor={article.author} />
    </div>
  );
}
