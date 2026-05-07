import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { requireAdmin } from "@/app/actions/auth";
import { getAdminEngagementMessages } from "@/app/actions/admin";
import { ExternalLink, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import AdminMessageThread from "@/components/portal/admin/AdminMessageThread";

export const metadata = { title: "Conversation — Terralume Admin Portal" };

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

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();
}

export default async function AdminMessageThreadPage({
  params,
}: {
  params: Promise<{ engagementId: string }>;
}) {
  const { engagementId } = await params;
  const user = await requireAdmin().catch(() => null);
  if (!user) redirect("/admin-login");

  let data: Awaited<ReturnType<typeof getAdminEngagementMessages>>;
  try {
    data = await getAdminEngagementMessages(engagementId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "Not authorised.") redirect("/admin-portal/messages");
    notFound();
  }

  const { engagement, canSend } = data;
  const client = engagement.user;
  const pm = engagement.pm;

  const clientName = client.preferredName ?? client.fullName ?? client.email;
  const pmName = pm?.preferredName ?? pm?.fullName ?? "Unassigned";

  const clientInfo = {
    id: client.id,
    fullName: client.fullName,
    preferredName: client.preferredName,
    photoUrl: client.photoUrl ?? null,
    role: client.role,
  };
  const pmInfo = pm
    ? {
        id: pm.id,
        fullName: pm.fullName,
        preferredName: pm.preferredName,
        photoUrl: pm.photoUrl ?? null,
        role: pm.role,
      }
    : null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Thread header ─────────────────────────────── */}
      <div className="shrink-0 flex items-center justify-between gap-3 px-5 py-3.5 border-b border-divider bg-white">
        <div className="flex items-center gap-3 min-w-0">
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--color-navy-light) text-sm font-semibold text-(--color-navy)">
            {initials(clientName)}
          </div>
          {/* Info */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-on-surface text-sm truncate">
                {clientName}
              </span>
              <Badge variant="outline" className="text-[10px] px-1.5 shrink-0">
                {STAGE_LABELS[engagement.stage] ?? engagement.stage}
              </Badge>
              {!canSend && (
                <span className="flex items-center gap-1 text-[10px] text-on-surface-muted shrink-0">
                  <Lock size={10} />
                  Read-only
                </span>
              )}
            </div>
            <p className="text-xs text-on-surface-muted truncate">
              PM: {pmName} · {client.email}
            </p>
          </div>
        </div>
        <Link
          href={`/admin-portal/engagements/${engagementId}`}
          className="flex items-center gap-1 text-xs text-on-surface-muted hover:text-on-surface transition-colors shrink-0"
          title="View engagement"
        >
          <ExternalLink size={13} />
          <span className="hidden sm:inline">Engagement</span>
        </Link>
      </div>

      {/* ── Message thread (fills remaining height) ────── */}
      <div className="flex-1 overflow-hidden">
        <AdminMessageThread
          initialMessages={engagement.messages}
          engagementId={engagementId}
          currentUserId={user.id}
          canSend={canSend}
          clientInfo={clientInfo}
          pmInfo={pmInfo}
        />
      </div>
    </div>
  );
}
