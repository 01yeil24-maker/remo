"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import { createPost, deletePost, updatePost } from "@/lib/posts";
import { LIMITS } from "@/lib/board-config";

export type FormState = { error?: string };

function validate(title: string, content: string): string | null {
  if (!title || !content) return "제목과 내용을 입력해 주세요.";
  if (title.length > LIMITS.title) return `제목은 ${LIMITS.title}자까지 쓸 수 있어요.`;
  if (content.length > LIMITS.content) return `내용은 ${LIMITS.content}자까지 쓸 수 있어요.`;
  return null;
}

export async function createPostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await currentUser();
  if (!user) return { error: "로그인한 회원만 글을 쓸 수 있어요." };

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  const invalid = validate(title, content);
  if (invalid) return { error: invalid };

  try {
    await createPost({ title, content, authorId: user.id });
  } catch (error) {
    console.error("createPost failed:", error);
    return { error: "저장에 실패했어요. 데이터베이스 연결을 확인해 주세요." };
  }

  revalidatePath("/board");
  redirect("/board");
}

export async function updatePostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await currentUser();
  if (!user) return { error: "로그인한 회원만 글을 수정할 수 있어요." };

  const id = Number(formData.get("id"));
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!Number.isInteger(id) || id <= 0) return { error: "잘못된 접근이에요." };
  const invalid = validate(title, content);
  if (invalid) return { error: invalid };

  let result;
  try {
    result = await updatePost(id, { title, content }, user);
  } catch (error) {
    console.error("updatePost failed:", error);
    return { error: "수정에 실패했어요. 데이터베이스 연결을 확인해 주세요." };
  }

  if (result === "not-found") return { error: "이미 삭제된 글이에요." };
  if (result === "forbidden") return { error: "내가 쓴 글만 수정할 수 있어요." };

  revalidatePath("/board");
  revalidatePath(`/board/${id}`);
  redirect(`/board/${id}`);
}

export async function deletePostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const user = await currentUser();
  if (!user) return { error: "로그인한 회원만 글을 지울 수 있어요." };

  const id = Number(formData.get("id"));
  if (!Number.isInteger(id) || id <= 0) return { error: "잘못된 접근이에요." };

  let result;
  try {
    result = await deletePost(id, user);
  } catch (error) {
    console.error("deletePost failed:", error);
    return { error: "삭제에 실패했어요. 데이터베이스 연결을 확인해 주세요." };
  }

  if (result === "not-found") return { error: "이미 삭제된 글이에요." };
  if (result === "forbidden") return { error: "내가 쓴 글만 지울 수 있어요." };

  revalidatePath("/board");
  redirect("/board");
}
