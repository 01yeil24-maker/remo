import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { noticeClass } from "@/components/formStyles";
import LoginForm from "./LoginForm";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await currentUser()) redirect("/board");

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">LOGIN</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">로그인</h1>

        {isDbConfigured() ? (
          <LoginForm />
        ) : (
          <p className={`${noticeClass} mt-10 max-w-xl`}>
            아직 데이터베이스가 연결되지 않았어요. Vercel의 Storage 탭에서 Neon을 연결하면
            로그인 기능이 동작합니다.
          </p>
        )}
      </main>
    </div>
  );
}
