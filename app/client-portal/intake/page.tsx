import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getMyIntakeSubmissions } from "@/app/actions/intake";
import { ClipboardList, Plus, Eye } from "lucide-react";

export const metadata = {
  title: "My Intake Forms — Terralume Client Portal",
};

const STATUS_META: Record<string, { label: string; className: string }> = {
  PENDING: {
    label: "Pending review",
    className: "bg-amber-50 text-amber-700 border border-amber-200",
  },
  REVIEWING: {
    label: "In review",
    className: "bg-blue-50 text-blue-700 border border-blue-200",
  },
  ACTIVE: {
    label: "Active engagement",
    className: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    className: "bg-zinc-100 text-zinc-500 border border-zinc-200",
  },
};

const TYPE_LABEL: Record<string, string> = {
  rent: "Rental",
  buy: "Purchase",
  lease: "Commercial Lease",
};

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function ClientIntakePage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const submissions = await getMyIntakeSubmissions(user.id);

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            My Enquiries
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Intake Forms
          </h1>
          <p className="text-sm text-on-surface-muted mt-1">
            All the briefs you have submitted to Terralume.
          </p>
        </div>
        <Link
          href="/client-portal/intake/new"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
        >
          <Plus size={15} />
          Submit new brief
        </Link>
      </div>

      {submissions.length === 0 ? (
        <div className="rounded-2xl border border-divider bg-surface shadow-sm flex flex-col items-center justify-center py-20 gap-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy-light">
            <ClipboardList size={24} className="text-navy" />
          </div>
          <div>
            <h2 className="font-medium text-on-surface">No briefs yet</h2>
            <p className="text-sm text-on-surface-muted mt-1 max-w-sm">
              Start by submitting your property brief so an advisor can begin
              working on your search.
            </p>
          </div>
          <Link
            href="/client-portal/intake/new"
            className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
          >
            <Plus size={15} />
            Submit your first brief
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {submissions.map((s) => {
            const statusMeta = STATUS_META[s.status] ?? STATUS_META.PENDING;
            return (
              <div
                key={s.id}
                className="rounded-2xl border border-divider bg-surface shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy-light">
                    <ClipboardList size={18} className="text-navy" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-semibold text-on-surface">
                        {s.referenceNumber}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusMeta.className}`}
                      >
                        {statusMeta.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-on-surface mt-0.5">
                      {TYPE_LABEL[s.transactionType] ?? s.transactionType}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      Submitted {formatDate(s.createdAt)}
                      {s.location && ` · ${s.location}`}
                    </p>
                  </div>
                </div>
                <Link
                  href={`/client-portal/intake/${s.id}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-divider bg-white px-4 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-alt shrink-0"
                >
                  <Eye size={14} />
                  View details
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
