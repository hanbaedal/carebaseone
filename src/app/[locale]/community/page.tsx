import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { communityNavItems } from "@/lib/site";
import { resolveLocale } from "@/lib/locale";

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  resolveLocale((await params).locale);
  const t = await getTranslations("community");

  return (
    <div className="mx-auto max-w-5xl px-6 py-16">
      <h1 className="font-display text-4xl text-brand-ink">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-brand-ink/70">{t("lede")}</p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {communityNavItems
          .filter((item) => item.href !== "/community")
          .map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-2xl border border-line bg-white px-6 py-8 hover:border-brand hover:bg-brand/5"
            >
              <p className="text-lg font-semibold text-brand-ink">
                {t(`sections.${item.key}`)}
              </p>
            </Link>
          ))}
        <Link
          href="/contact"
          className="rounded-2xl border border-line bg-white px-6 py-8 hover:border-brand hover:bg-brand/5"
        >
          <p className="text-lg font-semibold text-brand-ink">{t("sections.contact")}</p>
        </Link>
      </div>
    </div>
  );
}
