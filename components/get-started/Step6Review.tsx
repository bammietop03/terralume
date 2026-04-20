"use client";

import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

const TYPE_LABEL: Record<string, string> = {
  rent: "Rental",
  buy: "Purchase",
  lease: "Commercial Lease",
};

function SummaryItem({
  label,
  value,
}: {
  label: string;
  value?: string | string[] | null;
}) {
  const display = Array.isArray(value)
    ? value.length > 0
      ? value.join(", ")
      : null
    : value || null;

  return (
    <div className="rounded-xl bg-surface-alt px-3.5 py-3">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-muted">
        {label}
      </p>
      <p
        className={[
          "mt-0.5 text-sm font-medium",
          display ? "text-on-surface" : "italic text-on-surface-muted",
        ].join(" ")}
      >
        {display ?? "Not provided"}
      </p>
    </div>
  );
}

export function Step6Review({ data, set }: Props) {
  const displayName =
    data.preferredName || data.fullName.split(" ")[0] || "there";

  const budgetDisplay =
    data.budgetMin && data.budgetMax
      ? `${data.currency} ${data.budgetMin} – ${data.budgetMax}`
      : data.budgetMin
        ? `${data.currency} ${data.budgetMin}+`
        : null;

  return (
    <div className="space-y-6">
      {/* Summary grid */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          Your brief
        </p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-2">
          <SummaryItem
            label="Transaction type"
            value={TYPE_LABEL[data.transactionType] ?? data.transactionType}
          />
          <SummaryItem label="Purpose" value={data.purpose} />
          <SummaryItem label="Name" value={data.fullName} />
          <SummaryItem label="Based in" value={data.location} />
          <SummaryItem label="Areas" value={data.targetAreas} />
          <SummaryItem label="Property type" value={data.propertyType} />
          <SummaryItem label="Budget range" value={budgetDisplay} />
          <SummaryItem
            label="Target date"
            value={data.targetDate || "Flexible"}
          />
        </div>
      </div>

      {/* What happens next box */}
      <div className="flex gap-3 rounded-xl border border-navy/20 bg-navy-light px-4 py-3">
        <div className="mt-0.5 w-1 shrink-0 rounded-full bg-navy" />
        <p className="text-xs leading-relaxed text-navy">
          <strong>What happens next:</strong> A Terralume advisor will review
          your brief and contact you within 48 hours to schedule your 30–45
          minute discovery call. We will confirm your reference number by email
          immediately after submission.
        </p>
      </div>

      {/* Consent */}
      <div>
        <label className="flex cursor-pointer items-start gap-3">
          <span
            onClick={() => set({ dataConsent: !data.dataConsent })}
            className={[
              "mt-0.5 flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded border-[1.5px] transition-all",
              data.dataConsent
                ? "border-navy bg-navy text-white"
                : "border-divider-strong bg-surface",
            ].join(" ")}
          >
            {data.dataConsent && (
              <svg
                className="h-2.5 w-2.5"
                fill="none"
                viewBox="0 0 12 12"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2 6l3 3 5-5"
                />
              </svg>
            )}
          </span>
          <span className="text-xs leading-relaxed text-on-surface-muted">
            I confirm the information provided is accurate and I consent to
            Terralume Ltd processing my personal data for the purpose of
            providing advisory services, in accordance with the Nigeria Data
            Protection Regulation (NDPR).
          </span>
        </label>
      </div>
    </div>
  );
}
