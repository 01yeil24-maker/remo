import Image from "next/image";
import SiteHeader from "@/components/SiteHeader";
import { teamMembers } from "@/lib/data";

export default function ExpertsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Experts" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">E — EXPERTS</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">우리를 만드는 사람들</h1>

        <div className="mt-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-8 lg:grid-cols-5">
          {teamMembers.map((member) => (
            <div key={member.slug} className="flex flex-col">
              <div className="relative aspect-4/5 w-full overflow-hidden rounded-xl bg-white">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
                />
              </div>
              <div className="mt-4">
                <div className="text-[17px] font-semibold tracking-[-0.02em]">{member.name}</div>
                <div className="mt-0.5 text-[13px] font-medium text-brand-orange">{member.role}</div>
                <p className="mt-2 text-[13px] leading-[1.65] text-brand-ink/60">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
