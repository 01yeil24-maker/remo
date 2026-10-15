// 사우나 치맥 랜딩 페이지의 사전 수요 조사 응답을 저장/조회합니다.
// 설문까지 응답하면 커피 쿠폰 코드를 발급합니다.

import { randomInt } from "node:crypto";
import { getSql } from "./db";
import { ensureSchema } from "./schema";
import { SURVEY_FIELDS } from "./sauna-config";

export type Lead = {
  id: number;
  intent: string;
  contact: string | null;
  improvement: string | null;
  ageBand: string | null;
  gender: string | null;
  region: string | null;
  preferredTime: string | null;
  priceBand: string | null;
  surveyDone: boolean;
  couponCode: string | null;
  couponSent: boolean;
  createdAt: string;
};

export const INSERT_LEAD = `
INSERT INTO leads
  (intent, contact, improvement, age_band, gender, region, preferred_time, price_band, survey_done, coupon_code)
VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
RETURNING id, coupon_code`;

export const SELECT_LEADS = `
SELECT id, intent, contact, improvement, age_band, gender, region, preferred_time,
       price_band, survey_done, coupon_code, coupon_sent, created_at
FROM leads
ORDER BY id DESC`;

export const UPDATE_COUPON_SENT = `UPDATE leads SET coupon_sent = $1 WHERE id = $2`;

/** 헷갈리는 글자(0/O, 1/I)를 뺀 코드 알파벳 */
const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function makeCouponCode(): string {
  let body = "";
  for (let i = 0; i < 8; i++) {
    body += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  }
  return `REMO-${body.slice(0, 4)}-${body.slice(4)}`;
}

function toLead(row: Record<string, unknown>): Lead {
  return {
    id: Number(row.id),
    intent: String(row.intent),
    contact: (row.contact as string) ?? null,
    improvement: (row.improvement as string) ?? null,
    ageBand: (row.age_band as string) ?? null,
    gender: (row.gender as string) ?? null,
    region: (row.region as string) ?? null,
    preferredTime: (row.preferred_time as string) ?? null,
    priceBand: (row.price_band as string) ?? null,
    surveyDone: Boolean(row.survey_done),
    couponCode: (row.coupon_code as string) ?? null,
    couponSent: Boolean(row.coupon_sent),
    createdAt: new Date(row.created_at as string | Date).toISOString(),
  };
}

export type LeadInput = {
  intent: string;
  contact: string | null;
  improvement: string | null;
  ageBand: string | null;
  gender: string | null;
  region: string | null;
  preferredTime: string | null;
  priceBand: string | null;
};

/** 설문 문항을 하나라도 답했으면 쿠폰을 발급합니다. */
export function isSurveyAnswered(input: LeadInput): boolean {
  return SURVEY_FIELDS.some((field) => Boolean(input[field.name as keyof LeadInput]));
}

export async function createLead(
  input: LeadInput,
): Promise<{ id: number; couponCode: string | null }> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);

  const surveyDone = isSurveyAnswered(input);
  const couponCode = surveyDone ? makeCouponCode() : null;

  const rows = await sql.query(INSERT_LEAD, [
    input.intent,
    input.contact,
    input.improvement,
    input.ageBand,
    input.gender,
    input.region,
    input.preferredTime,
    input.priceBand,
    surveyDone,
    couponCode,
  ]);

  return { id: Number(rows[0].id), couponCode: (rows[0].coupon_code as string) ?? null };
}

export async function listLeads(): Promise<Lead[]> {
  const sql = getSql();
  if (!sql) return [];
  await ensureSchema(sql);
  const rows = await sql.query(SELECT_LEADS);
  return rows.map(toLead);
}

export async function setCouponSent(id: number, sent: boolean): Promise<void> {
  const sql = getSql();
  if (!sql) throw new Error("데이터베이스가 연결되어 있지 않습니다.");
  await ensureSchema(sql);
  await sql.query(UPDATE_COUPON_SENT, [sent, id]);
}

// ── 집계 ───────────────────────────────────────────────────────────────

export type Distribution = { value: string; count: number }[];

export function distribution(leads: Lead[], key: keyof Lead): Distribution {
  const counts = new Map<string, number>();
  for (const lead of leads) {
    const value = lead[key];
    if (typeof value !== "string" || !value) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count);
}

// ── CSV 내보내기 ───────────────────────────────────────────────────────

function csvCell(value: string | number | boolean | null): string {
  const text = value === null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export function leadsToCsv(leads: Lead[]): string {
  const header = [
    "id",
    "신청일시",
    "구매의사",
    "연락처",
    "개선요청",
    "나이대",
    "성별",
    "지역",
    "선호시간",
    "희망가격",
    "쿠폰코드",
    "쿠폰발송",
  ];
  const rows = leads.map((lead) =>
    [
      lead.id,
      lead.createdAt,
      lead.intent,
      lead.contact,
      lead.improvement,
      lead.ageBand,
      lead.gender,
      lead.region,
      lead.preferredTime,
      lead.priceBand,
      lead.couponCode,
      lead.couponSent ? "발송" : "미발송",
    ]
      .map(csvCell)
      .join(","),
  );
  // 엑셀에서 한글이 깨지지 않도록 BOM을 붙입니다.
  return "﻿" + [header.join(","), ...rows].join("\n");
}
