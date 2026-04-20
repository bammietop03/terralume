import { Building2, Calendar, Clock, UserCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Engagement, PMProfile } from "@/types";

const STAGE_LABELS: Record<string, string> = {
  discovery: "Discovery",
  brief_confirmation: "Brief Confirmation",
  area_shortlisting: "Area Shortlisting",
  property_search: "Property Search",
  due_diligence: "Due Diligence",
  offer_negotiation: "Offer & Negotiation",
  legal_completion: "Legal & Completion",
  handover: "Handover",
};

const TIER_LABELS: Record<string, string> = {
  essential: "Essential",
  premium: "Premium",
  elite: "Elite",
};

function fmtDate(d: Date | null | string): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  engagement: Engagement;
  pm: PMProfile | null;
}

export default function EngagementSummaryCard({ engagement, pm }: Props) {
  const tier = engagement.serviceTier
    ? (TIER_LABELS[engagement.serviceTier] ?? engagement.serviceTier)
    : null;
  const stage = STAGE_LABELS[engagement.stage] ?? engagement.stage;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)]">
      {/* Navy accent stripe at top */}
      <div className="h-1 w-full bg-linear-to-r from-(--color-navy) via-(--color-crimson) to-(--color-navy)" />

      <div className="p-6">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-(--color-navy) to-(--color-navy-dark) text-white shadow-sm ring-1 ring-black/3">
              <Building2 size={20} />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-on-surface-muted/80">
                Active Engagement
              </p>
              {tier && (
                <Badge variant="default" className="mt-0.5 text-xs">
                  {tier}
                </Badge>
              )}
            </div>
          </div>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-(--color-navy-light) border border-(--color-navy)/10 px-3 py-1.5 text-xs font-semibold text-(--color-navy) shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-(--color-navy) animate-pulse" />
            {stage}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="flex items-start gap-2.5 rounded-xl bg-(--color-navy-light)/40 border border-(--color-navy)/5 p-3.5">
            <Calendar
              size={15}
              className="mt-0.5 text-(--color-navy) shrink-0"
            />
            <div>
              <p className="text-[11px] text-on-surface-muted">Started</p>
              <p className="text-sm font-semibold text-on-surface">
                {fmtDate(engagement.startDate)}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2.5 rounded-xl bg-(--color-crimson-light)/40 border border-(--color-crimson)/5 p-3.5">
            <Clock
              size={15}
              className="mt-0.5 text-(--color-crimson) shrink-0"
            />
            <div>
              <p className="text-[11px] text-on-surface-muted">
                Target completion
              </p>
              <p className="text-sm font-semibold text-on-surface">
                {fmtDate(engagement.targetDate)}
              </p>
            </div>
          </div>
        </div>

        {/* PM card */}
        <div className="rounded-xl bg-linear-to-br from-(--color-navy-dark) to-[#0d1940] p-4 flex items-center gap-3 shadow-sm ring-1 ring-white/5">
          {pm?.photoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={pm.photoUrl}
              alt={pm.fullName ?? "PM"}
              className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
            />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <UserCircle size={22} className="text-white/70" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white/50">Your Project Manager</p>
            <p className="text-sm font-semibold text-white truncate">
              {pm?.fullName ?? "To be assigned"}
            </p>
            {pm?.email && (
              <p className="text-xs text-white/50 truncate">{pm.email}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
