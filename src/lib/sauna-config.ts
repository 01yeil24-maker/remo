// 사우나 치맥 세션의 기획 수치와 설문 선택지입니다.
// 서버·클라이언트 양쪽에서 쓰기 때문에 DB 코드가 섞이지 않도록 분리했습니다.

export const SESSION = {
  name: "사우나 치맥",
  tagline: "땀 빼고, 치맥하고, 사람 얻고.",
  capacity: 8,
  priceRegular: 39000,
  priceEarly: 29000,
  durationHours: 3,
  deposit: 10000,
} as const;

export const INTENT_OPTIONS = [
  {
    value: "buy_now",
    label: "열리면 바로 신청할게요",
    hint: "1호 세션 우선 안내를 받습니다",
  },
  {
    value: "interested",
    label: "관심 있어요, 일정 보고 정할게요",
    hint: "일정이 확정되면 알려드립니다",
  },
  {
    value: "curious",
    label: "아직은 구경만",
    hint: "의견만 남겨주셔도 큰 도움이 됩니다",
  },
] as const;

export const AGE_OPTIONS = [
  { value: "under_24", label: "24세 이하" },
  { value: "25_29", label: "25~29세" },
  { value: "30_34", label: "30~34세" },
  { value: "35_39", label: "35~39세" },
  { value: "over_40", label: "40세 이상" },
] as const;

export const GENDER_OPTIONS = [
  { value: "female", label: "여성" },
  { value: "male", label: "남성" },
  { value: "other", label: "기타" },
  { value: "no_answer", label: "응답 안 함" },
] as const;

export const REGION_OPTIONS = [
  { value: "seoul_gangnam", label: "서울 강남권" },
  { value: "seoul_gangbuk", label: "서울 강북권" },
  { value: "gyeonggi", label: "경기·인천" },
  { value: "other_region", label: "그 외 지역" },
] as const;

export const TIME_OPTIONS = [
  { value: "weekday_evening", label: "평일 저녁" },
  { value: "friday_evening", label: "금요일 저녁" },
  { value: "weekend_day", label: "주말 낮" },
  { value: "weekend_evening", label: "주말 저녁" },
] as const;

export const PRICE_OPTIONS = [
  { value: "under_25", label: "2만 5천원까지" },
  { value: "25_35", label: "2만 5천~3만 5천원" },
  { value: "35_45", label: "3만 5천~4만 5천원" },
  { value: "over_45", label: "4만 5천원 이상도 괜찮음" },
] as const;

export const LEAD_LIMITS = {
  improvement: 1000,
  contact: 120,
} as const;

/** 설문 문항 정의 — 폼과 관리자 집계가 같은 목록을 씁니다. */
export const SURVEY_FIELDS = [
  { name: "ageBand", label: "나이대", options: AGE_OPTIONS },
  { name: "gender", label: "성별", options: GENDER_OPTIONS },
  { name: "region", label: "주로 활동하는 지역", options: REGION_OPTIONS },
  { name: "preferredTime", label: "선호하는 시간대", options: TIME_OPTIONS },
  { name: "priceBand", label: "이 세션에 낼 수 있는 금액", options: PRICE_OPTIONS },
] as const;

export type SurveyFieldName = (typeof SURVEY_FIELDS)[number]["name"];

const ALL_OPTIONS = [
  ...INTENT_OPTIONS,
  ...AGE_OPTIONS,
  ...GENDER_OPTIONS,
  ...REGION_OPTIONS,
  ...TIME_OPTIONS,
  ...PRICE_OPTIONS,
].reduce<Record<string, string>>((acc, o) => {
  acc[o.value] = o.label;
  return acc;
}, {});

export function labelOf(value: string | null): string {
  if (!value) return "-";
  return ALL_OPTIONS[value] ?? value;
}

export function formatWon(value: number): string {
  return value.toLocaleString("ko-KR") + "원";
}
