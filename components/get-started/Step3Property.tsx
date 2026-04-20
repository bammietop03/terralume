"use client";

import {
  TARGET_AREAS,
  PROPERTY_TYPES_RESIDENTIAL,
  PROPERTY_TYPES_LEASE,
  BEDROOM_OPTIONS,
  MUST_HAVES_RESIDENTIAL,
  MUST_HAVES_LEASE,
} from "./constants";
import type { FormData } from "./types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
        selected
          ? "border-navy bg-navy-light text-navy"
          : "border-divider bg-surface text-on-surface-muted hover:border-divider-strong hover:text-on-surface",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function toggle(arr: string[], val: string): string[] {
  return arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];
}

export function Step3Property({ data, set, errors }: Props) {
  const isLease = data.transactionType === "lease";
  const propertyTypes = isLease
    ? PROPERTY_TYPES_LEASE
    : PROPERTY_TYPES_RESIDENTIAL;
  const mustHaves = isLease ? MUST_HAVES_LEASE : MUST_HAVES_RESIDENTIAL;

  return (
    <div className="space-y-5">
      {/* Target areas */}
      <div>
        <Label className="mb-1 block">
          Target areas in Lagos <span className="text-crimson">*</span>
        </Label>
        <p className="mb-2 text-[11px] text-on-surface-muted">
          Select all that work for you. We will search within these.
        </p>
        <div className="flex flex-wrap gap-2">
          {TARGET_AREAS.map((area) => (
            <Chip
              key={area}
              label={area}
              selected={data.targetAreas.includes(area)}
              onClick={() =>
                set({ targetAreas: toggle(data.targetAreas, area) })
              }
            />
          ))}
        </div>
        {errors.targetAreas && <p className={errCls}>{errors.targetAreas}</p>}
      </div>

      {/* Property type + bedrooms / floor area */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">
            Property type <span className="text-crimson">*</span>
          </Label>
          <Select
            value={data.propertyType}
            onValueChange={(val) => set({ propertyType: val })}
          >
            <SelectTrigger
              className={errors.propertyType ? "border-red-400" : ""}
            >
              <SelectValue placeholder="Select type..." />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.propertyType && (
            <p className={errCls}>{errors.propertyType}</p>
          )}
        </div>

        {!isLease ? (
          <div>
            <Label className="mb-1 block">Minimum bedrooms</Label>
            <Select
              value={data.bedrooms}
              onValueChange={(val) => set({ bedrooms: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {BEDROOM_OPTIONS.map((b) => (
                  <SelectItem key={b} value={b === "Any" ? "any" : b}>
                    {b === "Any"
                      ? "Any"
                      : `${b} bedroom${b === "1" ? "" : "s"}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <div>
            <Label className="mb-1 block">Floor area needed (sqm)</Label>
            <Input
              type="text"
              placeholder="e.g. 200"
              value={data.floorAreaSqm}
              onChange={(e) => set({ floorAreaSqm: e.target.value })}
            />
          </div>
        )}
      </div>

      {/* Must-haves */}
      <div>
        <Label className="mb-1 block">Must-have features</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {mustHaves.map((m) => (
            <Chip
              key={m}
              label={m}
              selected={data.mustHaves.includes(m)}
              onClick={() => set({ mustHaves: toggle(data.mustHaves, m) })}
            />
          ))}
        </div>
      </div>

      {/* Deal-breakers */}
      <div>
        <Label className="mb-1 block">Deal-breakers or hard exclusions</Label>
        <Textarea
          placeholder="e.g. no ground floor, no flooding-prone areas, must have C of O..."
          className="resize-y"
          value={data.dealBreakers}
          onChange={(e) => set({ dealBreakers: e.target.value })}
        />
        <p className="mt-1.5 text-[11px] text-on-surface-muted">
          Be as specific as possible. This protects you and saves time.
        </p>
      </div>
    </div>
  );
}
