"use client";

import { EcosystemDiagram } from "@/components/EcosystemDiagram";
import { cmsPreviewText, cmsSlotRing } from "@/components/admin/cms-slot";
import { GUEST_CONTENT_MAX } from "@/lib/guest-layout";

const NODE_KEYS = [
  "technology",
  "research",
  "product",
  "oem",
  "healthcare",
  "education",
  "distribution",
  "partner",
] as const;

export function BusinessCmsBody({
  values,
  activeSlot,
  onSelectSlot,
}: {
  values: Record<string, string>;
  activeSlot: string | null;
  onSelectSlot: (path: string) => void;
}) {
  const centerPath = "business.center";
  const invitePath = "business.invite";
  const nodes = NODE_KEYS.map((key) =>
    cmsPreviewText(values[`business.nodes.${key}`] ?? "", key),
  );

  return (
    <section
      className={`mx-auto grid w-full ${GUEST_CONTENT_MAX} items-center gap-12 px-guest-gutter py-20 md:grid-cols-[1.1fr_0.9fr]`}
    >
      <div>
        <ul className="grid gap-2 text-sm tracking-[0.04em] text-ink/70">
          {NODE_KEYS.map((key) => {
            const path = `business.nodes.${key}`;
            return (
              <li key={key} className="border-b border-ink/10 py-2">
                <button
                  type="button"
                  onClick={() => onSelectSlot(path)}
                  className={`block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === path)}`}
                >
                  {cmsPreviewText(values[path] ?? "", "항목")}
                </button>
              </li>
            );
          })}
        </ul>
        <button
          type="button"
          onClick={() => onSelectSlot(invitePath)}
          className={`mt-8 block w-full border-0 bg-transparent p-0 text-left ${cmsSlotRing(activeSlot === invitePath)}`}
        >
          <span className="text-sm leading-7 text-brand-ink/70">
            {cmsPreviewText(values[invitePath] ?? "", "파트너 초대 문구")}
          </span>
        </button>
        <button
          type="button"
          onClick={() => onSelectSlot(centerPath)}
          className={`mt-6 block w-full border-0 bg-transparent p-0 text-left md:hidden ${cmsSlotRing(activeSlot === centerPath)}`}
        >
          <span className="text-xs text-ink/45">
            다이어그램 중앙: {cmsPreviewText(values[centerPath] ?? "", "중앙 문구")}
          </span>
        </button>
      </div>
      <div>
        <button
          type="button"
          onClick={() => onSelectSlot(centerPath)}
          className={`mb-3 hidden w-full border-0 bg-transparent p-0 text-left md:block ${cmsSlotRing(activeSlot === centerPath)}`}
        >
          <span className="text-xs text-ink/45">
            다이어그램 중앙: {cmsPreviewText(values[centerPath] ?? "", "중앙 문구")}
          </span>
        </button>
        <EcosystemDiagram
          center={cmsPreviewText(values[centerPath] ?? "", "NO Metabolite")}
          nodes={nodes}
        />
      </div>
    </section>
  );
}
