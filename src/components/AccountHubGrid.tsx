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

export function AccountHubGrid({ groups, title }: { groups: HubGroup[]; title: string }) {
  if (groups.length === 0) return null;

  return (
    <section className="mt-0">
      <h2 className="text-sm font-semibold tracking-wide text-brand-ink/70">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, index) => (
          <article
            key={group.key}
            className={`flex flex-col rounded-2xl border px-5 py-5 shadow-sm ${shells[index % shells.length]}`}
          >
            <h3 className="text-sm font-semibold text-brand-ink">{group.title}</h3>
            <ul className="mt-3 flex flex-col gap-2 border-t border-ink/10 pt-3">
              {group.links.map((link) => (
                <li key={`${group.key}-${link.href}`}>
                  {isAdminPath(link.href) ? (
                    <a href={link.href} className="text-[13px] text-brand-ink/80 hover:text-brand">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-[13px] text-brand-ink/80 hover:text-brand">
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