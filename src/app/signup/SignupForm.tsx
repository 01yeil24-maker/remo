"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type AuthFormState } from "../auth-actions";
import { AUTH_FORM_LIMITS } from "@/lib/board-config";
import {
  errorClass,
  fieldClass,
  labelClass,
  noticeClass,
  primaryButtonClass,
} from "@/components/formStyles";

const initialState: AuthFormState = {};

export default function SignupForm() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  if (state.done) {
    return (
      <div className="mt-10 max-w-xl">
        <p className={noticeClass}>
          {state.pending
            ? "가입 신청이 접수됐어요. 관리자가 승인하면 로그인할 수 있습니다."
            : "관리자 계정으로 가입됐어요. 바로 로그인할 수 있습니다."}
        </p>
        <Link href="/login" className={`${primaryButtonClass} mt-6 inline-block`}>
          로그인하러 가기
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-10 flex max-w-md flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="name">
          이름
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={AUTH_FORM_LIMITS.nameMax}
          placeholder="게시판에 표시될 이름"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="email">
          이메일
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={AUTH_FORM_LIMITS.emailMax}
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
          minLength={AUTH_FORM_LIMITS.passwordMin}
          maxLength={AUTH_FORM_LIMITS.passwordMax}
          autoComplete="new-password"
          placeholder={`${AUTH_FORM_LIMITS.passwordMin}자 이상`}
          className={fieldClass}
        />
      </div>

      {state.error && <p className={errorClass}>{state.error}</p>}

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={pending} className={primaryButtonClass}>
          {pending ? "신청 중..." : "가입 신청"}
        </button>
        <Link
          href="/login"
          className="text-[14px] font-medium text-brand-ink/60 transition-colors hover:text-brand-orange"
        >
          이미 계정이 있어요
        </Link>
      </div>
    </form>
  );
}
