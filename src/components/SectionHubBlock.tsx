import Image from "next/image";
import { Link } from "@/i18n/navigation";

export function SectionHubBlock({
  title,
  excerpt,
  href,
  image,
  detailsLabel,
  anchorId,
}: {
  title: string;
  excerpt: string;
  href: string;
  image: string;
  detailsLabel: string;
  anchorId?: string;
}) {
  return (
    <section
      id={anchorId}
      className="scroll-mt-36 border-b border-line py-10 last:border-b-0 md:py-14"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Link
          href={href}
          className="font-display text-2xl text-brand-ink transition hover:text-brand md:text-3xl"
        >
          {title}
        </Link>
        <Link href={href} className="text-[13px] font-medium text-brand hover:underline">
          {detailsLabel}
        </Link>
      </div>
      <Link
        href={href}
        className="mt-6 block overflow-hidden rounded-2xl border border-brand/10 bg-sky-50/80 transition hover:border-brand/25 hover:bg-sky-50"
      >
        <div className="grid items-center gap-6 p-5 md:grid-cols-[minmax(0,11rem)_1fr] md:p-7">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-[11rem] overflow-hidden rounded-xl bg-white shadow-sm">
            <Image src={image} alt="" fill className="object-cover" sizes="176px" />
          </div>
          <p className="whitespace-pre-line text-[15px] leading-8 text-brand-ink/80">{excerpt}</p>
        </div>
      </Link>
    </section>
  );
}