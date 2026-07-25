"use client";

import Link from "next/link";
import {
  Bell,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  MessageSquare,
  StickyNote,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const TAB_ICONS = {
  overview: LayoutDashboard,
  tasks: ClipboardList,
  updates: Bell,
  messages: MessageSquare,
  documents: FileText,
  billing: CreditCard,
  notes: StickyNote,
} as const;

export type EngagementTabIcon = keyof typeof TAB_ICONS;

export type EngagementTab = {
  id: string;
  label: string;
  icon: EngagementTabIcon;
  badge?: number;
};

interface EngagementTabNavProps {
  basePath: string;
  activeTab: string;
  tabs: EngagementTab[];
}

export default function EngagementTabNav({
  basePath,
  activeTab,
  tabs,
}: EngagementTabNavProps) {
  return (
    <nav className="overflow-x-auto pb-1 -mx-1 px-1">
      <div className="inline-flex min-w-full gap-1 rounded-xl border border-divider bg-surface p-1 shadow-sm">
        {tabs.map((tab) => {
          const Icon: LucideIcon = TAB_ICONS[tab.icon] ?? LayoutDashboard;
          const isActive = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={`${basePath}?tab=${tab.id}`}
              className={cn(
                "inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-navy text-white shadow-sm"
                  : "text-on-surface-muted hover:bg-surface-alt hover:text-on-surface",
              )}
            >
              <Icon size={15} />
              {tab.label}
              {tab.badge != null && tab.badge > 0 && (
                <Badge
                  variant="outline"
                  className={cn(
                    "h-5 min-w-5 px-1.5 text-[10px] tabular-nums",
                    isActive
                      ? "border-white/30 bg-white/15 text-white"
                      : "border-divider bg-surface text-on-surface-muted",
                  )}
                >
                  {tab.badge > 99 ? "99+" : tab.badge}
                </Badge>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
