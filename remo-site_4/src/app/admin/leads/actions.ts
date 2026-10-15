"use server";

import { revalidatePath } from "next/cache";
import { currentUser } from "@/lib/auth";
import { setCouponSent } from "@/lib/leads";

export async function setCouponSentAction(formData: FormData): Promise<void> {
  const me = await currentUser();
  if (me?.role !== "admin") throw new Error("관리자만 할 수 있는 작업입니다.");

  const leadId = Number(formData.get("leadId"));
  const sent = String(formData.get("sent")) === "true";
  if (!Number.isInteger(leadId) || leadId <= 0) throw new Error("잘못된 요청입니다.");

  await setCouponSent(leadId, sent);
  revalidatePath("/admin/leads");
}
