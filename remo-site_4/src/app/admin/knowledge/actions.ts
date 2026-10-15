"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { addDocument, deleteDocument } from "@/lib/knowledge";
import { buildSeedDocument, SEED_SOURCE, SEED_TITLE } from "@/lib/remo-seed";
import { testConnection } from "@/lib/gemini";

export type KbFormState = { error?: string; message?: string };

const TITLE_MAX = 120;
const CONTENT_MAX = 100_000;

async function requireAdmin() {
  const me = await currentUser();
  if (me?.role !== "admin") throw new Error("관리자만 할 수 있는 작업입니다.");
  return me;
}

export async function addDocumentAction(
  _prev: KbFormState,
  formData: FormData,
): Promise<KbFormState> {
  await requireAdmin();

  const title = String(formData.get("title") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) return { error: "제목과 내용을 입력해 주세요." };
  if (title.length > TITLE_MAX) return { error: `제목은 ${TITLE_MAX}자까지 가능합니다.` };
  if (content.length > CONTENT_MAX) {
    return { error: `내용은 ${CONTENT_MAX.toLocaleString("ko-KR")}자까지 가능합니다.` };
  }

  try {
    const { chunkCount } = await addDocument({ title, source: source || null, content });
    revalidatePath("/admin/knowledge");
    return { message: `"${title}" 문서를 ${chunkCount}개 조각으로 저장했습니다.` };
  } catch (error) {
    console.error("addDocument failed:", error);
    return { error: `저장에 실패했어요. ${String(error).slice(0, 200)}` };
  }
}

export async function addSeedDocumentAction(): Promise<KbFormState> {
  await requireAdmin();
  try {
    const { chunkCount } = await addDocument({
      title: SEED_TITLE,
      source: SEED_SOURCE,
      content: buildSeedDocument(),
    });
    revalidatePath("/admin/knowledge");
    return { message: `기본 안내 문서를 ${chunkCount}개 조각으로 넣었습니다.` };
  } catch (error) {
    console.error("addSeedDocument failed:", error);
    return { error: `저장에 실패했어요. ${String(error).slice(0, 200)}` };
  }
}

export async function deleteDocumentAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = Number(formData.get("documentId"));
  if (!Number.isInteger(id) || id <= 0) throw new Error("잘못된 요청입니다.");
  await deleteDocument(id);
  revalidatePath("/admin/knowledge");
}

export async function testGeminiAction(): Promise<KbFormState> {
  await requireAdmin();
  const result = await testConnection();
  return result.ok ? { message: result.message } : { error: result.message };
}
