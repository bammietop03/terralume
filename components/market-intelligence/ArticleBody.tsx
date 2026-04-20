import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface Props {
  body: string;
}

const components: Components = {
  p: ({ children }) => (
    <p className="mb-6 text-[16px] leading-[1.85] text-on-surface">
      {children}
    </p>
  ),
  h2: ({ children }) => (
    <h2 className="mb-4 mt-10 font-display text-2xl font-bold text-navy first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-3 mt-8 font-display text-xl font-bold text-navy">
      {children}
    </h3>
  ),
  h1: ({ children }) => (
    <h1 className="mb-4 mt-10 font-display text-3xl font-bold text-navy">
      {children}
    </h1>
  ),
  ul: ({ children }) => (
    <ul className="mb-6 space-y-2.5 pl-0 list-none">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-6 space-y-2.5 pl-0 list-none">{children}</ol>
  ),
  li: ({ children, ...props }) => {
    // Detect ordered list via parent context by checking node
    const isOrdered = (props as { ordered?: boolean }).ordered;
    return (
      <li className="flex items-start gap-3 text-[15px] leading-relaxed text-on-surface">
        {isOrdered ? (
          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-[11px] font-bold text-white">
            {(props as { index?: number }).index != null
              ? ((props as { index?: number }).index ?? 0) + 1
              : "•"}
          </span>
        ) : (
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-crimson" />
        )}
        <span>{children}</span>
      </li>
    );
  },
  blockquote: ({ children }) => (
    <div className="mb-6 rounded-xl border border-navy/20 bg-navy-light px-5 py-4 flex gap-3">
      <span className="mt-0.5 text-navy shrink-0">ℹ</span>
      <div className="text-[15px] leading-relaxed text-navy/80">{children}</div>
    </div>
  ),
  hr: () => <hr className="my-8 border-divider" />,
  strong: ({ children }) => (
    <strong className="font-semibold text-on-surface">{children}</strong>
  ),
  em: ({ children }) => <em className="italic text-on-surface">{children}</em>,
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-crimson underline underline-offset-2 hover:text-crimson/80 transition-colors"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
  code: ({ children, className }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return (
        <pre className="mb-6 overflow-x-auto rounded-xl bg-navy-dark p-5">
          <code className="text-sm text-white/90 font-mono">{children}</code>
        </pre>
      );
    }
    return (
      <code className="rounded bg-surface-card px-1.5 py-0.5 text-[14px] font-mono text-navy">
        {children}
      </code>
    );
  },
};

export default function ArticleBody({ body }: Props) {
  return (
    <div className="prose-article">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {body}
      </ReactMarkdown>
    </div>
  );
}
