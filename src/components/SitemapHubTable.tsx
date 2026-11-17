import { Link } from "@/i18n/navigation";

const linkClass =
  "break-keep text-brand-ink/85 hover:text-brand hover:underline sm:whitespace-nowrap";

type LinkItem = { href: string; label: string };

export function SitemapHubTable({
  tableKey,
  title,
  titleHref,
  links,
  mode = "public",
}: {
  tableKey: string;
  title: string;
  titleHref?: string;
  links: LinkItem[];
  mode?: "public" | "admin";
}) {
  const caption =
    titleHref && titleHref.length > 0 ? (
      mode === "public" ? (
        <Link href={titleHref} className="text-brand hover:text-brand-deep hover:underline">
          {title}
        </Link>
      ) : (
        <a href={titleHref} className="text-brand hover:text-brand-deep hover:underline">
          {title}
        </a>
      )
    ) : (
      <span className="text-brand-ink">{title}</span>
    );

  return (
    <div className="min-w-0 overflow-x-auto rounded-md border border-line/80 bg-white/90 sm:rounded-lg 2xl:rounded-xl">
      <table className="w-full min-w-[calc(6ch+2rem)] border-collapse text-left">
        <caption className="border-b border-line/60 bg-brand/5 px-2 py-1 text-left text-[10px] font-semibold tracking-wide sm:px-2.5 sm:py-1.5 sm:text-[11px] md:px-3 md:text-[12px] xl:px-3.5 xl:py-2 xl:text-[13px] 2xl:px-4 2xl:py-2.5 2xl:text-sm">
          {caption}
        </caption>
        <tbody>
          {links.map((link) => (
            <tr key={`${tableKey}-${link.href}-${link.label}`} className="border-b border-line/40 last:border-0">
              <td className="px-2 py-0.5 sm:px-2.5 sm:py-1 md:px-3 md:py-1.5 xl:px-3.5 xl:py-2 2xl:px-4 2xl:py-2.5">
                {mode === "public" ? (
                  <Link
                    href={link.href}
                    className={`text-[10px] leading-snug sm:text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-sm ${linkClass}`}
                  >
                    {link.label}
                  </Link>
                ) : (
                  <a
                    href={link.href}
                    className={`text-[10px] leading-snug sm:text-[11px] md:text-[12px] xl:text-[13px] 2xl:text-sm ${linkClass}`}
                  >
                    {link.label}
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}