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
  const staff = await getSession();
  const member = await getApprovedMember();

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:py-10">
      <SitemapCardGrid items={headerNav} tNav={tNav} />
      {staff ? (
        <div className="mt-5 sm:mt-6">
          <AccountHubGrid groups={staffHubGroups(staff.role)} />
        </div>
      ) : null}
      {member ? (
        <div className="mt-5 sm:mt-6">
          <AccountHubGrid groups={memberHubGroups} />
        </div>
      ) : null}
    </div>
  );
}
