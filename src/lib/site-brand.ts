import { getCmsMessages } from "@/lib/content";

export async function getSiteBrand() {
  const messages = (await getCmsMessages("ko")) as {
    meta?: { site?: string; tagline?: string };
  };
  return {
    siteName: messages.meta?.site?.trim() || "CAREBASE",
    tagline: messages.meta?.tagline?.trim() || "",
  };
}
