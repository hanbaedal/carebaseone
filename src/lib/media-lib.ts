import { ensureIndexes, media, type MediaCategory, type MediaDoc } from "@/lib/db";
import { galleryFileMissing, galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { ensureCmsGallerySeed, galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { cmsGalleryFallbackOptions } from "@/lib/cms-gallery-images";
import { isGalleryImageFile, repairGalleryImageMime } from "@/lib/media-crud";
import { isImageMime, resolveMediaChannels, showOnPublicGallery } from "@/lib/media-channels";
import { productLinesQuery } from "@/lib/media-product-lines";
import { ensureProductLineGalleryFromCatalog } from "@/lib/product-line-gallery-migrate";
import type { ProductLineCategory } from "@/lib/product-categories";
import { ensureMediaReady, ensureMediaSeed } from "@/lib/seed-media";
import { mediaApiPath } from "@/lib/media-storage";

export async function listPublishedMedia(
  category?: MediaCategory,
  memberApproved = false,
) {
  await ensureMediaReady();
  const filter: Record<string, unknown> = {
    published: true,
    audience: memberApproved ? { $in: ["public", "member"] } : "public",
  };
  if (category) filter.category = category;
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

/** 자료실: 특허 페이지와 겹치지 않도록 patent 제외 */
export async function listArchiveMedia(memberApproved = false) {
  await ensureMediaReady();
  const filter: Record<string, unknown> = {
    published: true,
    category: { $ne: "patent" },
    audience: memberApproved ? { $in: ["public", "member"] } : "public",
  };
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

export async function listAllMedia() {
  await ensureMediaSeed();
  return (await media()).find({}).sort({ createdAt: -1 }).toArray();
}

/** 홈페이지관리 — 목록 (갤러리 시드 포함) */
export async function listMediaForAdmin(category?: MediaCategory): Promise<MediaDoc[]> {
  await ensureMediaReady();
  await ensureCmsGallerySeed();
  const filter = category ? { category } : {};
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

function mediaOptionFromDoc(
  m: Pick<MediaDoc, "slug" | "filePath" | "title" | "fileName" | "tags" | "mime" | "gridFsId"> & {
    storage?: MediaDoc["storage"];
  },
) {
  return {
    slug: m.slug,
    src: galleryThumbSrc(m),
    title: m.title?.ko || m.slug,
  };
}

/** CMS 배경 선택 — cmsBackground 채널 이미지 + 정적 폴백 */
export async function listCmsImageMediaOptions() {
  const fallback = cmsGalleryFallbackOptions();
  try {
    await ensureMediaReady();
    await ensureCmsGallerySeed();
    await repairGalleryImageMime();
    const { repairGalleryDiskMirrors } = await import("@/lib/media-crud");
    await repairGalleryDiskMirrors();
    const docs = await (await media())
      .find({
        published: true,
        $or: [{ mime: { $regex: /^image\//i } }, { fileName: { $regex: /\.(jpe?g|png|webp|gif)$/i } }],
      })
      .project({
        slug: 1,
        filePath: 1,
        title: 1,
        fileName: 1,
        tags: 1,
        category: 1,
        channels: 1,
        mime: 1,
        storage: 1,
        gridFsId: 1,
        createdAt: 1,
      })
      .sort({ category: 1, createdAt: -1 })
      .limit(200)
      .toArray() as Pick<
      MediaDoc,
      "slug" | "filePath" | "title" | "fileName" | "tags" | "category" | "channels" | "mime" | "createdAt"
    >[];

    const cmsDocs = docs.filter(
      (m) =>
        isGalleryImageFile(m.fileName, m.mime) &&
        resolveMediaChannels(m).cmsBackground &&
        !galleryFileMissing(m as MediaDoc),
    );

    const map = new Map(fallback.map((item) => [item.slug, item]));
    for (const m of cmsDocs) {
      map.set(m.slug, mediaOptionFromDoc(m));
    }

    const galleryFirst = Array.from(map.values()).sort((a, b) => {
      const aGal = a.slug.startsWith("gallery-") ? 0 : 1;
      const bGal = b.slug.startsWith("gallery-") ? 0 : 1;
      if (aGal !== bGal) return aGal - bGal;
      return a.title.localeCompare(b.title, "ko");
    });
    if (galleryFirst.length > 0) return galleryFirst;
  } catch {
    /* Mongo 없으면 로컬 갤러리 폴백 */
  }
  return fallback;
}

export async function findMediaBySlug(slug: string) {
  await ensureMediaReady();
  return (await media()).findOne({ slug, published: true });
}

/** 공개 커뮤니티 갤러리 — 관리 이미지 갤러리와 동일 풀(공개·파일 있음·공개갤러리 체크) */
export async function listPublicGalleryMedia(memberApproved = false): Promise<MediaDoc[]> {
  await ensureMediaReady();
  await ensureCmsGallerySeed();
  await repairGalleryImageMime();
  const { repairGalleryDiskMirrors, repairGalleryPublicChannels } = await import("@/lib/media-crud");
  await repairGalleryDiskMirrors();
  await repairGalleryPublicChannels();
  const { galleryFileMissing } = await import("@/lib/gallery-thumb-src");
  const docs = await listMediaForAdmin("gallery");
  return docs.filter((d) => {
    if (!d.published) return false;
    if (!isGalleryImageFile(d.fileName, d.mime)) return false;
    if (galleryFileMissing(d)) return false;
    if (!showOnPublicGallery(d)) return false;
    if (d.audience === "member" && !memberApproved) return false;
    return true;
  });
}

export function publicGalleryImageSrc(item: MediaDoc) {
  return mediaOptionFromDoc(item).src;
}

/** 제품 라인 페이지 카드 — 게시 + 라인 체크 + 파일 있음 (체크된 전부) */
export async function listProductLineGalleryMedia(
  category: ProductLineCategory,
): Promise<MediaDoc[]> {
  await ensureMediaReady();
  await ensureCmsGallerySeed();
  await repairGalleryImageMime();
  const { repairGalleryDiskMirrors } = await import("@/lib/media-crud");
  await repairGalleryDiskMirrors();
  await ensureProductLineGalleryFromCatalog();
  const { backfillProductLineCategoryFromCatalog } = await import(
    "@/lib/product-line-gallery-migrate"
  );
  await backfillProductLineCategoryFromCatalog(category);
  const { repairProductLineChannelsShape } = await import("@/lib/gallery-product-line-limit");
  await repairProductLineChannelsShape();

  await ensureIndexes();
  const docs = (await (await media())
    .find(productLinesQuery(category))
    .sort({ createdAt: -1 })
    .toArray()) as MediaDoc[];

  return docs.filter((d) => isGalleryImageFile(d.fileName, d.mime));
}
