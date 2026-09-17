import SiteHeader from "@/components/SiteHeader";
import { projects } from "@/lib/data";

export default function MakingPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Making" />
      <main className="flex flex-1 flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-brand-orange">
            M — Making
          </p>
          <h1 className="mt-3 font-display text-4xl text-brand-ink sm:text-5xl">
            우리가 만든 것들
          </h1>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.slug}
              className="flex flex-col gap-3 rounded-lg border border-brand-line bg-white/60 p-5"
            >
              <span className="w-fit rounded-full bg-brand-orange/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-brand-orange">
                {project.category}
              </span>
              <h2 className="font-display text-2xl text-brand-ink">{project.title}</h2>
              <p className="text-sm leading-relaxed text-brand-ink/75">{project.description}</p>
              <p className="mt-auto pt-3 text-xs text-brand-ink/60">
                팀원 · {project.members.join(", ")}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
