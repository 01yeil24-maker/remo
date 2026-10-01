import SiteHeader from "@/components/SiteHeader";
import { projects } from "@/lib/data";

export default function MakingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Making" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">M — MAKING</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">우리가 만든 것들</h1>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col rounded-2xl border border-brand-line bg-white/70 p-6"
            >
              <span className="w-fit rounded-full bg-brand-orange/10 px-2.5 py-1 text-[12px] font-semibold text-brand-orange">
                {project.category}
              </span>
              <h2 className="mt-4 text-[20px] font-bold tracking-[-0.02em]">{project.title}</h2>
              <p className="mt-2 text-[14px] leading-[1.7] text-brand-ink/65">
                {project.description}
              </p>
              <p className="mt-auto pt-5 text-[13px] text-brand-ink/45">
                {project.members.join(" · ")}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
