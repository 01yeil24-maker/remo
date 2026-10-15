import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser } from "@/lib/auth";
import PostEditor from "../PostEditor";

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  const user = await currentUser();
  if (!user) redirect("/login");

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Board" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">BOARD</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">글쓰기</h1>
        <p className="mt-3 text-[14px] text-brand-ink/60">{user.name} 이름으로 올라갑니다.</p>
        <PostEditor mode="create" />
      </main>
    </div>
  );
}
