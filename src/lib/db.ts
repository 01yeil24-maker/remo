// Neon(Postgres) 연결용 Prisma client 싱글턴입니다.
//
// 아직 이 파일은 사용되지 않습니다 (지금은 lib/data.ts의 정적 데이터로 화면을 채웁니다).
// DB 연동을 시작하려면:
//   1. 개발 안내서의 "개발 환경 구축 절차"대로 DATABASE_URL을 설정하고
//      npx prisma generate 를 실행하세요.
//   2. tsconfig.json의 "exclude" 배열에서 "src/lib/db.ts" 항목을 제거하세요.
//   3. 각 페이지에서 lib/data.ts 대신 아래 client로 Neon을 조회하도록 바꾸세요.

import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
