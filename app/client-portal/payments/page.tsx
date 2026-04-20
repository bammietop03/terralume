import { CreditCard } from "lucide-react";

export const metadata = { title: "Payments — Terralume Client Portal" };

export default function PaymentsPage() {
  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Payments
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Payment History
        </h1>
      </div>

      <div className="rounded-2xl border border-dashed border-divider bg-surface p-16 text-center shadow-sm">
        <div className="flex justify-center mb-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[--color-navy-light]">
            <CreditCard size={28} className="text-[--color-navy]" />
          </div>
        </div>
        <h2 className="font-display text-lg font-semibold text-on-surface mb-2">
          Payment records coming soon
        </h2>
        <p className="text-sm text-on-surface-muted max-w-sm mx-auto">
          Your retainer and success fee payments will be tracked here.
        </p>
      </div>
    </div>
  );
}
