"use client";

import { LOCATION_OPTIONS } from "./constants";
import type { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
  errors: Partial<Record<keyof FormData, string>>;
}

const errCls = "mt-1 text-xs text-red-600";

export function Step2AboutYou({ data, set, errors }: Props) {
  return (
    <div className="space-y-4">
      {/* Name row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">
            Full legal name <span className="text-crimson">*</span>
          </Label>
          <Input
            type="text"
            className={errors.fullName ? "border-red-400" : ""}
            placeholder="As on your ID"
            value={data.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
          />
          {errors.fullName && <p className={errCls}>{errors.fullName}</p>}
        </div>
        <div>
          <Label className="mb-1 block">Preferred name</Label>
          <Input
            type="text"
            placeholder="What should we call you?"
            value={data.preferredName}
            onChange={(e) => set({ preferredName: e.target.value })}
          />
        </div>
      </div>

      {/* Email */}
      <div>
        <Label className="mb-1 block">
          Email address <span className="text-crimson">*</span>
        </Label>
        <Input
          type="email"
          className={errors.email ? "border-red-400" : ""}
          placeholder="you@email.com"
          value={data.email}
          onChange={(e) => set({ email: e.target.value })}
        />
        {errors.email && <p className={errCls}>{errors.email}</p>}
      </div>

      {/* Phone + Nationality row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">
            Phone / WhatsApp <span className="text-crimson">*</span>
          </Label>
          <Input
            type="tel"
            className={errors.phone ? "border-red-400" : ""}
            placeholder="+234 or with country code"
            value={data.phone}
            onChange={(e) => set({ phone: e.target.value })}
          />
          {errors.phone && <p className={errCls}>{errors.phone}</p>}
        </div>
        <div>
          <Label className="mb-1 block">Nationality</Label>
          <Input
            type="text"
            placeholder="e.g. Nigerian"
            value={data.nationality}
            onChange={(e) => set({ nationality: e.target.value })}
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <Label className="mb-1 block">
          Where are you currently based? <span className="text-crimson">*</span>
        </Label>
        <Select
          value={data.location}
          onValueChange={(val) => set({ location: val })}
        >
          <SelectTrigger className={errors.location ? "border-red-400" : ""}>
            <SelectValue placeholder="Select location..." />
          </SelectTrigger>
          <SelectContent>
            {LOCATION_OPTIONS.map((o) => (
              <SelectItem key={o.value} value={o.value}>
                {o.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.location && <p className={errCls}>{errors.location}</p>}
        <p className="mt-1.5 text-[11px] text-on-surface-muted">
          Diaspora clients: we offer dedicated remote advisory packages.
        </p>
      </div>
    </div>
  );
}
