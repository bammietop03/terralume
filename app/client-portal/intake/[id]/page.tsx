import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getIntakeSubmissionById } from "@/app/actions/intake";
import {
  ArrowLeft,
  User,
  Target,
  Home,
  Wallet,
  Clock,
  Info,
  Mail,
  Phone,
} from "lucide-react";
import RequestPmChangeButton from "@/components/portal/client/RequestPmChangeButton";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = { title: "Brief Details — Terralume Client Portal" };

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

function formatDate(date: Date | null | undefined) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Section({
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
  full,
}: {
  label: string;
  value?: string | null | boolean | string[];
  full?: boolean;
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
    <div className={full ? "col-span-2" : ""}>
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

export default async function ClientIntakeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const submission = await getIntakeSubmissionById(id);
  if (!submission) notFound();

  const statusMeta = STATUS_META[submission.status] ?? STATUS_META.PENDING;

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-6">
      {/* Back */}
      <Link
        href="/client-portal/intake"
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
      >
        <ArrowLeft size={12} />
        My briefs
      </Link>

      {/* Page header card */}
      <div className="rounded-xl border border-divider bg-surface p-5 flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold text-navy uppercase">
          {submission.fullName.charAt(0)}
        </div>
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
            Submitted {formatDate(submission.createdAt)}
          </p>
        </div>
        <span
          className={`self-start sm:self-auto inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusMeta.className}`}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* Assigned advisor card */}
      {submission.user?.assignedPm ? (
        <Card className="overflow-hidden">
          <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
            <User size={13} className="text-on-surface-muted shrink-0" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
              Your advisor
            </span>
          </div>
          <CardContent className="p-4 flex items-start gap-4">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold uppercase text-navy">
              {submission.user.assignedPm.fullName?.charAt(0) ?? "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface">
                {submission.user.assignedPm.fullName ?? "Your advisor"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                <a
                  href={`mailto:${submission.user.assignedPm.email}`}
                  className="inline-flex items-center gap-1 text-xs text-on-surface-muted hover:text-navy transition-colors"
                >
                  <Mail size={11} />
                  {submission.user.assignedPm.email}
                </a>
                {submission.user.assignedPm.phone && (
                  <a
                    href={`tel:${submission.user.assignedPm.phone}`}
                    className="inline-flex items-center gap-1 text-xs text-on-surface-muted hover:text-navy transition-colors"
                  >
                    <Phone size={11} />
                    {submission.user.assignedPm.phone}
                  </a>
                )}
              </div>
            </div>
            {!submission.user.pmChangeRequested && (
              <RequestPmChangeButton submissionId={submission.id} />
            )}
          </CardContent>
          {submission.user.pmChangeRequested && (
            <div className="border-t border-divider bg-amber-50 px-4 py-2.5 flex items-center gap-2 text-xs text-amber-700">
              <Info size={13} className="shrink-0" />
              Advisor change requested — our team will be in touch shortly.
            </div>
          )}
        </Card>
      ) : null}

      {/* What happens next info box */}
      {submission.status === "PENDING" && (
        <div className="rounded-2xl border border-divider bg-navy-light p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy mb-1">
            What happens next
          </p>
          <p className="text-sm text-on-surface leading-relaxed">
            Your advisor is reviewing your brief. You will receive a call within
            48 hours to schedule your discovery call. In the meantime, explore
            our{" "}
            <Link
              href="/area-guides"
              className="text-navy font-medium underline underline-offset-2"
            >
              area guides
            </Link>{" "}
            and{" "}
            <Link
              href="/market-intelligence"
              className="text-navy font-medium underline underline-offset-2"
            >
              market intelligence
            </Link>
            .
          </p>
        </div>
      )}

      {/* Two-column section grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* LEFT */}
        <div className="space-y-4">
          {/* Contact */}
          <Section title="Your contact details" icon={User}>
            <Field label="Full name" value={submission.fullName} />
            <Field label="Preferred name" value={submission.preferredName} />
            <Field label="Email" value={submission.email} full />
            <Field label="Phone" value={submission.phone} />
            <Field label="Based in" value={submission.location} />
            <Field label="Nationality" value={submission.nationality} />
          </Section>

          {/* Goal */}
          <Section title="Your goal" icon={Target}>
            <Field
              label="Transaction type"
              value={
                TYPE_LABEL[submission.transactionType] ??
                submission.transactionType
              }
            />
            <Field label="Purpose" value={submission.purpose} />
          </Section>

          {/* Budget */}
          <Section title="Budget &amp; financing" icon={Wallet}>
            <Field label="Currency" value={submission.currency} />
            <Field label="Budget minimum" value={submission.budgetMin} />
            <Field label="Budget maximum" value={submission.budgetMax} />
            <Field
              label="Source of funds"
              value={submission.sourceOfFunds}
              full
            />
            <Field
              label="Mortgage status"
              value={submission.mortgageStatus}
              full
            />
          </Section>
        </div>

        {/* RIGHT */}
        <div className="space-y-4">
          {/* Property */}
          <Section title="Property requirements" icon={Home}>
            <Field label="Target areas" value={submission.targetAreas} full />
            <Field label="Property type" value={submission.propertyType} />
            <Field label="Minimum bedrooms" value={submission.bedrooms} />
            <Field label="Floor area (sqm)" value={submission.floorAreaSqm} />
            <Field label="Must-haves" value={submission.mustHaves} full />
            <Field label="Deal-breakers" value={submission.dealBreakers} full />
          </Section>

          {/* Timeline */}
          <Section title="Timeline &amp; background" icon={Clock}>
            <Field label="Target date" value={submission.targetDate} />
            <Field label="Decision speed" value={submission.decisionSpeed} />
            <Field label="Decision makers" value={submission.decisionMakers} />
            <Field
              label="Prior experience"
              value={submission.priorExperience}
            />
            <Field label="Risk profile" value={submission.riskProfile} />
            <Field label="Referral source" value={submission.referralSource} />
          </Section>
        </div>
      </div>

      {/* Footer actions */}
      <div className="flex justify-between items-center pt-2">
        <Link
          href="/client-portal/intake"
          className="text-sm text-on-surface-muted hover:text-on-surface transition-colors"
        >
          ← Back to my briefs
        </Link>
        <Link
          href="/client-portal/intake/new"
          className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-navy-dark"
        >
          Submit a new brief
        </Link>
      </div>
    </div>
  );
}
