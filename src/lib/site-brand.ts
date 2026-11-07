import { getCompanyProfile } from "@/lib/company-profile";
import { getCmsMessages } from "@/lib/content";

export async function getSiteBrand() {
  const [profile, messages] = await Promise.all([
    getCompanyProfile(),
    getCmsMessages("ko"),
  ]);
  const meta = messages as { meta?: { site?: string; tagline?: string } };
  return {
    siteName: profile.companyName || meta.meta?.site?.trim() || "CAREBASE",
    tagline: meta.meta?.tagline?.trim() || "",
  };
}
