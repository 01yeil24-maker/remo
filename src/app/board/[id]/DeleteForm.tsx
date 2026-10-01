"use client";

import { useActionState } from "react";
import { deletePostAction, type FormState } from "../actions";

const initialState: FormState = {};

export default function DeleteForm({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(deletePostAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <input type="hidden" name="id" value={id} />
      <div className="flex flex-wrap items-center gap-3">
        <input
          name="password"
          type="password"
          required
          placeholder="비밀번호"
          aria-label="글 삭제 비밀번호"
          className="w-40 rounded-xl border border-brand-line bg-white px-4 py-2.5 text-[14px] outline-none transition-colors placeholder:text-brand-ink/30 focus:border-brand-orange"
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-full border border-brand-line px-5 py-2.5 text-[14px] font-medium text-brand-ink/70 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-60"
        >
          {pending ? "삭제 중..." : "삭제"}
        </button>
      </div>
      {state.error && (
        <p className="text-[13px] font-medium text-brand-orange">{state.error}</p>
      )}
    </form>
  );
}
