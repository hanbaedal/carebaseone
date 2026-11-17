import { opsAdminHubSections } from "@/lib/admin-menu";
import { SitemapHubTable } from "@/components/SitemapHubTable";
import type { Role } from "@/lib/session";
import { SITEMAP_CARD_ARTICLE, SITEMAP_CARD_SHELL, SITEMAP_NAV_GRID } from "@/lib/guest-layout";

export function OpsAdminHubSitemap({ role }: { role: Role }) {
  const hubs = opsAdminHubSections(role);
  if (hubs.length === 0) return null;

  return (
    <article className={`${SITEMAP_CARD_SHELL} ${SITEMAP_CARD_ARTICLE} border-violet-200/50 bg-violet-50/40`}>
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