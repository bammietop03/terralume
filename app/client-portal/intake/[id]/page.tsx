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
    <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 border-b border-divider bg-surface-alt px-5 py-3.5">
        <Icon size={15} className="text-on-surface-muted" />
        <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          {title}
        </h2>
      </div>
      <div className="px-5 py-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        {children}
      </div>
    </div>
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
  const display = Array.isArray(value) ? (
    value.length > 0 ? (
      value.join(", ")
    ) : (
      <span className="text-on-surface-muted italic">None selected</span>
    )
  ) : value === true ? (
    "Yes"
  ) : value === false ? (
    "No"
  ) : (
    value || <span className="text-on-surface-muted italic">Not provided</span>
  );

  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <p className="text-[10px] font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
        {label}
      </p>
      <p className="text-sm text-on-surface">{display}</p>
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
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      {/* Back + Header */}
      <div>
        <Link
          href="/client-portal/intake"
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={13} />
          My briefs
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
              Brief details
            </p>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              {TYPE_LABEL[submission.transactionType] ??
                submission.transactionType}
            </h1>
            <p className="text-sm text-on-surface-muted mt-0.5">
              {submission.referenceNumber} · Submitted{" "}
              {formatDate(submission.createdAt)}
            </p>
          </div>
          <span
            className={`self-start inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${statusMeta.className}`}
          >
            {statusMeta.label}
          </span>
        </div>
      </div>

      {/* Assigned advisor card */}
      {submission.assignedPm ? (
        <div className="rounded-2xl border border-divider bg-surface overflow-hidden">
          <div className="flex items-center gap-2.5 border-b border-divider bg-surface-alt px-5 py-3.5">
            <User size={15} className="text-on-surface-muted" />
            <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
              Your advisor
            </h2>
          </div>
          <div className="px-5 py-4 flex items-start gap-4">
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-bold uppercase text-white">
              {submission.assignedPm.fullName?.charAt(0) ?? "?"}
            </div>
            {/* Details */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-on-surface">
                {submission.assignedPm.fullName ?? "Your advisor"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
                <a
                  href={`mailto:${submission.assignedPm.email}`}
                  className="inline-flex items-center gap-1 text-xs text-on-surface-muted hover:text-navy transition-colors"
                >
                  <Mail size={11} />
                  {submission.assignedPm.email}
                </a>
                {submission.assignedPm.phone && (
                  <a
                    href={`tel:${submission.assignedPm.phone}`}
                    className="inline-flex items-center gap-1 text-xs text-on-surface-muted hover:text-navy transition-colors"
                  >
                    <Phone size={11} />
                    {submission.assignedPm.phone}
                  </a>
                )}
              </div>
            </div>
            {/* Request change */}
            {!submission.pmChangeRequested && (
              <RequestPmChangeButton submissionId={submission.id} />
            )}
          </div>
          {submission.pmChangeRequested && (
            <div className="border-t border-divider bg-amber-50 px-5 py-3 flex items-center gap-2 text-xs text-amber-700">
              <Info size={13} className="shrink-0" />
              Advisor change requested — our team will be in touch shortly.
            </div>
          )}
        </div>
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

      {/* Contact */}
      <Section title="Your contact details" icon={User}>
        <Field label="Full name" value={submission.fullName} />
        <Field label="Preferred name" value={submission.preferredName} />
        <Field label="Email" value={submission.email} />
        <Field label="Phone" value={submission.phone} />
        <Field label="Based in" value={submission.location} />
        <Field label="Nationality" value={submission.nationality} />
      </Section>

      {/* Goal */}
      <Section title="Your goal" icon={Target}>
        <Field
          label="Transaction type"
          value={
            TYPE_LABEL[submission.transactionType] ?? submission.transactionType
          }
        />
        <Field label="Purpose" value={submission.purpose} />
      </Section>

      {/* Property */}
      <Section title="Property requirements" icon={Home}>
        <Field label="Target areas" value={submission.targetAreas} full />
        <Field label="Property type" value={submission.propertyType} />
        <Field label="Minimum bedrooms" value={submission.bedrooms} />
        <Field label="Floor area (sqm)" value={submission.floorAreaSqm} />
        <Field label="Must-haves" value={submission.mustHaves} full />
        <Field label="Deal-breakers" value={submission.dealBreakers} full />
      </Section>

      {/* Budget */}
      <Section title="Budget &amp; financing" icon={Wallet}>
        <Field label="Currency" value={submission.currency} />
        <Field label="Budget minimum" value={submission.budgetMin} />
        <Field label="Budget maximum" value={submission.budgetMax} />
        <Field label="Source of funds" value={submission.sourceOfFunds} />
        <Field label="Mortgage status" value={submission.mortgageStatus} />
      </Section>

      {/* Timeline */}
      <Section title="Timeline &amp; background" icon={Clock}>
        <Field label="Target date" value={submission.targetDate} />
        <Field label="Decision speed" value={submission.decisionSpeed} />
        <Field label="Decision makers" value={submission.decisionMakers} />
        <Field label="Prior experience" value={submission.priorExperience} />
        <Field label="Risk profile" value={submission.riskProfile} />
        <Field label="Referral source" value={submission.referralSource} />
      </Section>

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
