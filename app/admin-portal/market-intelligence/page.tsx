import { redirect } from "next/navigation";
import { requireRole } from "@/app/actions/auth";
import { getArticles } from "@/app/actions/articles";
import ArticlesTable from "@/components/portal/admin/ArticlesTable";
import { Newspaper, BookOpen, Eye, EyeOff } from "lucide-react";

export const metadata = {
  title: "Market Intelligence — Terralume Admin Portal",
};

export default async function MarketIntelligencePage() {
  const user = await requireRole("ADMIN").catch(() => null);
  if (!user) redirect("/admin-login");

  const articles = await getArticles();

  const total = articles.length;
  const published = articles.filter((a) => a.published).length;
  const drafts = total - published;

  const stats = [
    {
      label: "Total articles",
      value: total,
      icon: Newspaper,
      iconBg: "bg-(--color-navy-light)",
      iconColor: "text-(--color-navy)",
    },
    {
      label: "Published",
      value: published,
      icon: Eye,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: EyeOff,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Content
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Market Intelligence
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Manage all articles — create, edit, publish, or remove content.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.label}
              className="rounded-2xl border border-divider bg-surface shadow-sm px-5 py-4 flex items-center gap-4"
            >
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                <Icon size={20} className={s.iconColor} />
              </span>
              <div>
                <p className="text-2xl font-bold text-on-surface leading-none">
                  {s.value}
                </p>
                <p className="text-xs text-on-surface-muted mt-0.5">
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <ArticlesTable initialArticles={articles} />
    </div>
  );
}
