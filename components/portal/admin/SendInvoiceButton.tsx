"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { sendInvoice } from "@/app/actions/invoices";
import { Button } from "@/components/ui/button";

interface SendInvoiceButtonProps {
  invoiceId: string;
}

export default function SendInvoiceButton({
  invoiceId,
}: SendInvoiceButtonProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    setError(null);
    startTransition(async () => {
      try {
        await sendInvoice(invoiceId);
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to send invoice.",
        );
      }
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <Button type="button" size="sm" onClick={handleSend} disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 size={14} className="mr-1.5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <Send size={14} className="mr-1.5" />
            Send Invoice
          </>
        )}
      </Button>
      {error ? (
        <p className="text-right text-xs text-red-600">{error}</p>
      ) : null}
    </div>
  );
}
