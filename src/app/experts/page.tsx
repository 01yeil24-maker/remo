import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import { teamMembers } from "@/lib/data";

export default function ExpertsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Experts" />
      <main className="flex flex-1 flex-col gap-10 px-6 py-12 sm:px-10 sm:py-16">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-brand-orange">
            E — Experts
          </p>
          <h1 className="mt-3 font-display text-4xl text-brand-ink sm:text-5xl">
            우리를 만드는 사람들
          </h1>
        </div>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <div key={member.slug} className="flex flex-col gap-3">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-lg bg-white">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 45vw, 220px"
                />
              </div>
              <div>
                <div className="font-display text-lg text-brand-ink">{member.name}</div>
                <div className="text-xs font-medium text-brand-orange">{member.role}</div>
                <p className="mt-1 text-xs leading-relaxed text-brand-ink/70">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
