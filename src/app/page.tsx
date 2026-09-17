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
      <div className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Image src="/logo.png" alt="REMO" width={80} height={80} className="h-7 w-auto sm:h-8" priority />
        <Link
          href="/gallery"
          className="border-b border-brand-line pb-1 text-sm text-brand-ink transition-colors hover:border-brand-orange hover:text-brand-orange sm:text-base"
        >
          Gallery
        </Link>
      </div>

      <main className="flex flex-1 flex-col items-center justify-center gap-8 px-6 py-12 text-center">
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:flex sm:gap-10 md:gap-16">
          {letters.map((letter) => (
            <Link
              key={letter.char}
              href={letter.href}
              className="group flex flex-col items-center gap-3"
            >
              <span className="font-display text-7xl leading-none text-brand-orange transition-transform duration-150 group-hover:-translate-y-1 sm:text-8xl md:text-9xl">
                {letter.char}
              </span>
              <span className="text-xs uppercase tracking-widest text-brand-ink/70 sm:text-sm">
                {letter.label}
              </span>
            </Link>
          ))}
        </div>
        <p className="font-body text-sm text-brand-ink/70 sm:text-base">
          &ldquo;{philosophy.tagline}&rdquo;
        </p>
      </main>

      <footer className="px-6 py-6 text-center text-xs text-brand-ink/60 sm:text-sm">
        © 2026 REMO
      </footer>
    </div>
  );
}
