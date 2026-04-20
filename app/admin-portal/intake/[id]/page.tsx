import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import {
  getIntakeSubmissionById,
  updateIntakeStatus,
} from "@/app/actions/intake";
import { getStaffUsers } from "@/app/actions/users";
import {
  ArrowLeft,
  User,
  Target,
  Home,
  Wallet,
  Clock,
  ShieldCheck,
  ExternalLink,
  UserCircle,
} from "lucide-react";
import IntakeStatusSelect from "@/components/portal/admin/IntakeStatusSelect";
import AssignPmButton from "@/components/portal/admin/AssignPmButton";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Intake Detail — Terralume Admin Portal" };

const TYPE_LABEL: Record<string, string> = {
  rent: "Rental",
  buy: "Purchase",
  lease: "Commercial Lease",
};

const STATUS_META: Record<
  string,
  { label: string; dot: string; badge: string }
> = {
  PENDING: {
    label: "Pending",
    dot: "bg-amber-400",
    badge: "bg-amber-50 text-amber-700 ring-amber-200",
  },
  REVIEWING: {
    label: "Reviewing",
    dot: "bg-blue-400",
    badge: "bg-blue-50 text-blue-700 ring-blue-200",
  },
  ACTIVE: {
    label: "Active",
    dot: "bg-emerald-400",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  },
  CLOSED: {
    label: "Closed",
    dot: "bg-zinc-300",
    badge: "bg-zinc-100 text-zinc-500 ring-zinc-200",
  },
};

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
        <Icon size={13} className="text-on-surface-muted shrink-0" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
          {title}
        </span>
      </div>
      <CardContent className="p-4 pt-4 grid grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </CardContent>
    </Card>
  );
}

function Field({
  label,
  value,
  span2,
}: {
  label: string;
  value?: string | null | boolean | string[];
  span2?: boolean;
}) {
  const isEmpty =
    value === null ||
    value === undefined ||
    value === "" ||
    (Array.isArray(value) && value.length === 0);

  const display = Array.isArray(value)
    ? value.join(" · ")
    : value === true
      ? "Yes"
      : value === false
        ? "No"
        : value;

  return (
    <div className={span2 ? "col-span-2" : ""}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-muted/70 mb-0.5">
        {label}
      </p>
      {isEmpty ? (
        <p className="text-xs italic text-on-surface-muted">—</p>
      ) : (
        <p className="text-sm text-on-surface leading-snug">{display}</p>
      )}
    </div>
  );
}

