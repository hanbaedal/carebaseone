import { SectionSiblingNav } from "@/components/SectionSiblingNav";
import { CmsPageFooter } from "@/components/CmsPageFooter";

type CmsFooterSection =
  | "home"
  | "about"
  | "aboutGreeting"
  | "aboutFeatures"
  | "solution"
  | "global"
  | "business"
  | "product"
  | "technology"
  | "community"
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