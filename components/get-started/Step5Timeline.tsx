"use client";

import {
  DECISION_SPEED,
  DECISION_MAKERS,
  PRIOR_EXPERIENCE,
  RISK_PROFILE,
  REFERRAL_SOURCES,
} from "./constants";
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
}

interface RadioItemProps {
  value: string;
  label: string;
  sub?: string;
  selected: boolean;
  onSelect: () => void;
}

function RadioItem({ value, label, sub, selected, onSelect }: RadioItemProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={[
        "flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-all",
        selected
          ? "border-navy bg-navy-light"
          : "border-divider bg-surface hover:border-divider-strong hover:bg-surface-alt",
      ].join(" ")}
    >
      {/* radio dot */}
      <span
        className={[
          "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[1.5px] transition-all",
          selected ? "border-navy bg-navy" : "border-divider-strong bg-surface",
        ].join(" ")}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
      <span>
        <span
          className={[
            "block text-xs font-semibold",
            selected ? "text-navy" : "text-on-surface",
          ].join(" ")}
        >
          {label}
        </span>
        {sub && (
          <span
            className={[
              "block text-[11px] mt-0.5",
              selected ? "text-navy/70" : "text-on-surface-muted",
            ].join(" ")}
          >
            {sub}
          </span>
        )}
      </span>
    </button>
  );
}

export function Step5Timeline({ data, set }: Props) {
  const isBuy = data.transactionType === "buy";

  return (
    <div className="space-y-5">
      {/* Target date + Decision speed */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label className="mb-1 block">Target possession / move-in date</Label>
          <Input
            type="text"
            placeholder="e.g. July 2026, ASAP, flexible"
            value={data.targetDate}
            onChange={(e) => set({ targetDate: e.target.value })}
          />
        </div>
        <div>
          <Label className="mb-1 block">
            Decision speed once right property found
          </Label>
          <Select
            value={data.decisionSpeed}
            onValueChange={(val) => set({ decisionSpeed: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              {DECISION_SPEED.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Decision makers */}
      <div>
        <Label className="mb-1 block">
          Who else is involved in the final decision?
        </Label>
        <div className="mt-1 space-y-2">
          {DECISION_MAKERS.map((dm) => (
            <RadioItem
              key={dm.value}
              value={dm.value}
              label={dm.label}
              sub={dm.sub}
              selected={data.decisionMakers === dm.value}
              onSelect={() => set({ decisionMakers: dm.value })}
            />
          ))}
        </div>
      </div>

      {/* Prior experience */}
      <div>
        <Label className="mb-1 block">Prior Lagos property experience</Label>
        <Select
          value={data.priorExperience}
          onValueChange={(val) => set({ priorExperience: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {PRIOR_EXPERIENCE.map((p) => (
              <SelectItem key={p.value} value={p.value}>
                {p.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="mt-1.5 text-[11px] text-on-surface-muted">
          If you encountered problems before, your advisor will make a note — it
          helps us protect you.
        </p>
      </div>

      {/* Risk profile — buy only */}
      {isBuy && (
        <div>
          <Label className="mb-1 block">Investment risk profile</Label>
          <div className="mt-1 space-y-2">
            {RISK_PROFILE.map((r) => (
              <RadioItem
                key={r.value}
                value={r.value}
                label={r.label}
                sub={r.sub}
                selected={data.riskProfile === r.value}
                onSelect={() => set({ riskProfile: r.value })}
              />
            ))}
          </div>
        </div>
      )}

      {/* Referral source */}
      <div>
        <Label className="mb-1 block">How did you hear about Terralume?</Label>
        <Select
          value={data.referralSource}
          onValueChange={(val) => set({ referralSource: val })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select..." />
          </SelectTrigger>
          <SelectContent>
            {REFERRAL_SOURCES.map((r) => (
              <SelectItem key={r.value} value={r.value}>
                {r.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
