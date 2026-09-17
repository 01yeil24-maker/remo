import SiteHeader from "@/components/SiteHeader";
import { teamMembers, projects, philosophy } from "@/lib/data";

export default function RootsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Roots" />
      <main className="flex flex-1 flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <p className="font-display text-sm uppercase tracking-widest text-brand-orange">
          R — Roots
        </p>
        <h1 className="max-w-2xl font-display text-4xl leading-tight text-brand-ink sm:text-5xl">
          우리는 여기서 시작했습니다
        </h1>
        <p className="max-w-xl font-body text-base leading-relaxed text-brand-ink/80 sm:text-lg">
          REMO는 &ldquo;{philosophy.taglineEn}&rdquo; — {philosophy.tagline}을 지향하는 팀이에요.
          패션, 서비스 기획, 콘텐츠, 소프트웨어까지 서로 다른 관심사를 가진 팀원들이 모여
          각자의 프로젝트를 만들어가고 있습니다.
        </p>
        <div className="flex flex-wrap gap-10 sm:gap-16">
          <div>
            <div className="font-display text-4xl text-brand-orange sm:text-5xl">
              {teamMembers.length}
            </div>
            <div className="mt-1 text-sm text-brand-ink/70">팀원</div>
          </div>
          <div>
            <div className="font-display text-4xl text-brand-orange sm:text-5xl">
              {projects.length}
            </div>
            <div className="mt-1 text-sm text-brand-ink/70">진행 중인 프로젝트</div>
          </div>
        </div>
      </main>
    </div>
  );
}
