"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PayNowButton({
  engagementId,
  invoiceId,
  amount,
  currency,
}: {
  engagementId: string;
  invoiceId: string;
  amount: number;
  currency: string;
}) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handlePay() {
    setError(null);
    startTransition(async () => {
      try {
        const res = await fetch("/api/payments/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ engagementId, amount, currency, invoiceId }),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data.error ?? "Payment failed to initialise.");

        // Store reference for callback page
        sessionStorage.setItem("paystack_reference", data.reference);
        sessionStorage.setItem("paystack_invoice_id", invoiceId);

        router.push(data.authorizationUrl);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Payment error.");
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1 shrink-0">
      <Button size="sm" onClick={handlePay} disabled={isPending}>
        <CreditCard size={14} className="mr-1.5" />
        {isPending ? "Loading…" : "Pay Now"}
      </Button>
      {error && (
        <p className="text-xs text-red-600 max-w-40 text-right">{error}</p>
      )}
    </div>
  );
}
