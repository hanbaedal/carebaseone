import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/BrandLogo";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-line bg-white text-brand-ink">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <BrandLogo />
        <p className="mt-5 max-w-xl text-sm leading-7 text-brand-ink/65">
          {t("footer.mission")}
        </p>
        <div className="mt-10 border-t border-line pt-6 text-xs leading-6 text-brand-ink/45">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-3">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
