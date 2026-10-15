// 입력 제한값입니다.
// 서버(검증)와 클라이언트(폼 maxLength) 양쪽에서 쓰기 때문에
// 데이터베이스 코드가 섞이지 않도록 별도 파일로 두었습니다.

export const LIMITS = {
  title: 100,
  content: 5000,
} as const;

export const AUTH_FORM_LIMITS = {
  nameMax: 20,
  emailMax: 120,
  passwordMin: 8,
  passwordMax: 72,
} as const;
