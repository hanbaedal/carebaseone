import {
  IconFacebook,
  IconInstagram,
  IconNaverBlog,
  IconYoutube,
} from "@/components/sns/SnsBrandIcons";
import type { CompanySnsLink } from "@/lib/company-sns";
import type { PublicSnsKey } from "@/lib/company-sns";
import type { ReactNode } from "react";

const ICONS: Record<PublicSnsKey, (props: { className?: string }) => ReactNode> = {
  facebook: IconFacebook,
  instagram: IconInstagram,
  youtube: IconYoutube,
  naverBlog: IconNaverBlog,
};

const ICON_COLOR: Record<PublicSnsKey, string> = {
  facebook: "text-[#1877F2]",
  instagram: "text-[#E4405F]",
  youtube: "text-[#FF0000]",
  naverBlog: "text-[#03C75A]",
};

export function SnsIconLinkRow({
  links,
  compact = false,
  onBrandBg = false,
  className = "",
}: {
  links: CompanySnsLink[];
  compact?: boolean;
  onBrandBg?: boolean;
  className?: string;
}) {
  if (links.length === 0) return null;

  const size = compact ? "h-9 w-9" : "h-10 w-10";
  const iconSize = compact ? "h-[18px] w-[18px]" : "h-5 w-5";
  const shell = onBrandBg
    ? "border-current/20 bg-white/95 text-brand-ink shadow-sm ring-1 ring-black/5"
    : "border-line bg-white/95 text-brand-ink shadow-md ring-1 ring-black/5";

  return (
    <nav
      className={`flex shrink-0 flex-row flex-wrap items-center justify-end gap-2 ${className}`}
      aria-label="SNS 바로가기"
    >
      {links.map((item) => {
        const Icon = ICONS[item.key];
        return (
          <a
            key={item.key}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`flex ${size} items-center justify-center rounded-full border backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand ${shell}`}
            aria-label={item.labelKo}
            title={item.labelKo}
          >
            <span className={ICON_COLOR[item.key]}>
              <Icon className={iconSize} />
            </span>
          </a>
        );
      })}
    </nav>
  );
}