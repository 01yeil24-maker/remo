"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthFormState } from "../auth-actions";
import { errorClass, fieldClass, labelClass, primaryButtonClass } from "@/components/formStyles";

const initialState: AuthFormState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-10 flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="password">
          비밀번호
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>

      {state.error && <p className={errorClass}>{state.error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "로그인 중..." : "로그인"}
        </button>
        <Link
          href="/signup"
          className="text-[14px] font-medium text-brand-ink/60 transition-colors hover:text-brand-orange"
        >
          가입 신청하기
        </Link>
      </div>
    </form>
  );
}
