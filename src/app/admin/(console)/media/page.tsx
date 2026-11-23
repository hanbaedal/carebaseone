import { redirect } from "next/navigation";
import {
  ARCHIVE_PUBLIC_CATEGORIES,
  MEDIA_FOCUS_LABELS,
  MEDIA_FOCUS_TO_CATEGORY,
  RESEARCH_PUBLIC_CATEGORIES,
  type MediaFocusKey,
} from "@/lib/homepage-admin-paths";
import { listMediaForAdmin } from "@/lib/media-lib";
import { saveMedia } from "@/app/admin/ops-actions";
import { AdminMediaItemsTable } from "@/components/admin/AdminMediaItemsTable";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";
import type { MediaCategory } from "@/lib/db";

export const dynamic = "force-dynamic";

const categories: MediaCategory[] = [
  "gallery",
  "patent",
  "certification",
  "research",
  "product",
  "other",
];

function siteVisibleCount(items: Awaited<ReturnType<typeof listMediaForAdmin>>) {
  return items.filter((item) => item.published && item.audience === "public").length;
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; focus?: string }>;
}) {
  const query = await searchParams;
  const focusKey = query.focus as MediaFocusKey | undefined;
  if (focusKey === "gallery") {
    const q = new URLSearchParams();
    if (query.status) q.set("status", query.status);
    if (query.message) q.set("message", query.message);
    const qs = q.toString();
    redirect(`/admin/gallery${qs ? `?${qs}` : ""}`);
  }
  const category = focusKey && focusKey in MEDIA_FOCUS_TO_CATEGORY ? MEDIA_FOCUS_TO_CATEGORY[focusKey] : undefined;
  const title = focusKey && focusKey in MEDIA_FOCUS_LABELS ? MEDIA_FOCUS_LABELS[focusKey] : "자료·증빙 전체";
  const isResearchFocus = focusKey === "research";
  const isArchiveFocus = focusKey === "archive";

  const researchItems = isResearchFocus || isArchiveFocus ? await listMediaForAdmin("research") : [];
  const productItems = isResearchFocus || isArchiveFocus ? await listMediaForAdmin("product") : [];
  const certificationItems = isArchiveFocus ? await listMediaForAdmin("certification") : [];
  const otherItems = isArchiveFocus ? await listMediaForAdmin("other") : [];
  const items = isResearchFocus || isArchiveFocus ? [] : await listMediaForAdmin(category);

  const statusMsg =
    query.status === "saved"
      ? "저장했습니다."
      : query.status === "error"
        ? (query.message ?? "저장 실패")
        : undefined;

  const description = isArchiveFocus
    ? "공개 자료실(/community/archive)과 동일하게 네 섹션입니다. 「노출=사이트」인 항목만 게스트에 표시됩니다. 특허·갤러리 이미지는 각 메뉴에서 관리합니다."
    : isResearchFocus
      ? "공개 연구·임상 페이지(/research)는 아래와 같이 두 섹션입니다. 「노출=사이트」인 항목만 게스트에 표시됩니다. 제품·성분 자료는 분류 product 로 등록하세요."
      : "이미지 갤러리는 /admin/gallery 에서 관리합니다. 특허·인증 등 문서는 이 화면에서 등록합니다.";

  const returnQuery = focusKey ? `?focus=${encodeURIComponent(focusKey)}` : "";
  const categoryHint = (c: MediaCategory) => {
    if (isArchiveFocus && ARCHIVE_PUBLIC_CATEGORIES.includes(c as (typeof ARCHIVE_PUBLIC_CATEGORIES)[number])) {
      return " — 사이트 자료실";
    }
    if (isResearchFocus && RESEARCH_PUBLIC_CATEGORIES.includes(c as (typeof RESEARCH_PUBLIC_CATEGORIES)[number])) {
      return " — 사이트 연구·임상";
    }
    return "";
  };

  return (
    <HomepageOpsShell
      title={title}
      description={description}
      status={statusMsg}
      statusError={query.status === "error"}
    >
      <OpsSection title="등록 / 메타 수정">
        <form action={saveMedia} className="grid gap-2 text-xs">
          {returnQuery ? <input type="hidden" name="returnQuery" value={returnQuery} /> : null}
          <input name="slug" placeholder="slug (영문·숫자·하이픈)" required className="border border-ink/15 px-2 py-1.5" />
          <select name="category" defaultValue={category ?? "patent"} className="border border-ink/15 px-2 py-1.5">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
                {categoryHint(c)}
              </option>
            ))}
          </select>
          <select name="audience" className="border border-ink/15 px-2 py-1.5">
            <option value="public">공개</option>
            <option value="member">회원</option>
          </select>
          <input name="titleKo" placeholder="제목 (한국어)" required className="border border-ink/15 px-2 py-1.5" />
          <textarea name="summaryKo" placeholder="간략 소개 (한국어)" rows={2} className="border border-ink/15 px-2 py-1.5" />
          <label className="grid gap-1">
            파일 (PDF 등, 신규·교체)
            <input
              name="file"
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,image/*"
            />
          </label>
          <label className="flex items-center gap-2">
            <input name="published" type="checkbox" value="on" defaultChecked /> 공개
          </label>
          <button type="submit" className="bg-forest px-3 py-2 text-cream">
            저장
          </button>
        </form>
      </OpsSection>

      {isArchiveFocus ? (
        <>
          <OpsSection
            title={`인증·규제 (certification) — ${certificationItems.length}건, 사이트 노출 ${siteVisibleCount(certificationItems)}건`}
          >
            <AdminMediaItemsTable items={certificationItems} returnQuery={returnQuery} />
          </OpsSection>
          <OpsSection
            title={`연구·임상 (research) — ${researchItems.length}건, 사이트 노출 ${siteVisibleCount(researchItems)}건`}
          >
            <AdminMediaItemsTable items={researchItems} returnQuery={returnQuery} />
          </OpsSection>
          <OpsSection
            title={`제품·성분 (product) — ${productItems.length}건, 사이트 노출 ${siteVisibleCount(productItems)}건`}
          >
            <AdminMediaItemsTable items={productItems} returnQuery={returnQuery} />
          </OpsSection>
          <OpsSection
            title={`기타 자료 (other) — ${otherItems.length}건, 사이트 노출 ${siteVisibleCount(otherItems)}건`}
          >
            <AdminMediaItemsTable items={otherItems} returnQuery={returnQuery} />
          </OpsSection>
        </>
      ) : isResearchFocus ? (
        <>
          <OpsSection
            title={`연구·논문 (research) — ${researchItems.length}건, 사이트 노출 ${siteVisibleCount(researchItems)}건`}
          >
            <AdminMediaItemsTable items={researchItems} returnQuery={returnQuery} />
          </OpsSection>
          <OpsSection
            title={`제품·성분 (product) — ${productItems.length}건, 사이트 노출 ${siteVisibleCount(productItems)}건`}
          >
            <AdminMediaItemsTable items={productItems} returnQuery={returnQuery} />
          </OpsSection>
        </>
      ) : (
        <OpsSection title={`목록 (${items.length}건, 사이트 노출 ${siteVisibleCount(items)}건)`}>
          <AdminMediaItemsTable items={items} returnQuery={returnQuery} />
        </OpsSection>
      )}
    </HomepageOpsShell>
  );
}