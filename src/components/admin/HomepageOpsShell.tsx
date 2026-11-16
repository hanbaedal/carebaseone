import type { ReactNode } from "react";

export function HomepageOpsShell({
  title,
  description,
  status,
  statusError,
  children,
}: {
  title: string;
  description?: string;
  status?: string;
  statusError?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-5 sm:px-6">
      <p className="text-[10px] text-ink/45">
        <a href="/admin/cms" className="text-brand hover:underline">
          홈페이지 CMS
        </a>
        <span className="text-ink/35"> / </span>
        <span className="text-ink/55">{title}</span>
      </p>
      <h1 className="mt-1 text-sm font-semibold text-brand-ink">{title}</h1>
      {description ? <p className="mt-1 text-[11px] leading-5 text-ink/50">{description}</p> : null}
      {status ? (
        <p className={`mt-2 text-xs ${statusError ? "text-red-800" : "text-forest"}`}>{status}</p>
      ) : null}
      <div className="mt-5 grid gap-5">{children}</div>
    </div>
  );
}

export function OpsSection({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-line bg-white p-4 shadow-sm">
      <h2 className="text-[12px] font-semibold text-brand-ink">{title}</h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}