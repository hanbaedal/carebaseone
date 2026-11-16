import { redirect } from "@/i18n/navigation";
import { Link } from "@/i18n/navigation";
import { getApprovedMember } from "@/lib/member-session";
import { listPosts } from "@/lib/posts";
import { listOrdersForMember } from "@/lib/orders";
import { resolveLocale } from "@/lib/locale";
import { formatKoreaDateTime } from "@/lib/korea-time";
import type { MemberPublic } from "@/lib/members";

export default async function MemberHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const loc = resolveLocale(locale);
  const approved = await getApprovedMember();
  if (!approved) {
    redirect({ href: "/login", locale: loc });
  }
  const member: MemberPublic = approved!;

  const [notices, archive, orders] = await Promise.all([
    listPosts("notice", true),
    listPosts("archive", true),
    listOrdersForMember(member.username),
  ]);

  const memberNotices = notices.filter((p) => p.visibility === "member" || p.visibility === "public");
  const memberArchive = archive.filter((p) => p.visibility === "member");

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <h1 className="font-display text-3xl text-brand-ink">회원 홈</h1>
      <p className="mt-2 text-sm text-brand-ink/65">
        {member.name}님 ({member.tier}) · 승인 회원 전용 안내·자료·주문입니다.
      </p>

      <div className="mt-10 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm font-semibold text-brand-ink">바로가기</h2>
          <ul className="mt-3 flex flex-col gap-2 text-sm">
            <li>
              <Link href="/store" className="text-brand hover:underline">
                스토어·주문
              </Link>
            </li>
            <li>
              <Link href="/member/orders" className="text-brand hover:underline">
                내 주문 ({orders.length})
              </Link>
            </li>
            <li>
              <Link href="/member/profile" className="text-brand hover:underline">
                프로필 수정
              </Link>
            </li>
            <li>
              <Link href="/community/notice" className="text-brand hover:underline">
                공지사항 (전체)
              </Link>
            </li>
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="text-sm font-semibold text-brand-ink">회원 공지</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {memberNotices.length === 0 ? (
              <li className="py-2 text-brand-ink/50">등록된 공지가 없습니다.</li>
            ) : (
              memberNotices.slice(0, 5).map((post) => (
                <li key={post.slug} className="py-2">
                  <Link
                    href={`/community/notice/${post.slug}`}
                    className="text-brand-ink hover:text-brand"
                  >
                    {post.title[loc] ?? post.title.ko}
                  </Link>
                  {post.visibility === "member" ? (
                    <span className="ml-2 text-[10px] text-brand">회원</span>
                  ) : null}
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5 md:col-span-2">
          <h2 className="text-sm font-semibold text-brand-ink">회원 전용 자료</h2>
          <ul className="mt-3 divide-y divide-line text-sm">
            {memberArchive.length === 0 ? (
              <li className="py-2 text-brand-ink/50">회원 전용 자료가 없습니다.</li>
            ) : (
              memberArchive.map((post) => (
                <li key={post.slug} className="py-2 flex flex-wrap items-baseline justify-between gap-2">
                  <span className="font-medium text-brand-ink">{post.title[loc] ?? post.title.ko}</span>
                  <span className="text-xs text-brand-ink/45">
                    {formatKoreaDateTime(post.createdAt, locale)}
                  </span>
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

    </div>
  );
}