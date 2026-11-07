import { companySnsLinks, type PublicSnsKey } from "@/lib/company-sns";
import { getCompanyProfile } from "@/lib/company-profile";
import {
  IconFacebook,
  IconInstagram,
  IconNaverBlog,
  IconYoutube,
} from "@/components/sns/SnsBrandIcons";
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

export async function FloatingSnsBar() {
  const profile = await getCompanyProfile();
  const links = companySnsLinks(profile);

  if (links.length === 0) return null;

  return (
    <nav
      className="pointer-events-none fixed bottom-5 right-4 z-40 flex flex-col items-end gap-2 sm:bottom-6 sm:right-6"
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
            className="pointer-events-auto flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/95 text-brand-ink shadow-md ring-1 ring-black/5 backdrop-blur-sm transition hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            aria-label={item.labelKo}
            title={item.labelKo}
          >
            <span className={ICON_COLOR[item.key]}>
              <Icon />
            </span>
          </a>
        );
      })}
    </nav>
  );
}
