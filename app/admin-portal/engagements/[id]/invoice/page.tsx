"use client";

import { useState, useTransition, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Plus, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createInvoice,
  sendInvoice,
  getInvoices,
} from "@/app/actions/invoices";
import { getEngagementDetail } from "@/app/actions/admin";

type Invoice = {
  id: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  status: string;
  dueDate: Date | null;
  issuedAt: Date | null;
  paidAt: Date | null;
};

const STATUS_STYLES: Record<string, string> = {
  DRAFT: "bg-zinc-100 text-zinc-600 ring-zinc-200",
  SENT: "bg-blue-50 text-blue-700 ring-blue-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function EngagementInvoicePage() {
  const params = useParams<{ id: string }>();
  const engagementId = params.id;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("NGN");
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sendingId, setSendingId] = useState<string | null>(null);
  // Pre-fill amount from tier price
  const [tierPrice, setTierPrice] = useState<number | null>(null);
  const [tierCurrency, setTierCurrency] = useState<string>("NGN");

  async function refresh() {
    const data = await getInvoices(engagementId);
    setInvoices(data as Invoice[]);
  }

  useEffect(() => {
    refresh();
    getEngagementDetail(engagementId).then((eng) => {
      if (eng?.tierRef) {
        setTierPrice(eng.tierRef.price);
        setTierCurrency(eng.tierRef.currency);
        setCurrency(eng.tierRef.currency);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementId]);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    startTransition(async () => {
      try {
        await createInvoice(engagementId, {
          description,
          amount: parseFloat(amount),
          currency,
          dueDate: dueDate ? new Date(dueDate) : null,
        });
        setDescription("");
        setAmount("");
        setDueDate("");
        setCreateOpen(false);
        await refresh();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to create invoice.",
        );
      }
    });
  }

  async function handleSend(invoiceId: string) {
    setSendingId(invoiceId);
    try {
      await sendInvoice(invoiceId);
      await refresh();
    } catch {
      // toast would go here
    } finally {
      setSendingId(null);
    }
  }

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <Link
        href={`/admin-portal/engagements/${engagementId}`}
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to engagement
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            Phase 5
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Invoices
          </h1>
          {tierPrice && (
            <p className="text-sm text-on-surface-muted mt-1">
              Tier price:{" "}
              <span className="font-semibold text-on-surface">
                {tierCurrency} {tierPrice.toLocaleString()}
              </span>
            </p>
          )}
        </div>

        {/* Create invoice dialog */}
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus size={15} className="mr-1.5" />
              New invoice
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create Invoice</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <Label htmlFor="invDesc">Description</Label>
                <Textarea
                  id="invDesc"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Retainer fee — property search mandate"
                  className="resize-none"
                  required
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="invAmount">
                    Amount ({currency})
                    {tierPrice && (
                      <button
                        type="button"
                        onClick={() => setAmount(String(tierPrice))}
                        className="ml-2 text-xs text-(--color-navy) hover:underline"
                      >
                        Use tier price
                      </button>
                    )}
                  </Label>
                  <Input
                    id="invAmount"
                    type="number"
                    min="1"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="invDue">Due date (optional)</Label>
                  <Input
                    id="invDue"
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="invCurrency">Currency</Label>
                <Input
                  id="invCurrency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value.toUpperCase())}
                  maxLength={3}
                  placeholder="NGN"
                />
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <div className="flex justify-end gap-2 pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating…" : "Create invoice"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invoice list */}
      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-12 text-center">
          <p className="text-sm text-on-surface-muted">
            No invoices yet. Create one above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold text-on-surface">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.DRAFT}`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-muted mt-0.5 truncate">
                      {inv.description}
                    </p>
                    <p className="text-sm font-medium text-on-surface mt-1">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </p>
                    {inv.dueDate && (
                      <p className="text-xs text-on-surface-muted">
                        Due: {formatDate(inv.dueDate)}
                      </p>
                    )}
                    {inv.paidAt && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Paid {formatDate(inv.paidAt)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {inv.status === "DRAFT" && (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={sendingId === inv.id}
                        onClick={() => handleSend(inv.id)}
                      >
                        <Send size={13} className="mr-1.5" />
                        {sendingId === inv.id ? "Sending…" : "Send"}
                      </Button>
                    )}
                    {inv.status === "PAID" && (
                      <a
                        href={`/print/receipt/${inv.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-alt"
                      >
                        <Download size={12} />
                        Receipt
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
