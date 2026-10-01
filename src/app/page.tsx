import Link from "next/link";
import Image from "next/image";
import { philosophy } from "@/lib/data";

const letters = [
  { char: "R", label: "Roots", href: "/roots" },
  { char: "E", label: "Experts", href: "/experts" },
  { char: "M", label: "Making", href: "/making" },
  { char: "O", label: "Our Way", href: "/our-way" },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Image src="/logo.png" alt="REMO" width={80} height={80} className="h-7 w-auto sm:h-8" priority />
        <nav className="flex items-center gap-5 text-[14px] font-medium text-brand-ink/70 sm:gap-6 sm:text-[15px]">
          <Link href="/gallery" className="transition-colors hover:text-brand-orange">
            Gallery
          </Link>
          <Link href="/board" className="transition-colors hover:text-brand-orange">
            Board
          </Link>
        </nav>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-10 px-6 py-16 text-center sm:gap-12">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 sm:flex sm:gap-x-5 md:gap-x-7">
          {letters.map((letter) => (
            <Link
              key={letter.char}
              href={letter.href}
              className="group flex flex-col items-center gap-2.5 sm:gap-3"
            >
              <span className="text-[84px] font-extrabold leading-none tracking-[-0.05em] text-brand-orange transition-transform duration-200 group-hover:-translate-y-1 sm:text-[112px] md:text-[136px]">
                {letter.char}
              </span>
              <span className="text-[13px] font-medium text-brand-ink/55 sm:text-[15px]">
                {letter.label}
              </span>
            </Link>
          ))}
        </div>
        <p className="text-[15px] font-medium text-brand-ink/60 sm:text-[17px]">
          {philosophy.tagline}
        </p>
      </main>

      <footer className="px-6 py-8 text-center text-[13px] text-brand-ink/40">
        © 2026 REMO
      </footer>
    </div>
  );
}
