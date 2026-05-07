"use client";

import { useState, useTransition } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  CheckCircle2,
  XCircle,
  Layers,
  MoreHorizontal,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createServiceTier,
  updateServiceTier,
  deleteServiceTier,
} from "@/app/actions/service-tiers";
import { toast } from "sonner";

// â”€â”€â”€ Types â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export interface ServiceTierRow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  currency: string;
  isActive: boolean;
  createdAt: Date;
}

interface Props {
  initialTiers: ServiceTierRow[];
}

type DialogMode = "none" | "add" | "edit" | "view" | "delete";

const CURRENCIES = ["NGN", "USD", "GBP", "EUR"];

function formatPrice(price: number, currency: string) {
  if (currency === "NGN") {
    return `₦${price.toLocaleString("en-NG")}`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(price);
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// â”€â”€â”€ Tier form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

function TierForm({
  tier,
  onSubmit,
  isPending,
}: {
  tier?: ServiceTierRow;
  onSubmit: (data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
  }) => void;
  isPending: boolean;
}) {
  const [name, setName] = useState(tier?.name ?? "");
  const [slug, setSlug] = useState(tier?.slug ?? "");
  const [description, setDescription] = useState(tier?.description ?? "");
  const [price, setPrice] = useState(String(tier?.price ?? ""));
  const [currency, setCurrency] = useState(tier?.currency ?? "NGN");
  const [slugManual, setSlugManual] = useState(!!tier);

  function handleNameChange(v: string) {
    setName(v);
    if (!slugManual) setSlug(slugify(v));
  }

  function handleSlugChange(v: string) {
    setSlugManual(true);
    setSlug(v.toLowerCase().replace(/[^a-z0-9-]/g, ""));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = parseFloat(price);
    if (isNaN(parsed) || parsed <= 0) {
      toast.error("Price must be a positive number.");
      return;
    }
    onSubmit({ name, slug, description, price: parsed, currency });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tier-name">Name</Label>
          <Input
            id="tier-name"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Premium"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tier-slug">Slug</Label>
          <Input
            id="tier-slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="e.g. premium"
            required
          />
          <p className="text-[11px] text-on-surface-muted">
            Lowercase letters, numbers and hyphens only.
          </p>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tier-desc">Description / Tagline</Label>
        <Textarea
          id="tier-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Short description shown on the services pageâ€¦"
          rows={2}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tier-price">Advisory fee from</Label>
          <Input
            id="tier-price"
            type="number"
            min="1"
            step="1000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="150000"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label>Currency</Label>
          <Select value={currency} onValueChange={setCurrency}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {CURRENCIES.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <DialogFooter className="pt-2">
        <DialogClose asChild>
          <Button type="button" variant="outline" disabled={isPending}>
            Cancel
          </Button>
        </DialogClose>
        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 size={14} className="animate-spin" />}
          {tier ? "Save changes" : "Create tier"}
        </Button>
      </DialogFooter>
    </form>
  );
}

// â”€â”€â”€ Main component â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function ServiceTiersManager({ initialTiers }: Props) {
  const [tiers, setTiers] = useState<ServiceTierRow[]>(initialTiers);
  const [mode, setMode] = useState<DialogMode>("none");
  const [selectedTier, setSelectedTier] = useState<ServiceTierRow | null>(null);
  const [isPending, startTransition] = useTransition();

  function openView(tier: ServiceTierRow) {
    setSelectedTier(tier);
    setMode("view");
  }
  function openEdit(tier: ServiceTierRow) {
    setSelectedTier(tier);
    setMode("edit");
  }
  function openDelete(tier: ServiceTierRow) {
    setSelectedTier(tier);
    setMode("delete");
  }
  function openAdd() {
    setSelectedTier(null);
    setMode("add");
  }
  function closeAll() {
    setMode("none");
  }

  function handleCreate(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
  }) {
    startTransition(async () => {
      try {
        const created = await createServiceTier({
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          price: data.price,
          currency: data.currency,
        });
        setTiers((prev) => [
          ...prev,
          {
            id: created.id,
            name: created.name,
            slug: created.slug,
            description: created.description,
            price: created.price,
            currency: created.currency,
            isActive: created.isActive,
            createdAt: created.createdAt,
          },
        ]);
        closeAll();
        toast.success(`"${created.name}" tier created.`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to create tier.",
        );
      }
    });
  }

  function handleEdit(data: {
    name: string;
    slug: string;
    description: string;
    price: number;
    currency: string;
  }) {
    if (!selectedTier) return;
    startTransition(async () => {
      try {
        const updated = await updateServiceTier(selectedTier.id, {
          name: data.name,
          slug: data.slug,
          description: data.description || null,
          price: data.price,
          currency: data.currency,
        });
        setTiers((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
        );
        closeAll();
        toast.success(`"${updated.name}" updated.`);
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update tier.",
        );
      }
    });
  }

  function handleToggleActive(tier: ServiceTierRow) {
    startTransition(async () => {
      try {
        const updated = await updateServiceTier(tier.id, {
          isActive: !tier.isActive,
        });
        setTiers((prev) =>
          prev.map((t) => (t.id === updated.id ? { ...t, ...updated } : t)),
        );
        toast.success(
          updated.isActive
            ? `"${updated.name}" activated.`
            : `"${updated.name}" deactivated.`,
        );
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to update tier.",
        );
      }
    });
  }

  function handleDelete() {
    if (!selectedTier) return;
    startTransition(async () => {
      try {
        await deleteServiceTier(selectedTier.id);
        setTiers((prev) =>
          prev.map((t) =>
            t.id === selectedTier.id ? { ...t, isActive: false } : t,
          ),
        );
        closeAll();
        toast.success("Tier deactivated.");
      } catch (err) {
        toast.error(
          err instanceof Error ? err.message : "Failed to deactivate tier.",
        );
      }
    });
  }

  const activeTiers = tiers.filter((t) => t.isActive);
  const inactiveTiers = tiers.filter((t) => !t.isActive);

  return (
    <>
      {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-1">
            Settings
          </p>
          <h1 className="font-display text-2xl font-bold text-on-surface">
            Service Tiers
          </h1>
          <p className="text-sm text-on-surface-muted mt-1">
            Manage the advisory packages shown on the website and used for
            client engagements.
          </p>
        </div>
        <Button
          size="sm"
          className="h-9 gap-2 bg-(--color-navy) hover:bg-(--color-navy-dark) text-white"
          onClick={openAdd}
        >
          <Plus size={15} />
          New Tier
        </Button>
      </div>

      {/* â”€â”€ Stats strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total tiers", value: tiers.length },
          { label: "Active", value: activeTiers.length },
          { label: "Inactive", value: inactiveTiers.length },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-xl border border-divider bg-surface px-5 py-4"
          >
            <p className="text-2xl font-bold text-on-surface">{s.value}</p>
            <p className="text-xs text-on-surface-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* â”€â”€ Table â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <div className="rounded-2xl border border-divider bg-surface shadow-sm overflow-hidden">
        {tiers.length === 0 ? (
          <div className="py-20 flex flex-col items-center gap-3 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-(--color-navy-light)">
              <Layers size={22} className="text-(--color-navy)" />
            </span>
            <div>
              <p className="text-sm font-medium text-on-surface">
                No tiers yet
              </p>
              <p className="text-xs text-on-surface-muted mt-0.5">
                Click &ldquo;New Tier&rdquo; to get started.
              </p>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface-alt border-b border-divider hover:bg-surface-alt">
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide pl-6">
                  Name
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                  Slug
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden md:table-cell">
                  Description
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide">
                  Price
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden sm:table-cell">
                  Status
                </TableHead>
                <TableHead className="text-xs font-semibold text-on-surface-muted uppercase tracking-wide hidden lg:table-cell">
                  Created
                </TableHead>
                <TableHead className="pr-6" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tiers.map((tier) => (
                <TableRow
                  key={tier.id}
                  onClick={() => openView(tier)}
                  className="hover:bg-surface-alt transition-colors border-b border-divider last:border-0 cursor-pointer"
                >
                  <TableCell className="pl-6 py-3">
                    <p className="font-medium text-sm text-on-surface">
                      {tier.name}
                    </p>
                  </TableCell>
                  <TableCell className="py-3">
                    <code className="rounded bg-surface-muted px-1.5 py-0.5 text-xs text-on-surface-muted">
                      {tier.slug}
                    </code>
                  </TableCell>
                  <TableCell className="py-3 hidden md:table-cell max-w-64">
                    <p className="text-sm text-on-surface-muted truncate">
                      {tier.description ?? (
                        <span className="italic text-xs">No description</span>
                      )}
                    </p>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-sm text-on-surface">
                    {formatPrice(tier.price, tier.currency)}
                  </TableCell>
                  <TableCell className="py-3 hidden sm:table-cell">
                    {tier.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium px-2.5 py-0.5">
                        <CheckCircle2 size={11} />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted text-on-surface-muted border border-divider text-xs font-medium px-2.5 py-0.5">
                        <XCircle size={11} />
                        Inactive
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-sm text-on-surface-muted hidden lg:table-cell">
                    {formatDate(tier.createdAt)}
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
                        className="w-44 rounded-xl"
                      >
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm"
                          onClick={() => openView(tier)}
                        >
                          <Eye size={14} />
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm text-(--color-navy) focus:text-(--color-navy)"
                          onClick={() => openEdit(tier)}
                        >
                          <Pencil size={14} />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm"
                          onClick={() => handleToggleActive(tier)}
                          disabled={isPending}
                        >
                          {tier.isActive ? (
                            <>
                              <XCircle size={14} />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <CheckCircle2 size={14} />
                              Activate
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="gap-2 cursor-pointer text-sm text-destructive focus:text-destructive"
                          onClick={() => openDelete(tier)}
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

      {/* Footer count */}
      <div className="mt-3">
        <p className="text-xs text-on-surface-muted">
          Showing{" "}
          <span className="font-medium text-on-surface">{tiers.length}</span>{" "}
          tier{tiers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* â”€â”€ View dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Dialog open={mode === "view"} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display">
              {selectedTier?.name}
            </DialogTitle>
            <DialogDescription>Service tier details</DialogDescription>
          </DialogHeader>
          {selectedTier && (
            <div className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                  <p className="text-xs text-on-surface-muted mb-0.5">Price</p>
                  <p className="font-mono text-sm font-semibold text-on-surface">
                    {formatPrice(selectedTier.price, selectedTier.currency)}
                  </p>
                </div>
                <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                  <p className="text-xs text-on-surface-muted mb-0.5">Status</p>
                  {selectedTier.isActive ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                      <CheckCircle2 size={12} />
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-muted">
                      <XCircle size={12} />
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-on-surface-muted uppercase tracking-wide">
                  Slug
                </p>
                <code className="block rounded bg-surface-muted px-3 py-2 text-sm text-on-surface-muted">
                  {selectedTier.slug}
                </code>
              </div>
              {selectedTier.description && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-on-surface-muted uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-on-surface leading-relaxed">
                    {selectedTier.description}
                  </p>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-on-surface-muted uppercase tracking-wide">
                  Created
                </p>
                <p className="text-sm text-on-surface">
                  {formatDate(selectedTier.createdAt)}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                closeAll();
                if (selectedTier) openEdit(selectedTier);
              }}
            >
              <Pencil size={13} />
              Edit
            </Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* â”€â”€ Add dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Dialog open={mode === "add"} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">New Service Tier</DialogTitle>
            <DialogDescription>
              Add a new advisory package to the website.
            </DialogDescription>
          </DialogHeader>
          <TierForm onSubmit={handleCreate} isPending={isPending} />
        </DialogContent>
      </Dialog>

      {/* â”€â”€ Edit dialog â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <Dialog open={mode === "edit"} onOpenChange={(o) => !o && closeAll()}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display">
              Edit â€” {selectedTier?.name}
            </DialogTitle>
            <DialogDescription>
              Update tier details. Changes reflect on the website immediately.
            </DialogDescription>
          </DialogHeader>
          {selectedTier && (
            <TierForm
              tier={selectedTier}
              onSubmit={handleEdit}
              isPending={isPending}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* â”€â”€ Delete confirmation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
      <AlertDialog
        open={mode === "delete"}
        onOpenChange={(o) => !o && closeAll()}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate this tier?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>{selectedTier?.name}</strong> will be hidden from the
              website and cannot be assigned to new engagements. Existing
              engagements are unaffected. You can reactivate it at any time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending && <Loader2 size={13} className="animate-spin" />}
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
