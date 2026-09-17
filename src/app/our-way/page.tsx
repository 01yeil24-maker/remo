import SiteHeader from "@/components/SiteHeader";
import { philosophy } from "@/lib/data";

export default function OurWayPage() {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader active="Our Way" />
      <main className="flex flex-1 flex-col gap-14 px-6 py-12 sm:px-10 sm:py-16">
        <div>
          <p className="font-display text-sm uppercase tracking-widest text-brand-orange">
            O — Our Way
          </p>
          <h1 className="mt-3 max-w-2xl font-display text-3xl italic leading-snug text-brand-ink sm:text-4xl">
            &ldquo;{philosophy.quote}&rdquo;
          </h1>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {philosophy.values.map((value, i) => (
            <div key={value.title}>
              <div className="font-display text-sm text-brand-orange">
                0{i + 1}
              </div>
              <h3 className="mt-3 font-display text-xl text-brand-ink">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink/75">{value.body}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
