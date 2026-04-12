import Image from "next/image";
import Link from "next/link";
import { Clock, User } from "lucide-react";
import { Article, CATEGORIES } from "@/lib/articles-data";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface ArticleCardProps {
  article: Article;
  variant?: "default" | "featured";
}

export default function ArticleCard({
  article,
  variant = "default",
}: ArticleCardProps) {
  const category = CATEGORIES.find((c) => c.slug === article.category)!;

  if (variant === "featured") {
    return (
      <Link
        href={`/market-intelligence/${article.slug}`}
        className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface transition-shadow hover:shadow-xl md:flex-row"
      >
        {/* Image */}
        <div className="relative aspect-video shrink-0 overflow-hidden md:aspect-auto md:w-[52%]">
          <Image
            fill
            src={article.image}
            alt={article.title}
            className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 52vw"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent md:hidden" />
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-center p-7 lg:p-10">
          {/* Category + Featured badge */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${category.color} ${category.textColor}`}
            >
              {category.label}
            </span>
            <span className="rounded-full bg-crimson px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white">
              Featured
            </span>
          </div>

          <h2 className="mb-3 font-display text-2xl font-bold leading-snug text-navy transition-colors group-hover:text-crimson lg:text-3xl">
            {article.title}
          </h2>

          <p className="mb-6 line-clamp-3 text-[15px] leading-relaxed text-on-surface-muted">
            {article.excerpt}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-[13px] text-on-surface-muted">
            <span className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5" />
              {article.author.name}
              <span className="text-on-surface-muted/60">·</span>
              {article.author.role}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime} min read
            </span>
            <span>{formatDate(article.date)}</span>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/market-intelligence/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-divider bg-surface transition-shadow hover:shadow-lg"
    >
      {/* Image */}
      <div className="relative aspect-video overflow-hidden">
        <Image
          fill
          src={article.image}
          alt={article.title}
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Category badge */}
        <div className="mb-3">
          <span
            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-widest ${category.color} ${category.textColor}`}
          >
            {category.label}
          </span>
        </div>

        <h3 className="mb-2 flex-1 font-display text-[17px] font-bold leading-snug text-navy transition-colors group-hover:text-crimson">
          {article.title}
        </h3>

        <p className="mb-4 line-clamp-2 text-[13px] leading-relaxed text-on-surface-muted">
          {article.excerpt}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-divider pt-4 text-[12px] text-on-surface-muted">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {article.author.name}
          </span>
          <span className="text-divider">·</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {article.readTime} min
          </span>
          <span className="text-divider">·</span>
          <span>{formatDate(article.date)}</span>
        </div>
      </div>
    </Link>
  );
}
