import { Field, RadioGroup, inputClass } from "./formFields";
import { TIMELINE_OPTIONS, DECISION_SPEED } from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step5Timeline({ data, set }: Props) {
  return (
    <div className="space-y-6">
      <Field label="Target completion / move-in date" required>
        <RadioGroup
          options={TIMELINE_OPTIONS}
          value={data.targetDate}
          onChange={(v) => set({ targetDate: v })}
        />
      </Field>

      <Field label="How quickly do you typically make decisions?" required>
        <RadioGroup
          options={DECISION_SPEED}
          value={data.decisionSpeed}
          onChange={(v) => set({ decisionSpeed: v })}
        />
      </Field>

      <Field
        label="Other decision-makers"
        hint="Who else (if anyone) needs to be part of the final decision?"
      >
        <input
          type="text"
          placeholder="e.g. Spouse based in London, family trust"
          value={data.otherDecisionMakers}
          onChange={(e) => set({ otherDecisionMakers: e.target.value })}
          className={inputClass}
        />
      </Field>
    </div>
  );
}
