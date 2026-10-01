import SiteHeader from "@/components/SiteHeader";
import { isDbConfigured } from "@/lib/db";
import PostForm from "./PostForm";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  const configured = isDbConfigured();

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Board" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">BOARD</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">글쓰기</h1>

        {configured ? (
          <PostForm />
        ) : (
          <p className="mt-10 max-w-2xl rounded-2xl border border-brand-line bg-white/70 px-6 py-5 text-[14px] leading-[1.7] text-brand-ink/65">
            아직 데이터베이스가 연결되지 않아 글을 저장할 수 없어요. Vercel 프로젝트의 Storage
            탭에서 Neon을 연결하면 바로 사용할 수 있습니다.
          </p>
        )}
      </main>
    </div>
  );
}
