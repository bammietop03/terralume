"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  UserPlus,
  Search,
  Eye,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Briefcase,
  User,
  X,
  Users,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createUser, updateUser, deleteUser } from "@/app/actions/users";
import type { UserWithStats } from "@/app/actions/users";
import type { Role } from "@/types";
import { toast } from "sonner";

//  Helpers

function initials(name: string | null, email: string) {
  return (name ?? email)
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const ROLE_META: Record<
  Role,
  { label: string; icon: React.ElementType; badgeClass: string }
> = {
  CLIENT: {
    label: "Client",
    icon: User,
    badgeClass:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
  },
  PM: {
    label: "Project Manager",
    icon: Briefcase,
    badgeClass:
      "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300",
  },
  ADMIN: {
    label: "Administrator",
    icon: ShieldCheck,
    badgeClass:
      "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950 dark:text-purple-300",
  },
};

const SEGMENT_CONFIG = {
  clients: {
    availableRoles: ["CLIENT"] as Role[],
    defaultRole: "CLIENT" as Role,
    addLabel: "Add client",
    emptyLabel: "No clients yet.",
    filterEmptyLabel: "No clients match your search.",
    showRoleColumn: false,
    showRoleFilter: false,
  },
  staff: {
    availableRoles: ["PM", "ADMIN"] as Role[],
    defaultRole: "PM" as Role,
    addLabel: "Add staff member",
    emptyLabel: "No staff members yet.",
    filterEmptyLabel: "No staff members match your filters.",
    showRoleColumn: true,
    showRoleFilter: true,
  },
};

function RoleBadge({ role }: { role: Role }) {
  const meta = ROLE_META[role];
  const Icon = meta.icon;
  return (
    <Badge
      variant="outline"
      className={`gap-1.5 font-medium text-xs ${meta.badgeClass}`}
    >
      <Icon size={11} />
      {meta.label}
    </Badge>
  );
}

function formatDate(date: Date | string | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

//  Types

type DialogMode = "none" | "add" | "edit" | "view" | "delete";

interface FormState {
  fullName: string;
  email: string;
  role: Role;
  phone: string;
  preferredName: string;
}

//  Main component

interface Props {
  initialUsers: UserWithStats[];
  segment: "clients" | "staff";
}

export default function UsersTable({ initialUsers, segment }: Props) {
  const config = SEGMENT_CONFIG[segment];
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<Role | "ALL">("ALL");
  const [mode, setMode] = useState<DialogMode>("none");
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    role: config.defaultRole,
    phone: "",
    preferredName: "",
  });

  //  Filtering

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return initialUsers.filter((u) => {
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      const matchSearch =
        !q ||
        (u.fullName ?? "").toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone ?? "").includes(q);
      return matchRole && matchSearch;
    });
  }, [initialUsers, search, roleFilter]);

  //  Dialog helpers

  function openAdd() {
    setForm({
      fullName: "",
      email: "",
      role: config.defaultRole,
      phone: "",
      preferredName: "",
    });
    setSelectedUser(null);
    setMode("add");
  }

  function openEdit(user: UserWithStats) {
    setForm({
      fullName: user.fullName ?? "",
      email: user.email,
      role: user.role,
      phone: user.phone ?? "",
      preferredName: user.preferredName ?? "",
    });
    setSelectedUser(user);
    setMode("edit");
  }

  function openView(user: UserWithStats) {
    setSelectedUser(user);
    setMode("view");
  }
  function openDelete(user: UserWithStats) {
    setSelectedUser(user);
    setMode("delete");
  }
  function closeAll() {
    setMode("none");
  }
  function handleField(key: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validateForm() {
    if (!form.fullName.trim()) return "Full name is required.";
    if (!form.email.trim()) return "Email is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email.";
    return null;
  }

  function handleSave() {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    startTransition(async () => {
      try {
        if (mode === "add") {
          await createUser({
            email: form.email.trim(),
            fullName: form.fullName.trim(),
            preferredName: form.preferredName.trim() || undefined,
            role: form.role,
            phone: form.phone.trim() || undefined,
          });
          toast.success("User created successfully.");
        } else if (mode === "edit" && selectedUser) {
          await updateUser(selectedUser.id, {
            fullName: form.fullName.trim(),
            preferredName: form.preferredName.trim() || undefined,
            role: form.role,
            phone: form.phone.trim() || undefined,
          });
          toast.success("User updated successfully.");
        }
        closeAll();
        router.refresh();
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "An unexpected error occurred.",
        );
      }
    });
  }

  function handleDelete() {
    if (!selectedUser) return;
    startTransition(async () => {
      try {
        await deleteUser(selectedUser.id);
        closeAll();
        router.refresh();
        toast.success("User deleted.");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to delete user.",
        );
      }
    });
  }

  //  Render

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-muted pointer-events-none"
          />
          <Input
            placeholder="Search by name, email or phone"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-8 h-9 text-sm bg-surface"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-muted hover:text-on-surface transition-colors"
              aria-label="Clear search"
            >
              <X size={13} />
            </button>
          )}
        </div>

        {config.showRoleFilter && (
          <Select
            value={roleFilter}
            onValueChange={(v) => setRoleFilter(v as typeof roleFilter)}
          >
            <SelectTrigger className="h-9 w-full sm:w-44 text-sm bg-surface">
              <SelectValue placeholder="All roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All roles</SelectItem>
              {config.availableRoles.map((r) => (
                <SelectItem key={r} value={r}>
                  {ROLE_META[r].label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          size="sm"
          className="h-9 gap-2 bg-(--color-navy) hover:bg-(--color-navy-dark) text-white"
          onClick={openAdd}
        >
          <UserPlus size={15} />
          {config.addLabel}
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-navy-light)">
              <Users size={22} className="text-(--color-navy)" />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">
                {search || roleFilter !== "ALL"
                  ? "No results found"
                  : segment === "clients"
                    ? "No clients yet"
                    : "No staff members yet"}
              </p>
              <p className="text-xs text-on-surface-muted mt-0.5">
                {search || roleFilter !== "ALL"
                  ? "Try adjusting your search or filters."
                  : `Click "${config.addLabel}" to get started.`}
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-alt border-b border-divider hover:bg-surface-alt">
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide pl-6">
                  User
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden sm:table-cell">
                  Email
                </TableHead>
                {config.showRoleColumn && (
                  <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                    Role
                  </TableHead>
                )}
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden md:table-cell">
                  Phone
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden lg:table-cell text-center">
                  Engagements
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden lg:table-cell">
                  Onboarded
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden xl:table-cell">
                  Joined
                </TableHead>
                <TableHead className="pr-6" />
              </TableRow>
            </TableHeader>

            <TableBody>
              {filtered.map((user) => (
                <TableRow
                  key={user.id}
                  onClick={() => openView(user)}
                  className="hover:bg-surface-alt transition-colors border-b border-divider last:border-0 cursor-pointer"
                >
                  <TableCell className="pl-6 py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <Avatar className="h-8 w-8 shrink-0">
                        {user.photoUrl && (
                          <AvatarImage
                            src={user.photoUrl}
                            alt={user.fullName ?? user.email}
                          />
                        )}
                        <AvatarFallback className="text-xs font-semibold bg-(--color-navy-light) text-(--color-navy)">
                          {initials(user.fullName, user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-on-surface truncate leading-tight">
                          {user.fullName ?? ""}
                        </p>
                        {user.preferredName && (
                          <p className="text-xs text-on-surface-muted truncate leading-tight">
                            "{user.preferredName}"
                          </p>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="text-sm text-on-surface-muted hidden sm:table-cell py-3">
                    {user.email}
                  </TableCell>

                  {config.showRoleColumn && (
                    <TableCell className="py-3">
                      <RoleBadge role={user.role} />
                    </TableCell>
                  )}

                  <TableCell className="text-sm text-on-surface-muted hidden md:table-cell py-3">
                    {user.phone ?? ""}
                  </TableCell>

                  <TableCell className="text-center hidden lg:table-cell py-3">
                    {user._count.engagements > 0 ? (
                      <span className="inline-flex items-center justify-center rounded-full bg-(--color-navy-light) text-(--color-navy) text-xs font-semibold h-6 min-w-6 px-2">
                        {user._count.engagements}
                      </span>
                    ) : (
                      <span className="text-xs text-on-surface-muted">—</span>
                    )}
                  </TableCell>

                  <TableCell className="hidden lg:table-cell py-3">
                    {user.onboardingComplete ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5">
                        <CheckCircle2 size={11} />
                        Complete
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-xs font-medium px-2.5 py-0.5">
                        <XCircle size={11} />
                        Pending
                      </span>
                    )}
                  </TableCell>

                  <TableCell className="text-sm text-on-surface-muted hidden xl:table-cell py-3">
                    {formatDate(user.createdAt)}
                  </TableCell>

                  <TableCell
                    className="pr-6 py-3 text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-on-surface-muted hover:text-on-surface"
                        >
                          <MoreHorizontal size={16} />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl"
                      >
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm"
                          onClick={() => openView(user)}
                        >
                          <Eye size={14} />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm text-(--color-navy) focus:text-(--color-navy)"
                          onClick={() => openEdit(user)}
                        >
                          <Pencil size={14} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm text-destructive focus:text-destructive"
                          onClick={() => openDelete(user)}
                        >
                          <Trash2 size={14} />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-on-surface-muted">
          Showing{" "}
          <span className="font-medium text-on-surface">{filtered.length}</span>{" "}
          of{" "}
          <span className="font-medium text-on-surface">
            {initialUsers.length}
          </span>{" "}
          {segment === "clients" ? "client" : "staff member"}
          {initialUsers.length !== 1 ? "s" : ""}
        </p>
        {(search || roleFilter !== "ALL") &&
          filtered.length !== initialUsers.length && (
            <button
              onClick={() => {
                setSearch("");
                setRoleFilter("ALL");
              }}
              className="text-xs text-(--color-navy) hover:underline"
            >
              Clear filters
            </button>
          )}
      </div>

      {/* Add / Edit Dialog */}
      <Dialog
        open={mode === "add" || mode === "edit"}
        onOpenChange={(o) => !o && closeAll()}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {mode === "add"
                ? segment === "clients"
                  ? "Add new client"
                  : "Add staff member"
                : "Edit user"}
            </DialogTitle>
            <DialogDescription>
              {mode === "add"
                ? "A welcome email with a password-setup link will be sent automatically."
                : "Update user details. Email address cannot be changed here."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="fullName">Full name *</Label>
              <Input
                id="fullName"
                placeholder="e.g. Amara Okafor"
                value={form.fullName}
                onChange={(e) => handleField("fullName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="preferredName">
                Preferred name{" "}
                <span className="text-on-surface-muted text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                id="preferredName"
                placeholder="e.g. Amara"
                value={form.preferredName}
                onChange={(e) => handleField("preferredName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">
                Email address{mode === "add" ? " *" : ""}
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="user@example.com"
                value={form.email}
                onChange={(e) => handleField("email", e.target.value)}
                disabled={mode === "edit"}
                className={
                  mode === "edit" ? "opacity-60 cursor-not-allowed" : ""
                }
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">
                Phone{" "}
                <span className="text-on-surface-muted text-xs">
                  (optional)
                </span>
              </Label>
              <Input
                id="phone"
                placeholder="+234 800 000 0000"
                value={form.phone}
                onChange={(e) => handleField("phone", e.target.value)}
              />
            </div>

            {config.availableRoles.length > 1 && (
              <div className="space-y-1.5">
                <Label htmlFor="role">Role *</Label>
                <Select
                  value={form.role}
                  onValueChange={(v) => handleField("role", v)}
                >
                  <SelectTrigger id="role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {config.availableRoles.map((r) => (
                      <SelectItem key={r} value={r}>
                        {ROLE_META[r].label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeAll} disabled={isPending}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isPending}
              className="bg-(--color-navy) hover:bg-(--color-navy-dark) text-white gap-2"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              {mode === "add" ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog open={mode === "view"} onOpenChange={(o) => !o && closeAll()}>
        {selectedUser && (
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-display">User details</DialogTitle>
            </DialogHeader>

            <div className="py-2 space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  {selectedUser.photoUrl && (
                    <AvatarImage
                      src={selectedUser.photoUrl}
                      alt={selectedUser.fullName ?? selectedUser.email}
                    />
                  )}
                  <AvatarFallback className="text-base font-bold bg-(--color-navy-light) text-(--color-navy)">
                    {initials(selectedUser.fullName, selectedUser.email)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-on-surface text-base leading-snug">
                    {selectedUser.fullName ?? ""}
                  </p>
                  {selectedUser.preferredName && (
                    <p className="text-sm text-on-surface-muted">
                      "{selectedUser.preferredName}"
                    </p>
                  )}
                  <div className="mt-1.5">
                    <RoleBadge role={selectedUser.role} />
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-x-6 gap-y-4 text-sm">
                <DetailItem label="Email" value={selectedUser.email} span={2} />
                <DetailItem label="Phone" value={selectedUser.phone} />
                <DetailItem
                  label="Nationality"
                  value={selectedUser.nationality}
                />
                <DetailItem label="Location" value={selectedUser.location} />
                <DetailItem label="ID type" value={selectedUser.idType} />
                <DetailItem
                  label="ID number"
                  value={selectedUser.idNumber ? "" : null}
                />
                <DetailItem
                  label="Onboarding"
                  value={
                    selectedUser.onboardingComplete ? "Complete" : "Pending"
                  }
                />
                <DetailItem
                  label="Engagements"
                  value={String(selectedUser._count.engagements)}
                />
                <DetailItem
                  label="Joined"
                  value={formatDate(selectedUser.createdAt)}
                  span={2}
                />
              </dl>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={closeAll}>
                Close
              </Button>
              <Button
                className="bg-(--color-navy) hover:bg-(--color-navy-dark) text-white gap-2"
                onClick={() => {
                  closeAll();
                  setTimeout(() => openEdit(selectedUser), 50);
                }}
              >
                <Pencil size={14} />
                Edit
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog
        open={mode === "delete"}
        onOpenChange={(o) => !o && closeAll()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display">
              Delete user?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{selectedUser?.fullName ?? selectedUser?.email}</strong>{" "}
              and revoke their access. All associated data will also be removed.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              disabled={isPending}
              className="bg-destructive text-white hover:bg-destructive/90 gap-2"
            >
              {isPending && <Loader2 size={14} className="animate-spin" />}
              Delete user
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

//  Sub-components

function DetailItem({
  label,
  value,
  span,
}: {
  label: string;
  value: string | null | undefined;
  span?: number;
}) {
  return (
    <div className={span === 2 ? "col-span-2" : undefined}>
      <dt className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-0.5">
        {label}
      </dt>
      <dd className="text-sm text-on-surface">{value ?? ""}</dd>
    </div>
  );
}
