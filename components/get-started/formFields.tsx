/* Shared Tailwind class strings used across all step components */
export const labelClass = "block text-sm font-medium text-on-surface mb-1.5";
export const inputClass =
  "w-full rounded-xl border border-divider bg-white px-4 py-3 text-sm text-on-surface placeholder:text-on-surface-muted outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10";
export const selectClass =
  "w-full appearance-none rounded-xl border border-divider bg-white px-4 py-3 text-sm text-on-surface outline-none transition-all focus:border-navy focus:ring-2 focus:ring-navy/10 cursor-pointer";
export const hintClass = "mt-1.5 text-xs text-on-surface-muted";

/* ── Field wrapper ─────────────────────────────────────── */
export function Field({
  label,
  hint,
  required = false,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className={labelClass}>
        {label}
        {required && <span className="ml-0.5 text-crimson">*</span>}
      </label>
      {children}
      {hint && <p className={hintClass}>{hint}</p>}
    </div>
  );
}

/* ── Radio group ───────────────────────────────────────── */
export function RadioGroup({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[] | string[];
  value: string;
  onChange: (v: string) => void;
}) {
  const normalised = (
    options as (string | { value: string; label: string })[]
  ).map((o) => (typeof o === "string" ? { value: o, label: o } : o));

  return (
    <div className="space-y-2">
      {normalised.map(({ value: v, label }) => (
        <label
          key={v}
          className={[
            "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
            value === v
              ? "border-navy bg-navy-light font-medium text-navy"
              : "border-divider bg-white text-on-surface hover:border-navy/40",
          ].join(" ")}
        >
          <span
            className={[
              "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              value === v ? "border-navy" : "border-divider",
            ].join(" ")}
          >
            {value === v && <span className="h-2 w-2 rounded-full bg-navy" />}
          </span>
          {label}
          <input
            type="radio"
            value={v}
            checked={value === v}
            onChange={() => onChange(v)}
            className="sr-only"
          />
        </label>
      ))}
    </div>
  );
}

/* ── Checkbox group ────────────────────────────────────── */
export function CheckGroup({
  options,
  values,
  onChange,
}: {
  options: string[];
  values: string[];
  onChange: (v: string[]) => void;
}) {
  function toggle(opt: string) {
    onChange(
      values.includes(opt) ? values.filter((x) => x !== opt) : [...values, opt],
    );
  }

  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {options.map((opt) => {
        const checked = values.includes(opt);
        return (
          <label
            key={opt}
            className={[
              "flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-colors",
              checked
                ? "border-navy bg-navy-light font-medium text-navy"
                : "border-divider bg-white text-on-surface hover:border-navy/40",
            ].join(" ")}
          >
            <span
              className={[
                "flex h-4 w-4 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
                checked ? "border-navy bg-navy" : "border-divider",
              ].join(" ")}
            >
              {checked && (
                <svg
                  className="h-2.5 w-2.5 text-white"
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
              )}
            </span>
            {opt}
            <input
              type="checkbox"
              checked={checked}
              onChange={() => toggle(opt)}
              className="sr-only"
            />
          </label>
        );
      })}
    </div>
  );
}

/* ── Select chevron ────────────────────────────────────── */
export function SelectChevron() {
  return (
    <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-muted">
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </span>
  );
}
