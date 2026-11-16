export const FOOTER_COMPANY = {
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

/** 회사명·주소·전화·이메일 — 페이지 풋터 */
export function CompanyContactBlock({
  className = "",
  onBrandBg = false,
}: {
  className?: string;
  /** 풋터 배경색 위 — 부모 color 상속 */
  onBrandBg?: boolean;
}) {
  const icon = onBrandBg ? "mt-0.5 h-4 w-4 shrink-0 opacity-90" : iconClass;
  const body = onBrandBg ? "text-sm opacity-90" : "text-sm text-brand-ink/70";
  const name = onBrandBg ? "font-medium" : "font-medium text-brand-ink";
  const link = onBrandBg ? "hover:opacity-100" : "hover:text-brand";

  return (
    <ul className={`grid gap-3 ${body} ${className}`}>
      <li className="flex items-start gap-2.5">
        <IconBuilding className={icon} />
        <span className={name}>{FOOTER_COMPANY.name}</span>
      </li>
      <li className="flex items-start gap-2.5">
        <IconPin className={icon} />
        <span>{FOOTER_COMPANY.address}</span>
      </li>
      <li className="flex flex-wrap items-start gap-x-6 gap-y-2">
        <span className="inline-flex items-start gap-2.5">
          <IconPhone className={icon} />
          <a href={`tel:${FOOTER_COMPANY.phone}`} className={link}>
            {FOOTER_COMPANY.phone}
          </a>
        </span>
        <span className="inline-flex items-start gap-2.5">
          <IconMail className={icon} />
          <a href={`mailto:${FOOTER_COMPANY.email}`} className={link}>
            {FOOTER_COMPANY.email}
          </a>
        </span>
      </li>
    </ul>
  );
}
