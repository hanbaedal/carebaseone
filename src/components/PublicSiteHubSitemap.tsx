import { SitemapHubTable } from "@/components/SitemapHubTable";
import type { HeaderNavItem } from "@/lib/site";
import { SITEMAP_CARD_ARTICLE, SITEMAP_CARD_SHELL, SITEMAP_NAV_GRID } from "@/lib/guest-layout";

export function PublicSiteHubSitemap({
  items,
  tNav,
}: {
  items: HeaderNavItem[];
  tNav: (key: string) => string;
}) {
  return (
    <article className={`${SITEMAP_CARD_SHELL} ${SITEMAP_CARD_ARTICLE} border-slate-200/90 bg-slate-50/80`}>
      <div className={`${SITEMAP_NAV_GRID} items-start`}>
        {items.map((item) => (
          <SitemapHubTable
            key={item.key}
            tableKey={item.key}
            title={tNav(item.key)}
            titleHref={item.href}
            links={(item.children ?? []).map((child) => ({
              href: child.href,
              label: tNav(child.key),
            }))}
            mode="public"
          />
        ))}
      </div>
    </article>
  );
}