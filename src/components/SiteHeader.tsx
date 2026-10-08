import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/auth";
import { logoutAction } from "@/app/auth-actions";

const navItems = [
  { href: "/roots", label: "Roots" },
  { href: "/experts", label: "Experts" },
  { href: "/making", label: "Making" },
  { href: "/our-way", label: "Our Way" },
  { href: "/gallery", label: "Gallery" },
  { href: "/board", label: "Board" },
];

export default async function SiteHeader({ active }: { active?: string }) {
  const user = await currentUser();

  return (
    <header className="border-b border-brand-line">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-5 sm:px-10 sm:py-6">
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

          <Link
            href="/sauna-chimaek"
            className="border-b-2 border-transparent pb-0.5 font-medium text-brand-ink/70 transition-colors hover:text-brand-orange"
          >
            사우나치맥
          </Link>

          {user?.role === "admin" && (
            <>
              <Link
                href="/admin/members"
                className="border-b-2 border-transparent pb-0.5 font-medium text-brand-ink/70 transition-colors hover:text-brand-orange"
              >
                회원 관리
              </Link>
              <Link
                href="/admin/leads"
                className="border-b-2 border-transparent pb-0.5 font-medium text-brand-ink/70 transition-colors hover:text-brand-orange"
              >
                세션 응답
              </Link>
            </>
          )}
        </nav>

        <div className="flex items-center gap-3 text-[14px]">
          {user ? (
            <>
              <span className="text-brand-ink/60">{user.name}</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="font-medium text-brand-ink/50 transition-colors hover:text-brand-orange"
                >
                  로그아웃
                </button>
              </form>
            </>
          ) : (
            <Link
              href="/login"
              className="font-medium text-brand-ink/60 transition-colors hover:text-brand-orange"
            >
              로그인
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
