"use client";

import { CURRENCIES, SOURCE_OF_FUNDS, MORTGAGE_STATUS } from "./constants";
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

export function Step4Budget({ data, set, errors }: Props) {
  const isBuy = data.transactionType === "buy";
  const isLease = data.transactionType === "lease";

  return (
    <div className="space-y-5">
      {/* Confidentiality notice */}
      <div className="flex gap-3 rounded-xl border border-navy/20 bg-navy-light px-4 py-3">
        <div className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-navy" />
        <p className="text-xs leading-relaxed text-navy">
          Your budget is confidential. We use it to find the best options within
          your range — not to judge or rush you into anything above it.
        </p>
      </div>

      {/* Currency */}
      <div>
        <Label className="mb-1 block">Currency</Label>
        <div className="flex gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => set({ currency: c })}
              className={[
                "rounded-full border px-4 py-1.5 text-xs font-semibold transition-all",
                data.currency === c
                  ? "border-navy bg-navy-light text-navy"
                  : "border-divider bg-surface text-on-surface-muted hover:border-divider-strong hover:text-on-surface",
              ].join(" ")}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Budget range */}
      <div>
        <Label className="mb-1 block">
          {isLease ? "Annual rent / lease budget" : "Total budget"}{" "}
          <span className="text-crimson">*</span>
        </Label>
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="text"
              className={errors.budgetMin ? "border-red-400" : ""}
              placeholder="Minimum"
              value={data.budgetMin}
              onChange={(e) => set({ budgetMin: e.target.value })}
            />
            {errors.budgetMin && <p className={errCls}>{errors.budgetMin}</p>}
          </div>
          <span className="shrink-0 text-sm text-on-surface-muted">—</span>
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Maximum"
              value={data.budgetMax}
              onChange={(e) => set({ budgetMax: e.target.value })}
            />
          </div>
        </div>
        <p className="mt-1.5 text-[11px] text-on-surface-muted">
          {isLease
            ? "Enter annual figures. Service charge budget can be noted in the deal-breakers field."
            : "For purchase: include all fees (legal, stamp duty, agency) — typically 5–8% above the property price."}
        </p>
      </div>

      {/* Source of funds */}
      <div>
        <Label className="mb-1 block">
          Primary source of funds <span className="text-crimson">*</span>
        </Label>
        <Select
          value={data.sourceOfFunds}
          onValueChange={(val) => set({ sourceOfFunds: val })}
        >
          <SelectTrigger
            className={errors.sourceOfFunds ? "border-red-400" : ""}
          >
            <SelectValue placeholder="Select source..." />
          </SelectTrigger>
          <SelectContent>
            {SOURCE_OF_FUNDS.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.sourceOfFunds && (
          <p className={errCls}>{errors.sourceOfFunds}</p>
        )}
      </div>

      {/* Mortgage status — buy only */}
      {isBuy && (
        <div>
          <Label className="mb-1 block">Mortgage / financing status</Label>
          <Select
            value={data.mortgageStatus}
            onValueChange={(val) => set({ mortgageStatus: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              {MORTGAGE_STATUS.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Rental warning */}
      {data.transactionType === "rent" && (
        <div className="flex gap-3 rounded-xl border border-crimson/30 bg-crimson/5 px-4 py-3">
          <div className="mt-0.5 h-full w-1 shrink-0 rounded-full bg-crimson" />
          <p className="text-xs leading-relaxed text-crimson">
            Lagos standard: most landlords require 1–2 years rent upfront. We
            negotiate payment structures on your behalf and will always tell you
            what the market actually demands.
          </p>
        </div>
      )}
    </div>
  );
}
