import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getLeadById } from "@/app/actions/leads";
import { getStaffUsers } from "@/app/actions/users";
import {
  ArrowLeft,
  User,
  CalendarCheck,
  MailCheck,
  ExternalLink,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LeadStatusSelect from "@/components/portal/admin/LeadStatusSelect";
import AssignLeadPmButton from "@/components/portal/admin/AssignLeadPmButton";
import SendCalendarButton from "@/components/portal/admin/SendCalendarButton";
import SendIntakeInviteButton from "@/components/portal/admin/SendIntakeInviteButton";
import LeadNotesField from "@/components/portal/admin/LeadNotesField";

export const metadata = { title: "Lead Detail — Terralume Admin Portal" };

const STATUS_META: Record<string, { label: string; badge: string }> = {
  NEW: {
    label: "New",
    badge: "bg-purple-50 text-purple-700 ring-1 ring-purple-200",
  },
  CONSULTATION_SCHEDULED: {
    label: "Consultation scheduled",
    badge: "bg-blue-50 text-blue-700 ring-1 ring-blue-200",
  },
  AWAITING_DECISION: {
    label: "Awaiting decision",
    badge: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  },
  INTAKE_INVITED: {
    label: "Intake invited",
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
  },
  INTAKE_SUBMITTED: {
    label: "Intake submitted",
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    badge: "bg-zinc-100 text-zinc-500 ring-1 ring-zinc-200",
  },
};

const INTEREST_LABEL: Record<string, string> = {
  BUY: "Buy a property",
  INVEST: "Invest in real estate",
  DEVELOP: "Develop / build",
  LEGAL_SUPPORT: "Legal support / due diligence",
  CROSS_BORDER: "Cross-border / diaspora acquisition",
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
        <Icon size={13} className="shrink-0 text-on-surface-muted" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
          {title}
        </span>
      </div>
      <CardContent className="grid grid-cols-2 gap-x-6 gap-y-4 p-4 pt-4">
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
  value?: string | null;
  span2?: boolean;
}) {
  return (
    <div className={span2 ? "col-span-2" : ""}>
      <p className="mb-0.5 text-[10px] font-medium uppercase tracking-wider text-on-surface-muted/70">
        {label}
      </p>
      {!value ? (
        <p className="text-xs italic text-on-surface-muted">—</p>
      ) : (
        <p className="text-sm leading-snug text-on-surface">{value}</p>
      )}
    </div>
  );
}

