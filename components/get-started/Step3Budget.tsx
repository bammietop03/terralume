import { Field, RadioGroup, inputClass } from "./formFields";
import {
  BUDGET_RANGES,
  CURRENCIES,
  SOURCE_OF_FUNDS,
  MORTGAGE_STATUS,
} from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step3Budget({ data, set }: Props) {
  return (
    <div className="space-y-6">
      <Field label="Budget range" required>
        <RadioGroup
          options={BUDGET_RANGES}
          value={data.budgetRange}
          onChange={(v) => set({ budgetRange: v })}
        />
      </Field>

      {data.budgetRange ===
        "Equivalent in foreign currency (specify below)" && (
        <Field label="Specify amount and currency">
          <input
            type="text"
            placeholder="e.g. $200,000 USD"
            value={data.budgetNote}
            onChange={(e) => set({ budgetNote: e.target.value })}
            className={inputClass}
          />
        </Field>
      )}

      <Field label="Preferred transaction currency">
        <RadioGroup
          options={CURRENCIES}
          value={data.currency}
          onChange={(v) => set({ currency: v })}
        />
      </Field>

      <Field
        label="Primary source of funds"
        hint="Required for AML compliance. Treated in strict confidence."
      >
        <RadioGroup
          options={SOURCE_OF_FUNDS}
          value={data.sourceOfFunds}
          onChange={(v) => set({ sourceOfFunds: v })}
        />
      </Field>

      <Field label="Mortgage / financing status">
        <RadioGroup
          options={MORTGAGE_STATUS}
          value={data.mortgageStatus}
          onChange={(v) => set({ mortgageStatus: v })}
        />
      </Field>
    </div>
  );
}
