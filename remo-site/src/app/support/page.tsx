import SiteHeader from "@/components/SiteHeader";
import { isDbConfigured } from "@/lib/db";
import { isGeminiConfigured } from "@/lib/gemini";
import { noticeClass } from "@/components/formStyles";
import SupportChat from "./SupportChat";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "고객상담 | REMO",
  description: "REMO와 사우나 치맥 세션에 대해 궁금한 점을 물어보세요.",
};

export default function SupportPage() {
  const ready = isDbConfigured() && isGeminiConfigured();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="고객상담" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">SUPPORT</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">고객상담</h1>
        <p className="mt-3 max-w-xl text-[15px] leading-[1.8] text-brand-ink/60">
          자주 묻는 질문은 챗봇이 바로 답해드립니다. 답을 찾지 못하면 게시판으로 안내해 드려요.
        </p>

        {ready ? (
          <SupportChat />
        ) : (
          <p className={`${noticeClass} mt-10 max-w-2xl`}>
            상담 챗봇이 아직 준비되지 않았어요. Vercel 환경변수에 <code>GEMINI_API_KEY</code>를
            추가하고 Neon이 연결되면 바로 동작합니다.
          </p>
        )}
      </main>
    </div>
  );
}
