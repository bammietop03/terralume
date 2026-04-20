"use client";

import { useState, useRef, useTransition } from "react";
import { Camera, Loader2, Check, AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { updateProfile } from "@/app/actions/users";
import { uploadAvatar } from "@/app/actions/storage";

interface ProfileData {
  id: string;
  fullName: string | null;
  preferredName: string | null;
  email: string;
  phone: string | null;
  nationality: string | null;
  location: string | null;
  photoUrl: string | null;
  role: string;
}

interface Props {
  user: ProfileData;
}

export default function ProfileForm({ user }: Props) {
  const initials = (user.fullName ?? user.email)
    .split(" ")
    .map((s) => s[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const roleLabel =
    user.role === "ADMIN"
      ? "Administrator"
      : user.role === "PM"
        ? "Project Manager"
        : "Client";

  const [avatarUrl, setAvatarUrl] = useState(user.photoUrl ?? "");
  const [avatarPending, startAvatarTransition] = useTransition();
  const [formPending, startFormTransition] = useTransition();
  const [avatarError, setAvatarError] = useState("");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">(
    "idle",
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    fullName: user.fullName ?? "",
    preferredName: user.preferredName ?? "",
    phone: user.phone ?? "",
    nationality: user.nationality ?? "",
    location: user.location ?? "",
  });

  function handleField(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSaveStatus("idle");
  }

  function handleAvatarClick() {
    fileRef.current?.click();
  }

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError("");

    // Optimistic preview
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl);

    const fd = new FormData();
    fd.append("file", file);

    startAvatarTransition(async () => {
      const result = await uploadAvatar(fd);
      if (result.ok) {
        setAvatarUrl(result.url);
      } else {
        setAvatarError(result.error);
        setAvatarUrl(user.photoUrl ?? ""); // revert
      }
    });
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveStatus("idle");
    startFormTransition(async () => {
      const result = await updateProfile(form);
      setSaveStatus(result.success ? "saved" : "error");
    });
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* ── Two-column grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Avatar + identity */}
        <div className="space-y-4">
          {/* Avatar card */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Profile photo
              </span>
            </div>
            <CardContent className="p-5 flex flex-col items-center gap-4">
              <div className="relative">
                <Avatar className="h-20 w-20 ring-2 ring-(--color-divider)">
                  {avatarUrl && (
                    <AvatarImage src={avatarUrl} alt={user.fullName ?? ""} />
                  )}
                  <AvatarFallback className="bg-linear-to-br from-crimson to-[#6b1220] text-white text-xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handleAvatarClick}
                  disabled={avatarPending}
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-on-surface text-surface shadow-md transition-opacity hover:opacity-80 disabled:opacity-50"
                >
                  {avatarPending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Camera size={12} />
                  )}
                </button>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleAvatarChange}
              />

              <div className="text-center">
                <p className="text-sm font-semibold text-on-surface">
                  {user.fullName ?? "—"}
                </p>
                <p className="text-xs text-on-surface-muted mt-0.5">
                  {roleLabel}
                </p>
              </div>

              {avatarError && (
                <p className="flex items-center gap-1.5 text-xs text-red-600">
                  <AlertCircle size={12} />
                  {avatarError}
                </p>
              )}

              <Button
                type="button"
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleAvatarClick}
                disabled={avatarPending}
              >
                {avatarPending ? "Uploading…" : "Change photo"}
              </Button>
              <p className="text-[11px] text-on-surface-muted text-center">
                JPEG, PNG or WebP · max 3 MB
              </p>
            </CardContent>
          </Card>

          {/* Account info (read-only) */}
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Account
              </span>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-muted/70 mb-0.5">
                  Email
                </p>
                <p className="text-sm text-on-surface">{user.email}</p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider text-on-surface-muted/70 mb-0.5">
                  Role
                </p>
                <p className="text-sm text-on-surface">{roleLabel}</p>
              </div>
              <p className="text-[11px] text-on-surface-muted pt-1">
                Email cannot be changed here. Contact support if needed.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* RIGHT: Editable fields */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-divider bg-surface-alt/60 px-4 py-2.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-on-surface-muted">
                Personal information
              </span>
            </div>
            <CardContent className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="fullName" className="text-xs font-medium">
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleField}
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="preferredName" className="text-xs font-medium">
                  Preferred name
                </Label>
                <Input
                  id="preferredName"
                  name="preferredName"
                  value={form.preferredName}
                  onChange={handleField}
                  placeholder="What we should call you"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-medium">
                  Phone number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleField}
                  placeholder="+234 800 000 0000"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nationality" className="text-xs font-medium">
                  Nationality
                </Label>
                <Input
                  id="nationality"
                  name="nationality"
                  value={form.nationality}
                  onChange={handleField}
                  placeholder="e.g. Nigerian"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="location" className="text-xs font-medium">
                  Based in
                </Label>
                <Input
                  id="location"
                  name="location"
                  value={form.location}
                  onChange={handleField}
                  placeholder="City, Country"
                />
              </div>
            </CardContent>
          </Card>

          {/* Save bar */}
          <div className="flex items-center justify-between gap-4 rounded-xl border border-divider bg-surface px-5 py-3.5">
            {saveStatus === "saved" && (
              <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                <Check size={14} />
                Changes saved
              </span>
            )}
            {saveStatus === "error" && (
              <span className="flex items-center gap-1.5 text-sm text-red-600">
                <AlertCircle size={14} />
                Failed to save
              </span>
            )}
            {saveStatus === "idle" && (
              <span className="text-xs text-on-surface-muted">
                Changes are not saved automatically.
              </span>
            )}
            <Button type="submit" disabled={formPending} className="shrink-0">
              {formPending ? (
                <>
                  <Loader2 size={14} className="animate-spin mr-2" />
                  Saving…
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}
