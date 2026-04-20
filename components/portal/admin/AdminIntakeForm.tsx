"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X } from "lucide-react";
import { IntakeForm } from "@/components/get-started/IntakeForm";
import { submitIntakeFormForClient } from "@/app/actions/intake";
import type { FormData as IntakeFormData } from "@/components/get-started/types";
import { INITIAL_FORM_DATA } from "@/components/get-started/types";

interface ClientOption {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  nationality: string | null;
  location: string | null;
  preferredName: string | null;
}

interface Props {
  clients: ClientOption[];
}

export default function AdminIntakeForm({ clients }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientOption | null>(
    null,
  );

  const filtered = clients.filter((c) => {
    const q = search.toLowerCase();
    return (
      (c.fullName ?? "").toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q)
    );
  });

  function selectClient(c: ClientOption) {
    setSelectedClient(c);
    setSearch("");
    setOpen(false);
  }

  function clearClient() {
    setSelectedClient(null);
  }

  const aboutData: Partial<IntakeFormData> = selectedClient
    ? {
        fullName: selectedClient.fullName ?? "",
        preferredName: selectedClient.preferredName ?? "",
        email: selectedClient.email,
        phone: selectedClient.phone ?? "",
        nationality: selectedClient.nationality ?? "",
        location: selectedClient.location ?? "",
      }
    : {};

  const submitForClient = useCallback(
    async (data: IntakeFormData) => {
      if (!selectedClient) {
        return { success: false, error: "Please select a client first." };
      }
      const result = await submitIntakeFormForClient(selectedClient.id, data);
      if (result.success) {
        router.push("/admin-portal/intake");
      }
      return result;
    },
    [selectedClient, router],
  );

  return (
    <div className="space-y-6">
      {/* Client selector */}
      <div className="rounded-2xl border border-divider bg-surface p-5 shadow-sm">
        <p className="mb-3 text-sm font-semibold text-on-surface">
          Select client <span className="text-crimson">*</span>
        </p>

        {selectedClient ? (
          <div className="flex items-center justify-between rounded-xl border border-divider bg-surface-alt px-4 py-3">
            <div>
              <p className="text-sm font-medium text-on-surface">
                {selectedClient.fullName ?? selectedClient.email}
              </p>
              <p className="text-xs text-on-surface-muted">
                {selectedClient.email}
              </p>
            </div>
            <button
              type="button"
              onClick={clearClient}
              className="rounded-lg p-1.5 text-on-surface-muted hover:bg-surface-alt hover:text-on-surface transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="relative">
            <div
              className="flex cursor-pointer items-center gap-2 rounded-xl border border-divider bg-surface px-4 py-2.5 text-sm text-on-surface-muted"
              onClick={() => setOpen((v) => !v)}
            >
              <Search size={14} className="shrink-0" />
              <input
                className="flex-1 bg-transparent outline-none placeholder:text-on-surface-muted text-on-surface text-sm"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
              />
              <ChevronDown size={14} className="shrink-0" />
            </div>

            {open && filtered.length > 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-divider bg-surface shadow-lg overflow-hidden">
                <ul className="max-h-60 overflow-y-auto divide-y divide-divider">
                  {filtered.map((c) => (
                    <li
                      key={c.id}
                      className="cursor-pointer px-4 py-3 hover:bg-surface-alt transition-colors"
                      onMouseDown={() => selectClient(c)}
                    >
                      <p className="text-sm font-medium text-on-surface">
                        {c.fullName ?? c.email}
                      </p>
                      <p className="text-xs text-on-surface-muted">{c.email}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {open && search.length > 0 && filtered.length === 0 && (
              <div className="absolute z-20 mt-1 w-full rounded-xl border border-divider bg-surface shadow-lg px-4 py-3">
                <p className="text-sm text-on-surface-muted">
                  No clients found.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Intake form — only shown once client selected */}
      {selectedClient ? (
        <IntakeForm
          initialData={{ ...INITIAL_FORM_DATA, ...aboutData }}
          readOnlyAbout
          submitAction={submitForClient}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-divider bg-surface p-12 text-center text-sm text-on-surface-muted">
          Select a client above to fill in their intake brief.
        </div>
      )}
    </div>
  );
}
