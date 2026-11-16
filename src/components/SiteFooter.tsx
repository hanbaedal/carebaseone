import { getTranslations } from "next-intl/server";
import { BrandLogo } from "@/components/BrandLogo";
import { companySnsLinksAll } from "@/lib/company-sns";
import { getCompanyProfile } from "@/lib/company-profile";

const FOOTER_COMPANY = {
  name: "주식회사 케어베이스",
  address: "서울시 구로구 중앙로 77, 2층 564호",
  phone: "010-5926-8267",
  email: "carebasekorea@gmail.com",
} as const;

function IconBuilding({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M4 20h16M6 20V8l6-4 6 4v12M10 20v-4h4v4M9 11h1.5M13.5 11H15M9 14h1.5M13.5 14H15"
      />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10Z"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        d="M7.5 4.5h2.2l1.1 3.3-1.6 1.1a12 12 0 0 0 5.9 5.9l1.1-1.6 3.3 1.1v2.2a1.5 1.5 0 0 1-1.5 1.5A14.5 14.5 0 0 1 6 6a1.5 1.5 0 0 1 1.5-1.5Z"
      />
    </svg>
  );
}

function IconMail({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="3.5" y="5.5" width="17" height="13" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      <path stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </svg>
  );
}

const iconClass = "mt-0.5 h-4 w-4 shrink-0 text-brand";

export async function SiteFooter() {
  const t = await getTranslations();
  const company = await getCompanyProfile();
  const sns = companySnsLinksAll(company);

  return (
    <footer className="mt-auto border-t border-line bg-white text-brand-ink">
      <div className="mx-auto max-w-7xl px-6 py-10 sm:py-12">
        <BrandLogo />
        <p className="mt-4 max-w-xl text-sm leading-7 text-brand/80">{t("footer.mission")}</p>

        <ul className="mt-6 grid gap-3 text-sm text-brand-ink/70">
          <li className="flex items-start gap-2.5">
            <IconBuilding className={iconClass} />
            <span className="font-medium text-brand-ink">{FOOTER_COMPANY.name}</span>
          </li>
          <li className="flex items-start gap-2.5">
            <IconPin className={iconClass} />
            <span>{FOOTER_COMPANY.address}</span>
          </li>
          <li className="flex flex-wrap items-start gap-x-6 gap-y-2">
            <span className="inline-flex items-start gap-2.5">
              <IconPhone className={iconClass} />
              <a href={`tel:${FOOTER_COMPANY.phone}`} className="hover:text-brand">
                {FOOTER_COMPANY.phone}
              </a>
            </span>
            <span className="inline-flex items-start gap-2.5">
              <IconMail className={iconClass} />
              <a href={`mailto:${FOOTER_COMPANY.email}`} className="hover:text-brand">
                {FOOTER_COMPANY.email}
              </a>
            </span>
          </li>
        </ul>

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
