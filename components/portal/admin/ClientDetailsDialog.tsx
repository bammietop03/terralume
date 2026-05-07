"use client";

import { useState } from "react";
import Link from "next/link";
import { User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type ClientInfo = {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  location: string | null;
  nationality: string | null;
  idType: string | null;
  idNumber: string | null;
  onboardingComplete: boolean;
  createdAt: Date | string;
  lastLogin: Date | string | null;
};

interface Props {
  client: ClientInfo;
  stats: { label: string; value: number }[];
}

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ClientDetailsDialog({ client, stats }: Props) {
  const [open, setOpen] = useState(false);

  const fields = [
    { label: "Full name", value: client.fullName },
    { label: "Email", value: client.email },
    { label: "Phone", value: client.phone },
    { label: "Location", value: client.location },
    { label: "Nationality", value: client.nationality },
    { label: "ID type", value: client.idType },
    { label: "ID number", value: client.idNumber },
    {
      label: "Onboarding",
      value: client.onboardingComplete ? "Complete" : "Pending",
    },
    { label: "Joined", value: formatDate(client.createdAt) },
    { label: "Last login", value: formatDate(client.lastLogin) },
  ];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-xl border border-divider bg-surface px-3 py-1.5 text-sm font-medium text-on-surface hover:bg-surface-muted transition-colors"
      >
        <User size={14} />
        Client Details
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Client Profile</DialogTitle>
          </DialogHeader>
          <div className="space-y-5 pt-2">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl border border-divider bg-surface-muted/40 px-4 py-3 text-center"
                >
                  <p className="text-xl font-bold text-on-surface">{s.value}</p>
                  <p className="text-xs text-on-surface-muted">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Profile fields */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {fields.map(({ label, value }) => (
                <div key={label}>
                  <dt className="text-on-surface-muted text-xs">{label}</dt>
                  <dd className="font-medium text-on-surface">
                    {value ?? "—"}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="flex justify-end">
              <Link
                href={`/admin-portal/clients/${client.id}`}
                className="text-sm font-medium text-(--color-navy) hover:underline underline-offset-4"
              >
                View full client page →
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
