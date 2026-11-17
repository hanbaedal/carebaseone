import { Link } from "@/i18n/navigation";
import type { HubGroup } from "@/lib/account-hub";
import { SITEMAP_CARD_GRID, SITEMAP_CARD_SHELL } from "@/lib/guest-layout";

const shells = [
  "border-slate-200/90 bg-slate-50",
  "border-sky-200/80 bg-sky-50",
  "border-emerald-200/80 bg-emerald-50",
  "border-violet-200/80 bg-violet-50",
  "border-amber-200/80 bg-amber-50",
  "border-rose-200/80 bg-rose-50",
  "border-teal-200/80 bg-teal-50",
];

function isAdminPath(href: string) {
  return href.startsWith("/admin");
}

function linkListClass(groupKey: string) {
  if (groupKey === "homepage") {
    return "mt-2 grid grid-cols-2 gap-x-3 gap-y-1 border-t border-ink/10 pt-2 sm:grid-cols-3 lg:grid-cols-4";
  }
  return "mt-2 flex flex-col gap-0.5 border-t border-ink/10 pt-2";
}

function cardClass(groupKey: string, shell: string) {
  if (groupKey === "homepage") {
    return `${SITEMAP_CARD_SHELL} ${shell} col-span-full`;
  }
  return `${SITEMAP_CARD_SHELL} ${shell}`;
}

const linkClass =
  "whitespace-nowrap text-[12px] leading-snug text-brand-ink/80 hover:text-brand sm:text-[13px]";

export function AccountHubGrid({ groups, title }: { groups: HubGroup[]; title?: string }) {
  if (groups.length === 0) return null;

  return (
    <section className="mt-0">
      {title ? (
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-brand-ink/70 sm:mb-3 sm:text-sm">
          {title}
        </h2>
      ) : null}
      <div className={SITEMAP_CARD_GRID}>
        {groups.map((group, index) => (
          <article
            key={group.key}
            className={cardClass(group.key, shells[index % shells.length])}
          >
            <h3 className="whitespace-nowrap text-[13px] font-semibold text-brand-ink sm:text-sm">
              {group.title}
            </h3>
            <ul className={linkListClass(group.key)}>
              {group.links.map((link) =>
                link.heading ? (
                  <li
                    key={`heading-${group.key}-${link.label}`}
                    className="col-span-full mt-1.5 list-none first:mt-0"
                  >
                    <p className="text-[10px] font-semibold tracking-wide text-ink/45">
                      {link.label}
                    </p>
                  </li>
                ) : (
                  <li key={`${group.key}-${link.href}-${link.label}`} className="min-w-0">
                    {isAdminPath(link.href) ? (
                      <a href={link.href} className={linkClass}>
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className={linkClass}>
                        {link.label}
                      </Link>
                    )}
                  </li>
                ),
              )}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
