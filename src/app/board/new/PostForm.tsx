"use client";

import Link from "next/link";
import { useActionState } from "react";
import { createPostAction, type FormState } from "../actions";
import { LIMITS } from "@/lib/board-config";

const initialState: FormState = {};

const fieldClass =
  "w-full rounded-xl border border-brand-line bg-white px-4 py-3 text-[15px] text-brand-ink outline-none transition-colors placeholder:text-brand-ink/30 focus:border-brand-orange";

const labelClass = "block text-[14px] font-semibold text-brand-ink/80";

export default function PostForm() {
  const [state, formAction, pending] = useActionState(createPostAction, initialState);

  return (
    <form action={formAction} className="mt-10 flex max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="title">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          maxLength={LIMITS.title}
          placeholder="제목을 입력하세요"
          className={fieldClass}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="author">
          이름
        </label>
        <input
          id="author"
          name="author"
          type="text"
          required
          maxLength={LIMITS.author}
          placeholder="이름을 입력하세요"
          className={`${fieldClass} sm:max-w-xs`}
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className={labelClass} htmlFor="content">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          required
          rows={10}
          maxLength={LIMITS.content}
          placeholder="내용을 입력하세요"
          className={`${fieldClass} resize-y leading-[1.7]`}
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
          minLength={LIMITS.passwordMin}
          maxLength={LIMITS.passwordMax}
          placeholder={`${LIMITS.passwordMin}자 이상`}
          className={`${fieldClass} sm:max-w-xs`}
        />
        <p className="text-[13px] text-brand-ink/50">글을 지울 때 필요해요.</p>
      </div>

      {state.error && (
        <p className="rounded-xl bg-brand-orange/10 px-4 py-3 text-[14px] font-medium text-brand-orange">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-brand-orange px-6 py-3 text-[15px] font-semibold text-white transition-colors hover:bg-brand-orange-dark disabled:opacity-60"
        >
          {pending ? "올리는 중..." : "올리기"}
        </button>
        <Link
          href="/board"
          className="rounded-full border border-brand-line px-6 py-3 text-[15px] font-medium text-brand-ink/70 transition-colors hover:text-brand-orange"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
