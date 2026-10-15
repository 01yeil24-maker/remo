import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser, hasAdminConfigured } from "@/lib/auth";
import { isDbConfigured } from "@/lib/db";
import { noticeClass } from "@/components/formStyles";
import SignupForm from "./SignupForm";

export const dynamic = "force-dynamic";

export default async function SignupPage() {
  if (await currentUser()) redirect("/board");

  const configured = isDbConfigured();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">JOIN</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">가입 신청</h1>
        <p className="mt-3 max-w-md text-[14px] leading-[1.7] text-brand-ink/60">
          관리자가 승인하면 로그인할 수 있어요.
        </p>

        {!configured ? (
          <p className={`${noticeClass} mt-10 max-w-xl`}>
            아직 데이터베이스가 연결되지 않았어요. Vercel의 Storage 탭에서 Neon을 연결하면
            가입 기능이 동작합니다.
          </p>
        ) : (
          <>
            {!hasAdminConfigured() && (
              <p className={`${noticeClass} mt-10 max-w-xl`}>
                아직 관리자 이메일이 지정되지 않았어요. Vercel 환경변수에 ADMIN_EMAILS를
                추가하면, 그 주소로 가입한 계정이 관리자가 되어 다른 회원을 승인할 수 있습니다.
              </p>
            )}
            <SignupForm />
          </>
        )}
      </main>
    </div>
  );
}
