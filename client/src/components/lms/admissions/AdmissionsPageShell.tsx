import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";

type AdmissionsPageShellProps = {
  base: string;
  eyebrow: string;
  title: string;
  description: string;
  heroImage: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  aside?: ReactNode;
  children: ReactNode;
};

export default function AdmissionsPageShell({
  base,
  eyebrow,
  title,
  description,
  heroImage,
  backHref,
  backLabel,
  actions,
  aside,
  children,
}: AdmissionsPageShellProps) {
  return (
    <div className="min-h-screen bg-[#f6f2ea] text-[#1b1b1b]">
      <section className="relative overflow-hidden border-b border-black/10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${heroImage}')` }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(110deg,rgba(18,27,22,0.82)_0%,rgba(18,27,22,0.58)_42%,rgba(18,27,22,0.82)_100%)]" />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-24 md:pb-16 md:pt-28">
          {backHref ? (
            <Link
              href={backHref}
              className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-white/85 transition hover:text-white"
            >
              <ArrowLeft size={15} />
              {backLabel || "Back"}
            </Link>
          ) : null}

          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.28em] text-[#d6ff00]">{eyebrow}</p>
            <h1 className="mt-3 text-4xl font-bold text-[#fffdee] md:text-5xl">{title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/88 md:text-base">
              {description}
            </p>
            {actions ? <div className="mt-6 flex flex-wrap gap-3">{actions}</div> : null}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:py-12">
        <div className="min-w-0 space-y-6">{children}</div>
        {aside ? <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">{aside}</aside> : null}
      </section>

      <section className="border-t border-black/8 bg-white/70">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-sm text-[#5d655f] md:flex-row md:items-center md:justify-between">
          <p>Hamere Wengel Admissions</p>
          <div className="flex flex-wrap gap-4">
            <Link href={`${base}/lms/admissions`} className="transition hover:text-[#214f35]">
              Admissions Home
            </Link>
            <Link href={`${base}/lms/register`} className="transition hover:text-[#214f35]">
              Register
            </Link>
            <Link href={`${base}/contact`} className="transition hover:text-[#214f35]">
              Contact
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}