import { redirect } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { currentUser, listUsers, type MemberStatus } from "@/lib/auth";
import { setMemberStatusAction } from "@/app/auth-actions";
import { formatDate } from "@/lib/format";
import { noticeClass, smallButtonClass } from "@/components/formStyles";

export const dynamic = "force-dynamic";

const statusLabel: Record<MemberStatus, string> = {
  pending: "승인 대기",
  approved: "승인됨",
  rejected: "거절됨",
};

const statusStyle: Record<MemberStatus, string> = {
  pending: "bg-brand-orange/10 text-brand-orange",
  approved: "bg-brand-ink/8 text-brand-ink/70",
  rejected: "bg-brand-ink/5 text-brand-ink/40",
};

function StatusButton({
  userId,
  status,
  label,
  tone,
}: {
  userId: number;
  status: MemberStatus;
  label: string;
  tone: "primary" | "ghost";
}) {
  return (
    <form action={setMemberStatusAction}>
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="status" value={status} />
      <button
        type="submit"
        className={
          smallButtonClass +
          " " +
          (tone === "primary"
            ? "bg-brand-orange text-white hover:bg-brand-orange-dark"
            : "border border-brand-line text-brand-ink/60 hover:border-brand-orange hover:text-brand-orange")
        }
      >
        {label}
      </button>
    </form>
  );
}

export default async function MembersPage() {
  const me = await currentUser();
  if (!me) redirect("/login");
  if (me.role !== "admin") redirect("/board");

  const users = await listUsers();
  const pendingCount = users.filter((u) => u.status === "pending").length;

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-14 sm:px-10 sm:py-20">
        <p className="text-[13px] font-semibold tracking-[0.06em] text-brand-orange">ADMIN</p>
        <h1 className="mt-4 text-[30px] font-bold sm:text-[40px]">회원 관리</h1>
        <p className="mt-3 text-[14px] text-brand-ink/60">
          {pendingCount > 0 ? `승인을 기다리는 신청이 ${pendingCount}건 있어요.` : "승인 대기 중인 신청이 없어요."}
        </p>

        {users.length === 0 ? (
          <p className={`${noticeClass} mt-10`}>아직 가입한 회원이 없어요.</p>
        ) : (
          <ul className="mt-10 overflow-hidden rounded-2xl border border-brand-line bg-white/70">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex flex-col gap-4 border-b border-brand-line px-6 py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[16px] font-semibold tracking-[-0.02em]">
                      {user.name}
                    </span>
                    {user.role === "admin" && (
                      <span className="rounded-full bg-brand-orange px-2 py-0.5 text-[11px] font-semibold text-white">
                        관리자
                      </span>
                    )}
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${statusStyle[user.status]}`}
                    >
                      {statusLabel[user.status]}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-[13px] text-brand-ink/50">
                    {user.email} · {formatDate(user.createdAt)} 신청
                  </p>
                </div>

                {user.id === me.id ? (
                  <span className="shrink-0 text-[13px] text-brand-ink/40">본인 계정</span>
                ) : (
                  <div className="flex shrink-0 flex-wrap gap-2">
                    {user.status !== "approved" && (
                      <StatusButton
                        userId={user.id}
                        status="approved"
                        label="승인"
                        tone="primary"
                      />
                    )}
                    {user.status !== "rejected" && (
                      <StatusButton
                        userId={user.id}
                        status="rejected"
                        label={user.status === "approved" ? "승인 취소" : "거절"}
                        tone="ghost"
                      />
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
