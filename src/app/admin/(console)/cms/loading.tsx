export default function CmsLoading() {
  return (
    <div
      className="flex min-h-[min(70vh,40rem)] flex-col items-center justify-center gap-2 bg-paper text-sm text-ink/55"
      aria-busy="true"
      aria-live="polite"
    >
      <p>홈페이지 CMS 불러오는 중…</p>
    </div>
  );
}