import { SectionSiblingNav } from "@/components/SectionSiblingNav";
import { CmsPageFooter } from "@/components/CmsPageFooter";

type CmsFooterSection =
  | "home"
  | "aboutGreeting"
  | "aboutFeatures"
  | "solution"
  | "global"
  | "business"
  | "product"
  | "contact";

export async function SectionTail({
  section,
  docked,
}: {
  section?: CmsFooterSection;
  docked?: boolean;
}) {
  return (
    <>
      <SectionSiblingNav />
      {section ? <CmsPageFooter section={section} docked={docked} /> : null}
    </>
  );
}