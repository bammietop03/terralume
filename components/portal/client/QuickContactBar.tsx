import { MessageCircle, Mail, Phone } from "lucide-react";
import type { PMProfile } from "@/types";

interface Props {
  pm: PMProfile | null;
}

export default function QuickContactBar({ pm }: Props) {
  if (!pm) return null;

  const whatsappUrl = pm.phone
    ? `https://wa.me/${pm.phone.replace(/\D/g, "")}`
    : null;

  const mailtoUrl = `mailto:${pm.email}`;

  return (
    <div className="rounded-2xl bg-linear-to-br from-(--color-navy-dark) to-[#0d1940] p-5 shadow-[0_1px_3px_rgba(27,42,107,0.1),0_8px_24px_rgba(27,42,107,0.08)] ring-1 ring-white/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-white/50 mb-3">
        Contact your PM
      </p>

      <div className="flex items-center gap-3 mb-4">
        {pm.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={pm.photoUrl}
            alt={pm.fullName ?? "PM"}
            className="h-10 w-10 rounded-full object-cover border-2 border-white/20"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white text-sm font-semibold uppercase">
            {(pm.fullName ?? pm.email).charAt(0)}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white truncate">
            {pm.fullName ?? "Your PM"}
          </p>
          <p className="text-xs text-white/50 truncate">{pm.email}</p>
        </div>
      </div>

      <div className="flex gap-2">
        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-[#25d366] hover:bg-[#1eb557] text-white text-sm font-semibold py-2.5 transition-all duration-200 hover:shadow-lg hover:shadow-[#25d366]/20"
          >
            <MessageCircle size={16} />
            WhatsApp
          </a>
        )}
        <a
          href={mailtoUrl}
          className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold py-2.5 transition-all duration-200 border border-white/10"
        >
          <Mail size={16} />
          Email
        </a>
        {pm.phone && (
          <a
            href={`tel:${pm.phone}`}
            className="flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white py-2.5 px-3 transition-all duration-200 border border-white/10"
            aria-label="Call PM"
          >
            <Phone size={16} />
          </a>
        )}
      </div>
    </div>
  );
}
