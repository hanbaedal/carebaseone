import { Link } from "@/i18n/navigation";
import type { NavGroup } from "@/lib/site";

const pillarKeys = new Set(["technology", "product", "solution", "global", "business"]);

/** 카드별 파스텔 배경·테두리 */
const cardPastels: Record<string, { shell: string; divider: string; label: string }> = {
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
  member: {
    shell: "border-indigo-200/80 bg-indigo-50 hover:border-indigo-300/90",
    divider: "border-indigo-200/60",
    label: "text-indigo-800",
  },
};

function cardTheme(key: string) {
  return (
    cardPastels[key] ?? {
      shell: "border-line bg-white hover:border-brand/20",
      divider: "border-line",
      label: "text-brand-ink/60",
    }
  );
}

export function SitemapCardGrid({
  groups,
  tNav,
  tHome,
}: {
  groups: NavGroup[];
  tNav: (key: string) => string;
  tHome: (key: string) => string;
}) {
  const pillars = groups.filter((g) => pillarKeys.has(g.groupKey));
  const rest = groups.filter((g) => !pillarKeys.has(g.groupKey));

  return (
    <div className="mt-12 space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {pillars.map((group) => {
          const theme = cardTheme(group.groupKey);
          return (
          <article
            key={group.groupKey}
            className={`flex flex-col rounded-2xl border px-5 py-6 shadow-sm transition-all hover:shadow-md ${theme.shell}`}
          >
            <p className={`text-[11px] font-semibold tracking-[0.14em] ${theme.label}`}>
              {tHome(`${group.groupKey}.num`)}
            </p>
            <h2 className="mt-1 min-h-[2.75rem] text-[16px] font-semibold leading-snug text-brand-ink">
              {tHome(`${group.groupKey}.ko`)}
            </h2>
            <ul className={`mt-4 flex flex-1 flex-col gap-2 border-t pt-4 ${theme.divider}`}>
              {group.children.map((child) => (
                <li key={child.key}>
                  <Link
                    href={child.href}
                    className="text-[13px] text-brand-ink/80 hover:text-brand"
                  >
                    {tNav(child.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {rest.map((group) => {
          const theme = cardTheme(group.groupKey);
          return (
          <article
            key={group.groupKey}
            className={`flex flex-col rounded-2xl border px-6 py-7 shadow-sm transition-all hover:shadow-md ${theme.shell}`}
          >
            <h2 className={`text-sm font-semibold tracking-wide ${theme.label}`}>
              {tNav(`groups.${group.groupKey}`)}
            </h2>
            <ul className={`mt-4 flex flex-col gap-2 border-t pt-4 ${theme.divider}`}>
              {group.children.map((child) => (
                <li key={child.key}>
                  <Link
                    href={child.href}
                    className="text-[14px] text-brand-ink hover:text-brand"
                  >
                    {tNav(child.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </article>
        );
        })}
      </div>
    </div>
  );
}
