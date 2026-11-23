import { ensureIndexes, media, type MediaCategory, type MediaDoc } from "@/lib/db";
import { galleryThumbSrc } from "@/lib/gallery-thumb-src";
import { ensureCmsGallerySeed, galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { cmsGalleryFallbackOptions } from "@/lib/cms-gallery-images";
import { isGalleryImageFile, repairGalleryImageMime } from "@/lib/media-crud";
import { isImageMime, resolveMediaChannels } from "@/lib/media-channels";
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
  m: Pick<MediaDoc, "slug" | "filePath" | "title" | "fileName" | "tags" | "mime" | "storage">,
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
    const docs = await (await media())
      .find({
        published: true,
        mime: { $regex: /^image\//i },
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
        createdAt: 1,
      })
      .sort({ category: 1, createdAt: -1 })
      .limit(200)
      .toArray() as Pick<
      MediaDoc,
      "slug" | "filePath" | "title" | "fileName" | "tags" | "category" | "channels" | "mime" | "createdAt"
    >[];

    const cmsDocs = docs.filter((m) => resolveMediaChannels(m).cmsBackground);

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

/** 공개 커뮤니티 갤러리 — publicGallery 채널 */
export async function listPublicGalleryMedia(memberApproved = false): Promise<MediaDoc[]> {
  await ensureMediaReady();
  await ensureCmsGallerySeed();
  await repairGalleryImageMime();
  const { repairGalleryDiskMirrors } = await import("@/lib/media-crud");
  await repairGalleryDiskMirrors();
  const audience = memberApproved ? { $in: ["public", "member"] as const } : "public";
  const docs = await (await media())
    .find({
      published: true,
      category: "gallery",
      audience,
      $or: [{ mime: { $regex: /^image\//i } }, { fileName: { $regex: /\.(jpe?g|png|webp|gif)$/i } }],
    })
    .sort({ createdAt: -1 })
    .toArray();
  return docs.filter((d) => isGalleryImageFile(d.fileName, d.mime) && resolveMediaChannels(d).publicGallery);
}

export function publicGalleryImageSrc(item: MediaDoc) {
  return mediaOptionFromDoc(item).src;
}
