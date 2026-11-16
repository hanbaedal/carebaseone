import { ensureIndexes, media, type MediaCategory, type MediaDoc } from "@/lib/db";
import { ensureMediaReady, ensureMediaSeed } from "@/lib/seed-media";

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

/** CMS 배경 선택 — 시드 없이 이미지만 (가벼운 조회) */
export async function listCmsImageMediaOptions() {
  await ensureMediaReady();
  const docs = await (await media())
    .find({
      published: true,
      mime: { $regex: /^image\//i },
    })
    .project({ slug: 1, filePath: 1, title: 1 })
    .sort({ createdAt: -1 })
    .limit(120)
    .toArray();
  return docs.map((m) => ({
    slug: m.slug,
    src: m.filePath,
    title: m.title?.ko || m.slug,
  }));
}

export async function findMediaBySlug(slug: string) {
  await ensureMediaReady();
  return (await media()).findOne({ slug, published: true });
}
