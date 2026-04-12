import { Field, RadioGroup, inputClass } from "./formFields";
import {
  EXPERIENCE_LEVELS,
  RISK_TOLERANCE,
  REFERRAL_SOURCES,
  REFERRAL_NO_DETAIL,
} from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step6Background({ data, set }: Props) {
  const showReferralDetail =
    data.referralSource !== "" && !REFERRAL_NO_DETAIL.has(data.referralSource);

  return (
    <div className="space-y-6">
      <Field label="Prior property purchase experience">
        <RadioGroup
          options={EXPERIENCE_LEVELS}
          value={data.priorExperience}
          onChange={(v) => set({ priorExperience: v })}
        />
      </Field>

      <Field label="Risk tolerance">
        <RadioGroup
          options={RISK_TOLERANCE}
          value={data.riskTolerance}
          onChange={(v) => set({ riskTolerance: v })}
        />
      </Field>

      <Field label="How did you hear about Terralume?">
        <RadioGroup
          options={REFERRAL_SOURCES}
          value={data.referralSource}
          onChange={(v) => set({ referralSource: v })}
        />
      </Field>

      {showReferralDetail && (
        <Field
          label="Any more detail?"
          hint="E.g. name of person who referred you, event name, etc."
        >
          <input
            type="text"
            placeholder="Optional"
            value={data.referralDetail}
            onChange={(e) => set({ referralDetail: e.target.value })}
            className={inputClass}
          />
        </Field>
      )}
    </div>
  );
}
