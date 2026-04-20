"use client";

import { useState } from "react";
import PortalSidebar from "./PortalSidebar";
import PortalHeader from "./PortalHeader";
import type { Role } from "@/types";
import type { Notification } from "@/types";

interface Props {
  role: Role;
  userEmail: string;
  userName: string | null;
  preferredName: string | null;
  userId: string;
  photoUrl?: string | null;
  initialNotifications: Notification[];
  children: React.ReactNode;
}

export default function PortalShell({
  role,
  userEmail,
  userName,
  preferredName,
  userId,
  photoUrl,
  initialNotifications,
  children,
}: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#eef0f8]">
      {/* Subtle background pattern */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, rgba(27,42,107,0.03) 1px, transparent 0)",
          backgroundSize: "32px 32px",
        }}
      />
      <PortalSidebar
        role={role}
        userEmail={userEmail}
        userName={userName}
        mobileOpen={sidebarOpen}
        onMobileClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      <div className="relative z-10 flex flex-1 flex-col min-w-0 min-h-0">
        <PortalHeader
          role={role}
          userName={userName}
          preferredName={preferredName}
          userEmail={userEmail}
          photoUrl={photoUrl}
          userId={userId}
          initialNotifications={initialNotifications}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
