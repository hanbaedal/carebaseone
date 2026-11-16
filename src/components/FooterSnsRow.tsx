import { SnsIconLinkRow } from "@/components/sns/SnsIconLinkRow";
import { companySnsLinks } from "@/lib/company-sns";
import { getCompanyProfile } from "@/lib/company-profile";

export async function FooterSnsRow({
  compact = false,
  onBrandBg = false,
  className = "",
}: {
  compact?: boolean;
  onBrandBg?: boolean;
  className?: string;
}) {
  const profile = await getCompanyProfile();
  const links = companySnsLinks(profile);
  return (
    <SnsIconLinkRow
      links={links}
      compact={compact}
      onBrandBg={onBrandBg}
      className={className}
    />
  );
}