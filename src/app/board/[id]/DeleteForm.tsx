"use client";

import { useActionState } from "react";
import { deletePostAction, type FormState } from "../actions";

const initialState: FormState = {};

export default function DeleteForm({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(deletePostAction, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-2">
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-brand-line px-5 py-2.5 text-[14px] font-medium text-brand-ink/60 transition-colors hover:border-brand-orange hover:text-brand-orange disabled:opacity-60"
      >
        {pending ? "삭제 중..." : "삭제"}
      </button>
      {state.error && (
        <p className="text-[13px] font-medium text-brand-orange">{state.error}</p>
      )}
    </form>
  );
}
