import { homepageAdminHubSections } from "@/lib/admin-menu";
import { SitemapHubTable } from "@/components/SitemapHubTable";
import { SITEMAP_CARD_ARTICLE, SITEMAP_CARD_SHELL, SITEMAP_NAV_GRID } from "@/lib/guest-layout";

const linkClass =
  "break-keep text-[11px] font-medium text-brand hover:underline sm:whitespace-nowrap sm:text-[12px] md:text-[13px] xl:text-sm 2xl:text-base";

export function HomepageAdminHubSitemap() {
  const { mainHome, hubs } = homepageAdminHubSections();

  return (
    <article className={`${SITEMAP_CARD_SHELL} ${SITEMAP_CARD_ARTICLE} border-sky-200/50 bg-sky-50/50`}>
      {mainHome ? (
        <p className="mb-1.5 border-b border-ink/10 pb-1 sm:mb-2 sm:pb-1.5 2xl:mb-3 2xl:pb-2">
          <a href={mainHome.href} className={linkClass}>
            {mainHome.label}
          </a>
        </p>
      ) : null}
      <div className={`${SITEMAP_NAV_GRID} items-start`}>
        {hubs.map((hub) => (
          <SitemapHubTable
            key={hub.key}
            tableKey={hub.key}
            title={hub.title}
            titleHref={hub.hubHref}
            links={hub.links}
            mode="admin"
          />
        ))}
      </div>
    </article>
  );
}