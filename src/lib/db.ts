// Neon(Vercel Postgres) 연결입니다.
//
// Vercel 프로젝트에 Neon을 연결하면 DATABASE_URL 환경변수가 자동으로 들어옵니다.
// 로컬에서 테스트하려면 `vercel env pull` 로 .env.local에 받아오세요.
//
// @neondatabase/serverless 드라이버는 HTTP로 질의하기 때문에 Vercel의
// 서버리스 환경에서 커넥션 풀 걱정 없이 그대로 동작합니다.

import { neon } from "@neondatabase/serverless";

/** 이 프로젝트에서 쓰는 최소한의 질의 인터페이스 (테스트에서 교체 가능) */
export type SqlExecutor = {
  query: (text: string, params?: unknown[]) => Promise<Record<string, unknown>[]>;
};

/** DATABASE_URL이 설정되어 있는지 */
export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

/** DB가 연결되어 있으면 질의 함수를, 아니면 null을 돌려줍니다. */
export function getSql(): SqlExecutor | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;

  const sql = neon(url);
  return {
    query: (text, params = []) =>
      sql.query(text, params as unknown[]) as Promise<Record<string, unknown>[]>,
  };
}
