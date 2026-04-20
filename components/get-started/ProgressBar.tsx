import { TOTAL_STEPS, STEP_LABELS } from "./types";

export function ProgressBar({ step }: { step: number }) {
  const pct = Math.round((step / TOTAL_STEPS) * 100);

  return (
    <div className="mb-8">
      {/* Step counter + current label */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          Step {step} of {TOTAL_STEPS}
        </span>
        <span className="text-xs font-medium text-navy">
          {STEP_LABELS[step - 1]}
        </span>
      </div>

      {/* Fill track */}
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-card">
        <div
          className="h-full rounded-full bg-navy transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dot indicators */}
      <div className="mt-3 flex items-center justify-between">
        {STEP_LABELS.map((label, i) => {
          const num = i + 1;
          const done = num < step;
          const active = num === step;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <span
                className={[
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                  done
                    ? "bg-navy text-white"
                    : active
                      ? "border-2 border-navy bg-white text-navy"
                      : "border border-divider bg-white text-on-surface-muted",
                ].join(" ")}
              >
                {done ? (
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    viewBox="0 0 12 12"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2 6l3 3 5-5"
                    />
                  </svg>
                ) : (
                  num
                )}
              </span>
              <span className="hidden text-[9px] text-on-surface-muted sm:block">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
