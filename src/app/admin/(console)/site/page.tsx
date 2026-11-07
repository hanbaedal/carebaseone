import { adminSiteHubExtra, adminSiteHubGroups } from "@/lib/admin-menu";

export const dynamic = "force-dynamic";

export default function AdminSiteHubPage() {
  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm font-semibold text-brand-ink">홈페이지 구성</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          공개 홈·사이트맵과 같은 묶음입니다. 카드에서 페이지 문구를 고치거나, 커뮤니티는 게시·문의
          메뉴로 관리합니다.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {adminSiteHubGroups.map((group) => (
          <article
            key={group.key}
            className={`flex flex-col rounded-xl border px-4 py-4 shadow-sm ${group.shell}`}
          >
            <h2 className="border-b border-ink/10 pb-2 text-sm font-semibold text-brand-ink">
              {group.title}
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {group.links.map((link) => (
                <li key={`${group.key}-${link.label}`}>
                  <a
                    href={link.href}
                    className="text-[12px] text-brand-ink/80 hover:text-brand hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <section className="rounded-xl border border-dashed border-ink/15 bg-white px-4 py-3">
        <h2 className="text-xs font-semibold text-ink/60">공통</h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {adminSiteHubExtra.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-[12px] text-brand hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
