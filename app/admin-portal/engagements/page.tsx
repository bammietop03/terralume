import { redirect } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getAllEngagements } from "@/app/actions/admin";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import UpdateStageForm from "@/components/portal/admin/UpdateStageForm";
import DeleteEngagementButton from "@/components/portal/admin/DeleteEngagementButton";
import { Eye, Building2 } from "lucide-react";

export const metadata = { title: "Engagements — Terralume Admin Portal" };

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  brief_confirmation: "Brief Confirmation",
  area_shortlisting: "Area Shortlisting",
  property_search: "Property Search",
  due_diligence: "Due Diligence",
  offer_negotiation: "Offer & Negotiation",
  legal_completion: "Legal & Completion",
  handover: "Handover",
  active_client: "Active Client",
};

const TIER_LABELS: Record<string, string> = {
  essential: "Essential",
  premium: "Premium",
  elite: "Elite",
};

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function EngagementsPage() {
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const engagements = await getAllEngagements();

  const total = engagements.length;
  const onboarded = engagements.filter((e) => e.user.onboardingComplete).length;
  const agreementsSigned = engagements.filter(
    (e) => e.agreement?.status === "SIGNED",
  ).length;

  return (
    <div className="px-6 py-8 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Engagements
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Active Engagements
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          All active client engagements. Update stages and track onboarding
          progress.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Active engagements",
            value: total,
            color: "text-(--color-navy)",
            bg: "bg-(--color-navy-light)",
          },
          {
            label: "Fully onboarded",
            value: onboarded,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            label: "Agreements signed",
            value: agreementsSigned,
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-divider bg-surface shadow-sm px-5 py-4 flex items-center gap-4"
          >
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
            >
              <Building2 size={20} className={s.color} />
            </span>
            <div>
              <p className="text-2xl font-bold text-on-surface">{s.value}</p>
              <p className="text-xs text-on-surface-muted">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {engagements.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-16 text-center">
          <p className="text-sm text-on-surface-muted">
            No active engagements yet.{" "}
            <Link
              href="/admin-portal/intake"
              className="text-(--color-navy) underline underline-offset-4"
            >
              Activate a client from their intake form.
            </Link>
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-muted/50">
                <TableHead className="font-semibold text-on-surface-muted">
                  Client
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Tier
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  PM
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Stage
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Agreement
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Start date
                </TableHead>
                <TableHead className="font-semibold text-on-surface-muted">
                  Target
                </TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {engagements.map((eng) => {
                const invoicePaid = eng.invoices.some(
                  (inv) => inv.status === "PAID",
                );

                return (
                  <TableRow key={eng.id} className="hover:bg-surface-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium text-on-surface text-sm">
                          {eng.user.fullName ?? eng.user.email}
                        </p>
                        <p className="text-xs text-on-surface-muted">
                          {eng.user.email}
                        </p>
                        {eng.user.onboardingComplete && (
                          <span className="mt-0.5 inline-block rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                            Onboarded
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted capitalize">
                      {eng.serviceTier
                        ? (TIER_LABELS[eng.serviceTier] ?? eng.serviceTier)
                        : "—"}
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {eng.pm?.fullName ?? (
                        <span className="italic">Unassigned</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <UpdateStageForm
                        engagementId={eng.id}
                        currentStage={eng.stage}
                      />
                    </TableCell>
                    <TableCell>
                      {eng.agreement ? (
                        <Badge
                          variant={
                            eng.agreement.status === "SIGNED"
                              ? "default"
                              : "outline"
                          }
                          className="text-xs"
                        >
                          {eng.agreement.status === "SIGNED"
                            ? "Signed"
                            : "Pending"}
                        </Badge>
                      ) : (
                        <span className="text-xs text-on-surface-muted italic">
                          None
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {formatDate(eng.startDate)}
                    </TableCell>
                    <TableCell className="text-sm text-on-surface-muted">
                      {formatDate(eng.targetDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin-portal/engagements/${eng.id}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-divider px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted transition-colors"
                        >
                          <Eye size={13} />
                          View
                        </Link>
                        {user.role === "ADMIN" && (
                          <DeleteEngagementButton
                            engagementId={eng.id}
                            clientName={eng.user.fullName ?? eng.user.email}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
