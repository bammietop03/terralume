"use client";

import { useRef, useState, useTransition, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { signAgreement } from "@/app/actions/agreements";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  FileSignature,
  PenLine,
  Upload,
  Trash2,
  CheckCircle2,
  Loader2,
  Eye,
  Download,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────────────

export interface AgreementData {
  id: string;
  status: string;
  signedAt: Date | null;
  signerName: string | null;
  signatureImageUrl: string | null;
  serviceTier: string | null;
  scopeDescription: string;
  timeline: string | null;
  deliverables: string[];
  feeAmount: number;
  currency: string;
  terms: string;
  createdAt: Date;
}

interface Props {
  engagementId: string;
  agreement: AgreementData;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatDate(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateTime(d: Date | string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(amount: number, currency: string) {
  if (currency === "NGN") return `₦${amount.toLocaleString("en-NG")}`;
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Signature canvas ───────────────────────────────────────────────────────

function SignatureCanvas({
  onChange,
}: {
  onChange: (dataUrl: string | null) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const hasDrawn = useRef(false);

  function getPos(
    e: React.MouseEvent | React.TouchEvent,
    canvas: HTMLCanvasElement,
  ) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    if ("touches" in e) {
      const touch = e.touches[0];
      return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  }

  function startDraw(e: React.MouseEvent | React.TouchEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
    isDrawing.current = true;
  }

  function draw(e: React.MouseEvent | React.TouchEvent) {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    e.preventDefault();
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.stroke();
    hasDrawn.current = true;
  }

  function endDraw() {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawn.current) return;
    onChange(canvas.toDataURL("image/png"));
  }

  const clear = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hasDrawn.current = false;
    onChange(null);
  }, [onChange]);

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl border-2 border-dashed border-divider bg-white overflow-hidden">
        <canvas
          ref={canvasRef}
          width={600}
          height={180}
          className="w-full touch-none cursor-crosshair"
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        <p className="absolute inset-x-0 bottom-2 text-center text-xs text-on-surface-muted pointer-events-none select-none">
          Draw your signature above
        </p>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="gap-1.5 text-xs h-7"
        onClick={clear}
      >
        <Trash2 size={12} />
        Clear
      </Button>
    </div>
  );
}

// ─── Main ───────────────────────────────────────────────────────────────────

export default function AgreementDialog({ engagementId, agreement }: Props) {
  const [open, setOpen] = useState(false);
  const [signTab, setSignTab] = useState<"draw" | "upload">("draw");
  const [signerName, setSignerName] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [drawnDataUrl, setDrawnDataUrl] = useState<string | null>(null);
  const [uploadPreview, setUploadPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isSigned = agreement.status === "SIGNED";

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setFormError("Signature image must be under 2 MB.");
      return;
    }
    if (
      !["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(
        file.type,
      )
    ) {
      setFormError("Only JPG, PNG or WebP images are accepted.");
      return;
    }
    setFormError(null);
    const reader = new FileReader();
    reader.onload = (ev) => setUploadPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSign(e: React.FormEvent) {
    e.preventDefault();
    if (!agreed) {
      setFormError("Please confirm you have read and agreed to the terms.");
      return;
    }
    if (!signerName.trim()) {
      setFormError("Please type your full legal name.");
      return;
    }

    const sigImage = signTab === "draw" ? drawnDataUrl : uploadPreview;

    if (!sigImage) {
      setFormError(
        signTab === "draw"
          ? "Please draw your signature above."
          : "Please upload a signature image.",
      );
      return;
    }

    setFormError(null);
    startTransition(async () => {
      try {
        await signAgreement(engagementId, signerName.trim(), sigImage);
        toast.success("Agreement signed successfully.");
        setOpen(false);
        router.refresh();
      } catch (err) {
        setFormError(
          err instanceof Error ? err.message : "Failed to sign agreement.",
        );
      }
    });
  }

  // Reset sign form when dialog closes
  useEffect(() => {
    if (!open) {
      setSignerName("");
      setAgreed(false);
      setDrawnDataUrl(null);
      setUploadPreview(null);
      setFormError(null);
    }
  }, [open]);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={
          isSigned
            ? "gap-2 bg-emerald-600 hover:bg-emerald-700 text-white"
            : "gap-2 bg-(--color-navy) hover:bg-(--color-navy-dark) text-white"
        }
      >
        {isSigned ? (
          <>
            <Eye size={15} />
            View Agreement
          </>
        ) : (
          <>
            <FileSignature size={15} />
            Review &amp; Sign
          </>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl p-0 gap-0 flex flex-col max-h-[90vh]">
          {/* Fixed header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-divider shrink-0">
            <DialogTitle className="font-display text-lg">
              Service Agreement
            </DialogTitle>
            <DialogDescription className="text-sm">
              {isSigned
                ? `Signed by "${agreement.signerName}" on ${formatDateTime(agreement.signedAt)}`
                : "Please read the agreement carefully before signing."}
            </DialogDescription>
          </DialogHeader>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-5 space-y-6">
              {/* Signed banner */}
              {isSigned && (
                <div className="flex items-center justify-between gap-3 rounded-xl bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
                  <div className="flex items-center gap-3 text-sm font-medium text-emerald-700">
                    <CheckCircle2 size={16} className="shrink-0" />
                    <span>
                      Signed by &ldquo;{agreement.signerName}&rdquo; on{" "}
                      {formatDateTime(agreement.signedAt)}
                    </span>
                  </div>
                  <a
                    href="/print/agreement/client"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 shrink-0 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    >
                      <Download size={13} />
                      Download PDF
                    </Button>
                  </a>
                </div>
              )}

              {/* Key details */}
              <div className="grid grid-cols-2 gap-3">
                {agreement.serviceTier && (
                  <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                    <p className="text-xs text-on-surface-muted uppercase tracking-wide font-semibold mb-0.5">
                      Service tier
                    </p>
                    <p className="text-sm font-medium text-on-surface">
                      {agreement.serviceTier}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                  <p className="text-xs text-on-surface-muted uppercase tracking-wide font-semibold mb-0.5">
                    Advisory fee
                  </p>
                  <p className="text-sm font-medium text-on-surface">
                    {formatPrice(agreement.feeAmount, agreement.currency)}
                  </p>
                </div>
                {agreement.timeline && (
                  <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                    <p className="text-xs text-on-surface-muted uppercase tracking-wide font-semibold mb-0.5">
                      Timeline
                    </p>
                    <p className="text-sm font-medium text-on-surface">
                      {agreement.timeline}
                    </p>
                  </div>
                )}
                <div className="rounded-lg border border-divider bg-surface-muted px-4 py-3">
                  <p className="text-xs text-on-surface-muted uppercase tracking-wide font-semibold mb-0.5">
                    Prepared on
                  </p>
                  <p className="text-sm font-medium text-on-surface">
                    {formatDate(agreement.createdAt)}
                  </p>
                </div>
              </div>

              {/* Scope */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-2">
                  Scope of service
                </p>
                <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                  {agreement.scopeDescription}
                </p>
              </div>

              {/* Deliverables */}
              {agreement.deliverables.length > 0 && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-2">
                    Deliverables
                  </p>
                  <ul className="space-y-1.5">
                    {agreement.deliverables.map((d, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-sm text-on-surface"
                      >
                        <span className="mt-0.5 text-on-surface-muted shrink-0">
                          →
                        </span>
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Terms */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-2">
                  Terms &amp; conditions
                </p>
                <div className="rounded-xl border border-divider bg-surface-muted p-4 max-h-52 overflow-y-auto">
                  <p className="text-sm text-on-surface whitespace-pre-wrap leading-relaxed">
                    {agreement.terms}
                  </p>
                </div>
              </div>

              {/* Signature display (if signed) */}
              {isSigned && agreement.signatureImageUrl && (
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted mb-2">
                    Signature on file
                  </p>
                  <div className="rounded-xl border border-divider bg-white p-4 inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={agreement.signatureImageUrl}
                      alt="Signature"
                      className="max-h-24 max-w-full object-contain"
                    />
                  </div>
                </div>
              )}

              {/* Sign form (only if pending) */}
              {!isSigned && (
                <>
                  <Separator />
                  <form onSubmit={handleSign} className="space-y-5">
                    <div className="flex items-center gap-2 mb-1">
                      <PenLine size={16} className="text-(--color-navy)" />
                      <h3 className="font-semibold text-on-surface text-sm">
                        Sign this agreement
                      </h3>
                    </div>

                    {/* Signature method — shadcn Tabs */}
                    <Tabs
                      value={signTab}
                      onValueChange={(v) => {
                        setSignTab(v as "draw" | "upload");
                        setFormError(null);
                      }}
                    >
                      <TabsList className="mb-4">
                        <TabsTrigger value="draw" className="gap-1.5">
                          <PenLine size={13} />
                          Draw
                        </TabsTrigger>
                        <TabsTrigger value="upload" className="gap-1.5">
                          <Upload size={13} />
                          Upload
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="draw">
                        <SignatureCanvas onChange={setDrawnDataUrl} />
                      </TabsContent>

                      <TabsContent value="upload">
                        <div className="space-y-2">
                          <Label htmlFor="sig-upload">
                            Signature image (JPG, PNG, WebP · max 2 MB)
                          </Label>
                          <Input
                            id="sig-upload"
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleUpload}
                            className="cursor-pointer"
                          />
                          {uploadPreview && (
                            <div className="mt-2 rounded-xl border border-divider bg-white p-3 inline-block">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={uploadPreview}
                                alt="Signature preview"
                                className="max-h-24 max-w-full object-contain"
                              />
                            </div>
                          )}
                        </div>
                      </TabsContent>
                    </Tabs>

                    {/* Full name */}
                    <div className="space-y-1.5">
                      <Label htmlFor="signer-name">
                        Type your full legal name to confirm
                      </Label>
                      <Input
                        id="signer-name"
                        value={signerName}
                        onChange={(e) => {
                          setSignerName(e.target.value);
                          setFormError(null);
                        }}
                        placeholder="Your full legal name"
                        required
                      />
                    </div>

                    {/* Agree checkbox */}
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id="agree"
                        checked={agreed}
                        onCheckedChange={(v) => {
                          setAgreed(!!v);
                          setFormError(null);
                        }}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor="agree"
                        className="text-sm text-on-surface leading-snug cursor-pointer"
                      >
                        I confirm that I have read and understood this service
                        agreement, and I agree to be bound by its terms and
                        conditions.
                      </label>
                    </div>

                    {formError && (
                      <p className="text-sm text-red-600">{formError}</p>
                    )}

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full gap-2 bg-(--color-navy) hover:bg-(--color-navy-dark) text-white"
                    >
                      {isPending ? (
                        <Loader2 size={15} className="animate-spin" />
                      ) : (
                        <FileSignature size={15} />
                      )}
                      {isPending ? "Signing…" : "Sign agreement"}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
