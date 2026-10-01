// 게시판 입력 제한값입니다.
// 서버(검증)와 클라이언트(폼 maxLength) 양쪽에서 쓰기 때문에
// 데이터베이스 코드가 섞이지 않도록 별도 파일로 두었습니다.

export const LIMITS = {
  title: 100,
  author: 20,
  content: 5000,
  passwordMin: 4,
  passwordMax: 20,
} as const;
