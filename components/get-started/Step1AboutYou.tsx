import {
  Field,
  RadioGroup,
  SelectChevron,
  inputClass,
  selectClass,
} from "./formFields";
import { COUNTRY_CODES, LOCATIONS, NATIONALITIES } from "./constants";
import type { FormData } from "./types";

interface Props {
  data: FormData;
  set: (patch: Partial<FormData>) => void;
}

export function Step1AboutYou({ data, set }: Props) {
  return (
    <div className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" required>
          <input
            type="text"
            autoComplete="name"
            placeholder="As on ID document"
            value={data.fullName}
            onChange={(e) => set({ fullName: e.target.value })}
            className={inputClass}
            required
          />
        </Field>
        <Field label="Preferred name" hint="What shall we call you?">
          <input
            type="text"
            placeholder="e.g. Bayo"
            value={data.preferredName}
            onChange={(e) => set({ preferredName: e.target.value })}
            className={inputClass}
          />
        </Field>
      </div>

      <Field label="Email address" required>
        <input
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={data.email}
          onChange={(e) => set({ email: e.target.value })}
          className={inputClass}
          required
        />
      </Field>

      <Field label="Phone number">
        <div className="flex gap-2">
          <div className="relative shrink-0">
            <select
              value={data.countryCode}
              onChange={(e) => set({ countryCode: e.target.value })}
              aria-label="Country code"
              className={[selectClass, "w-auto pr-8"].join(" ")}
            >
              {COUNTRY_CODES.map(({ code, flag, label }) => (
                <option key={`${code}-${label}`} value={code}>
                  {flag} {code}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
          <input
            type="tel"
            autoComplete="tel-national"
            placeholder="080 0000 0000"
            value={data.phone}
            onChange={(e) => set({ phone: e.target.value })}
            className={[inputClass, "flex-1"].join(" ")}
          />
        </div>
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Current location" required>
          <div className="relative">
            <select
              value={data.location}
              onChange={(e) => set({ location: e.target.value })}
              className={selectClass}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {LOCATIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </Field>
        <Field label="Nationality" required>
          <div className="relative">
            <select
              value={data.nationality}
              onChange={(e) => set({ nationality: e.target.value })}
              className={selectClass}
              required
            >
              <option value="" disabled>
                Select…
              </option>
              {NATIONALITIES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
            <SelectChevron />
          </div>
        </Field>
      </div>
    </div>
  );
}
