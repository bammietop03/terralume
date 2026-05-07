"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Props {
  name: string;
  title?: string | null;
  signedUrl: string;
}

export default function ClientDocumentViewer({
  name,
  title,
  signedUrl,
}: Props) {
  const [open, setOpen] = useState(false);
  const displayName = title || name;

  const isPdf = name.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(name);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-7 gap-1.5 text-xs">
          <Eye size={12} />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{displayName}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 overflow-hidden">
          {isPdf && (
            <iframe
              src={signedUrl}
              className="w-full h-[65vh] rounded-lg border border-divider"
              title={name}
            />
          )}
          {isImage && (
            <div className="w-full overflow-hidden rounded-lg border border-divider bg-surface-muted flex items-center justify-center max-h-[65vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={signedUrl}
                alt={name}
                className="max-w-full max-h-[65vh] object-contain"
              />
            </div>
          )}
          {!isPdf && !isImage && (
            <div className="flex flex-col items-center gap-4 py-12">
              <p className="text-sm text-on-surface-muted">
                Preview not available for this file type.
              </p>
              <a
                href={signedUrl}
                download={name}
                className="inline-flex items-center gap-2 rounded-xl bg-(--color-navy) px-5 py-2.5 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
              >
                Download to view
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
