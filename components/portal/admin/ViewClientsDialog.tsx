"use client";

import { useMemo } from "react";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

type DialogClient = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  engagementCount: number;
  isCurrentEngagementClient: boolean;
};

interface ViewClientsDialogProps {
  clients: DialogClient[];
}

export default function ViewClientsDialog({ clients }: ViewClientsDialogProps) {
  const countLabel = useMemo(() => {
    if (clients.length === 1) return "1 client";
    return `${clients.length} clients`;
  }, [clients.length]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Users size={15} />
          View Clients
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Client Directory</DialogTitle>
          <DialogDescription>
            {countLabel} linked to this context.
          </DialogDescription>
        </DialogHeader>

        {clients.length === 0 ? (
          <div className="rounded-lg border border-dashed border-divider px-4 py-8 text-center text-sm text-on-surface-muted">
            No clients available for this engagement context.
          </div>
        ) : (
          <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
            {clients.map((client) => (
              <div
                key={client.id}
                className="rounded-xl border border-divider bg-surface px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-on-surface">
                    {client.name}
                  </p>
                  <div className="flex items-center gap-2">
                    {client.isCurrentEngagementClient && (
                      <Badge
                        variant="outline"
                        className="text-xs bg-blue-50 text-blue-700"
                      >
                        Current engagement
                      </Badge>
                    )}
                    <Badge variant="outline" className="text-xs">
                      {client.engagementCount} engagements
                    </Badge>
                  </div>
                </div>
                <p className="mt-1 text-xs text-on-surface-muted">
                  {client.email}
                </p>
                {client.phone ? (
                  <p className="mt-0.5 text-xs text-on-surface-muted">
                    {client.phone}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
