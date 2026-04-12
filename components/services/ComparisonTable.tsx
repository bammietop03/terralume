import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { ServiceTier } from "@/lib/services-data";

interface Props {
  comparison: ServiceTier["comparison"];
}

function Cell({ value }: { value: string | boolean }) {
  if (value === true) {
    return (
      <span className="flex items-center justify-center">
        <CheckCircle2 className="h-5 w-5 text-crimson" />
      </span>
    );
  }
  if (value === false) {
    return (
      <span className="flex items-center justify-center">
        <XCircle className="h-5 w-5 text-on-surface-muted opacity-40" />
      </span>
    );
  }
  return (
    <span className="flex items-center justify-center gap-1 text-[13px] font-medium text-on-surface-muted">
      <MinusCircle className="h-4 w-4 shrink-0 opacity-50" />
      {value}
    </span>
  );
}

export default function ComparisonTable({ comparison }: Props) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-divider">
      <table className="w-full min-w-140 border-collapse">
        <thead>
          <tr className="border-b border-divider bg-surface-card">
            <th className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
              Feature
            </th>
            <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
              DIY
            </th>
            <th className="px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-on-surface-muted">
              Traditional Agent
            </th>
            <th className="bg-navy-light px-4 py-4 text-center text-[11px] font-semibold uppercase tracking-[0.14em] text-navy">
              Terralume
            </th>
          </tr>
        </thead>
        <tbody>
          {comparison.map((row, i) => (
            <tr
              key={i}
              className="border-b border-divider last:border-0 even:bg-surface-alt"
            >
              <td className="px-6 py-4 text-[14px] text-on-surface">
                {row.feature}
              </td>
              <td className="px-4 py-4">
                <Cell value={row.diy} />
              </td>
              <td className="px-4 py-4">
                <Cell value={row.traditional} />
              </td>
              <td className="bg-navy-light/40 px-4 py-4">
                <Cell value={row.terralume} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
