"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { loginMember } from "@/app/[locale]/member/actions";

export function MemberLoginForm() {
  const router = useRouter();
  const [state, action, pending] = useActionState(loginMember, {});

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
      <label className="grid gap-1 text-sm" htmlFor="member-password">
        비밀번호 (입력한 대로 표시)
        <input
          id="member-password"
          name="password"
          type="text"
          required
          autoComplete="off"
          spellCheck={false}
          className="border border-line px-3 py-2"
        />
      </label>
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
