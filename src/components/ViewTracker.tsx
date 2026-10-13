"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/navigation";

export function ViewTracker() {
  const pathname = usePathname();
  const locale = useLocale();

  useEffect(() => {
    const body = JSON.stringify({ path: pathname, locale });
    void fetch("/api/view", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    });
  }, [pathname, locale]);

  return null;
}