export default async function AdminLeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const isAdmin = user.role === "ADMIN";

  const [lead, staffUsers] = await Promise.all([
    getLeadById(id),
    isAdmin ? getStaffUsers() : Promise.resolve([]),
  ]);
  if (!lead) notFound();

  const pmOptions = staffUsers
    .filter((u) => u.role === "PM" || u.role === "ADMIN")
    .map((u) => ({
      id: u.id,
      fullName: u.fullName,
      email: u.email,
      phone: u.phone,
    }));

  const statusMeta = STATUS_META[lead.status] ?? STATUS_META.NEW;

  return (
    <div className="mx-auto max-w-5xl space-y-5 px-6 py-7">
      {/* Back */}
      <Link
        href="/admin-portal/leads"
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted transition-colors hover:text-on-surface"
      >
        <ArrowLeft size={12} />
        All leads
      </Link>

      {/* Page header */}
      <div className="flex flex-col gap-4 rounded-xl border border-divider bg-surface p-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy/10 text-sm font-bold uppercase text-navy">
          {lead.fullName.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-semibold leading-tight text-on-surface">
            {lead.fullName}
          </p>
          <p className="mt-0.5 text-xs text-on-surface-muted">
            {lead.email}
            <span className="mx-1.5 text-divider-strong">·</span>
            {lead.phone}
            <span className="mx-1.5 text-divider-strong">·</span>
            Received {formatDate(lead.createdAt)}
          </p>
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusMeta.badge}`}
        >
          {statusMeta.label}
        </span>
      </div>

      {/* Two-column layout */}
      <div className="grid gap-5 lg:grid-cols-3">
        {/* ── Left: info sections (2/3) */}
        <div className="space-y-5 lg:col-span-2">
          <SectionCard title="Contact information" icon={User}>
            <Field label="Full name" value={lead.fullName} />
            <Field label="Email" value={lead.email} />
            <Field label="Phone" value={lead.phone} />
            <Field label="Location" value={lead.location} />
            <Field
              label="Interest type"
              value={
                lead.interestType ? INTEREST_LABEL[lead.interestType] : null
              }
            />
          </SectionCard>

          {/* Calendar section */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <CalendarCheck
                size={13}
                className="shrink-0 text-on-surface-muted"
              />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Consultation scheduling
              </span>
            </div>
            <CardContent className="p-4">
              <SendCalendarButton
                leadId={lead.id}
                existingUrl={lead.calendarUrl}
                sentAt={lead.calendarSentAt}
              />
            </CardContent>
          </Card>

          {/* Intake section */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <MailCheck size={13} className="shrink-0 text-on-surface-muted" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Intake invitation
              </span>
            </div>
            <CardContent className="space-y-3 p-4">
              <p className="text-sm text-on-surface-muted">
                Once the client has agreed to proceed during the consultation,
                send them their portal invitation to complete the structured
                intake.
              </p>
              <SendIntakeInviteButton
                leadId={lead.id}
                inviteSentAt={lead.inviteSentAt}
                clientName={lead.fullName}
              />

              {/* Link to intake submission if exists */}
              {lead.intakeSubmission && (
                <Link
                  href={`/admin-portal/intake/${lead.intakeSubmission.id}`}
                  className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-navy underline underline-offset-4"
                >
                  <FileText size={12} />
                  View intake submission (
                  {lead.intakeSubmission.referenceNumber})
                </Link>
              )}
            </CardContent>
          </Card>

          {/* Portal account link */}
          {lead.user && (
            <Card className="overflow-hidden">
              <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
                <User size={13} className="shrink-0 text-on-surface-muted" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                  Portal account
                </span>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-on-surface">
                      {lead.user.fullName ?? lead.user.email}
                    </p>
                    <p className="text-xs text-on-surface-muted">
                      {lead.user.email}
                    </p>
                    <p className="mt-0.5 text-[11px] text-on-surface-muted">
                      Onboarding:{" "}
                      {lead.user.onboardingComplete ? "Complete" : "Pending"}
                    </p>
                  </div>
                  <Link
                    href={`/admin-portal/users/${lead.user.id}`}
                    className="inline-flex items-center gap-1 text-xs font-medium text-navy underline underline-offset-4"
                  >
                    <ExternalLink size={11} />
                    View account
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* ── Right: admin controls (1/3) */}
        <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
          {/* Status */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Status
              </span>
            </div>
            <CardContent className="p-4">
              <LeadStatusSelect leadId={lead.id} currentStatus={lead.status} />
            </CardContent>
          </Card>

          {/* PM assignment */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <User size={13} className="shrink-0 text-on-surface-muted" />
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Project manager
              </span>
            </div>
            <CardContent className="p-4">
              {lead.assignedPm ? (
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-navy/10 text-xs font-bold uppercase text-navy">
                    {lead.assignedPm.fullName?.charAt(0) ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-on-surface">
                      {lead.assignedPm.fullName}
                    </p>
                    <p className="truncate text-[11px] text-on-surface-muted">
                      {lead.assignedPm.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-sm italic text-on-surface-muted">
                  No PM assigned yet
                </p>
              )}
              {isAdmin && (
                <div className="mt-3">
                  <AssignLeadPmButton
                    leadId={lead.id}
                    assignedPm={lead.assignedPm}
                    pmOptions={pmOptions}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Internal notes */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Internal notes
              </span>
            </div>
            <CardContent className="p-4">
              <LeadNotesField leadId={lead.id} initialNotes={lead.notes} />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}
