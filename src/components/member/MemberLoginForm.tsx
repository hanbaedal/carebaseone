"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { loginMember } from "@/app/[locale]/member/actions";

export function MemberLoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginMember, {});
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (state.ok) {
      router.replace("/store");
      router.refresh();
    }
  }, [state.ok, router]);

  return (
    <form action={action} className="grid gap-3">
      <label className="grid gap-1 text-sm">
        아이디
        <input name="username" required autoComplete="username" className="border border-line px-3 py-2" />
      </label>
      <div className="grid gap-1 text-sm">
        <label htmlFor="member-password">비밀번호</label>
        <div className="relative">
          <input
            id="member-password"
            name="password"
            type={visible ? "text" : "password"}
            required
            autoComplete="current-password"
            className="w-full border border-line px-3 py-2 pr-12"
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute inset-y-0 right-0 w-10 text-xs text-brand-ink/50"
          >
            {visible ? "숨김" : "보기"}
          </button>
        </div>
      </div>
      {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-brand px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
