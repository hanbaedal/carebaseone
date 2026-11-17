import { getTranslations } from "next-intl/server";
import { MemberHubSitemap } from "@/components/AccountHubGrid";
import { HomepageAdminHubSitemap } from "@/components/HomepageAdminHubSitemap";
import { OpsAdminHubSitemap } from "@/components/OpsAdminHubSitemap";
import { PublicSiteHubSitemap } from "@/components/PublicSiteHubSitemap";
import { memberHubGroups } from "@/lib/account-hub";
import { getApprovedMember } from "@/lib/member-session";
import { getSession } from "@/lib/session";
import { headerNav } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";
import {
  SITEMAP_PAGE,
  SITEMAP_PAGE_LEDE,
  SITEMAP_PAGE_TITLE,
  SITEMAP_SECTION_BODY,
  SITEMAP_SECTION_TITLE,
} from "@/lib/guest-layout";

export default async function SiteMapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const tNav = (await getTranslations("nav")) as (key: string) => string;
  const t = await getTranslations("sitemapPage");
  const staff = await getSession();
  const member = await getApprovedMember();

  return (
    <div className={SITEMAP_PAGE}>
      <header className="mb-0.5 sm:mb-1 xl:mb-2 2xl:mb-3">
        <h1 className={SITEMAP_PAGE_TITLE}>{t("title")}</h1>
        <p className={SITEMAP_PAGE_LEDE}>
          {staff || member ? t("ledeLoggedIn") : t("lede")}
        </p>
      </header>

      <section>
        <h2 className={SITEMAP_SECTION_TITLE}>{t("sectionSite")}</h2>
        <div className={SITEMAP_SECTION_BODY}>
          <PublicSiteHubSitemap items={headerNav} tNav={tNav} />
        </div>
      </section>

      {staff ? (
        <section>
          <h2 className={SITEMAP_SECTION_TITLE}>{t("sectionCms")}</h2>
          <div className={SITEMAP_SECTION_BODY}>
            <HomepageAdminHubSitemap />
          </div>
        </section>
      ) : null}

      {staff ? (
        <section>
          <h2 className={SITEMAP_SECTION_TITLE}>{t("sectionOps")}</h2>
          <div className={SITEMAP_SECTION_BODY}>
            <OpsAdminHubSitemap role={staff.role} />
          </div>
        </section>
      ) : null}

      {member && !staff ? (
        <section>
          <h2 className={SITEMAP_SECTION_TITLE}>{t("hubMember")}</h2>
          <div className={SITEMAP_SECTION_BODY}>
            <MemberHubSitemap groups={memberHubGroups} />
          </div>
        </section>
      ) : null}
    </div>
  );
}