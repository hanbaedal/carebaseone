import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CAREBASE 관리",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className="h-full">
      <body
        className="min-h-dvh bg-cream text-ink antialiased"
        style={{ fontFamily: '"Segoe UI", "Malgun Gothic", sans-serif' }}
      >
        {children}
      </body>
    </html>
  );
}
