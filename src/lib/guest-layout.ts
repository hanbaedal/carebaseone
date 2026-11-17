/**
 * 게스트(공개 [locale]) 레이아웃 — iOS safe-area·노치 대응
 * @see globals.css `--guest-header-total`, `h-guest-dvh` 등
 */

/** SiteHeader — 상태바·노치 아래로 내용 시작 */
export const GUEST_HEADER_SHELL = "sticky top-0 z-50 border-b border-line bg-white/95 text-brand-ink backdrop-blur-md pt-safe";

/** 헤더 실제 높이(대략 4.5rem + safe-top) — globals.css 변수 */
export const GUEST_STICKY_SUBNAV_TOP = "top-[var(--guest-header-total)]";

/** 홈·한 화면 쉘 (헤더·하단 safe-area 제외) */
export const GUEST_VIEWPORT_BELOW_HEADER =
  "flex h-guest-dvh max-h-guest-dvh flex-col overflow-hidden";

/** 본문 shell — 하단 safe-area는 globals.css `main` 규칙(홈 `h-guest-dvh` 제외) */
export const GUEST_MAIN_SHELL = "flex-1";

/** 가로 — 기존 px-4/sm:px-6 + safe (max로 큰 쪽) */
export const GUEST_PAGE_GUTTER_X = "px-guest-gutter";