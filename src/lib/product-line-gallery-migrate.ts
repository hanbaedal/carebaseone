import catalog from "@/data/product-catalog.json";
import { ensureIndexes, media } from "@/lib/db";
import { galleryPublicPathFromDoc } from "@/lib/cms-gallery-seed";
import { cmsGalleryImageDefs } from "@/lib/cms-gallery-images";
import ko from "@/messages/ko.json";
import {
  emptyProductLines,
  resolveProductLines,
  type MediaProductLines,
} from "@/lib/media-product-lines";
import { resolveMediaChannels } from "@/lib/media-channels";
import {
  PRODUCT_LINE_CATEGORIES,
  type ProductLineCategory,
} from "@/lib/product-categories";

const MIGRATE_FLAG = "product-lines-catalog-v1";

type CatalogLine = (typeof catalog.lines)[number];

function catalogText(slug: string, field: "title" | "summary") {
  const lines = (ko as { productCatalog?: { lines?: Record<string, { title?: string; summary?: string }> } })
    .productCatalog?.lines;
  const hit = lines?.[slug];
  const value = hit?.[field]?.trim();
  return value || slug;
}

async function findGalleryByImagePath(
  col: Awaited<ReturnType<typeof media>>,
  imagePath: string,
) {
  const fileName = imagePath.split("/").pop() ?? "";
  const byTag = await col.findOne({ category: "gallery", tags: imagePath });
  if (byTag) return byTag;
  const byFile = await col.findOne({ category: "gallery", fileName });
  if (byFile) return byFile;
  const def = cmsGalleryImageDefs().find((d) => d.publicPath === imagePath);
  if (def) {
    const bySlug = await col.findOne({ slug: def.slug });
    if (bySlug) return bySlug;
  }
  return null;
}

function uniqueCatalogImagesForCategory(category: ProductLineCategory) {
  const paths: { path: string; line: CatalogLine }[] = [];
  const seen = new Set<string>();
  for (const line of catalog.lines) {
    if (line.category !== category) continue;
    const path = line.image.trim();
    if (!path || seen.has(path)) continue;
    seen.add(path);
    paths.push({ path, line });
  }
  return paths;
}

async function assignProductLine(
  col: Awaited<ReturnType<typeof media>>,
  slug: string,
  category: ProductLineCategory,
  line: CatalogLine,
) {
  const hit = await col.findOne({ slug });
  if (!hit) return;
  const ch = resolveMediaChannels(hit);
  const lines: MediaProductLines = {
    ...emptyProductLines(),
    ...resolveProductLines(ch),
    [category]: true,
  };
  const title = catalogText(line.slug, "title");
  const summary = catalogText(line.slug, "summary");
  await col.updateOne(
    { slug },
    {
      $set: {
        channels: { ...ch, productLines: lines },
        published: true,
        title: {
          ko: title,
          en: hit.title.en || title,
          zh: hit.title.zh || title,
        },
        summary: {
          ko: summary,
          en: hit.summary.en || summary,
          zh: hit.summary.zh || summary,
        },
        tags: Array.from(new Set([...(hit.tags ?? []), line.image, `catalog:${line.slug}`])),
      },
    },
  );
}

/** product-catalog.json → 갤러리 제품 라인, 최초 1회 */
/** 해당 라인에 게시·체크된 사진이 없으면 카탈로그 기준으로 다시 연결 */
export async function backfillProductLineCategoryFromCatalog(category: ProductLineCategory) {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const count = await col.countDocuments({
    category: "gallery",
    published: true,
    [`channels.productLines.${category}`]: true,
  });
  if (count > 0) return;
  const candidates = uniqueCatalogImagesForCategory(category);
  for (const { path, line } of candidates) {
    const doc = await findGalleryByImagePath(col, path);
    if (!doc) continue;
    const already = resolveProductLines(resolveMediaChannels(doc))[category];
    if (already) continue;
    await assignProductLine(col, doc.slug, category, line);
  }
}

export async function ensureProductLineGalleryFromCatalog() {
  if (!process.env.MONGODB_URI) return;
  await ensureIndexes();
  const col = await media();
  const flagged = await col.findOne({ tags: MIGRATE_FLAG });
  if (flagged) return;

  for (const category of PRODUCT_LINE_CATEGORIES) {
    const candidates = uniqueCatalogImagesForCategory(category);
    for (const { path, line } of candidates) {
      const doc = await findGalleryByImagePath(col, path);
      if (!doc) continue;
      const already = resolveProductLines(resolveMediaChannels(doc))[category];
      if (already) continue;
      await assignProductLine(col, doc.slug, category, line);
    }
  }

  const anchor = await col.findOne({ category: "gallery" });
  if (anchor) {
    await col.updateOne(
      { _id: anchor._id },
      { $addToSet: { tags: MIGRATE_FLAG } },
    );
  }
}

export function imagePathHintFromDoc(doc: Pick<import("@/lib/db").MediaDoc, "tags" | "fileName">) {
  const tagged = doc.tags?.find((t) => t.startsWith("/images/"));
  if (tagged) return tagged;
  return galleryPublicPathFromDoc(doc.tags, doc.fileName);
}