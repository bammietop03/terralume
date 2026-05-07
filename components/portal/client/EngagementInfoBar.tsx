import { FolderOpen, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Props {
  documentCount: number;
  upcomingMeeting: {
    title: string | null;
    scheduledAt: Date;
    meetingLink: string | null;
  } | null;
}

export default function EngagementInfoBar({
  documentCount,
  upcomingMeeting,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      {/* Documents */}
      <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
        <div className="h-1 w-full bg-linear-to-r from-(--color-navy-light) to-navy/40" />
        <div className="px-5 py-4 flex items-center gap-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--color-navy-light) ring-1 ring-navy/8">
            <FolderOpen size={17} className="text-(--color-navy)" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted/80">
              Documents
            </p>
            <p className="text-sm font-bold text-on-surface mt-0.5">
              {documentCount === 0
                ? "No documents yet"
                : `${documentCount} file${documentCount === 1 ? "" : "s"} available`}
            </p>
          </div>
          <Link
            href="/client-portal/engagement"
            className="shrink-0 flex items-center gap-1 text-xs font-semibold text-(--color-navy) hover:underline"
          >
            View <ArrowRight size={12} />
          </Link>
        </div>
      </div>

      {/* Upcoming meeting */}
      {upcomingMeeting && (
        <div className="rounded-2xl border border-white/60 bg-white/80 backdrop-blur-sm shadow-[0_1px_3px_rgba(27,42,107,0.06),0_8px_24px_rgba(27,42,107,0.04)] overflow-hidden">
          <div className="h-1 w-full bg-linear-to-r from-(--color-crimson) to-(--color-crimson-light)" />
          <div className="px-5 py-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-muted/80 mb-1">
              Upcoming Meeting
            </p>
            <p className="text-sm font-bold text-on-surface">
              {upcomingMeeting.title ?? "Strategy Meeting"}
            </p>
            <p className="text-xs text-(--color-navy) font-medium mt-1">
              {new Date(upcomingMeeting.scheduledAt).toLocaleDateString(
                "en-GB",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  hour: "2-digit",
                  minute: "2-digit",
                },
              )}
            </p>
            {upcomingMeeting.meetingLink && (
              <a
                href={upcomingMeeting.meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-(--color-crimson) hover:underline"
              >
                Join meeting <ArrowRight size={12} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
