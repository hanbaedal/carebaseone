import Image from "next/image";
import { getLocale } from "next-intl/server";
import { listPublicGalleryMedia, publicGalleryImageSrc } from "@/lib/media-lib";
import { getApprovedMember } from "@/lib/member-session";

export async function PublicMediaGalleryGrid() {
  const member = await getApprovedMember();
  const items = await listPublicGalleryMedia(Boolean(member));
  const locale = await getLocale();

  if (items.length === 0) {
    return (
      <p className="mt-10 text-sm text-brand-ink/60">
        전시 중인 이미지가 없습니다. 관리자는 이미지 갤러리에서 「공개 갤러리」를 체크해 주세요.
      </p>
    );
  }

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2">
      {items.map((item) => {
        const src = publicGalleryImageSrc(item);
        const title = item.title[locale as "ko" | "en" | "zh"] || item.title.ko;
        const caption = item.summary[locale as "ko" | "en" | "zh"] || item.summary.ko;
        return (
          <figure key={item.slug} className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="relative aspect-[4/3]">
              <Image src={src} alt="" fill className="object-cover" sizes="(min-width: 640px) 50vw, 100vw" unoptimized />
            </div>
            <figcaption className="px-4 py-3">
              <p className="text-sm font-semibold text-brand-ink">{title}</p>
              {caption ? <p className="mt-1 text-xs text-brand-ink/60">{caption}</p> : null}
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}