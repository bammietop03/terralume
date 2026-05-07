import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { prisma } from "@/lib/prisma";
import { getIntakeSubmissionById } from "@/app/actions/intake";
import { getServiceTiers } from "@/app/actions/service-tiers";
import { ArrowLeft, Zap, User, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import ActivateClientForm from "@/components/portal/admin/ActivateClientForm";

export const metadata = { title: "Activate Client — Terralume Admin Portal" };

export default async function ActivateClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  const [submission, serviceTiers] = await Promise.all([
    getIntakeSubmissionById(id),
    getServiceTiers(),
  ]);
  if (!submission) notFound();

  // Must have a user account to activate
  if (!submission.userId || !submission.user) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <Link
          href={`/admin-portal/intake/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={12} />
          Back to intake
        </Link>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-800">
          This intake submission is not linked to a user account. A client
          account must exist before an engagement can be created.
        </div>
      </div>
    );
  }

  // Check if an engagement already exists
  const existingEngagement = await prisma.engagement.findFirst({
    where: { userId: submission.userId },
    select: { id: true },
  });

  if (existingEngagement) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <Link
          href={`/admin-portal/intake/${id}`}
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
        >
          <ArrowLeft size={12} />
          Back to intake
        </Link>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-sm text-emerald-800 space-y-3">
          <p className="font-semibold">This client is already activated.</p>
          <p>
            {submission.user.fullName ?? submission.user.email} already has an
            active engagement. Use the client detail page to manage it.
          </p>
          <Link
            href={`/admin-portal/clients/${submission.userId}`}
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-700 underline underline-offset-4"
          >
            View client →
          </Link>
        </div>
      </div>
    );
  }

  const clientName =
    submission.user.fullName ?? submission.user.email ?? submission.fullName;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
      {/* Back */}
      <Link
        href={`/admin-portal/intake/${id}`}
        className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface transition-colors"
      >
        <ArrowLeft size={12} />
        Back to intake
      </Link>

      {/* Header */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          Activate Client
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Create Engagement
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          This will create an engagement for the client and notify them by
          email.
        </p>
      </div>

      {/* Client summary */}
      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--color-navy-light) text-sm font-bold uppercase text-(--color-navy)">
              {clientName.charAt(0)}
            </div>
            <div>
              <p className="font-semibold text-on-surface text-sm">
                {clientName}
              </p>
              <p className="text-xs text-on-surface-muted">
                {submission.user.email}
              </p>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            {[
              { label: "Reference", value: submission.referenceNumber },
              {
                label: "Type",
                value: submission.transactionType,
              },
              { label: "Location", value: submission.location },
              {
                label: "Budget",
                value:
                  submission.budgetMin && submission.budgetMax
                    ? `${submission.currency} ${submission.budgetMin} – ${submission.budgetMax}`
                    : submission.budgetMin
                      ? `${submission.currency} ${submission.budgetMin}+`
                      : null,
              },
            ].map(({ label, value }) => (
              <div key={label}>
                <dt className="text-on-surface-muted text-xs">{label}</dt>
                <dd className="font-medium text-on-surface capitalize">
                  {value ?? "—"}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* What will happen */}
      <Card className="border-dashed">
        <CardContent className="pt-5 space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-3">
            What will happen
          </p>
          {[
            {
              icon: Zap,
              text: "An Engagement record is created with stage: Discovery",
            },
            {
              icon: User,
              text: "The intake submission is marked ACTIVE",
            },
            {
              icon: FileText,
              text: 'The client receives an email: "Your engagement has started"',
            },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-start gap-2.5 text-sm">
              <Icon size={15} className="mt-0.5 shrink-0 text-(--color-navy)" />
              <p className="text-on-surface-muted">{text}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Form */}
      <Card>
        <CardContent className="pt-5">
          <ActivateClientForm
            userId={submission.userId}
            submissionId={submission.id}
            clientName={clientName}
            serviceTiers={serviceTiers}
          />
        </CardContent>
      </Card>
    </div>
  );
}
