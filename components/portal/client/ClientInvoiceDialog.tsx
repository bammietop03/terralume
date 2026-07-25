"use client";

import { useState } from "react";
import { Eye, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import PayNowButton from "@/components/portal/client/PayNowButton";
import Link from "next/link";

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string | null;
  status: string;
  issuedAt: Date | string | null;
  dueDate: Date | string | null;
  paidAt: Date | string | null;
}

interface ClientInvoiceDialogProps {
  invoice: InvoiceData;
  engagementId: string;
  trigger?: React.ReactNode;
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(amount: number | null | undefined, currency = "NGN") {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function ClientInvoiceDialog({
  invoice,
  engagementId,
  trigger,
}: ClientInvoiceDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
            <Eye size={12} />
            View
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Invoice Details</DialogTitle>
            <Badge
              variant={invoice.status === "PAID" ? "default" : "outline"}
              className={invoice.status === "PAID" ? "bg-(--color-navy) text-white capitalize" : "capitalize text-on-surface-muted"}
            >
              {invoice.status.toLowerCase()}
            </Badge>
          </div>
        </DialogHeader>
        <div className="mt-4 space-y-4 text-sm">
          <div>
            <p className="text-xs text-on-surface-muted mb-1">Invoice Number</p>
            <p className="font-semibold text-on-surface">{invoice.invoiceNumber}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted mb-1">Description</p>
            <p className="text-on-surface">{invoice.description}</p>
          </div>
          <div>
            <p className="text-xs text-on-surface-muted mb-1">Amount</p>
            <p className="font-semibold text-xl text-on-surface">
              {formatCurrency(invoice.amount, invoice.currency ?? "NGN")}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-on-surface-muted mb-1">Issued On</p>
              <p className="text-on-surface">{formatDate(invoice.issuedAt)}</p>
            </div>
            <div>
              <p className="text-xs text-on-surface-muted mb-1">Due Date</p>
              <p className="text-on-surface">{formatDate(invoice.dueDate)}</p>
            </div>
          </div>
          {invoice.paidAt && (
            <div>
              <p className="text-xs text-on-surface-muted mb-1">Paid On</p>
              <p className="text-on-surface">{formatDate(invoice.paidAt)}</p>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-divider">
            {invoice.status === "SENT" && (
              <PayNowButton
                engagementId={engagementId}
                invoiceId={invoice.id}
                amount={invoice.amount}
                currency={invoice.currency ?? "NGN"}
              />
            )}
            {invoice.status === "PAID" && (
              <Link
                href={`/print/receipt/client/${invoice.id}`}
                target="_blank"
              >
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Download size={14} />
                  Download Receipt
                </Button>
              </Link>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
