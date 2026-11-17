import { homepageAdminHubSections } from "@/lib/admin-menu";
import { SITEMAP_CARD_SHELL, SITEMAP_NAV_GRID } from "@/lib/guest-layout";

const linkClass =
  "whitespace-nowrap text-brand hover:underline hover:text-brand-deep";

export function HomepageAdminHubSitemap({ title = "홈페이지관리" }: { title?: string }) {
  const { mainHome, hubs } = homepageAdminHubSections();

  return (
    <article className={`${SITEMAP_CARD_SHELL} border-slate-200/90 bg-slate-50`}>
      <h3 className="text-[13px] font-semibold text-brand-ink sm:text-sm">{title}</h3>
      {mainHome ? (
        <p className="mt-2 border-b border-ink/10 pb-2">
          <a href={mainHome.href} className={`text-[12px] font-medium sm:text-[13px] ${linkClass}`}>
            {mainHome.label}
          </a>
        </p>
      ) : null}
      <div className={`${SITEMAP_NAV_GRID} mt-3 items-start`}>
        {hubs.map((hub) => (
          <HubMenuTable key={hub.key} hub={hub} />
        ))}
      </div>
    </article>
  );
}

function HubMenuTable({
  hub,
}: {
  hub: {
    key: string;
    title: string;
    hubHref: string;
    links: { href: string; label: string }[];
  };
}) {
  return (
    <div className="min-w-0 overflow-x-auto rounded-lg border border-line/80 bg-white/90">
      <table className="w-full min-w-[calc(6ch+2rem)] border-collapse text-left">
        <caption className="border-b border-line/60 bg-brand/5 px-3 py-2 text-left text-[12px] font-semibold tracking-wide">
          {hub.hubHref ? (
            <a href={hub.hubHref} className="text-brand hover:text-brand-deep hover:underline">
              {hub.title}
            </a>
          ) : (
            <span className="text-brand-ink">{hub.title}</span>
          )}
        </caption>
        <tbody>
          {hub.links.map((link) => (
            <tr key={`${hub.key}-${link.href}-${link.label}`} className="border-b border-line/40 last:border-0">
              <td className="px-3 py-1.5">
                <a href={link.href} className={`text-[12px] text-brand-ink/85 sm:text-[13px] ${linkClass}`}>
                  {link.label}
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}