"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { uploadEngagementDocument } from "@/app/actions/storage";
import { Upload, Loader2 } from "lucide-react";

const DOCUMENT_CATEGORIES = [
  "Contract",
  "Report",
  "Analysis",
  "Legal Document",
  "Financial Document",
  "Property Document",
  "Site Plan",
  "Survey Report",
  "Energy Assessment",
  "Other",
];

interface UploadDocumentDialogProps {
  engagementId: string;
}

export default function UploadDocumentDialog({
  engagementId,
}: UploadDocumentDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  // Form state
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [isClientVisible, setIsClientVisible] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }
    if (!category) {
      setError("Please select a document category.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const result = await uploadEngagementDocument(
        formData,
        engagementId,
        category,
        isClientVisible,
        title || undefined,
      );

      if (!result.ok) {
        setError(result.error);
        setUploading(false);
        return;
      }

      // Success
      setOpen(false);
      setFile(null);
      setTitle("");
      setCategory("");
      setIsClientVisible(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      // Auto-fill title from filename if empty
      if (!title) {
        const nameWithoutExt = selectedFile.name.replace(/\.[^/.]+$/, "");
        setTitle(nameWithoutExt);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Upload size={16} className="mr-2" />
          Upload Document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-125">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a document for this engagement. It will be visible to the
              client unless you uncheck the option below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* File Input */}
            <div className="space-y-2">
              <Label htmlFor="file">
                File <span className="text-red-500">*</span>
              </Label>
              <Input
                id="file"
                type="file"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp"
                onChange={handleFileChange}
                disabled={uploading}
                required
              />
              <p className="text-xs text-on-surface-muted">
                Accepted: PDF, Word, Excel, Images (max 20 MB)
              </p>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Document Title (optional)</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Property Survey Report"
                disabled={uploading}
              />
              <p className="text-xs text-on-surface-muted">
                Leave blank to use the filename
              </p>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">
                Category <span className="text-red-500">*</span>
              </Label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={uploading}
                required
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Client Visibility */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="clientVisible"
                checked={isClientVisible}
                onCheckedChange={(checked) =>
                  setIsClientVisible(checked === true)
                }
                disabled={uploading}
              />
              <Label
                htmlFor="clientVisible"
                className="text-sm font-normal cursor-pointer"
              >
                Visible to client in their portal
              </Label>
            </div>

            {/* Error */}
            {error && (
              <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading || !file || !category}>
              {uploading ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Upload Document"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
