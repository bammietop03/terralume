"use client";

import { TRANSACTION_TYPES, PURPOSES } from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step1Goal({ data, set }: Props) {
  const isLease = data.transactionType === "lease";
  const isBuy = data.transactionType === "buy";
  const isRent = data.transactionType === "rent";

  function selectType(value: string) {
    // Reset purpose when type changes
    set({ transactionType: value, purpose: "" });
  }

  const purposeOptions = data.transactionType
    ? (PURPOSES[data.transactionType] ?? [])
    : [];

  return (
    <div className="space-y-6">
      {/* Transaction type cards */}
      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          What are you looking to do? <span className="text-crimson">*</span>
        </p>
        <div className="grid grid-cols-3 gap-3">
          {TRANSACTION_TYPES.map((type) => {
            const selected = data.transactionType === type.value;
            const icons: Record<string, React.ReactNode> = {
              rent: (
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <rect
                    x="2"
                    y="6"
                    width="14"
                    height="10"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M6 6V4.5A3 3 0 0 1 12 4.5V6"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ),
              buy: (
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <path
                    d="M9 2L2 7v9h5v-4h4v4h5V7L9 2Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
              lease: (
                <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
                  <rect
                    x="2"
                    y="3"
                    width="14"
                    height="12"
                    rx="1.5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path
                    d="M5 7h8M5 11h5"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            };
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => selectType(type.value)}
                className={[
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-all",
                  selected
                    ? "border-navy bg-navy-light text-navy"
                    : "border-divider bg-surface text-on-surface hover:border-divider-strong hover:bg-surface-alt",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    selected
                      ? "bg-navy/10 text-navy"
                      : "bg-surface-alt text-on-surface-muted",
                  ].join(" ")}
                >
                  {icons[type.value]}
                </span>
                <span className="text-sm font-semibold">{type.label}</span>
                <span className="text-[11px] leading-snug text-on-surface-muted">
                  {type.desc}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purpose chips — shown once a type is selected */}
      {data.transactionType && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
            Primary purpose
          </p>
          <div className="flex flex-wrap gap-2">
            {purposeOptions.map((opt) => {
              const selected = data.purpose === opt;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => set({ purpose: opt })}
                  className={[
                    "rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all",
                    selected
                      ? "border-navy bg-navy-light text-navy"
                      : "border-divider bg-surface text-on-surface-muted hover:border-divider-strong hover:text-on-surface",
                  ].join(" ")}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Diaspora note for rent */}
      {isRent && (
        <div className="rounded-xl border border-divider bg-surface-alt px-4 py-3">
          <p className="text-xs leading-relaxed text-on-surface-muted">
            <strong className="text-on-surface">Lagos standard:</strong> most
            landlords require 1–2 years rent upfront. We negotiate payment
            structures on your behalf and will always tell you what the market
            actually demands.
          </p>
        </div>
      )}

      {/* Buy info box  */}
      {isBuy && (
        <div className="rounded-xl border border-navy/20 bg-navy-light px-4 py-3">
          <p className="text-xs leading-relaxed text-navy">
            <strong>Diaspora clients:</strong> we offer dedicated remote
            advisory packages for purchase from abroad with full representation
            on the ground.
          </p>
        </div>
      )}

      {/* Lease info box */}
      {isLease && (
        <div className="rounded-xl border border-navy/20 bg-navy-light px-4 py-3">
          <p className="text-xs leading-relaxed text-navy">
            Commercial leases in Lagos typically run 2–3 years with annual rent
            reviews. We handle all heads-of-terms negotiation and legal review
            on your behalf.
          </p>
        </div>
      )}
    </div>
  );
}
