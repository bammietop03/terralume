import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Submit New Brief — Terralume Client Portal",
};

export default async function ClientIntakeNewPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <div>
        <Link
          href="/client-portal/intake"
          className="inline-flex items-center gap-1.5 text-xs text-on-surface-muted hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={13} />
          My briefs
        </Link>
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
          New enquiry
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Submit a new brief
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Complete the form below to start a new property search engagement.
        </p>
      </div>

      <IntakeForm />
    </div>
  );
}
