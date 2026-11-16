import { Link } from "@/i18n/navigation";
import type { HubGroup } from "@/lib/account-hub";

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

export function AccountHubGrid({ groups, title }: { groups: HubGroup[]; title?: string }) {
  if (groups.length === 0) return null;

  return (
    <section className="mt-0">
      {title ? (
        <h2 className="mb-2 text-xs font-semibold tracking-wide text-brand-ink/70 sm:mb-3 sm:text-sm">
          {title}
        </h2>
      ) : null}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {groups.map((group, index) => (
          <article
            key={group.key}
            className={`flex flex-col rounded-xl border px-3 py-3 shadow-sm sm:px-3.5 sm:py-3 ${shells[index % shells.length]}`}
          >
            <h3 className="text-[13px] font-semibold text-brand-ink sm:text-sm">{group.title}</h3>
            <ul className="mt-2 flex flex-col gap-1 border-t border-ink/10 pt-2">
              {group.links.map((link) => (
                <li key={`${group.key}-${link.href}`}>
                  {isAdminPath(link.href) ? (
                    <a
                      href={link.href}
                      className="text-[12px] leading-snug text-brand-ink/80 hover:text-brand sm:text-[13px]"
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="text-[12px] leading-snug text-brand-ink/80 hover:text-brand sm:text-[13px]"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
