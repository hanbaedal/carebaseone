import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/BrandLogo";
import { companySnsLinksAll } from "@/lib/company-sns";
import { getCompanyProfile } from "@/lib/company-profile";

export async function SiteFooter() {
  const t = await getTranslations();
  const company = await getCompanyProfile();
  const sns = companySnsLinksAll(company);

  return (
    <footer className="border-t border-line bg-white text-brand-ink">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <BrandLogo />
        <p className="mt-5 max-w-xl text-sm leading-7 text-brand-ink/65">
          {t("footer.mission")}
        </p>
        {company.companyName || company.businessRegistrationNumber ? (
          <p className="mt-4 text-xs leading-6 text-brand-ink/55">
            {company.companyName ? <span className="block font-medium">{company.companyName}</span> : null}
            {company.representativeName ? (
              <span className="block">대표 {company.representativeName}</span>
            ) : null}
            {company.businessRegistrationNumber ? (
              <span className="block">사업자등록번호 {company.businessRegistrationNumber}</span>
            ) : null}
            {company.companyPhone ? <span className="block">Tel {company.companyPhone}</span> : null}
          </p>
        ) : null}
        {sns.length > 0 ? (
          <ul className="mt-4 flex flex-wrap gap-3 text-xs">
            {sns.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-brand hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <div className="mt-10 border-t border-line pt-6 text-xs leading-6 text-brand-ink/45">
          <p>{t("footer.disclaimer")}</p>
          <p className="mt-3">{t("footer.rights")}</p>
        </div>
      </div>
    </footer>
  );
}
