import { ensureIndexes, posts, type PostDoc, type PostType } from "@/lib/db";
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
  const now = new Date();
  await (await posts()).updateOne(
    { slug: input.slug },
    {
      $set: { ...input, updatedAt: now },
      $setOnInsert: { createdAt: input.createdAt ?? now },
    },
    { upsert: true },
  );
}

export async function deletePost(slug: string) {
  await ensureIndexes();
  await (await posts()).deleteOne({ slug });
}
