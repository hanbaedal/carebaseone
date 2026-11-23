import { ensureIndexes, media, type MediaCategory, type MediaDoc } from "@/lib/db";
import { ensureCmsGallerySeed, galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { cmsGalleryFallbackOptions } from "@/lib/cms-gallery-images";
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

/** 홈페이지관리 — 시드 없이 목록 (카테고리 필터) */
export async function listMediaForAdmin(category?: MediaCategory): Promise<MediaDoc[]> {
  await ensureMediaReady();
  const filter = category ? { category } : {};
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

/** CMS 배경 선택 — 갤러리(및 업로드 이미지). 갤러리 시드 포함 */
export async function listCmsImageMediaOptions() {
  try {
    await ensureMediaReady();
    await ensureCmsGallerySeed();
    const docs = await (await media())
      .find({
        published: true,
        mime: { $regex: /^image\//i },
      })
      .project({ slug: 1, filePath: 1, title: 1, fileName: 1, tags: 1, category: 1 })
      .sort({ category: 1, createdAt: -1 })
      .limit(200)
      .toArray();

    const fromDb = docs.map((m) => {
      const publicHint = galleryPublicPathFromDoc(m.tags, m.fileName);
      const src =
        m.filePath?.startsWith("/images/")
          ? m.filePath
          : publicHint.startsWith("/images/")
            ? publicHint
            : m.filePath || mediaApiPath(m.slug);
      return {
        slug: m.slug,
        src,
        title: m.title?.ko || m.slug,
      };
    });

    if (fromDb.length > 0) return fromDb;
  } catch {
    /* Mongo 없으면 로컬 갤러리 폴백 */
  }
  return cmsGalleryFallbackOptions();
}

export async function findMediaBySlug(slug: string) {
  await ensureMediaReady();
  return (await media()).findOne({ slug, published: true });
}