export default async function AdminIntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const [submission, staffUsers] = await Promise.all([
    getIntakeSubmissionById(id),
    getStaffUsers(),
  ]);
  if (!submission) notFound();

  const pmOptions = staffUsers
    .filter((u) => u.role === "PM")
    .map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
    }));

  // PM is now on the client User, not the submission
  const assignedPm = submission.user?.assignedPm ?? null;
  const pmChangeRequested = submission.user?.pmChangeRequested ?? false;
  const pmChangeReason = submission.user?.pmChangeReason ?? null;
  const isSuperAdmin = user.role === "ADMIN";

  const statusMeta = STATUS_META[submission.status] ?? STATUS_META.PENDING;

  const budgetDisplay =
    submission.budgetMin && submission.budgetMax
      ? `${submission.currency} ${submission.budgetMin} – ${submission.budgetMax}`
      : submission.budgetMin
        ? `${submission.currency} ${submission.budgetMin}+`
        : null;

  return (
    <div className="mx-auto max-w-5xl px-6 py-7 space-y-5">
      {/* Back */}
      <Link
        href="/admin-portal/intake"
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
      >
        <ArrowLeft size={12} />
        All intake forms
      </Link>

      {/* Page header */}
      <div className="rounded-xl border border-divider bg-surface p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        {/* Avatar */}
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold text-navy uppercase">
          {submission.fullName.charAt(0)}
        </div>

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-on-surface leading-tight truncate">
            {submission.fullName}
          </p>
          <p className="mt-0.5 text-xs text-on-surface-muted">
            {submission.referenceNumber}
            <span className="mx-1.5 text-divider-strong">·</span>
            {TYPE_LABEL[submission.transactionType] ??
              submission.transactionType}
            <span className="mx-1.5 text-divider-strong">·</span>
            {formatDate(submission.createdAt)}
          </p>
        </div>

        {/* Status badge + selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 shrink-0">
          {/* PM assignment */}
          <div className="flex items-center gap-2">
            {assignedPm ? (
              <div className="flex items-center gap-1.5 rounded-full border border-divider bg-surface-alt px-2.5 py-1">
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-navy text-[10px] font-bold uppercase text-white">
                  {assignedPm.fullName?.charAt(0) ?? <UserCircle size={12} />}
                </div>
                <span className="text-xs text-on-surface font-medium">
                  {assignedPm.fullName ?? assignedPm.email}
                </span>
              </div>
            ) : (
              <span className="text-xs text-on-surface-muted italic">
                No PM assigned
              </span>
            )}
            {/* Only super-admin (ADMIN role) may assign/reassign PMs */}
            {isSuperAdmin && submission.userId && (
              <AssignPmButton
                userId={submission.userId}
                assignedPm={assignedPm}
                pmChangeRequested={pmChangeRequested}
                pmChangeReason={pmChangeReason}
                pmOptions={pmOptions}
              />
            )}
          </div>

          <div className="flex sm:flex-col items-center sm:items-end gap-2 sm:gap-1.5">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${statusMeta.badge}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
            <IntakeStatusSelect
              submissionId={submission.id}
              currentStatus={submission.status}
            />
          </div>
        </div>
      </div>

      {/* Two-column section grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT COLUMN */}
        <div className="space-y-4">
          {/* Contact */}
          <SectionCard title="Contact" icon={User}>
            <Field label="Full name" value={submission.fullName} />
            <Field label="Preferred name" value={submission.preferredName} />
            <Field label="Email" value={submission.email} span2 />
            <Field label="Phone" value={submission.phone} />
            <Field label="Based in" value={submission.location} />
            <Field label="Nationality" value={submission.nationality} />
            {submission.user && (
              <div className="col-span-2 pt-1 border-t border-divider mt-1">
                <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-muted/70 mb-1">
                  Portal account
                </p>
                <Link
                  href={
                    isSuperAdmin
                      ? "/admin-portal/users/clients"
                      : "/admin-portal/clients"
                  }
                  className="inline-flex items-center gap-1 text-xs text-navy hover:underline font-medium"
                >
                  View client account <ExternalLink size={11} />
                </Link>
              </div>
            )}
          </SectionCard>

          {/* Goal */}
          <SectionCard title="Goal & purpose" icon={Target}>
            <Field
              label="Transaction type"
              value={
                TYPE_LABEL[submission.transactionType] ??
                submission.transactionType
              }
            />
            <Field label="Purpose" value={submission.purpose} />
          </SectionCard>

          {/* Budget */}
          <SectionCard title="Budget & financing" icon={Wallet}>
            <Field label="Budget range" value={budgetDisplay} span2 />
            <Field label="Currency" value={submission.currency} />
            <Field label="Source of funds" value={submission.sourceOfFunds} />
            <Field
              label="Mortgage status"
              value={submission.mortgageStatus}
              span2
            />
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-4">
          {/* Property */}
          <SectionCard title="Property requirements" icon={Home}>
            <Field label="Target areas" value={submission.targetAreas} span2 />
            <Field label="Property type" value={submission.propertyType} />
            <Field label="Min bedrooms" value={submission.bedrooms} />
            <Field label="Floor area (sqm)" value={submission.floorAreaSqm} />
            <Field label="Must-haves" value={submission.mustHaves} span2 />
            <Field
              label="Deal-breakers"
              value={submission.dealBreakers}
              span2
            />
          </SectionCard>

          {/* Timeline */}
          <SectionCard title="Timeline & background" icon={Clock}>
            <Field label="Target date" value={submission.targetDate} />
            <Field label="Decision speed" value={submission.decisionSpeed} />
            <Field label="Decision makers" value={submission.decisionMakers} />
            <Field
              label="Prior experience"
              value={submission.priorExperience}
            />
            <Field label="Risk profile" value={submission.riskProfile} />
            <Field label="Referral source" value={submission.referralSource} />
          </SectionCard>

          {/* Consent */}
          <SectionCard title="Consent & compliance" icon={ShieldCheck}>
            <Field label="NDPR data consent" value={submission.dataConsent} />
            <Field
              label="Submitted at"
              value={formatDate(submission.createdAt)}
            />
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
