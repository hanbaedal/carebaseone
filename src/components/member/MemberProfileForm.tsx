"use client";

import { useActionState } from "react";
import { updateProfile, logoutMember } from "@/app/[locale]/member/actions";
import type { MemberPublic } from "@/lib/members";

export function MemberProfileForm({ member }: { member: MemberPublic }) {
  const [state, action, pending] = useActionState(updateProfile, {});

  return (
    <div className="grid gap-4">
      <p className="text-sm">
        <span className="text-brand-ink/50">이름</span> {member.name}
      </p>
      <p className="text-sm">
        <span className="text-brand-ink/50">아이디</span> {member.username}
      </p>
      <form action={action} className="grid gap-3 border-t border-line pt-4">
        <label className="grid gap-1 text-sm">
          새 비밀번호 (선택)
          <input name="password" type="password" minLength={8} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          이메일
          <input name="email" defaultValue={member.email} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          전화번호
          <input name="phone" defaultValue={member.phone} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          우편번호
          <input name="zipcode" defaultValue={member.zipcode} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          주소
          <input name="address" defaultValue={member.address} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          상세주소
          <input name="addressDetail" defaultValue={member.addressDetail} className="border border-line px-3 py-2" />
        </label>
        <label className="grid gap-1 text-sm">
          참고사항
          <textarea name="note" rows={3} defaultValue={member.note} className="border border-line px-3 py-2" />
        </label>
        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.ok ? <p className="text-sm text-brand">저장했습니다.</p> : null}
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand px-5 py-2 text-sm text-white disabled:opacity-60"
        >
          저장
        </button>
      </form>
      <form action={logoutMember}>
        <button type="submit" className="text-sm text-brand-ink/50">
          로그아웃
        </button>
      </form>
    </div>
  );
}
