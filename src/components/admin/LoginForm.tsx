"use client";

import { useActionState, useEffect } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});

  useEffect(() => {
    if (state.ok) {
      window.location.assign("/admin/site");
    }
  }, [state.ok]);

  return (
    <form action={action} className="grid gap-3">
      <label className="grid gap-1 text-xs">
        아이디
        <input
          name="username"
          autoComplete="username"
          required
          className="border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest"
        />
      </label>
      <label className="grid gap-1 text-xs" htmlFor="password">
        비밀번호 (입력한 대로 표시)
        <input
          id="password"
          name="password"
          type="text"
          autoComplete="off"
          spellCheck={false}
          required
          className="border border-ink/15 bg-white px-2 py-1.5 text-sm outline-none focus:border-forest"
        />
      </label>
      {state.error ? <p className="text-xs text-red-800">{state.error}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-forest px-3 py-2 text-xs tracking-[0.14em] text-cream disabled:opacity-60"
      >
        {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
