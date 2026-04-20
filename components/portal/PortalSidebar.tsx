"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  CreditCard,
  User,
  Users,
  UserCog,
  UserRound,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Bell,
  X,
  Newspaper,
  ClipboardList,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { Role } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const clientNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/client-portal/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Intake Forms", href: "/client-portal/intake", icon: ClipboardList },
  { label: "Documents", href: "/client-portal/documents", icon: FileText },
  { label: "Messages", href: "/client-portal/messages", icon: MessageSquare },
  { label: "Payments", href: "/client-portal/payments", icon: CreditCard },
  { label: "Notifications", href: "/client-portal/notifications", icon: Bell },
  { label: "Profile", href: "/client-portal/profile", icon: User },
  { label: "Settings", href: "/client-portal/settings", icon: Settings },
];

const adminNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin-portal/dashboard",
    icon: LayoutDashboard,
  },
  { label: "Clients", href: "/admin-portal/users/clients", icon: UserRound },
  { label: "Staff", href: "/admin-portal/users/staff", icon: UserCog },
  { label: "Leads", href: "/admin-portal/leads", icon: Sparkles },
  { label: "Intake Forms", href: "/admin-portal/intake", icon: ClipboardList },
  {
    label: "Market Intelligence",
    href: "/admin-portal/market-intelligence",
    icon: Newspaper,
  },
  { label: "Profile", href: "/admin-portal/profile", icon: User },
  { label: "Settings", href: "/admin-portal/settings", icon: Settings },
];

const pmNav: NavItem[] = [
  {
    label: "Dashboard",
    href: "/admin-portal/dashboard",
    icon: LayoutDashboard,
  },
  { label: "My Clients", href: "/admin-portal/clients", icon: Users },
  { label: "My Leads", href: "/admin-portal/leads", icon: Sparkles },
  { label: "Intake Forms", href: "/admin-portal/intake", icon: ClipboardList },
  { label: "Profile", href: "/admin-portal/profile", icon: User },
  { label: "Settings", href: "/admin-portal/settings", icon: Settings },
];

interface Props {
  role: Role;
  userEmail: string;
  userName: string | null;
  photoUrl?: string | null;
  mobileOpen: boolean;
  onMobileClose: () => void;
  collapsed: boolean;
  onCollapsedChange: (v: boolean) => void;
}

function NavLink({
  item,
  collapsed,
  onClick,
}: {
  item: NavItem;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  const link = (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group relative flex items-center gap-3 rounded-xl text-sm font-medium transition-all duration-200",
        isActive
          ? "bg-crimson text-white"
          : "text-white/45 hover:bg-white/5 hover:text-white/80",
        collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
      )}
    >
      {/* Crimson active left-bar */}
      {isActive && !collapsed && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.75 rounded-r-full bg-crimson" />
      )}

      {/* Icon wrapper */}
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-lg transition-all duration-200",
          collapsed ? "h-9 w-9" : "h-8 w-8",
          isActive
            ? "bg-crimson/20 text-white"
            : "text-white/40 group-hover:bg-white/6 group-hover:text-white/75",
        )}
      >
        <Icon size={16} />
      </span>

      {!collapsed && <span className="truncate">{item.label}</span>}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{link}</TooltipTrigger>
        <TooltipContent side="right" sideOffset={10} className="font-medium">
          {item.label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return link;
}

