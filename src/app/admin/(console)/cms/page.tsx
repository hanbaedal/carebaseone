import { publicSiteCmsHub } from "@/lib/cms-site-map";

export const dynamic = "force-dynamic";

const cardShell: Record<string, string> = {
  home: "border-line bg-white",
  about: "border-slate-200/90 bg-slate-50",
  product: "border-emerald-200/80 bg-emerald-50",
  technology: "border-sky-200/80 bg-sky-50",
  community: "border-teal-200/80 bg-teal-50",
};

const labels: Record<string, string> = {
  home: "홈",
  meta: "로고·회사명",
  nav: "메뉴 라벨",
  footer: "하단",
  cta: "버튼 문구",
  about: "회사소개",
  solution: "솔루션",
  global: "글로벌",
  business: "사업협력",
  product: "제품",
  technology: "기술",
  patents: "지식재산권",
  certifications: "인증·규제",
  research: "연구·임상",
  community: "커뮤니티",
  notice: "공지사항",
  archive: "자료실",
  gallery: "갤러리",
  contact: "문의",
};

export default function AdminCmsPage() {
  const cards = publicSiteCmsHub();

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-sm font-semibold text-brand-ink">홈페이지 관리</h1>
        <p className="mt-1 text-[11px] leading-5 text-ink/50">
          공개 홈·헤더·사이트맵과 <strong>같은 카드·순서</strong>입니다. 각 항목에서 「편집」으로
          문구를 고치고, 「보기」로 공개 페이지를 확인합니다.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <article
            key={card.key}
            className={`flex flex-col rounded-xl border px-4 py-4 shadow-sm ${
              cardShell[card.key] ?? "border-ink/10 bg-white"
            }`}
          >
            <div className="flex items-start justify-between gap-2 border-b border-ink/10 pb-2">
              <h2 className="text-sm font-semibold text-brand-ink">
                {labels[card.labelKey] ?? card.labelKey}
              </h2>
              <a
                href={`/ko${card.publicHref === "/" ? "" : card.publicHref}`}
                className="shrink-0 text-[10px] text-brand hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                보기
              </a>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {card.links.map((link) => (
                <li
                  key={`${card.key}-${link.labelKey}-${link.editHref}`}
                  className="flex items-center justify-between gap-2 text-[12px]"
                >
                  <span className="text-brand-ink/80">{labels[link.labelKey] ?? link.labelKey}</span>
                  <span className="flex shrink-0 gap-2">
                    <a
                      href={`/ko${link.publicHref === "/" ? "" : link.publicHref}`}
                      className="text-ink/45 hover:text-brand hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      보기
                    </a>
                    <a href={link.editHref} className="font-medium text-brand hover:underline">
                      편집
                    </a>
                  </span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="text-[10px] text-ink/45">
        공개 사이트맵과 비교:{" "}
        <a
          href="/ko/sitemap"
          className="text-brand hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          /ko/sitemap
        </a>
      </p>
    </div>
  );
}