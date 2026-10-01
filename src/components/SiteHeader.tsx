import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/roots", label: "Roots" },
  { href: "/experts", label: "Experts" },
  { href: "/making", label: "Making" },
  { href: "/our-way", label: "Our Way" },
  { href: "/gallery", label: "Gallery" },
  { href: "/board", label: "Board" },
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="border-b border-brand-line">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-6 px-6 py-5 sm:px-10 sm:py-6">
        <Link href="/" className="shrink-0">
          <Image src="/logo.png" alt="REMO" width={96} height={96} className="h-8 w-auto" priority />
        </Link>
        <nav className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[14px] sm:gap-x-7 sm:text-[15px]">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={
                "border-b-2 pb-0.5 transition-colors " +
                (active === item.label
                  ? "border-brand-orange font-semibold text-brand-orange"
                  : "border-transparent font-medium text-brand-ink/70 hover:text-brand-orange")
              }
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
