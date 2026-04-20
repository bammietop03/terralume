"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  LogOut,
  User,
  Settings,
  Check,
  CheckCheck,
  ChevronDown,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { markRead, markAllRead } from "@/app/actions/notifications";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Notification } from "@/types";
import type { Role } from "@/types";

interface Props {
  role: Role;
  userName: string | null;
  preferredName: string | null;
  userEmail: string;
  photoUrl?: string | null;
  userId: string;
  initialNotifications: Notification[];
  onMenuClick: () => void;
}

// ── Derive a readable page title from the current path ──────────────
function usePageTitle(role: Role) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const last = segments[segments.length - 1] ?? "dashboard";
  const labels: Record<string, string> = {
    dashboard: "Dashboard",
    documents: "Documents",
    messages: "Messages",
    payments: "Payments",
    notifications: "Notifications",
    profile: "Profile",
    clients: "Clients",
    engagements: "Engagements",
    settings: "Settings",
    "first-login": "Welcome",
  };
  return (
    labels[last] ??
    last.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// ── Notifications panel ──────────────────────────────────────────────
function NotificationsPanel({
  userId,
  initialNotifications,
}: {
  userId: string;
  initialNotifications: Notification[];
}) {
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);
  const [open, setOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) =>
          setNotifications((prev) => [payload.new as Notification, ...prev]),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function handleMarkRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
    await markRead(id);
  }

  async function handleMarkAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    await markAllRead(userId);
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "relative inline-flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-200 outline-none",
            open
              ? "bg-white/10 text-white"
              : "text-white/50 hover:bg-white/8 hover:text-white",
          )}
          aria-label={`Notifications${unread > 0 ? ` (${unread} unread)` : ""}`}
        >
          <Bell size={17} />
          {unread > 0 && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[--color-crimson] px-1 text-[9px] font-bold text-white leading-none">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-90 p-0 rounded-2xl border border-[--color-divider]/60 shadow-2xl shadow-black/10 overflow-hidden bg-white z-50"
      >
        {/* Panel header */}
        <div className="flex items-center justify-between px-4 py-3.5 bg-[--color-navy-light]/30 border-b border-[--color-divider]/60">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[--color-navy]">
              <Bell size={13} className="text-white" />
            </div>
            <h3 className="text-sm font-semibold text-[--color-on-surface]">
              Notifications
            </h3>
            {unread > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[--color-crimson] px-1.5 text-[10px] font-bold text-white">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-[--color-navy] font-semibold hover:bg-[--color-navy-light] transition-colors"
            >
              <CheckCheck size={12} />
              Mark all read
            </button>
          )}
        </div>

        {/* Notification list */}
        <ScrollArea className="max-h-85">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[--color-navy-light]/60">
                <Sparkles size={20} className="text-[--color-navy]/40" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-on-surface-muted">
                  All caught up
                </p>
                <p className="text-xs text-on-surface-muted/70 mt-0.5">
                  No notifications yet
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-[--color-divider]/50">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => !n.read && handleMarkRead(n.id)}
                  className={cn(
                    "group w-full text-left px-4 py-3.5 transition-colors hover:bg-[--color-navy-light]/20",
                    !n.read && "bg-[--color-navy-light]/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "mt-0.5 h-2 w-2 shrink-0 rounded-full transition-colors",
                        n.read ? "bg-transparent" : "bg-[--color-crimson]",
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "text-sm leading-snug",
                          n.read
                            ? "text-on-surface-muted"
                            : "font-medium text-on-surface",
                        )}
                      >
                        {n.content}
                      </p>
                      <time className="mt-1 block text-[11px] text-on-surface-muted/70">
                        {new Date(n.createdAt).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </time>
                    </div>
                    {!n.read && (
                      <Check
                        size={13}
                        className="shrink-0 text-[--color-navy] opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                      />
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Main header ───────────────────────────────────────────────────────
export default function PortalHeader({
  role,
  userName,
  preferredName,
  userEmail,
  photoUrl,
  userId,
  initialNotifications,
  onMenuClick,
}: Props) {
  const router = useRouter();
  const pageTitle = usePageTitle(role);

  const displayName = preferredName ?? userName ?? userEmail;
  const initials = (userName ?? userEmail)
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const profileHref =
    role === "CLIENT" ? "/client-portal/profile" : "/admin-portal/settings";

  const portalLabel =
    role === "CLIENT"
      ? "Client Portal"
      : role === "ADMIN"
        ? "Admin Portal"
        : "PM Portal";

  const roleBadgeStyle =
    role === "ADMIN"
      ? "bg-[--color-crimson]/20 text-[--color-crimson-light]"
      : role === "PM"
        ? "bg-white/15 text-white/70"
        : "bg-white/10 text-white/50";

  return (
    <header
      className="relative z-40 flex h-15 shrink-0 items-center justify-between px-4 sm:px-6 gap-4"
      style={{
        background: "linear-gradient(175deg, #111d4e 0%, #0d1940 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
        boxShadow: "0 1px 0 rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.15)",
      }}
    >
      {/* ── Left ── */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Hamburger (mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden inline-flex h-9 w-9 items-center justify-center rounded-xl text-white/50 hover:bg-white/10 hover:text-white transition-colors"
          aria-label="Open navigation"
        >
          <Menu size={19} />
        </button>

        {/* Mobile logo */}
        <Link href="/" className="lg:hidden">
          <span className="font-display text-[17px] font-bold tracking-tight text-white">
            Terra<span className="text-[--color-crimson]">lume</span>
          </span>
        </Link>

        {/* Desktop: page context */}
        <div className="hidden lg:flex items-center gap-2.5 min-w-0">
          <span className="text-[11px] font-semibold text-white/30 uppercase tracking-wider select-none">
            {portalLabel}
          </span>
          <span className="text-white/20 text-sm">/</span>
          <span className="text-sm font-semibold text-white/80 truncate">
            {pageTitle}
          </span>
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center gap-1.5">
        {/* Notification bell */}
        <NotificationsPanel
          userId={userId}
          initialNotifications={initialNotifications}
        />

        {/* Vertical divider */}
        <div className="h-5 w-px bg-white/10 mx-1" />

        {/* User dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-xl pl-1 pr-2 py-1 hover:bg-white/8 transition-all duration-200 outline-none group">
              {/* Avatar with ring */}
              <div className="relative">
                <div className="h-8 w-8 rounded-full ring-2 ring-[--color-navy]/15 ring-offset-1 overflow-hidden">
                  <Avatar className="h-8 w-8">
                    {photoUrl && (
                      <AvatarImage src={photoUrl} alt={displayName} />
                    )}
                    <AvatarFallback className="bg-linear-to-br from-[--color-navy] to-[--color-navy-dark] text-white text-xs font-bold">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>

              {/* Name + role */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-[13px] font-semibold text-white leading-tight max-w-30 truncate">
                  {displayName}
                </span>
                <span
                  className={cn(
                    "text-[10px] font-semibold px-1.5 py-px rounded-full leading-tight mt-0.5",
                    roleBadgeStyle,
                  )}
                >
                  {role === "ADMIN" ? "Admin" : role === "PM" ? "PM" : "Client"}
                </span>
              </div>

              <ChevronDown
                size={13}
                className="hidden sm:block text-white/30 group-hover:text-white/60 transition-colors ml-0.5"
              />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            sideOffset={10}
            className="z-50 w-60 rounded-2xl border border-[--color-divider]/60 shadow-2xl shadow-black/10 p-1.5 overflow-hidden bg-white"
          >
            {/* Mini profile card */}
            <div className="flex items-center gap-3 px-3 py-3 mb-1 rounded-xl bg-[--color-navy-light]/30">
              <div className="h-10 w-10 rounded-full ring-2 ring-[--color-navy]/15 overflow-hidden shrink-0">
                <Avatar className="h-10 w-10">
                  {photoUrl && <AvatarImage src={photoUrl} alt={displayName} />}
                  <AvatarFallback className="bg-linear-to-br from-[--color-navy] to-[--color-navy-dark] text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-on-surface truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-[11px] text-on-surface-muted truncate mt-0.5 leading-tight">
                  {userEmail}
                </p>
              </div>
            </div>

            <DropdownMenuSeparator className="bg-[--color-divider]/60 my-1" />

            <DropdownMenuItem
              asChild
              className="rounded-xl cursor-pointer gap-2.5 px-3 py-2.5 focus:bg-[--color-navy-light]/50 focus:text-[--color-navy]"
            >
              <Link href={profileHref}>
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[--color-navy-light]">
                  <User size={14} className="text-[--color-navy]" />
                </span>
                <span className="text-sm">Profile &amp; Settings</span>
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator className="bg-[--color-divider]/60 my-1" />

            <DropdownMenuItem
              asChild
              className="rounded-xl cursor-pointer gap-2.5 px-3 py-2.5 focus:bg-red-50 focus:text-red-600 text-red-600"
            >
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="flex w-full items-center gap-2.5"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-50">
                    <LogOut size={14} className="text-red-500" />
                  </span>
                  <span className="text-sm">Log out</span>
                </button>
              </form>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
