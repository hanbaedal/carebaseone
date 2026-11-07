import { ensureIndexes, posts, type PostDoc, type PostType } from "@/lib/db";
import { formatKoreaDateTimeStorage, mongoCreated, mongoUpdated } from "@/lib/korea-time";
import { ensurePostSeed } from "@/lib/seed-posts";

export async function listPosts(type: PostType, memberOk: boolean) {
  await ensurePostSeed();
  const visibility = memberOk
    ? (["public", "member"] as const)
    : (["public"] as const);
  return (await posts())
    .find({ type, published: true, visibility: { $in: [...visibility] } })
    .sort({ pinned: -1, createdAt: -1 })
    .toArray();
}

export async function findPostBySlug(slug: string) {
  await ensureIndexes();
  return (await posts()).findOne({ slug, published: true });
}

export async function listAllPosts(type?: PostType) {
  await ensureIndexes();
  const filter = type ? { type } : {};
  return (await posts()).find(filter).sort({ createdAt: -1 }).toArray();
}

export async function upsertPost(
  input: Omit<PostDoc, "createdAt" | "updatedAt"> & { createdAt?: Date },
) {
  await ensureIndexes();
  const createdAt = input.createdAt ?? new Date();
  const updated = mongoUpdated();
  const insert = mongoCreated(createdAt);
  const eventAtKst =
    input.eventAt != null ? { eventAtKst: formatKoreaDateTimeStorage(input.eventAt) } : {};
  await (await posts()).updateOne(
    { slug: input.slug },
    {
      $set: { ...input, ...updated, ...eventAtKst },
      $setOnInsert: insert,
    },
    { upsert: true },
  );
}

export async function deletePost(slug: string) {
  await ensureIndexes();
  await (await posts()).deleteOne({ slug });
}
