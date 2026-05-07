"use client";

import { useRef, useState, useTransition } from "react";
import {
  uploadEngagementDocument,
  getDocumentSignedUrl,
  deleteDocument,
} from "@/app/actions/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download, Eye, FilePlus, Trash2 } from "lucide-react";

const CATEGORIES = [
  { value: "contract", label: "Contract" },
  { value: "title", label: "Title Document" },
  { value: "due-diligence", label: "Due Diligence" },
  { value: "compliance", label: "Compliance" },
  { value: "projection", label: "Financial Projection" },
  { value: "other", label: "Other" },
];

const CATEGORY_LABELS: Record<string, string> = {
  contract: "Contract",
  title: "Title Document",
  "due-diligence": "Due Diligence",
  compliance: "Compliance",
  projection: "Financial Projection",
  other: "Other",
};

type Document = {
  id: string;
  name: string;
  title: string | null;
  category: string | null;
  filePath: string;
  uploadedAt: Date | string;
  isClientVisible: boolean;
};

interface Props {
  engagementId: string;
  documents: Document[];
}

function formatDate(d: Date | string) {
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function ViewDocumentDialog({ doc }: { doc: Document }) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleOpen() {
    setOpen(true);
    if (!url) {
      setLoading(true);
      const result = await getDocumentSignedUrl(doc.filePath);
      setUrl(result.ok ? result.url : null);
      setLoading(false);
    }
  }

  const isPdf = doc.name.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|webp)$/i.test(doc.name);
  const displayTitle = doc.title || doc.name;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1.5 text-xs"
          onClick={handleOpen}
        >
          <Eye size={12} />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle className="truncate pr-6">{displayTitle}</DialogTitle>
        </DialogHeader>
        <div className="mt-2 overflow-hidden">
          {loading && (
            <p className="text-sm text-on-surface-muted py-8 text-center">
              Loading document…
            </p>
          )}
          {!loading && !url && (
            <p className="text-sm text-red-600 py-4">
              Could not load document preview.
            </p>
          )}
          {!loading && url && isPdf && (
            <iframe
              src={url}
              className="w-full h-[60vh] rounded-lg border border-divider"
              title={displayTitle}
            />
          )}
          {!loading && url && isImage && (
            <div className="w-full overflow-hidden rounded-lg border border-divider bg-surface-muted flex items-center justify-center max-h-[60vh]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={displayTitle}
                className="max-w-full max-h-[60vh] object-contain"
              />
            </div>
          )}
          {!loading && url && !isPdf && !isImage && (
            <div className="flex flex-col items-center gap-4 py-8">
              <FileText size={40} className="text-on-surface-muted" />
              <p className="text-sm text-on-surface-muted">
                Preview not available for this file type.
              </p>
              <a
                href={url}
                download
                className="inline-flex items-center gap-2 rounded-xl bg-(--color-navy) px-4 py-2 text-sm font-medium text-white hover:bg-navy/90 transition-colors"
              >
                <Download size={14} />
                Download to view
              </a>
            </div>
          )}
          {!loading && url && (isPdf || isImage) && (
            <div className="flex justify-end mt-3">
              <a
                href={url}
                download
                className="inline-flex items-center gap-2 rounded-xl border border-divider px-3 py-1.5 text-xs font-medium text-on-surface hover:bg-surface-muted transition-colors"
              >
                <Download size={12} />
                Download
              </a>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function DocumentDialog({ engagementId, documents }: Props) {
  const [uploadOpen, setUploadOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("other");
  const [docTitle, setDocTitle] = useState("");
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();
  const [, startDeleteTransition] = useTransition();

  function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setResult(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await uploadEngagementDocument(
        formData,
        engagementId,
        category,
        isClientVisible,
        docTitle.trim() || undefined,
      );
      if (res.ok) {
        setResult({ ok: true, msg: "Document uploaded successfully." });
        setUploadOpen(false);
        setDocTitle("");
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setResult({ ok: false, msg: res.error });
      }
    });
  }

  function handleDelete(documentId: string) {
    startDeleteTransition(async () => {
      await deleteDocument(documentId);
    });
  }

  return (
    <div className="space-y-4">
      {/* Document list */}
      {documents.length > 0 ? (
        <div className="divide-y divide-divider rounded-xl border border-divider overflow-hidden">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-surface"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText size={16} className="shrink-0 text-on-surface-muted" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-on-surface truncate">
                    {doc.title || doc.name}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap mt-0.5">
                    <span className="text-xs text-on-surface-muted">
                      {CATEGORY_LABELS[doc.category ?? ""] ?? doc.category ?? "General"}{" "}
                      · {formatDate(doc.uploadedAt)}
                    </span>
                    {!doc.isClientVisible && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 text-amber-600 border-amber-300"
                      >
                        Internal
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ViewDocumentDialog doc={doc} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-on-surface-muted hover:text-red-600"
                    >
                      <Trash2 size={13} />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete document?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete &quot;{doc.title || doc.name}&quot; from
                        storage and the portal. This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-red-600 hover:bg-red-700 text-white"
                        onClick={() => handleDelete(doc.id)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-on-surface-muted">
          No documents uploaded yet.
        </p>
      )}

      {result && (
        <p className={`text-sm ${result.ok ? "text-emerald-600" : "text-red-600"}`}>
          {result.msg}
        </p>
      )}

      {/* Upload dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-2">
            <FilePlus size={14} />
            Upload Document
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleUpload} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="docTitle">
                Title <span className="text-on-surface-muted font-normal">(what the client sees)</span>
              </Label>
              <Input
                id="docTitle"
                placeholder="e.g. Signed Purchase Agreement"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="docCategory">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="docCategory">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c.value} value={c.value}>
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="docFile">
                File (PDF, Word, Excel, image — max 20 MB)
              </Label>
              <input
                ref={fileRef}
                id="docFile"
                name="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                required
                className="block w-full text-sm text-on-surface file:mr-3 file:rounded-lg file:border-0 file:bg-(--color-navy-light) file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-(--color-navy) hover:file:bg-navy/10 cursor-pointer"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer w-fit">
              <input
                type="checkbox"
                checked={isClientVisible}
                onChange={(e) => setIsClientVisible(e.target.checked)}
                className="rounded border-divider"
              />
              <span className="text-sm text-on-surface-muted">
                Visible to client
              </span>
            </label>
            {result && !result.ok && (
              <p className="text-sm text-red-600">{result.msg}</p>
            )}
            <div className="flex justify-end gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setUploadOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                <Upload size={14} className="mr-2" />
                {isPending ? "Uploading…" : "Upload"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}