function SidebarContent({
  role,
  userEmail,
  userName,
  photoUrl,
  collapsed,
  onCollapsedChange,
  onClose,
}: Pick<
  Props,
  | "role"
  | "userEmail"
  | "userName"
  | "photoUrl"
  | "collapsed"
  | "onCollapsedChange"
> & {
  onClose?: () => void;
}) {
  const navItems =
    role === "CLIENT" ? clientNav : role === "ADMIN" ? adminNav : pmNav;

  const initials = (userName ?? userEmail)
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    role === "ADMIN"
      ? "Administrator"
      : role === "PM"
        ? "Project Manager"
        : "Client";

  return (
    <div className="flex h-full flex-col">
      {/* -- Logo bar -- */}
      <div
        className={cn(
          "flex h-16 shrink-0 items-center border-b border-white/[0.07]",
          collapsed ? "justify-center px-3" : "gap-3 px-4",
        )}
      >
        {!collapsed && (
          <Link href="/" className="flex items-baseline gap-px min-w-0 flex-1">
            <span className="font-display text-[17px] font-bold tracking-tight text-white leading-none">
              Terra
            </span>
            <span className="font-display text-[17px] font-bold tracking-tight text-(--color-crimson) leading-none">
              lume
            </span>
          </Link>
        )}

        {/* Mobile close */}
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto rounded-lg p-1.5 text-white/40 hover:bg-white/8 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* -- Navigation -- */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-0.5">
        {!collapsed && (
          <p className="px-3 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-white/20 select-none">
            Navigation
          </p>
        )}
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* -- Thin divider -- */}
      <div className="mx-3 h-px bg-white/[0.07]" />

      {/* -- User footer -- */}
      <div
        className={cn(
          "p-2.5 space-y-1",
          collapsed && "flex flex-col items-center gap-1.5",
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-3 rounded-xl px-3 py-2.5">
            {/* Avatar with online dot */}
            <div className="relative shrink-0">
              <Avatar className="h-9 w-9 shadow-md ring-2 ring-white/10">
                {photoUrl && (
                  <AvatarImage src={photoUrl} alt={userName ?? userEmail} />
                )}
                <AvatarFallback className="bg-linear-to-br from-(--color-crimson) to-[#6b1220] text-white text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0d1940]" />
            </div>
            {/* Name + role */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white truncate leading-tight">
                {userName ?? "�"}
              </p>
              <p className="text-[11px] text-white/35 truncate leading-tight mt-0.5">
                {roleLabel}
              </p>
            </div>
          </div>
        ) : (
          /* Collapsed: avatar only */
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="relative h-9 w-9 cursor-default shrink-0">
                <Avatar className="h-9 w-9 shadow-md ring-2 ring-white/10">
                  {photoUrl && (
                    <AvatarImage src={photoUrl} alt={userName ?? userEmail} />
                  )}
                  <AvatarFallback className="bg-linear-to-br from-(--color-crimson) to-[#6b1220] text-white text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 border-2 border-[#0d1940]" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={10}>
              {userName ?? userEmail}
            </TooltipContent>
          </Tooltip>
        )}

        {/* Logout button */}
        <form action="/api/auth/logout" method="POST">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="submit"
                className={cn(
                  "group flex w-full items-center gap-3 rounded-xl text-sm text-white/40 hover:bg-red-500/12 hover:text-red-300 transition-all duration-200",
                  collapsed ? "justify-center p-2.5" : "px-3 py-2.5",
                )}
              >
                <span
                  className={cn(
                    "flex shrink-0 items-center justify-center rounded-lg transition-colors",
                    "group-hover:bg-red-500/10",
                    collapsed ? "h-9 w-9" : "h-8 w-8",
                  )}
                >
                  <LogOut size={15} />
                </span>
                {!collapsed && <span>Log out</span>}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" sideOffset={10}>
                Log out
              </TooltipContent>
            )}
          </Tooltip>
        </form>
      </div>

      {/* -- Collapse toggle (desktop only) -- */}
      {!onClose && (
        <button
          onClick={() => onCollapsedChange(!collapsed)}
          className="absolute -right-3.5 top-18 z-20 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-[#0d1940] text-white/50 shadow-lg hover:text-white hover:border-white/20 transition-all duration-200"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      )}
    </div>
  );
}

export default function PortalSidebar({
  role,
  userEmail,
  userName,
  photoUrl,
  mobileOpen,
  onMobileClose,
  collapsed,
  onCollapsedChange,
}: Props) {
  return (
    <TooltipProvider delayDuration={0}>
      {/* -- Desktop sidebar -- */}
      <aside
        style={{
          background: "linear-gradient(175deg, #111d4e 0%, #0d1940 100%)",
          borderRight: "1px solid rgba(255,255,255,0.06)",
        }}
        className={cn(
          "relative hidden lg:flex flex-col shrink-0 overflow-hidden transition-all duration-300 ease-in-out",
          collapsed ? "w-17" : "w-59",
        )}
      >
        <SidebarContent
          role={role}
          userEmail={userEmail}
          userName={userName}
          photoUrl={photoUrl}
          collapsed={collapsed}
          onCollapsedChange={onCollapsedChange}
        />
      </aside>

      {/* -- Mobile drawer -- */}
      <Sheet open={mobileOpen} onOpenChange={(o) => !o && onMobileClose()}>
        <SheetContent
          side="left"
          className="w-59 p-0"
          style={{
            background: "linear-gradient(175deg, #111d4e 0%, #0d1940 100%)",
            borderRight: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <SidebarContent
            role={role}
            userEmail={userEmail}
            userName={userName}
            photoUrl={photoUrl}
            collapsed={false}
            onCollapsedChange={() => {}}
            onClose={onMobileClose}
          />
        </SheetContent>
      </Sheet>
    </TooltipProvider>
  );
}
