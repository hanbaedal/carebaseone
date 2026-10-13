import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { navItems } from "@/lib/site";

export async function SiteFooter() {
  const t = await getTranslations();
  const locale = await getLocale();

  return (
    <footer className="bg-navy text-cream">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <p className="font-display text-3xl leading-snug md:text-4xl">
          {t("footer.closeQuote1")}
          <br />
          {t("footer.closeQuote2")}
          <br />
          {t("footer.closeQuote3")}
        </p>
        <p className="mt-8 max-w-xl text-sm leading-7 text-cream/70">
          {t("footer.mission")}
        </p>
        <div
          className={`mt-12 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-cream/55 ${
            locale === "en" ? "tracking-[0.16em]" : "tracking-normal"
          }`}
        >
          {navItems.map((item) => (
            <Link key={item.key} href={item.href} className="hover:text-cream">
              {t(`nav.${item.key}`)}
            </Link>
          ))}
        </div>
        <div className="mt-12 border-t border-cream/15 pt-6 text-xs leading-6 text-cream/45">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-3">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
