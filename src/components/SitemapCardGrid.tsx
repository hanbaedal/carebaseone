import { Link } from "@/i18n/navigation";
import type { HeaderNavItem } from "@/lib/site";
import { SITEMAP_CARD_GRID, SITEMAP_CARD_SHELL } from "@/lib/guest-layout";

const cardPastels: Record<string, { shell: string; divider: string; label: string }> = {
  about: {
    shell: "border-slate-200/90 bg-slate-50 hover:border-slate-300",
    divider: "border-slate-200/70",
    label: "text-slate-700",
  },
  technology: {
    shell: "border-sky-200/80 bg-sky-50 hover:border-sky-300/90",
    divider: "border-sky-200/60",
    label: "text-sky-700",
  },
  product: {
    shell: "border-emerald-200/80 bg-emerald-50 hover:border-emerald-300/90",
    divider: "border-emerald-200/60",
    label: "text-emerald-800",
  },
  solution: {
    shell: "border-violet-200/80 bg-violet-50 hover:border-violet-300/90",
    divider: "border-violet-200/60",
    label: "text-violet-800",
  },
  global: {
    shell: "border-amber-200/80 bg-amber-50 hover:border-amber-300/90",
    divider: "border-amber-200/60",
    label: "text-amber-900",
  },
  business: {
    shell: "border-rose-200/80 bg-rose-50 hover:border-rose-300/90",
    divider: "border-rose-200/60",
    label: "text-rose-800",
  },
  community: {
    shell: "border-teal-200/80 bg-teal-50 hover:border-teal-300/90",
    divider: "border-teal-200/60",
    label: "text-teal-800",
  },
};

function theme(key: string) {
  return (
    cardPastels[key] ?? {
      shell: "border-line bg-white hover:border-brand/20",
      divider: "border-line",
      label: "text-brand-ink/60",
    }
  );
}

/** 헤더 `headerNav`와 동일 — 노트북에서 한 줄·한 화면에 가깝게 */
export function SitemapCardGrid({
  items,
  tNav,
}: {
  items: HeaderNavItem[];
  tNav: (key: string) => string;
}) {
  return (
    <div className={SITEMAP_CARD_GRID}>
      {items.map((item) => {
        const pastel = theme(item.key);
        const children = item.children ?? [];

        return (
          <article
            key={item.key}
            className={`${SITEMAP_CARD_SHELL} ${pastel.shell}`}
          >
            <h2
              className={`whitespace-nowrap text-[13px] font-semibold tracking-wide sm:text-sm ${pastel.label}`}
            >
              <Link href={item.href} className="text-brand-ink hover:text-brand">
                {tNav(item.key)}
              </Link>
            </h2>
            {children.length > 0 ? (
              <ul
                className={`mt-2 flex flex-1 flex-col gap-0.5 border-t pt-2 ${pastel.divider}`}
              >
                {children.map((link) => (
                  <li key={link.href} className="min-w-0">
                    <Link
                      href={link.href}
                      className="whitespace-nowrap text-[12px] leading-snug text-brand-ink/80 hover:text-brand sm:text-[13px]"
                    >
                      {tNav(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
