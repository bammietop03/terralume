import { Field, RadioGroup, CheckGroup, inputClass } from "./formFields";
import {
  AREA_OPTIONS,
  PROPERTY_TYPES,
  BEDROOM_OPTIONS,
  MUST_HAVES,
} from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step4Property({ data, set }: Props) {
  return (
    <div className="space-y-6">
      <Field
        label="Location preferences"
        hint="Select all areas you'd consider. We'll narrow it further together."
      >
        <CheckGroup
          options={AREA_OPTIONS}
          values={data.locationPreferences}
          onChange={(v) => set({ locationPreferences: v })}
        />
      </Field>

      <Field label="Property type" required>
        <RadioGroup
          options={PROPERTY_TYPES}
          value={data.propertyType}
          onChange={(v) => set({ propertyType: v })}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Minimum bedrooms">
          <RadioGroup
            options={BEDROOM_OPTIONS}
            value={data.bedrooms}
            onChange={(v) => set({ bedrooms: v })}
          />
        </Field>
        <div className="space-y-5">
          <Field label="Min. size (sqm)" hint="Leave blank if flexible">
            <input
              type="number"
              min={0}
              placeholder="e.g. 120"
              value={data.sizeMin}
              onChange={(e) => set({ sizeMin: e.target.value })}
              className={inputClass}
            />
          </Field>
          <Field label="Max. size (sqm)" hint="Leave blank if flexible">
            <input
              type="number"
              min={0}
              placeholder="e.g. 300"
              value={data.sizeMax}
              onChange={(e) => set({ sizeMax: e.target.value })}
              className={inputClass}
            />
          </Field>
        </div>
      </div>

      <Field
        label="Must-haves"
        hint="Select features you'd refuse to compromise on."
      >
        <CheckGroup
          options={MUST_HAVES}
          values={data.mustHaves}
          onChange={(v) => set({ mustHaves: v })}
        />
      </Field>

      <Field
        label="Deal-breakers"
        hint="Anything that would make you immediately walk away from a property?"
      >
        <textarea
          rows={3}
          value={data.dealBreakers}
          onChange={(e) => set({ dealBreakers: e.target.value })}
          placeholder="e.g. No property within 500m of a market, must not be on family land…"
          className={[inputClass, "resize-none"].join(" ")}
        />
      </Field>
    </div>
  );
}
