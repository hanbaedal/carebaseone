import { getTranslations } from "next-intl/server";
import { SectionHubBlock } from "@/components/SectionHubBlock";
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

export async function SectionHubList({ blocks }: { blocks: HubBlockDef[] }) {
  const tCta = await getTranslations("cta");
  const detailsLabel = tCta("details");

  return (
    <Card className="mx-auto max-w-4xl px-4 pb-16 pt-4 sm:px-6 md:pt-8">
      {await Promise.all(
        blocks.map(async (block) => {
          const t = await getTranslations(block.messageNs);
          const tr = t as unknown as (key: string) => string;
          const title = resolveHubField(tr, block.titleKey);
          const rawExcerpt = resolveHubField(tr, block.excerptKey);
          const excerpt = truncateExcerpt(rawExcerpt);
          const anchorId = block.href.split("/").filter(Boolean).pop();
          return (
            <SectionHubBlock
              key={block.href}
              title={title}
              excerpt={excerpt}
              href={block.href}
              image={block.image}
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