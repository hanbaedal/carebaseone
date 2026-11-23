import { ensureIndexes, media } from "@/lib/db";
import { mongoCreatedUpdated } from "@/lib/korea-time";
import { cmsGalleryImageDefs } from "@/lib/cms-gallery-images";
import { defaultChannelsForGallerySeed } from "@/lib/media-channels";
import { mediaApiPath } from "@/lib/media-storage";

let seedPromise: Promise<void> | null = null;
let seedCompleted = false;

/** 사용 중인 사이트·제품 이미지를 media(gallery)에 등록 */
export async function ensureCmsGallerySeed() {
  if (!process.env.MONGODB_URI) return;
  if (seedCompleted) {
    await ensureIndexes();
    await backfillMediaChannels(await media());
    return;
  }
  if (seedPromise) return seedPromise;
  seedPromise = runSeed()
    .then(() => {
      seedCompleted = true;
    })
    .finally(() => {
      seedPromise = null;
    });
  return seedPromise;
}

async function runSeed() {
  await ensureIndexes();
  const col = await media();
  for (const item of cmsGalleryImageDefs()) {
    const channels = defaultChannelsForGallerySeed(item.publicPath);
    const hit = await col.findOne({ slug: item.slug });
    if (hit) {
      const patch: Record<string, unknown> = {};
      if (hit.category !== "gallery") patch.category = "gallery";
      if (hit.filePath !== mediaApiPath(item.slug)) {
        patch.filePath = mediaApiPath(item.slug);
        patch.mime = item.mime;
        patch.fileName = item.fileName;
      }
      if (!hit.channels) patch.channels = channels;
      patch.tags = Array.from(new Set([...(hit.tags ?? []), "cms", "background", item.publicPath]));
      if (Object.keys(patch).length > 0) {
        await col.updateOne({ slug: item.slug }, { $set: { ...patch, published: hit.published ?? true } });
      }
      continue;
    }
    await col.insertOne({
      slug: item.slug,
      category: "gallery",
      audience: "public",
      title: { ko: item.titleKo, en: item.titleEn, zh: item.titleZh },
      summary: { ko: item.titleKo, en: item.titleEn, zh: item.titleZh },
      filePath: mediaApiPath(item.slug),
      fileName: item.fileName,
      mime: item.mime,
      size: 0,
      tags: ["cms", "background", item.publicPath],
      channels,
      published: true,
      storage: "missing",
      createdBy: "CAREBASE",
      ...mongoCreatedUpdated(),
    });
  }

  await backfillMediaChannels(col);
}

async function backfillMediaChannels(col: Awaited<ReturnType<typeof media>>) {
  const missing = await col
    .find({ mime: { $regex: /^image\//i }, channels: { $exists: false } })
    .project({ slug: 1, category: 1, tags: 1, fileName: 1 })
    .toArray();
  for (const hit of missing) {
    const publicPath = galleryPublicPathFromDoc(hit.tags, hit.fileName);
    const channels =
      hit.category === "gallery"
        ? defaultChannelsForGallerySeed(publicPath.startsWith("/images/") ? publicPath : "")
        : { publicGallery: false, cmsBackground: false };
    await col.updateOne({ slug: hit.slug }, { $set: { channels } });
  }
}

/** tags에 보관된 publicPath 또는 fileName으로 디스크 경로 힌트 */
export function galleryPublicPathFromDoc(tags: string[] | undefined, fileName: string) {
  const tagged = tags?.find((t) => t.startsWith("/images/"));
  if (tagged) return tagged;
  if (fileName.includes("jaryeon") || fileName.includes("patch") || fileName.includes("recoverx") || fileName.includes("garlic")) {
    return `/images/products/${fileName}`;
  }
  return `/images/site/${fileName}`;
}
