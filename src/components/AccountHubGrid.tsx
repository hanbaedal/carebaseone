import type { HubGroup } from "@/lib/account-hub";
import { SITEMAP_CARD_ARTICLE, SITEMAP_CARD_SHELL, SITEMAP_NAV_GRID } from "@/lib/guest-layout";
import { SitemapHubTable } from "@/components/SitemapHubTable";

/** 회원 로그인 시 사이트맵 — 회원 메뉴 테이블 */
export function MemberHubSitemap({ groups }: { groups: HubGroup[] }) {
  if (groups.length === 0) return null;

  return (
    <article className={`${SITEMAP_CARD_SHELL} ${SITEMAP_CARD_ARTICLE} border-emerald-200/50 bg-emerald-50/40`}>
      <div className={`${SITEMAP_NAV_GRID} items-start`}>
        {groups.map((group) => {
          const links = group.links
            .filter((link) => !link.heading && link.href)
            .map((link) => ({ href: link.href, label: link.label }));
          const hubHref = links[0]?.href ?? "";
          return (
            <SitemapHubTable
              key={group.key}
              tableKey={group.key}
              title={group.title}
              titleHref={hubHref}
              links={links}
              mode="public"
            />
          );
        })}
      </div>
    </article>
  );
}