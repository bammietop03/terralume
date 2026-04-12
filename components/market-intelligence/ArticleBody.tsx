import { AlertTriangle, Info, AlertCircle } from "lucide-react";
import { ContentBlock } from "@/lib/articles-content";

interface Props {
  blocks: ContentBlock[];
}

const calloutConfig = {
  info: {
    icon: Info,
    bg: "bg-navy-light",
    border: "border-navy/20",
    iconColor: "text-navy",
    titleColor: "text-navy",
    textColor: "text-navy/80",
  },
  warning: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    iconColor: "text-amber-600",
    titleColor: "text-amber-800",
    textColor: "text-amber-700",
  },
  danger: {
    icon: AlertCircle,
    bg: "bg-crimson-light",
    border: "border-crimson/20",
    iconColor: "text-crimson",
    titleColor: "text-crimson",
    textColor: "text-crimson/80",
  },
};

export default function ArticleBody({ blocks }: Props) {
  return (
    <div className="prose-article">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "paragraph":
            return (
              <p
                key={i}
                className="mb-6 text-[16px] leading-[1.85] text-on-surface"
              >
                {block.text}
              </p>
            );

          case "heading2":
            return (
              <h2
                key={i}
                className="mb-4 mt-10 font-display text-2xl font-bold text-navy first:mt-0"
              >
                {block.text}
              </h2>
            );

          case "heading3":
            return (
              <h3
                key={i}
                className="mb-3 mt-8 font-display text-xl font-bold text-navy"
              >
                {block.text}
              </h3>
            );

          case "list": {
            const Tag = block.ordered ? "ol" : "ul";
            return (
              <Tag
                key={i}
                className={`mb-6 space-y-2.5 pl-0 ${block.ordered ? "list-none" : "list-none"}`}
              >
                {block.items.map((item, j) => (
                  <li
                    key={j}
                    className="flex items-start gap-3 text-[15px] leading-relaxed text-on-surface"
                  >
                    {block.ordered ? (
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
                        {j + 1}
                      </span>
                    ) : (
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
                    )}
                    {item}
                  </li>
                ))}
              </Tag>
            );
          }

          case "callout": {
            const variant = block.variant ?? "info";
            const cfg = calloutConfig[variant];
            const Icon = cfg.icon;
            return (
              <div
                key={i}
                className={`my-8 flex gap-4 rounded-xl border p-5 ${cfg.bg} ${cfg.border}`}
              >
                <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.iconColor}`} />
                <div>
                  {block.title && (
                    <p
                      className={`mb-1 text-[13px] font-bold uppercase tracking-wide ${cfg.titleColor}`}
                    >
                      {block.title}
                    </p>
                  )}
                  <p className={`text-[14px] leading-relaxed ${cfg.textColor}`}>
                    {block.text}
                  </p>
                </div>
              </div>
            );
          }

          case "divider":
            return <hr key={i} className="my-10 border-divider" />;

          default:
            return null;
        }
      })}
    </div>
  );
}
