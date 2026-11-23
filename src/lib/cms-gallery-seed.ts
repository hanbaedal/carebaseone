import { ensureIndexes, media } from "@/lib/db";
import { mongoCreatedUpdated } from "@/lib/korea-time";
import { cmsGalleryImageDefs } from "@/lib/cms-gallery-images";
import { mediaApiPath } from "@/lib/media-storage";

let seedPromise: Promise<void> | null = null;
let seedCompleted = false;

/** 사용 중인 사이트·제품 이미지를 media(gallery)에 등록 */
export async function ensureCmsGallerySeed() {
  if (seedCompleted) return;
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
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  for (const item of cmsGalleryImageDefs()) {
    const hit = await col.findOne({ slug: item.slug });
    if (hit) {
      // 기존 레코드의 공개 경로·분류만 보정
      if (hit.category !== "gallery" || hit.filePath !== mediaApiPath(item.slug)) {
        await col.updateOne(
          { slug: item.slug },
          {
            $set: {
              category: "gallery",
              filePath: mediaApiPath(item.slug),
              mime: item.mime,
              fileName: item.fileName,
              published: true,
              tags: Array.from(new Set([...(hit.tags ?? []), "cms", "background", item.publicPath])),
            },
          },
        );
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
      published: true,
      storage: "missing",
      createdBy: "CAREBASE",
      ...mongoCreatedUpdated(),
    });
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
