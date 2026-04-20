import { redirect } from "next/navigation";
import Link from "next/link";
import { requireClient } from "@/app/actions/auth";
import { getClientDashboardData } from "@/app/actions/dashboard";
import { getMyIntakeDraft } from "@/app/actions/intake";
import EngagementSummaryCard from "@/components/portal/client/EngagementSummaryCard";
import StageProgressTracker from "@/components/portal/client/StageProgressTracker";
import LatestUpdateCard from "@/components/portal/client/LatestUpdateCard";
import PendingActionsPanel from "@/components/portal/client/PendingActionsPanel";
import QuickContactBar from "@/components/portal/client/QuickContactBar";
import type { PendingAction, Update } from "@/types";
import { FileEdit } from "lucide-react";

export const metadata = {
  title: "Dashboard — Terralume Client Portal",
};

export default async function ClientDashboardPage() {
  const user = await requireClient().catch(() => null);
  if (!user) redirect("/login");

  const [data, draft] = await Promise.all([
    getClientDashboardData(user.id),
    getMyIntakeDraft(),
  ]);

  if (!data) {
    return (
      <>
        <div className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-crimson) mb-1">
            Client Portal
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Welcome to Terralume
          </h1>
        </div>
        <div className="p-8 max-w-3xl mx-auto space-y-4">
          {/* Draft continuation banner */}
          {draft && (
            <Link
              href="/client-portal/intake/new"
              className="flex items-center justify-between gap-4 rounded-2xl border border-navy/20 bg-navy-light p-5 transition-colors hover:bg-navy/10"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy text-white">
                  <FileEdit size={18} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-on-surface">
                    Continue your intake form
                  </p>
                  <p className="text-xs text-on-surface-muted">
                    You have an in-progress brief — step {draft.draftStep} of 6
                  </p>
                </div>
              </div>
              <span className="shrink-0 text-xs font-semibold text-navy underline underline-offset-4">
                Continue →
              </span>
            </Link>
          )}
          <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm p-10 text-center shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)]">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) shadow-sm">
              <span className="font-display text-2xl text-white">T</span>
            </div>
            <h2 className="font-display text-xl font-bold text-on-surface mb-3">
              Your portal is being set up
            </h2>
            <p className="text-on-surface-muted text-sm leading-relaxed max-w-md mx-auto">
              Your engagement hasn&apos;t been activated yet. Your project
              manager will set it up shortly — you&apos;ll receive an email when
              it&apos;s ready.
            </p>
          </div>
        </div>
      </>
    );
  }

  const { engagement, latestUpdate, pendingActions, pm } = data;

  const firstName =
    user.preferredName ?? user.fullName?.split(" ")[0] ?? "there";

  return (
    <>
      <div className="px-6 pt-8 pb-2 max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-(--color-crimson) mb-1">
          Client Portal
        </p>
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Good to see you, {firstName}
        </h1>
        <p className="mt-1 text-sm text-on-surface-muted">
          Here&apos;s your engagement overview and latest updates.
        </p>
      </div>

      {/* ── Main content ── */}
      <div className="px-6 py-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left column */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <EngagementSummaryCard engagement={engagement} pm={pm} />
            <LatestUpdateCard update={latestUpdate as Update | null} />
            <PendingActionsPanel actions={pendingActions as PendingAction[]} />
          </div>

          {/* Right column */}
          <div className="flex flex-col gap-5">
            <StageProgressTracker currentStage={engagement.stage} />
            <QuickContactBar pm={pm} />
          </div>
        </div>
      </div>
    </>
  );
}
