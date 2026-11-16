import { publicSiteCmsHub, type CmsHubCard } from "@/lib/cms-site-map";

export const dynamic = "force-dynamic";

const cardShell: Record<string, string> = {
  common: "border-slate-200 bg-white",
  about: "border-slate-200/90 bg-slate-50",
  product: "border-emerald-200/80 bg-emerald-50",
  technology: "border-sky-200/80 bg-sky-50",
  community: "border-teal-200/80 bg-teal-50",
};

function CmsCard({ card }: { card: CmsHubCard }) {
  return (
    <article
      className={`flex flex-col rounded-xl border px-4 py-4 shadow-sm ${
        cardShell[card.key] ?? "border-ink/10 bg-white"
      }`}
    >
      <div className="flex items-center justify-between gap-2 border-b border-ink/10 pb-2">
        <h2 className="text-sm font-semibold text-brand-ink">{card.label}</h2>
        <a
          href={card.publicHref}
          className="shrink-0 text-[10px] text-brand hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          공개 보기
        </a>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {card.links.map((link) => (
          <li
            key={`${card.key}-${link.key}-${link.editHref}`}
            className="flex items-center justify-between gap-2 rounded-md px-1 py-1 text-[12px] hover:bg-white/70"
          >
            <span className="min-w-0 truncate text-brand-ink/80">{link.label}</span>
            <span className="flex shrink-0 items-center gap-2">
              <a
                href={link.publicHref}
                className="text-ink/40 hover:text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                보기
              </a>
              <a
                href={link.editHref}
                className="rounded bg-forest px-2 py-0.5 text-[11px] font-medium text-cream hover:opacity-90"
              >
                수정
              </a>
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

export default function AdminCmsPage() {
  const { common, pages } = publicSiteCmsHub();

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h1 className="text-base font-semibold text-brand-ink">홈페이지 관리</h1>
          <p className="mt-1 text-[11px] leading-5 text-ink/50">
            공개 헤더·사이트맵과 같은 메뉴입니다. 「수정」으로 편집하고 「보기」로 공개 페이지를
            확인합니다.
          </p>
        </div>
        <a
          href="/ko"
          className="text-[11px] text-brand hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          공개 홈 열기 →
        </a>
      </div>

      <section className="grid gap-2">
        <h2 className="text-[11px] font-semibold tracking-wide text-ink/45">공통</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <CmsCard card={common} />
        </div>
      </section>

      <section className="grid gap-2">
        <h2 className="text-[11px] font-semibold tracking-wide text-ink/45">페이지 메뉴 (공개와 동일)</h2>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {pages.map((card) => (
            <CmsCard key={card.key} card={card} />
          ))}
        </div>
      </section>
    </div>
  );
}
