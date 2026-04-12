import { Field, RadioGroup, inputClass } from "./formFields";
import { TRANSACTION_TYPES, PRIMARY_PURPOSES } from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step2YourGoal({ data, set }: Props) {
  return (
    <div className="space-y-6">
      <Field label="What type of transaction are you pursuing?" required>
        <RadioGroup
          options={TRANSACTION_TYPES}
          value={data.transactionType}
          onChange={(v) => set({ transactionType: v })}
        />
      </Field>

      <Field label="What is the primary purpose of this property?">
        <RadioGroup
          options={PRIMARY_PURPOSES}
          value={data.primaryPurpose}
          onChange={(v) => set({ primaryPurpose: v })}
        />
      </Field>

      {data.primaryPurpose === "Other" && (
        <Field label="Please describe your purpose">
          <textarea
            rows={3}
            value={data.purposeOther}
            onChange={(e) => set({ purposeOther: e.target.value })}
            placeholder="Tell us more about what you have in mind…"
            className={[inputClass, "resize-none"].join(" ")}
          />
        </Field>
      )}
    </div>
  );
}
