import SiteHeader from "@/components/SiteHeader";
import { teamMembers, projects, philosophy } from "@/lib/data";

export default function RootsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Roots" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">R — ROOTS</p>
        <h1 className="mt-4 max-w-2xl text-[32px] font-bold sm:text-[44px]">
          우리는 여기서 시작했습니다
        </h1>
        <p className="mt-6 max-w-xl text-[16px] leading-[1.75] text-brand-ink/70 sm:text-[17px]">
          REMO는 &ldquo;{philosophy.taglineEn}&rdquo; — {philosophy.tagline}을 지향하는 팀이에요.
          패션, 서비스 기획, 콘텐츠, 소프트웨어까지 서로 다른 관심사를 가진 팀원들이 모여
          각자의 프로젝트를 만들어가고 있습니다.
        </p>
        <div className="mt-14 flex flex-wrap gap-12 sm:mt-16 sm:gap-20">
          <div>
            <div className="text-[40px] font-bold tracking-[-0.03em] text-brand-orange sm:text-[52px]">
              {teamMembers.length}
            </div>
            <div className="mt-1 text-[14px] font-medium text-brand-ink/55">팀원</div>
          </div>
          <div>
            <div className="text-[40px] font-bold tracking-[-0.03em] text-brand-orange sm:text-[52px]">
              {projects.length}
            </div>
            <div className="mt-1 text-[14px] font-medium text-brand-ink/55">진행 중인 프로젝트</div>
          </div>
        </div>
      </main>
    </div>
  );
}
