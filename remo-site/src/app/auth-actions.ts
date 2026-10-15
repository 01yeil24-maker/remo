"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  AUTH_LIMITS,
  currentUser,
  login,
  logout,
  setUserStatus,
  signup,
  type MemberStatus,
} from "@/lib/auth";

export type AuthFormState = { error?: string; done?: boolean; pending?: boolean };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const name = String(formData.get("name") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !name || !password) return { error: "모든 항목을 입력해 주세요." };
  if (!EMAIL_RE.test(email) || email.length > AUTH_LIMITS.emailMax) {
    return { error: "이메일 주소를 확인해 주세요." };
  }
  if (name.length > AUTH_LIMITS.nameMax) {
    return { error: `이름은 ${AUTH_LIMITS.nameMax}자까지 쓸 수 있어요.` };
  }
  if (password.length < AUTH_LIMITS.passwordMin || password.length > AUTH_LIMITS.passwordMax) {
    return { error: `비밀번호는 ${AUTH_LIMITS.passwordMin}자 이상으로 정해 주세요.` };
  }

  try {
    const result = await signup({ email, name, password });
    if (!result.ok) return { error: result.error };
    return { done: true, pending: result.status === "pending" };
  } catch (error) {
    console.error("signup failed:", error);
    return { error: "가입 처리에 실패했어요. 잠시 후 다시 시도해 주세요." };
  }
}

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) return { error: "이메일과 비밀번호를 입력해 주세요." };

  let result;
  try {
    result = await login(email, password);
  } catch (error) {
    console.error("login failed:", error);
    return { error: "로그인 처리에 실패했어요. 잠시 후 다시 시도해 주세요." };
  }

  if (!result.ok) {
    if (result.reason === "pending") {
      return { error: "아직 관리자 승인을 기다리는 계정이에요." };
    }
    if (result.reason === "rejected") {
      return { error: "승인되지 않은 계정이에요. 관리자에게 문의해 주세요." };
    }
    if (result.reason === "no-db") {
      return { error: "데이터베이스가 연결되어 있지 않아요." };
    }
    return { error: "이메일 또는 비밀번호가 맞지 않아요." };
  }

  revalidatePath("/", "layout");
  redirect("/board");
}

export async function logoutAction(): Promise<void> {
  await logout();
  revalidatePath("/", "layout");
  redirect("/");
}

export async function setMemberStatusAction(formData: FormData): Promise<void> {
  const me = await currentUser();
  if (me?.role !== "admin") {
    throw new Error("관리자만 할 수 있는 작업입니다.");
  }

  const userId = Number(formData.get("userId"));
  const status = String(formData.get("status")) as MemberStatus;
  if (!Number.isInteger(userId) || !["pending", "approved", "rejected"].includes(status)) {
    throw new Error("잘못된 요청입니다.");
  }
  if (userId === me.id) {
    // 관리자가 자기 자신의 승인을 내리면 아무도 승인을 못 하게 될 수 있습니다.
    throw new Error("자기 자신의 상태는 바꿀 수 없습니다.");
  }

  await setUserStatus(userId, status);
  revalidatePath("/admin/members");
}
