import { getTranslations } from "next-intl/server";
import { AccountHubGrid } from "@/components/AccountHubGrid";
import { SitemapCardGrid } from "@/components/SitemapCardGrid";
import { memberHubGroups, staffHubGroups } from "@/lib/account-hub";
import { getApprovedMember } from "@/lib/member-session";
import { getSession } from "@/lib/session";
import { headerNav } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

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
    <div className="mx-auto max-w-7xl px-6 py-16">
      {staff ? (
        <AccountHubGrid groups={staffHubGroups(staff.role)} title={t("hubStaff")} />
      ) : null}
      {member ? (
        <AccountHubGrid groups={memberHubGroups} title={t("hubMember")} />
      ) : null}
      {(staff || member) ? (
        <h2 className="mt-12 text-sm font-semibold tracking-wide text-brand-ink/70">{t("publicSection")}</h2>
      ) : null}
      <SitemapCardGrid items={headerNav} tNav={tNav} />
      <p className="mt-10 text-sm text-brand-ink/45">
        <a
          href="/sitemap.xml"
          className="text-brand-ink/55 underline-offset-2 hover:text-brand hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("xml")}
        </a>
      </p>
    </div>
  );
}
