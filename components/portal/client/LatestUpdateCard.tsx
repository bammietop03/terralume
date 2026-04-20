import { FileText, ChevronRight } from "lucide-react";
import type { Update } from "@/types";

interface Props {
  update: Update | null;
}

function fmtDate(d: Date | null | string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function LatestUpdateCard({ update }: Props) {
  if (!update) {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-[--color-navy-light] to-[--color-navy-light]" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[--color-navy-light] ring-1 ring-[--color-navy]/5">
              <FileText size={18} className="text-[--color-navy]" />
            </div>
            <h2 className="text-sm font-semibold text-on-surface">
              Latest Update
            </h2>
          </div>
          <p className="text-sm text-on-surface-muted">
            No updates yet. Your PM will post the first update soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
      {/* Navy accent stripe */}
      <div className="h-1 w-full bg-linear-to-r from-[--color-navy] to-[--color-navy-light]" />

      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-linear-to-br from-[--color-navy] to-[--color-navy-dark] text-white shadow-sm ring-1 ring-black/3">
            <FileText size={18} />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-on-surface">
              Latest Update
            </h2>
            {update.publishedAt && (
              <p className="text-xs text-on-surface-muted">
                {fmtDate(update.publishedAt)}
              </p>
            )}
          </div>
        </div>

        <p className="text-sm text-on-surface leading-relaxed mb-4 line-clamp-4">
          {update.content}
        </p>

        {update.nextSteps && (
          <div className="rounded-xl bg-[--color-navy-light]/50 border border-[--color-navy]/8 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-[--color-navy] mb-2">
              Next steps
            </p>
            <ul className="space-y-1.5">
              {update.nextSteps
                .split("\n")
                .filter(Boolean)
                .map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-on-surface"
                  >
                    <ChevronRight
                      size={14}
                      className="mt-0.5 shrink-0 text-[--color-crimson]"
                    />
                    {step}
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
