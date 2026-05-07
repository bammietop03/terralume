"use client";

import { useRef, useState, useTransition } from "react";
import { uploadEngagementDocument } from "@/app/actions/storage";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, CheckCircle2 } from "lucide-react";

const CATEGORIES = [
  { value: "contract", label: "Contract" },
  { value: "title", label: "Title Document" },
  { value: "due-diligence", label: "Due Diligence" },
  { value: "compliance", label: "Compliance" },
  { value: "projection", label: "Financial Projection" },
  { value: "other", label: "Other" },
];

export default function DocumentUploader({
  engagementId,
}: {
  engagementId: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("other");
  const [isClientVisible, setIsClientVisible] = useState(true);
  const [result, setResult] = useState<{ ok: boolean; msg: string } | null>(
    null,
  );
  const [isPending, startTransition] = useTransition();

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
      );
      if (res.ok) {
        setResult({ ok: true, msg: "Document uploaded." });
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setResult({ ok: false, msg: res.error });
      }
    });
  }

  return (
    <form onSubmit={handleUpload} className="space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
        <div className="space-y-1.5 sm:col-span-1">
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
        <div className="space-y-1.5 sm:col-span-2">
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
            className="block w-full text-sm text-on-surface file:mr-3 file:rounded-lg file:border-0 file:bg-(--color-navy-light) file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-(--color-navy) hover:file:bg-(--color-navy)/10 cursor-pointer"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer w-fit">
        <input
          type="checkbox"
          checked={isClientVisible}
          onChange={(e) => setIsClientVisible(e.target.checked)}
          className="rounded border-divider"
        />
        <span className="text-sm text-on-surface-muted">Visible to client</span>
      </label>

      {result && (
        <p
          className={`text-sm ${result.ok ? "text-emerald-600" : "text-red-600"}`}
        >
          {result.ok && <CheckCircle2 size={14} className="inline mr-1" />}
          {result.msg}
        </p>
      )}

      <Button type="submit" disabled={isPending} variant="outline" size="sm">
        <Upload size={14} className="mr-2" />
        {isPending ? "Uploading…" : "Upload document"}
      </Button>
    </form>
  );
}
