import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getClientDetail } from "@/app/actions/admin";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  CalendarCheck,
  CreditCard,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AssignPmButton from "@/components/portal/admin/AssignPmButton";

export const metadata = { title: "Client Detail — Terralume Admin Portal" };

function formatDate(date: Date | string | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

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

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await requireAdmin().catch(() => redirect("/admin-login"));

  const client = await getClientDetail(id);
  if (!client) notFound();

  const engagement = client.engagements[0] ?? null;

  const totalDocs = engagement?.documents?.length ?? 0;
  const paidInvoices =
    engagement?.invoices?.filter((inv) => inv.status === "PAID").length ?? 0;
  const totalInvoices = engagement?.invoices?.length ?? 0;
  const agreementSigned = engagement?.agreement?.status === "SIGNED";

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">
      {/* Back */}
      <Link
        href="/admin-portal/clients"
        className="flex items-center gap-1.5 text-sm text-on-surface-muted hover:text-on-surface transition-colors w-fit"
      >
        <ArrowLeft size={16} />
        Back to clients
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-(--color-navy-light) text-lg font-bold uppercase text-(--color-navy)">
            {(client.fullName ?? client.email).charAt(0)}
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              {client.fullName ?? client.email}
            </h1>
            <p className="text-sm text-on-surface-muted">{client.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <Badge
                variant={client.onboardingComplete ? "default" : "outline"}
                className="text-xs"
              >
                {client.onboardingComplete ? "Onboarded" : "Pending onboarding"}
              </Badge>
            </div>
          </div>
        </div>
        {engagement && (
          <Link
            href={`/admin-portal/engagements/${engagement.id}`}
            className="flex items-center gap-1.5 rounded-xl bg-(--color-navy) px-4 py-2 text-sm font-medium text-white hover:bg-(--color-navy)/90 transition-colors"
          >
            <ExternalLink size={14} />
            View Engagement
          </Link>
        )}
      </div>

      {/* Stats */}
      {engagement && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              icon: FileText,
              label: "Documents",
              value: totalDocs,
              color: "text-(--color-navy)",
              bg: "bg-(--color-navy-light)",
            },
            {
              icon: CalendarCheck,
              label: "Stage",
              value: STAGE_LABELS[engagement.stage] ?? engagement.stage,
              color: "text-blue-600",
              bg: "bg-blue-50",
              small: true,
            },
            {
              icon: CreditCard,
              label: "Invoices paid",
              value: `${paidInvoices}/${totalInvoices}`,
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: agreementSigned ? CheckCircle2 : Clock,
              label: "Agreement",
              value: agreementSigned ? "Signed" : "Pending",
              color: agreementSigned ? "text-emerald-600" : "text-amber-600",
              bg: agreementSigned ? "bg-emerald-50" : "bg-amber-50",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-divider bg-surface shadow-sm px-4 py-3 flex items-center gap-3"
            >
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${s.bg}`}
              >
                <s.icon size={18} className={s.color} />
              </span>
              <div className="min-w-0">
                <p
                  className={`font-bold text-on-surface truncate ${s.small ? "text-sm" : "text-xl"}`}
                >
                  {s.value}
                </p>
                <p className="text-xs text-on-surface-muted">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Profile card */}
      <Card>
        <CardContent className="pt-5">
          <h2 className="font-semibold text-on-surface mb-4">
            Profile Details
          </h2>
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-3 text-sm">
            {[
              { label: "Phone", value: client.phone },
              { label: "Location", value: client.location },
              { label: "Nationality", value: client.nationality },
              { label: "ID type", value: client.idType },
              { label: "ID number", value: client.idNumber },
              {
                label: "Onboarding",
                value: client.onboardingComplete ? "Complete" : "Pending",
              },
              { label: "Joined", value: formatDate(client.createdAt) },
              { label: "Last login", value: formatDate(client.lastLogin) },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-on-surface-muted text-xs">{label}</dt>
                <dd className="font-medium text-on-surface">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* Engagement quick-link */}
      {engagement ? (
        <Card>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-on-surface">
                  Active Engagement
                </h2>
                <p className="text-sm text-on-surface-muted mt-0.5">
                  {STAGE_LABELS[engagement.stage] ?? engagement.stage} ·{" "}
                  {engagement.serviceTier ?? "No tier set"} · Started{" "}
                  {formatDate(engagement.startDate)}
                </p>
              </div>
              <Link
                href={`/admin-portal/engagements/${engagement.id}`}
                className="flex items-center gap-1.5 text-sm font-medium text-(--color-navy) hover:underline underline-offset-4"
              >
                Manage →
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-dashed">
          <CardContent className="pt-5">
            <p className="text-sm text-on-surface-muted">
              No active engagement.{" "}
              <Link
                href="/admin-portal/intake"
                className="text-(--color-navy) underline underline-offset-4"
              >
                Activate from intake
              </Link>
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}