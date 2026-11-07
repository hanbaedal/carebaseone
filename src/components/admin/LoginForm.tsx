"use client";

import { useActionState, useEffect, useState } from "react";
import { login } from "@/app/admin/actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (state.ok) {
      window.location.assign("/admin");
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
      <div className="grid gap-1 text-xs">
        <label htmlFor="password">비밀번호</label>
        <div className="relative">
          <input
            id="password"
            name="password"
            type={visible ? "text" : "password"}
            autoComplete="current-password"
            required
            className="w-full border border-ink/15 bg-white py-1.5 pr-9 pl-2 text-sm outline-none focus:border-forest"
          />
          <button
            type="button"
            onClick={() => setVisible((open) => !open)}
            aria-label={visible ? "비밀번호 숨기기" : "비밀번호 보기"}
            aria-pressed={visible}
            className="absolute inset-y-0 right-0 flex w-9 items-center justify-center text-ink/45 hover:text-forest"
          >
            {visible ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
      </div>
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

function EyeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M3 3l18 18M10.5 10.7A2.5 2.5 0 0 0 12 14.5M9.9 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a18 18 0 0 1-3.2 4.2M6.1 6.6C3.8 8.2 2 12 2 12s3.5 6 10 6c1.4 0 2.7-.3 3.8-.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
