import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  /** Eyebrow label above the title */
  eyebrow: string;
  /** Main heading — accepts ReactNode so you can embed italic/crimson spans */
  title: ReactNode;
  /** Supporting description text */
  description: string;
  /** Breadcrumb trail — last item is always the current page (no href needed) */
  breadcrumbs: BreadcrumbItem[];
  /** Background image path — defaults to /images/hero.png */
  imageSrc?: string;
  imageAlt?: string;
  /** Minimum section height — defaults to "52vh" */
  minHeight?: string;
  /** Optional chips / badges rendered below the description */
  chips?: ReactNode;
  /** Optional CTA buttons rendered below the description (or chips) */
  actions?: ReactNode;
}

export default function PageHero({
  eyebrow,
  title,
  description,
  breadcrumbs,
  imageSrc = "/images/hero.png",
  imageAlt = "Lagos skyline",
  minHeight = "52vh",
  chips,
  actions,
}: PageHeroProps) {
  return (
    <section
      className="relative flex items-end overflow-hidden bg-navy-dark pb-16 pt-36"
      style={{ minHeight }}
    >
      <Image
        fill
        src={imageSrc}
        alt={imageAlt}
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-linear-to-b from-navy-dark/70 via-navy-dark/60 to-navy-dark/90" />
      <div className="absolute inset-0 bg-linear-to-r from-navy-dark/50 to-transparent" />

      <div className="container relative z-10 mx-auto max-w-5xl px-6">
        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-2 text-[13px] text-white/50">
          {breadcrumbs.map((crumb, i) => (
            <span key={i} className="flex items-center gap-2">
              {i > 0 && <span>/</span>}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="transition-colors hover:text-white/80"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-white/80">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>

        {/* Eyebrow */}
        <div className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-white">
          <span className="h-px w-8 bg-white" />
          {eyebrow}
        </div>

        {/* Title */}
        <h1 className="mb-4 font-display text-4xl font-bold text-white lg:text-5xl">
          {title}
        </h1>

        {/* Description */}
        <p className="max-w-xl text-[17px] leading-relaxed text-white/70">
          {description}
        </p>

        {/* Chips */}
        {chips && <div className="mt-8 flex flex-wrap gap-3">{chips}</div>}

        {/* Actions */}
        {actions && <div className="mt-8 flex flex-wrap gap-3">{actions}</div>}
      </div>
    </section>
  );
}
