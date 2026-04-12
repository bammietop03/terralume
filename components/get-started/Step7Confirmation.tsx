import { TRANSACTION_TYPES } from "./constants";
import type { FormData } from "./types";

/* ── Single summary row — skips empty values ─────────── */
function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string | string[] | boolean;
}) {
  const isEmpty =
    value === "" ||
    value === false ||
    (Array.isArray(value) && value.length === 0);
  if (isEmpty) return null;

  const display = Array.isArray(value)
    ? value.join(", ")
    : value === true
      ? "Yes"
      : String(value);

  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
      <span className="w-full shrink-0 text-xs font-medium uppercase tracking-wide text-on-surface-muted sm:w-44">
        {label}
      </span>
      <span className="text-sm text-on-surface">{display}</span>
    </div>
  );
}

/* ── Confirmation step ──────────────────────────────── */
interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step7Confirmation({ data, set }: Props) {
  const sections: {
    heading: string;
    rows: { label: string; value: string | string[] | boolean }[];
  }[] = [
    {
      heading: "About you",
      rows: [
        { label: "Full name", value: data.fullName },
        { label: "Preferred name", value: data.preferredName },
        { label: "Email", value: data.email },
        {
          label: "Phone",
          value: data.phone ? `${data.countryCode} ${data.phone}` : "",
        },
        { label: "Location", value: data.location },
        { label: "Nationality", value: data.nationality },
      ],
    },
    {
      heading: "Your goal",
      rows: [
        {
          label: "Transaction type",
          value:
            TRANSACTION_TYPES.find((t) => t.value === data.transactionType)
              ?.label ?? data.transactionType,
        },
        { label: "Primary purpose", value: data.primaryPurpose },
        { label: "Other purpose", value: data.purposeOther },
      ],
    },
    {
      heading: "Budget",
      rows: [
        { label: "Budget range", value: data.budgetRange },
        { label: "Currency", value: data.currency },
        { label: "Specific amount", value: data.budgetNote },
        { label: "Source of funds", value: data.sourceOfFunds },
        { label: "Mortgage status", value: data.mortgageStatus },
      ],
    },
    {
      heading: "Property",
      rows: [
        { label: "Areas", value: data.locationPreferences },
        { label: "Property type", value: data.propertyType },
        { label: "Bedrooms", value: data.bedrooms },
        {
          label: "Size (sqm)",
          value:
            data.sizeMin || data.sizeMax
              ? `${data.sizeMin || "—"} – ${data.sizeMax || "—"}`
              : "",
        },
        { label: "Must-haves", value: data.mustHaves },
        { label: "Deal-breakers", value: data.dealBreakers },
      ],
    },
    {
      heading: "Timeline",
      rows: [
        { label: "Target date", value: data.targetDate },
        { label: "Decision speed", value: data.decisionSpeed },
        { label: "Other decision-makers", value: data.otherDecisionMakers },
      ],
    },
    {
      heading: "Background",
      rows: [
        { label: "Experience", value: data.priorExperience },
        { label: "Risk tolerance", value: data.riskTolerance },
        { label: "Referral source", value: data.referralSource },
        { label: "Referral detail", value: data.referralDetail },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Summary table */}
      <div className="rounded-2xl border border-divider bg-surface-alt">
        {sections.map(({ heading, rows }, i) => (
          <div key={heading} className={i > 0 ? "border-t border-divider" : ""}>
            <div className="px-5 py-3">
              <p className="text-xs font-semibold uppercase tracking-widest text-crimson">
                {heading}
              </p>
            </div>
            <div className="divide-y divide-divider px-5">
              {rows.map((r) => (
                <SummaryRow key={r.label} label={r.label} value={r.value} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Consent checkboxes */}
      <div className="space-y-4 rounded-2xl border border-divider bg-white p-5">
        <h3 className="font-semibold text-on-surface">
          Data &amp; privacy consent
        </h3>

        {/* Required — data processing */}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-on-surface">
          <span
            className={[
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              data.dataConsent ? "border-navy bg-navy" : "border-divider",
            ].join(" ")}
          >
            {data.dataConsent && (
              <svg
                className="h-3 w-3 text-white"
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
          <span>
            <input
              type="checkbox"
              checked={data.dataConsent}
              onChange={(e) => set({ dataConsent: e.target.checked })}
              className="sr-only"
            />
            I consent to Terralume collecting and processing the information I
            have provided to deliver advisory services. My data will be handled
            in accordance with Terralume&apos;s privacy policy and will not be
            sold or shared with third parties without my consent.{" "}
            <span className="text-crimson">*</span>
          </span>
        </label>

        {/* Optional — marketing */}
        <label className="flex cursor-pointer items-start gap-3 text-sm text-on-surface-muted">
          <span
            className={[
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors",
              data.marketingConsent ? "border-navy bg-navy" : "border-divider",
            ].join(" ")}
          >
            {data.marketingConsent && (
              <svg
                className="h-3 w-3 text-white"
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
          <span>
            <input
              type="checkbox"
              checked={data.marketingConsent}
              onChange={(e) => set({ marketingConsent: e.target.checked })}
              className="sr-only"
            />
            I&apos;d like to receive market intelligence updates, area guides,
            and advisory insights from Terralume. I can unsubscribe at any time.
          </span>
        </label>
      </div>
    </div>
  );
}
