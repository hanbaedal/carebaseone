import Image from "next/image";
import { formatKoreaDate } from "@/lib/korea-time";
import {
  MEDIA_FOCUS_LABELS,
  MEDIA_FOCUS_TO_CATEGORY,
  type MediaFocusKey,
} from "@/lib/homepage-admin-paths";
import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { listMediaForAdmin } from "@/lib/media-lib";
import { removeMedia, saveMedia, toggleMedia } from "@/app/admin/ops-actions";
import { HomepageOpsShell, OpsSection } from "@/components/admin/HomepageOpsShell";
import type { MediaCategory, MediaDoc } from "@/lib/db";

export const dynamic = "force-dynamic";

const categories: MediaCategory[] = [
  "gallery",
  "patent",
  "certification",
  "research",
  "product",
  "other",
];

function mediaPreviewSrc(item: MediaDoc) {
  const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
  if (item.filePath?.startsWith("/images/")) return item.filePath;
  if (publicHint.startsWith("/images/")) return publicHint;
  if (item.mime?.startsWith("image/")) return item.filePath;
  return null;
}

export default async function AdminMediaPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; message?: string; focus?: string }>;
}) {
  const query = await searchParams;
  const focusKey = query.focus as MediaFocusKey | undefined;
  const category = focusKey && focusKey in MEDIA_FOCUS_TO_CATEGORY ? MEDIA_FOCUS_TO_CATEGORY[focusKey] : undefined;
  const title = focusKey && focusKey in MEDIA_FOCUS_LABELS ? MEDIA_FOCUS_LABELS[focusKey] : "자료·증빙 전체";
  const items = await listMediaForAdmin(category);
  const isGalleryFocus = category === "gallery";
  const statusMsg =
    query.status === "saved"
      ? "저장했습니다."
      : query.status === "error"
        ? (query.message ?? "저장 실패")
        : undefined;

  return (
    <HomepageOpsShell
      title={title}
      description={
        isGalleryFocus
          ? "CMS·홈페이지 배경용 미디어입니다. 공개 커뮤니티 갤러리(/ko/community/gallery)와는 별개입니다."
          : "홈페이지 배경 이미지는 「배경 이미지 갤러리」 메뉴(분류 gallery)에서 관리합니다."
      }
      status={statusMsg}
      statusError={query.status === "error"}
    >
      <OpsSection title="등록 / 메타 수정">
        <form action={saveMedia} className="grid gap-2 text-xs">
          <input name="slug" placeholder="slug (영문·숫자·하이픈)" required className="border border-ink/15 px-2 py-1.5" />
          <select name="category" defaultValue={category ?? "gallery"} className="border border-ink/15 px-2 py-1.5">
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
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
            {isGalleryFocus ? "이미지 파일 (신규·교체)" : "파일 (PDF 등, 신규·교체)"}
            <input
              name="file"
              type="file"
              accept={isGalleryFocus ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.mp4,image/*"}
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

      <OpsSection title={`목록 (${items.length}건)`}>
        {isGalleryFocus ? (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => {
              const src = mediaPreviewSrc(item);
              return (
                <li key={item.slug} className="overflow-hidden rounded-lg border border-ink/10 bg-cream/30">
                  <div className="relative aspect-[4/3] bg-ink/5">
                    {src ? (
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="220px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-ink/40">
                        미리보기 없음
                      </div>
                    )}
                    {!item.published ? (
                      <span className="absolute left-1.5 top-1.5 rounded bg-ink/70 px-1.5 py-0.5 text-[9px] text-cream">
                        비공개
                      </span>
                    ) : null}
                  </div>
                  <div className="space-y-1.5 p-2.5">
                    <p className="truncate text-[11px] font-medium text-brand-ink" title={item.title.ko}>
                      {item.title.ko}
                    </p>
                    <p className="truncate text-[10px] text-ink/45" title={item.slug}>
                      {item.slug}
                    </p>
                    <p className="text-[10px] text-ink/40">{formatKoreaDate(item.createdAt)}</p>
                    <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10px]">
                      {src ? (
                        <a href={src} className="text-forest hover:underline" target="_blank" rel="noreferrer">
                          보기
                        </a>
                      ) : null}
                      <form action={toggleMedia} className="inline">
                        <input type="hidden" name="slug" value={item.slug} />
                        <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                        <button type="submit" className="text-ink/60 hover:text-ink">
                          {item.published ? "비공개" : "공개"}
                        </button>
                      </form>
                      <form action={removeMedia} className="inline">
                        <input type="hidden" name="slug" value={item.slug} />
                        <button type="submit" className="text-red-800 hover:underline">
                          삭제
                        </button>
                      </form>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="overflow-x-auto text-xs">
            <table className="w-full min-w-[48rem]">
              <thead>
                <tr className="text-ink/50">
                  <th className="px-2 py-2 text-left font-normal">No</th>
                  <th className="px-2 py-2 text-left font-normal">slug</th>
                  <th className="px-2 py-2 text-left font-normal">분류</th>
                  <th className="px-2 py-2 text-left font-normal">제목</th>
                  <th className="px-2 py-2 text-left font-normal">날짜</th>
                  <th className="px-2 py-2 text-left font-normal">파일</th>
                  <th className="px-2 py-2 text-left font-normal">수정·삭제</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, i) => (
                  <tr key={item.slug} className="border-t border-ink/10">
                    <td className="px-2 py-2">{items.length - i}</td>
                    <td className="px-2 py-2">{item.slug}</td>
                    <td className="px-2 py-2">{item.category}</td>
                    <td className="max-w-[14rem] truncate px-2 py-2">{item.title.ko}</td>
                    <td className="whitespace-nowrap px-2 py-2">{formatKoreaDate(item.createdAt)}</td>
                    <td className="px-2 py-2">
                      {(() => {
                        const publicHint = galleryPublicPathFromDoc(item.tags, item.fileName);
                        const href =
                          item.storage === "gridfs"
                            ? item.filePath
                            : publicHint.startsWith("/images/")
                              ? publicHint
                              : item.filePath;
                        const label =
                          item.storage === "gridfs"
                            ? "열기"
                            : publicHint.startsWith("/images/")
                              ? "보기"
                              : "없음";
                        return (
                          <a href={href} className="text-forest" target="_blank" rel="noreferrer">
                            {label}
                          </a>
                        );
                      })()}
                    </td>
                    <td className="space-x-2 px-2 py-2">
                      <form action={toggleMedia} className="inline">
                        <input type="hidden" name="slug" value={item.slug} />
                        <input type="hidden" name="published" value={item.published ? "false" : "true"} />
                        <button type="submit">{item.published ? "비공개" : "공개"}</button>
                      </form>
                      <form action={removeMedia} className="inline">
                        <input type="hidden" name="slug" value={item.slug} />
                        <button type="submit" className="text-red-800">
                          삭제
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </OpsSection>
    </HomepageOpsShell>
  );
}
