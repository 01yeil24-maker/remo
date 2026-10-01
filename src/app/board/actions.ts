"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createPost, deletePost } from "@/lib/posts";
import { LIMITS } from "@/lib/board-config";

export type FormState = { error?: string };

export async function createPostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!title || !author || !content || !password) {
    return { error: "모든 항목을 입력해 주세요." };
  }
  if (title.length > LIMITS.title) {
    return { error: `제목은 ${LIMITS.title}자까지 쓸 수 있어요.` };
  }
  if (author.length > LIMITS.author) {
    return { error: `이름은 ${LIMITS.author}자까지 쓸 수 있어요.` };
  }
  if (content.length > LIMITS.content) {
    return { error: `내용은 ${LIMITS.content}자까지 쓸 수 있어요.` };
  }
  if (password.length < LIMITS.passwordMin || password.length > LIMITS.passwordMax) {
    return {
      error: `비밀번호는 ${LIMITS.passwordMin}~${LIMITS.passwordMax}자로 정해 주세요.`,
    };
  }

  try {
    await createPost({ title, author, content, password });
  } catch (error) {
    console.error("createPost failed:", error);
    return { error: "저장에 실패했어요. 데이터베이스 연결을 확인해 주세요." };
  }

  revalidatePath("/board");
  redirect("/board");
}

export async function deletePostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const id = Number(formData.get("id"));
  const password = String(formData.get("password") ?? "");

  if (!Number.isInteger(id) || id <= 0) {
    return { error: "잘못된 접근이에요." };
  }
  if (!password) {
    return { error: "비밀번호를 입력해 주세요." };
  }

  let result;
  try {
    result = await deletePost(id, password);
  } catch (error) {
    console.error("deletePost failed:", error);
    return { error: "삭제에 실패했어요. 데이터베이스 연결을 확인해 주세요." };
  }

  if (result === "not-found") return { error: "이미 삭제된 글이에요." };
  if (result === "wrong-password") return { error: "비밀번호가 맞지 않아요." };

  revalidatePath("/board");
  redirect("/board");
}
