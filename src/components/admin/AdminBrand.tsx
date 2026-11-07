import Image from "next/image";

export function AdminBrand({
  siteName,
  tagline,
}: {
  siteName: string;
  tagline?: string;
}) {
  return (
    <a
      href="/ko"
      className="inline-flex max-w-[min(100%,14rem)] shrink-0 items-center gap-2.5"
    >
      <Image
        src="/logo.png"
        alt={siteName}
        width={200}
        height={60}
        unoptimized
        className="h-8 w-auto max-w-[8.5rem] object-contain object-left md:h-9"
        priority
      />
      <span className="min-w-0 leading-tight">
        <span className="block truncate text-[13px] font-semibold tracking-wide text-brand-ink">
          {siteName}
        </span>
        {tagline ? (
          <span className="mt-0.5 hidden truncate text-[10px] text-ink/45 lg:block">
            {tagline}
          </span>
        ) : null}
      </span>
    </a>
  );
}
