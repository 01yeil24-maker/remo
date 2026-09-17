import Image from "next/image";
import Link from "next/link";

const navItems = [
  { href: "/roots", label: "Roots" },
  { href: "/experts", label: "Experts" },
  { href: "/making", label: "Making" },
  { href: "/our-way", label: "Our Way" },
  { href: "/gallery", label: "Gallery" },
];

export default function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="flex items-center justify-between border-b border-brand-line px-6 py-5 sm:px-10">
      <Link href="/" className="shrink-0">
        <Image src="/logo.png" alt="REMO" width={96} height={96} className="h-9 w-auto" priority />
      </Link>
      <nav className="flex flex-wrap gap-4 text-sm sm:gap-8 sm:text-base font-body">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={
              "border-b-2 pb-1 transition-colors " +
              (active === item.label
                ? "border-brand-orange text-brand-orange"
                : "border-transparent hover:text-brand-orange")
            }
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
