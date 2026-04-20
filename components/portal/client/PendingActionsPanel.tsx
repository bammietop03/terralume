import {
  FileSignature,
  ListChecks,
  MapPin,
  AlertCircle,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { PendingAction, PendingActionType } from "@/types";

const typeConfig: Record<
  PendingActionType,
  { icon: React.ReactNode; label: string; color: string }
> = {
  SIGN_DOCUMENT: {
    icon: <FileSignature size={16} />,
    label: "Sign document",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  APPROVE_SHORTLIST: {
    icon: <ListChecks size={16} />,
    label: "Approve shortlist",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  CONFIRM_VISIT: {
    icon: <MapPin size={16} />,
    label: "Confirm site visit",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  CONFIRM_BRIEF: {
    icon: <ListChecks size={16} />,
    label: "Confirm brief",
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
  OTHER: {
    icon: <AlertCircle size={16} />,
    label: "Action required",
    color:
      "bg-[--color-navy-light] text-[--color-navy] border-[--color-navy]/20",
  },
};

function fmtDueDate(d: Date | null | string): string {
  if (!d) return "";
  const date = new Date(d);
  const now = new Date();
  const diffDays = Math.ceil((date.getTime() - now.getTime()) / 86400000);
  if (diffDays < 0) return "Overdue";
  if (diffDays === 0) return "Due today";
  if (diffDays === 1) return "Due tomorrow";
  if (diffDays <= 7) return `Due in ${diffDays} days`;
  return `Due ${date.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

interface Props {
  actions: PendingAction[];
}

export default function PendingActionsPanel({ actions }: Props) {
  if (actions.length === 0) {
    return (
      <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-[--color-navy-light] to-[--color-navy-light]" />
        <div className="p-6">
          <h2 className="text-sm font-semibold text-on-surface mb-3">
            Pending Actions
          </h2>
          <p className="text-sm text-on-surface-muted">
            No actions required from you right now. 🎉
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
      {/* Crimson accent stripe */}
      <div className="h-1 w-full bg-linear-to-r from-[--color-crimson] to-[--color-crimson-light]" />

      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-on-surface">
            Pending Actions
          </h2>
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[--color-crimson] px-1.5 text-[10px] font-bold text-white">
            {actions.length}
          </span>
        </div>

        <ul className="space-y-2.5">
          {actions.map((action) => {
            const config =
              typeConfig[action.type as PendingActionType] ?? typeConfig.OTHER;
            const dueLabel = fmtDueDate(action.dueDate);
            const isOverdue = dueLabel === "Overdue";

            return (
              <li
                key={action.id}
                className="flex items-start gap-3 rounded-xl border border-divider/60 p-4 bg-white/60 hover:border-[--color-navy]/15 hover:bg-[--color-navy-light]/30 hover:shadow-sm transition-all duration-200"
              >
                <div
                  className={cn(
                    "shrink-0 flex h-8 w-8 items-center justify-center rounded-lg border",
                    config.color,
                  )}
                >
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-on-surface">
                    {action.title}
                  </p>
                  <p className="text-xs text-on-surface-muted capitalize">
                    {config.label}
                  </p>
                </div>
                {dueLabel && (
                  <div
                    className={cn(
                      "shrink-0 flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
                      isOverdue
                        ? "bg-red-50 text-red-500 border border-red-200"
                        : "bg-amber-50 text-amber-600 border border-amber-200",
                    )}
                  >
                    <Clock size={11} />
                    {dueLabel}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
