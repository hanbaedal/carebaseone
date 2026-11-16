import { cmsExtraLinks, cmsSectionLinks } from "@/lib/admin-menu";

export const dynamic = "force-dynamic";

export default function AdminCmsPage() {
  const groups = cmsSectionLinks();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm font-semibold text-brand-ink">메인·페이지 구성</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          공개 홈 문구와 메뉴를 한곳에서 편집합니다. 저장 시 영·중 자동 번역이 적용됩니다.
        </p>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {groups.map((group) => (
          <section
            key={group.title}
            className="rounded-xl border border-ink/10 bg-white px-4 py-3 shadow-sm"
          >
            <h2 className="border-b border-ink/10 pb-2 text-xs font-semibold text-ink/70">
              {group.title}
            </h2>
            <ul className="mt-2 flex flex-col gap-1.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="text-[12px] text-brand hover:underline">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <section className="rounded-xl border border-dashed border-ink/15 bg-slate-50/50 px-4 py-3">
        <h2 className="text-xs font-semibold text-ink/60">게시·기타</h2>
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
          {cmsExtraLinks.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="text-[12px] text-brand hover:underline">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
      <p className="text-[10px] text-ink/45">
        공개 사이트 보기:{" "}
        <a href="/ko" className="text-brand hover:underline" target="_blank" rel="noopener noreferrer">
          /ko
        </a>
      </p>
    </div>
  );
}