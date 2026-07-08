import type { LucideIcon } from "lucide-react";

interface EmptySectionProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function EmptySection({
  icon: Icon,
  title,
  description,
}: EmptySectionProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-divider bg-surface-alt/30 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-navy/10 text-navy">
        <Icon size={22} />
      </div>
      <p className="text-sm font-semibold text-on-surface">{title}</p>
      <p className="mt-1 max-w-sm text-sm text-on-surface-muted">
        {description}
      </p>
    </div>
  );
}
