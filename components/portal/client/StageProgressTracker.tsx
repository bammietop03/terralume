import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export const STAGES = [
  { key: "discovery", label: "Discovery" },
  { key: "brief_confirmation", label: "Brief Confirmation" },
  { key: "area_shortlisting", label: "Area Shortlisting" },
  { key: "property_search", label: "Property Search" },
  { key: "due_diligence", label: "Due Diligence" },
  { key: "offer_negotiation", label: "Offer & Negotiation" },
  { key: "legal_completion", label: "Legal & Completion" },
  { key: "handover", label: "Handover" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

interface Props {
  currentStage: string;
}

export default function StageProgressTracker({ currentStage }: Props) {
  const currentIndex = STAGES.findIndex((s) => s.key === currentStage);
  const safeIndex = currentIndex === -1 ? 0 : currentIndex;
  const pct = Math.round(((safeIndex + 1) / STAGES.length) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)]">
      {/* Crimson accent top stripe */}
      <div className="h-1 w-full bg-linear-to-r from-[--color-crimson] to-[--color-navy]" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-on-surface">
            Your Journey
          </h2>
          <span className="text-xs font-bold text-[--color-crimson]">
            {pct}%
          </span>
        </div>

        {/* Progress bar */}
        <div className="mb-5 h-1.5 w-full rounded-full bg-[--color-navy-light] overflow-hidden">
          <div
            className="h-full rounded-full bg-linear-to-r from-[--color-crimson] to-[--color-navy] transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>

        <ol className="relative flex flex-col gap-0">
          {STAGES.map((stage, i) => {
            const isDone = i < safeIndex;
            const isCurrent = i === safeIndex;
            const isUpcoming = i > safeIndex;
            const isLast = i === STAGES.length - 1;

            return (
              <li key={stage.key} className="flex gap-3.5 relative">
                {/* Connector line */}
                {!isLast && (
                  <div
                    className={cn(
                      "absolute left-3.25 top-7 w-0.5 h-full -z-10",
                      isDone
                        ? "bg-linear-to-b from-[--color-crimson] to-[--color-navy-light]"
                        : "bg-divider",
                    )}
                  />
                )}

                {/* Step circle */}
                <div className="shrink-0 mt-0.5">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-full flex items-center justify-center border-2 transition-all",
                      isDone &&
                        "border-[--color-crimson] bg-[--color-crimson] text-white",
                      isCurrent &&
                        "border-[--color-navy] bg-[--color-navy] text-white ring-4 ring-[--color-navy]/15",
                      isUpcoming &&
                        "border-divider bg-surface text-on-surface-muted",
                    )}
                  >
                    {isDone ? (
                      <Check size={12} strokeWidth={3} />
                    ) : (
                      <span className="text-[10px] font-bold">{i + 1}</span>
                    )}
                  </div>
                </div>

                {/* Label */}
                <div className="pb-5">
                  <p
                    className={cn(
                      "text-sm leading-tight",
                      isDone && "text-on-surface-muted line-through",
                      isCurrent && "text-on-surface font-semibold",
                      isUpcoming && "text-on-surface-muted",
                    )}
                  >
                    {stage.label}
                  </p>
                  {isCurrent && (
                    <span className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[--color-navy]">
                      <span className="h-1 w-1 rounded-full bg-[--color-navy] animate-pulse" />
                      In progress
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
