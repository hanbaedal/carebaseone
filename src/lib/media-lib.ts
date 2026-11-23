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

/** 홈페이지관리 — 목록 (갤러리 시드 포함) */
export async function listMediaForAdmin(category?: MediaCategory): Promise<MediaDoc[]> {
  await ensureMediaReady();
  await ensureCmsGallerySeed();
  const filter = category ? { category } : {};
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

/** CMS 배경 선택 — gallery 분류(+이미지) + 정적 폴백 병합 */
export async function listCmsImageMediaOptions() {
  const fallback = cmsGalleryFallbackOptions();
  try {
    await ensureMediaReady();
    await ensureCmsGallerySeed();
    const docs = await (await media())
      .find({
        published: true,
        $or: [{ category: "gallery" }, { mime: { $regex: /^image\//i } }],
      })
      .project({ slug: 1, filePath: 1, title: 1, fileName: 1, tags: 1, category: 1, createdAt: 1 })
      .sort({ category: 1, createdAt: -1 })
      .limit(200)
      .toArray();

    const map = new Map(fallback.map((item) => [item.slug, item]));
    for (const m of docs) {
      const publicHint = galleryPublicPathFromDoc(m.tags, m.fileName);
      const src =
        m.filePath?.startsWith("/images/")
          ? m.filePath
          : publicHint.startsWith("/images/")
            ? publicHint
            : m.filePath || mediaApiPath(m.slug);
      map.set(m.slug, {
        slug: m.slug,
        src,
        title: m.title?.ko || m.slug,
      });
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
