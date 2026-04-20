import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getMyIntakeDraft } from "@/app/actions/intake";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Submit New Brief — Terralume Client Portal",
};

export default async function ClientIntakeNewPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  // Load existing draft if one exists
  const draft = await getMyIntakeDraft();

  // Pre-fill About You from the user's profile
  const userAbout = {
    fullName: user.fullName ?? "",
    preferredName: user.preferredName ?? "",
    email: user.email ?? "",
    phone: user.phone ?? "",
    nationality: user.nationality ?? "",
    location: user.location ?? "",
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-6 py-8">
      <div>
        <Link
          href="/client-portal/intake"
          className="mb-4 inline-flex items-center gap-1.5 text-xs text-on-surface-muted transition-colors hover:text-on-surface"
        >
          <ArrowLeft size={13} />
          My briefs
        </Link>
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-on-surface-muted">
          New enquiry
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Submit a new brief
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Complete the form below to start a new property search engagement.
          {draft && (
            <span className="ml-1 font-medium text-navy">
              Your progress has been restored from your last session.
            </span>
          )}
        </p>
      </div>

      <IntakeForm
        enableDraft
        readOnlyAbout
        initialData={{ ...userAbout, ...(draft?.data ?? {}) }}
        initialStep={draft?.draftStep}
        draftId={draft?.id}
      />
    </div>
  );
}
