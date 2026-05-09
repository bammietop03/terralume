"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import Link from "next/link";

// export const metadata = { title: "Payment Confirmation — Terralume" };

export default function PaymentCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<"loading" | "success" | "failed">(
    "loading",
  );
  const [details, setDetails] = useState<{
    amount?: number;
    currency?: string;
  } | null>(null);

  useEffect(() => {
    const reference =
      searchParams.get("reference") ??
      (typeof window !== "undefined"
        ? sessionStorage.getItem("paystack_reference")
        : null);

    if (!reference) {
      setStatus("failed");
      return;
    }

    fetch(`/api/payments/verify?reference=${encodeURIComponent(reference)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "SUCCESS") {
          setStatus("success");
          setDetails({ amount: data.amount, currency: data.currency });
          if (typeof window !== "undefined") {
            sessionStorage.removeItem("paystack_reference");
            sessionStorage.removeItem("paystack_invoice_id");
          }
        } else {
          setStatus("failed");
        }
      })
      .catch(() => setStatus("failed"));
  }, [searchParams]);

  return (
    <div className="px-6 py-16 max-w-md mx-auto text-center">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-4">
          <Loader2 size={40} className="animate-spin text-(--color-navy)" />
          <p className="text-sm text-on-surface-muted">
            Verifying your payment…
          </p>
        </div>
      )}

      {status === "success" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
            <CheckCircle2 size={36} className="text-emerald-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Payment confirmed
          </h1>
          {details && (
            <p className="text-sm text-on-surface-muted">
              {details.currency} {details.amount?.toLocaleString()} received.
            </p>
          )}
          <p className="text-sm text-on-surface-muted">
            Your payment has been processed. You will receive a confirmation
            email shortly.
          </p>
          <Link
            href="/client-portal/payments"
            className="mt-2 rounded-xl bg-(--color-navy) px-6 py-3 text-sm font-semibold text-white hover:bg-navy/90 transition-colors"
          >
            Back to payments
          </Link>
        </div>
      )}

      {status === "failed" && (
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <XCircle size={36} className="text-red-600" />
          </div>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Payment failed
          </h1>
          <p className="text-sm text-on-surface-muted">
            We couldn&apos;t verify your payment. Please try again or contact
            your project manager.
          </p>
          <Link
            href="/client-portal/payments"
            className="mt-2 rounded-xl border border-divider px-6 py-3 text-sm font-semibold text-on-surface hover:bg-surface-muted transition-colors"
          >
            Back to payments
          </Link>
        </div>
      )}
    </div>
  );
}
