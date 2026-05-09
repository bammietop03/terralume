import { redirect } from "next/navigation";
import { requireClient } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CreditCard, CheckCircle2, Download } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import PayNowButton from "@/components/portal/client/PayNowButton";

export const metadata = { title: "Payments — Terralume Client Portal" };

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

export default async function PaymentsPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const engagement = await prisma.engagement.findFirst({
    where: { userId: user.id },
    include: {
      invoices: { orderBy: { createdAt: "desc" } },
    },
  });

  const invoices = engagement?.invoices ?? [];
  const engagementId = engagement?.id ?? null;

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Payments
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Invoices &amp; Payments
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Review your invoices and make payments securely online.
        </p>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-16 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-(--color-navy-light)">
              <CreditCard size={28} className="text-(--color-navy)" />
            </div>
          </div>
          <h2 className="font-display text-lg font-semibold text-on-surface mb-2">
            No invoices yet
          </h2>
          <p className="text-sm text-on-surface-muted max-w-sm mx-auto">
            Invoices will appear here once your PM issues them.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map((inv) => (
            <Card key={inv.id}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-semibold text-on-surface">
                        {inv.invoiceNumber}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${STATUS_STYLES[inv.status] ?? STATUS_STYLES.DRAFT}`}
                      >
                        {inv.status}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-muted">
                      {inv.description}
                    </p>
                    <p className="text-base font-semibold text-on-surface mt-1">
                      {inv.currency} {inv.amount.toLocaleString()}
                    </p>
                    {inv.dueDate && inv.status !== "PAID" && (
                      <p className="text-xs text-on-surface-muted">
                        Due: {formatDate(inv.dueDate)}
                      </p>
                    )}
                    {inv.paidAt && (
                      <p className="text-xs text-emerald-600 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={12} />
                        Paid {formatDate(inv.paidAt)}
                      </p>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    {inv.status === "SENT" && engagementId && (
                      <PayNowButton
                        engagementId={engagementId}
                        invoiceId={inv.id}
                        amount={inv.amount}
                        currency={inv.currency}
                      />
                    )}
                    {inv.status === "PAID" && (
                      <Link
                        href={`/print/receipt/client/${inv.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 rounded-lg border border-divider bg-white px-3 py-1.5 text-xs font-medium text-on-surface transition-colors hover:bg-surface-alt"
                      >
                        <Download size={12} />
                        Receipt
                      </Link>
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
