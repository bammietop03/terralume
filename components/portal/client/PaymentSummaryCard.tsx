import { CreditCard, CheckCircle2, Clock } from "lucide-react";
import Link from "next/link";

interface Props {
  paymentSummary: {
    totalPaid: number;
    currency: string;
    pendingAmount: number;
  };
}

function fmtCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function PaymentSummaryCard({ paymentSummary }: Props) {
  const { totalPaid, currency, pendingAmount } = paymentSummary;
  const hasActivity = totalPaid > 0 || pendingAmount > 0;

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
      <div className="h-1 w-full bg-linear-to-r from-green-500 to-emerald-400" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 ring-1 ring-green-200/60">
              <CreditCard size={18} className="text-green-600" />
            </div>
            <h2 className="text-sm font-semibold text-on-surface">Payments</h2>
          </div>
          <Link
            href="/client-portal/payments"
            className="text-xs font-semibold text-(--color-navy) hover:underline"
          >
            View all
          </Link>
        </div>

        {!hasActivity ? (
          <p className="text-sm text-on-surface-muted">
            No payment activity yet.
          </p>
        ) : (
          <div className="space-y-2.5">
            {totalPaid > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-green-50/60 border border-green-100 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={15} className="text-green-600 shrink-0" />
                  <span className="text-xs font-medium text-on-surface-muted">
                    Total paid
                  </span>
                </div>
                <span className="text-sm font-bold text-green-700">
                  {fmtCurrency(totalPaid, currency)}
                </span>
              </div>
            )}
            {pendingAmount > 0 && (
              <div className="flex items-center justify-between rounded-xl bg-amber-50/60 border border-amber-100 px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <Clock size={15} className="text-amber-600 shrink-0" />
                  <span className="text-xs font-medium text-on-surface-muted">
                    Outstanding
                  </span>
                </div>
                <span className="text-sm font-bold text-amber-700">
                  {fmtCurrency(pendingAmount, currency)}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
