"use server";

import { createLead, type LeadInput } from "@/lib/leads";
import {
  AGE_OPTIONS,
  GENDER_OPTIONS,
  INTENT_OPTIONS,
  LEAD_LIMITS,
  PRICE_OPTIONS,
  REGION_OPTIONS,
  TIME_OPTIONS,
} from "@/lib/sauna-config";

/** 오류로 되돌아올 때 적었던 내용이 날아가지 않도록 그대로 돌려줍니다. */
export type LeadFormValues = {
  intent: string;
  improvement: string;
  contact: string;
  ageBand: string;
  gender: string;
  region: string;
  preferredTime: string;
  priceBand: string;
};

export type LeadFormState = {
  error?: string;
  done?: boolean;
  couponCode?: string | null;
  intent?: string;
  values?: LeadFormValues;
};

function readValues(formData: FormData): LeadFormValues {
  const get = (name: string) => String(formData.get(name) ?? "").trim();
  return {
    intent: get("intent"),
    improvement: get("improvement"),
    contact: get("contact"),
    ageBand: get("ageBand"),
    gender: get("gender"),
    region: get("region"),
    preferredTime: get("preferredTime"),
    priceBand: get("priceBand"),
  };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function pick(
  formData: FormData,
  name: string,
  allowed: readonly { value: string }[],
): string | null {
  const raw = String(formData.get(name) ?? "").trim();
  if (!raw) return null;
  return allowed.some((option) => option.value === raw) ? raw : null;
}

export async function submitLeadAction(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const values = readValues(formData);

  const intent = pick(formData, "intent", INTENT_OPTIONS);
  if (!intent) return { error: "참여 의향을 선택해 주세요.", values };

  const improvementRaw = String(formData.get("improvement") ?? "").trim();
  if (improvementRaw.length > LEAD_LIMITS.improvement) {
    return { error: `의견은 ${LEAD_LIMITS.improvement}자까지 쓸 수 있어요.`, values };
  }

  const contactRaw = String(formData.get("contact") ?? "").trim();
  if (contactRaw && (!EMAIL_RE.test(contactRaw) || contactRaw.length > LEAD_LIMITS.contact)) {
    return { error: "이메일 주소를 다시 확인해 주세요.", values };
  }

  const input: LeadInput = {
    intent,
    contact: contactRaw || null,
    improvement: improvementRaw || null,
    ageBand: pick(formData, "ageBand", AGE_OPTIONS),
    gender: pick(formData, "gender", GENDER_OPTIONS),
    region: pick(formData, "region", REGION_OPTIONS),
    preferredTime: pick(formData, "preferredTime", TIME_OPTIONS),
    priceBand: pick(formData, "priceBand", PRICE_OPTIONS),
  };

  // 쿠폰을 받으려면 보낼 주소가 필요합니다.
  const answeredSurvey = Boolean(
    input.ageBand || input.gender || input.region || input.preferredTime || input.priceBand,
  );
  if (answeredSurvey && !input.contact) {
    return { error: "쿠폰을 보내드릴 이메일 주소를 적어주세요.", values };
  }

  try {
    const { couponCode } = await createLead(input);
    return { done: true, couponCode, intent };
  } catch (error) {
    console.error("createLead failed:", error);
    return { error: "저장에 실패했어요. 잠시 후 다시 시도해 주세요.", values };
  }
}
