import { getLocale, getTranslations } from "next-intl/server";
import { PublicGalleryShowcase } from "@/components/PublicGalleryShowcase";
import { isGalleryVideoFile } from "@/lib/media-crud";
import { listPublicGalleryMedia, publicGalleryImageSrc } from "@/lib/media-lib";
import { getApprovedMember } from "@/lib/member-session";

export async function PublicMediaGalleryGrid() {
  const member = await getApprovedMember();
  const items = await listPublicGalleryMedia(Boolean(member));
  const locale = await getLocale();
  const t = await getTranslations("community");
  const loc = locale === "en" || locale === "zh" ? locale : "ko";

  const showcaseItems = items.map((item) => ({
    slug: item.slug,
    src: publicGalleryImageSrc(item),
    title: item.title[loc] || item.title.ko,
    caption: item.summary[loc] || item.summary.ko,
    kind: (isGalleryVideoFile(item.fileName, item.mime) ? "video" : "image") as "image" | "video",
  }));

  return (
    <PublicGalleryShowcase
      items={showcaseItems}
      labels={{
        empty: t("galleryEmpty"),
        prev: t("galleryPrev"),
        next: t("galleryNext"),
        first: t("galleryFirst"),
        last: t("galleryLast"),
        pageLabel: t("galleryPageLabel"),
        galleryNav: t("galleryNav"),
      }}
    />
  );
}