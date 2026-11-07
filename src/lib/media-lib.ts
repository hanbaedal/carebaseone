import { ensureIndexes, media, type MediaCategory } from "@/lib/db";
import { ensureMediaSeed } from "@/lib/seed-media";

export async function listPublishedMedia(
  category?: MediaCategory,
  memberApproved = false,
) {
  await ensureMediaSeed();
  const filter: Record<string, unknown> = {
    published: true,
    audience: memberApproved ? { $in: ["public", "member"] } : "public",
  };
  if (category) filter.category = category;
  return (await media()).find(filter).sort({ createdAt: -1 }).toArray();
}

/** 자료실: 특허 페이지와 겹치지 않도록 patent 제외 */
export async function listArchiveMedia(memberApproved = false) {
  await ensureMediaSeed();
  const filter: Record<string, unknown> = {
    published: true,
    category: { $ne: "patent" },
    audience: memberApproved ? { $in: ["public", "member"] } : "public",
  };
  return (await media()).find(filter).sort({ category: 1, createdAt: -1 }).toArray();
}

export async function listAllMedia() {
  await ensureMediaSeed();
  return (await media()).find({}).sort({ category: 1, createdAt: -1 }).toArray();
}

export async function findMediaBySlug(slug: string) {
  await ensureMediaSeed();
  return (await media()).findOne({ slug, published: true });
}
