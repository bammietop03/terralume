"use client";

import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
  errors?: Partial<Record<keyof FormData, string>>;
}

export function StepEnergyNeeds({ data, set, errors }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy mb-2">
          Tell us about your energy needs
        </h2>
        <p className="text-gray-600">
          Help us understand your energy requirements so we can provide the
          right solution.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <Label
            htmlFor="energy-needs"
            className="text-sm font-semibold text-navy"
          >
            Describe your energy needs <span className="text-red-500">*</span>
          </Label>
          <p className="text-xs text-gray-600 mt-1 mb-2">
            For example: "I need a solar system for my 3-bedroom house in Lagos.
            Current monthly electricity bill is ₦50,000. Need 24/7 power for
            lights, AC, fridge, TV, and home office equipment."
          </p>
          <Textarea
            id="energy-needs"
            value={data.energyNeedsDescription || ""}
            onChange={(e) => set({ energyNeedsDescription: e.target.value })}
            placeholder="Describe your property, current power usage, budget range, and what you want to power..."
            rows={8}
            className="resize-none"
          />
          {errors?.energyNeedsDescription && (
            <p className="text-xs text-red-600 mt-1">
              {errors.energyNeedsDescription}
            </p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-navy mb-2">
            What to include:
          </p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li className="flex items-start">
              <span className="text-navy mr-2">•</span>
              Property type and size (e.g., 3-bedroom duplex, 5,000 sq ft
              office)
            </li>
            <li className="flex items-start">
              <span className="text-navy mr-2">•</span>
              Current monthly electricity cost
            </li>
            <li className="flex items-start">
              <span className="text-navy mr-2">•</span>
              Equipment you need to power (AC, fridge, freezer, lights, etc.)
            </li>
            <li className="flex items-start">
              <span className="text-navy mr-2">•</span>
              Any specific requirements (backup power, 24/7 coverage, etc.)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
