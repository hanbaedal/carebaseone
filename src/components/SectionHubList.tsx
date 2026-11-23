import { getTranslations } from "next-intl/server";
import { SectionHubBlock } from "@/components/SectionHubBlock";
import { resolveHubBlockImageSrc } from "@/lib/hub-media";
import type { HubBlockDef } from "@/lib/section-hub";
import { truncateExcerpt } from "@/lib/section-nav";

function resolveHubField(t: (key: string) => string, key: string) {
  try {
    const value = t(key);
    return typeof value === "string" ? value : "";
  } catch {
    return "";
  }
}

export async function SectionHubList({
  blocks,
  imageSection,
}: {
  blocks: HubBlockDef[];
  /** CMS 허브 카드 이미지 섹션 (about / product / technology / community) */
  imageSection?: string;
}) {
  const tCta = await getTranslations("cta");
  const detailsLabel = tCta("details");
  const tImages = imageSection
    ? ((await getTranslations(
        imageSection as "about" | "product" | "technology" | "community",
      )) as unknown as (key: string) => string)
    : null;

  return (
    <Card className="mx-auto max-w-4xl px-guest-gutter pb-16 pt-4 md:pt-8">
      {await Promise.all(
        blocks.map(async (block) => {
          const t = await getTranslations(block.messageNs);
          const tr = t as unknown as (key: string) => string;
          const title = resolveHubField(tr, block.titleKey);
          const rawExcerpt = resolveHubField(tr, block.excerptKey);
          const excerpt = truncateExcerpt(rawExcerpt);
          const anchorId = block.href.split("/").filter(Boolean).pop();
          const cmsImage =
            imageSection && tImages
              ? imageSection === "product"
                ? resolveHubField(tImages, `categories.${block.navKey}.image`)
                : resolveHubField(tImages, `hubCards.${block.navKey}.image`)
              : "";
          return (
            <SectionHubBlock
              key={block.href}
              title={title}
              excerpt={excerpt}
              href={block.href}
              image={resolveHubBlockImageSrc(block.image, cmsImage)}
              detailsLabel={detailsLabel}
              anchorId={anchorId}
            />
          );
        }),
      )}
    </Card>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}