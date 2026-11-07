import { Link } from "@/i18n/navigation";
import type { HeaderNavItem } from "@/lib/site";

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

/** 헤더 `headerNav` + 관리 메뉴와 동일한 구조·라벨(nav) */
export function SitemapCardGrid({
  items,
  tNav,
  adminHref = "/admin",
}: {
  items: HeaderNavItem[];
  tNav: (key: string) => string;
  adminHref?: string;
}) {
  return (
    <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => {
        const pastel = theme(item.key);
        const links =
          item.children && item.children.length > 0
            ? [{ href: item.href, key: item.key }, ...item.children]
            : [{ href: item.href, key: item.key }];

        return (
          <article
            key={item.key}
            className={`flex flex-col rounded-2xl border px-5 py-6 shadow-sm transition-all hover:shadow-md ${pastel.shell}`}
          >
            <h2 className={`text-sm font-semibold tracking-wide text-brand-ink ${pastel.label}`}>
              <Link href={item.href} className="hover:text-brand">
                {tNav(item.key)}
              </Link>
            </h2>
            {item.children?.length ? (
              <ul className={`mt-4 flex flex-1 flex-col gap-2 border-t pt-4 ${pastel.divider}`}>
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-brand-ink/80 hover:text-brand"
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
      <article className="flex flex-col rounded-2xl border border-line bg-white px-5 py-6 shadow-sm">
        <h2 className="text-sm font-semibold tracking-wide text-brand-ink">
          <a href={adminHref} className="hover:text-brand">
            {tNav("admin")}
          </a>
        </h2>
      </article>
    </div>
  );
}
