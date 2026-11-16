import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/BrandLogo";
import { CompanyContactBlock } from "@/components/CompanyContactBlock";
import { companySnsLinksAll } from "@/lib/company-sns";
import { getCompanyProfile } from "@/lib/company-profile";

export async function SiteFooter() {
  const t = await getTranslations();
  const company = await getCompanyProfile();
  const sns = companySnsLinksAll(company);

  return (
    <footer className="mt-auto border-t border-line bg-white text-brand-ink">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <BrandLogo />
        <p className="mt-4 max-w-xl text-sm leading-7 text-brand/80">{t("footer.mission")}</p>

        <CompanyContactBlock className="mt-6" />

        {sns.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs text-brand">
            {sns.map((item) => (
              <li key={item.label}>
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-8 border-t border-line pt-5 text-xs leading-6 text-brand-ink/45">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-2">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
