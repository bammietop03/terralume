import { TOTAL_STEPS } from "./types";

export function ProgressBar({
  step,
  totalSteps = TOTAL_STEPS,
}: {
  step: number;
  totalSteps?: number;
}) {
  const pct = Math.round((step / totalSteps) * 100);

  return (
    <div className="mb-8">
      {/* Step counter */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          Step {step} of {totalSteps}
        </span>
      </div>

      {/* Fill track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-card">
        <div
          className="h-full rounded-full bg-navy transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
