import SiteHeader from "@/components/SiteHeader";
import { philosophy } from "@/lib/data";

export default function OurWayPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Our Way" />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">O — OUR WAY</p>
        <h1 className="mt-5 max-w-3xl text-[26px] font-semibold leading-[1.5] tracking-[-0.025em] sm:text-[34px]">
          {philosophy.quote}
        </h1>

        <div className="mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          {philosophy.values.map((value, i) => (
            <div key={value.title}>
              <div className="text-[13px] font-bold text-brand-orange">0{i + 1}</div>
              <h2 className="mt-3 text-[19px] font-semibold tracking-[-0.02em]">{value.title}</h2>
              <p className="mt-2.5 text-[14px] leading-[1.75] text-brand-ink/65">{value.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
