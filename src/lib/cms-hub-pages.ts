const CMS_HUB_PAGE_KEYS = new Set(["about", "technology", "community", "product"]);

export function isCmsHubPage(pageKey: string) {
  return CMS_HUB_PAGE_KEYS.has(pageKey);
}

/** CMS 미리보기 — 공개 허브와 동일하게 히어로 + 카드 요약만 */
export function filterHubCanvasContentPaths(pageKey: string, paths: string[]): string[] {
  if (pageKey === "technology") {
    return paths.filter((path) => !path.startsWith("technology.blocks."));
  }
  if (pageKey === "community") {
    const hubCardFields = new Set([
      "community.sections.notice",
      "community.sections.archive",
      "community.sections.gallery",
      "community.noticeLede",
      "community.archiveLede",
      "community.galleryLede",
    ]);
    return paths.filter((path) => hubCardFields.has(path));
  }
  if (pageKey === "about") {
    return paths.filter(
      (path) =>
        !path.startsWith("about.blocks.") &&
        path !== "about.storyTitle" &&
        path !== "about.storyBody" &&
        path !== "about.ctaTechnology" &&
        path !== "about.ctaContact",
    );
  }
  if (pageKey === "product") {
    return paths.filter(
      (path) =>
        !path.startsWith("product.categories.") &&
        path !== "product.note" &&
        path !== "product.proofLink" &&
        path !== "product.certLink",
    );
  }
  return paths;
}